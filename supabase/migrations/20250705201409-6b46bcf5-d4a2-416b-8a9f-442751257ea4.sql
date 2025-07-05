-- Phase 4: Add audit trail and notification tables

-- Student card audit trail
CREATE TABLE public.student_card_audit (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  card_id UUID NOT NULL REFERENCES public.student_cards(id) ON DELETE CASCADE,
  action_type VARCHAR NOT NULL, -- 'created', 'printed', 'suspended', 'reactivated', 'expired'
  performed_by UUID REFERENCES auth.users(id),
  old_values JSONB,
  new_values JSONB,
  action_details TEXT,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Card notification settings
CREATE TABLE public.card_notification_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  notification_type VARCHAR NOT NULL, -- 'expiry_warning', 'renewal_reminder', 'batch_complete'
  days_before INTEGER, -- for expiry notifications
  is_active BOOLEAN DEFAULT true,
  recipients JSONB DEFAULT '[]'::jsonb, -- array of email addresses or user roles
  message_template TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Bulk export jobs tracking
CREATE TABLE public.bulk_export_jobs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  job_type VARCHAR NOT NULL, -- 'pdf_export', 'csv_export', 'card_batch'
  status VARCHAR NOT NULL DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed'
  parameters JSONB NOT NULL DEFAULT '{}'::jsonb,
  card_ids UUID[] DEFAULT '{}',
  result_url TEXT,
  progress_percentage NUMERIC(5,2) DEFAULT 0,
  error_message TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.student_card_audit ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.card_notification_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bulk_export_jobs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for audit trail
CREATE POLICY "Staff can view all audit records" 
  ON public.student_card_audit FOR SELECT 
  USING (get_current_user_role() = ANY (ARRAY['admin'::user_role, 'hr'::user_role]));

CREATE POLICY "System can insert audit records" 
  ON public.student_card_audit FOR INSERT 
  WITH CHECK (true);

-- RLS Policies for notification settings
CREATE POLICY "Admins can manage notification settings" 
  ON public.card_notification_settings FOR ALL 
  USING (get_current_user_role() = 'admin'::user_role);

CREATE POLICY "Staff can view notification settings" 
  ON public.card_notification_settings FOR SELECT 
  USING (get_current_user_role() = ANY (ARRAY['admin'::user_role, 'hr'::user_role]));

-- RLS Policies for bulk export jobs
CREATE POLICY "Staff can manage export jobs" 
  ON public.bulk_export_jobs FOR ALL 
  USING (get_current_user_role() = ANY (ARRAY['admin'::user_role, 'hr'::user_role]));

CREATE POLICY "Users can view own export jobs" 
  ON public.bulk_export_jobs FOR SELECT 
  USING (created_by = auth.uid() OR get_current_user_role() = ANY (ARRAY['admin'::user_role, 'hr'::user_role]));

-- Function to create audit record
CREATE OR REPLACE FUNCTION public.create_card_audit_record()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.student_card_audit (
      card_id, action_type, performed_by, new_values, action_details
    ) VALUES (
      NEW.id, 'created', auth.uid(), 
      row_to_json(NEW)::jsonb, 
      'Card created with number: ' || NEW.card_number
    );
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO public.student_card_audit (
      card_id, action_type, performed_by, old_values, new_values, action_details
    ) VALUES (
      NEW.id, 
      CASE 
        WHEN OLD.status != NEW.status THEN 'status_changed'
        WHEN OLD.is_printed != NEW.is_printed THEN 'printed'
        ELSE 'updated'
      END,
      auth.uid(),
      row_to_json(OLD)::jsonb,
      row_to_json(NEW)::jsonb,
      'Card updated'
    );
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for automatic audit logging
CREATE TRIGGER student_card_audit_trigger
  AFTER INSERT OR UPDATE ON public.student_cards
  FOR EACH ROW EXECUTE FUNCTION public.create_card_audit_record();

-- Function to check for expiring cards
CREATE OR REPLACE FUNCTION public.get_expiring_cards(days_ahead INTEGER DEFAULT 30)
RETURNS TABLE(
  card_id UUID,
  student_name TEXT,
  student_email TEXT,
  card_number TEXT,
  expiry_date DATE,
  days_until_expiry INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    sc.id as card_id,
    p.full_name as student_name,
    p.email as student_email,
    sc.card_number,
    sc.expiry_date,
    (sc.expiry_date - CURRENT_DATE)::INTEGER as days_until_expiry
  FROM public.student_cards sc
  JOIN public.students s ON s.id = sc.student_id
  JOIN public.profiles p ON p.id = s.profile_id
  WHERE sc.status = 'active'
    AND sc.expiry_date IS NOT NULL
    AND sc.expiry_date <= CURRENT_DATE + INTERVAL '1 day' * days_ahead
    AND sc.expiry_date > CURRENT_DATE
  ORDER BY sc.expiry_date ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add indexes for performance
CREATE INDEX idx_student_card_audit_card_id ON public.student_card_audit(card_id);
CREATE INDEX idx_student_card_audit_created_at ON public.student_card_audit(created_at);
CREATE INDEX idx_bulk_export_jobs_status ON public.bulk_export_jobs(status);
CREATE INDEX idx_bulk_export_jobs_created_by ON public.bulk_export_jobs(created_by);