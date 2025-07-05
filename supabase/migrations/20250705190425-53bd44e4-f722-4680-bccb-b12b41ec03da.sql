-- Create student cards related tables

-- Table for card templates
CREATE TABLE public.student_card_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR NOT NULL,
  description TEXT,
  template_data JSONB NOT NULL DEFAULT '{}',
  is_default BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table for student cards
CREATE TABLE public.student_cards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  template_id UUID REFERENCES public.student_card_templates(id),
  card_number VARCHAR NOT NULL UNIQUE,
  qr_code_data TEXT,
  barcode_data TEXT,
  issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
  expiry_date DATE,
  status VARCHAR NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired', 'suspended', 'lost', 'replaced')),
  is_printed BOOLEAN DEFAULT false,
  printed_at TIMESTAMP WITH TIME ZONE,
  printed_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table for printing batches
CREATE TABLE public.student_card_prints (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  batch_name VARCHAR NOT NULL,
  card_ids UUID[] NOT NULL,
  status VARCHAR NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  total_cards INTEGER NOT NULL,
  printed_cards INTEGER DEFAULT 0,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.student_card_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_card_prints ENABLE ROW LEVEL SECURITY;

-- RLS Policies for student_card_templates
CREATE POLICY "Staff can manage card templates" 
ON public.student_card_templates 
FOR ALL 
USING (get_current_user_role() = ANY(ARRAY['admin'::user_role, 'hr'::user_role]));

CREATE POLICY "Users can view active templates" 
ON public.student_card_templates 
FOR SELECT 
USING (is_active = true);

-- RLS Policies for student_cards
CREATE POLICY "Staff can manage student cards" 
ON public.student_cards 
FOR ALL 
USING (get_current_user_role() = ANY(ARRAY['admin'::user_role, 'hr'::user_role]));

CREATE POLICY "Students can view their own cards" 
ON public.student_cards 
FOR SELECT 
USING (
  student_id IN (
    SELECT id FROM students WHERE profile_id = auth.uid()
  ) OR 
  get_current_user_role() = ANY(ARRAY['admin'::user_role, 'hr'::user_role])
);

-- RLS Policies for student_card_prints
CREATE POLICY "Staff can manage print batches" 
ON public.student_card_prints 
FOR ALL 
USING (get_current_user_role() = ANY(ARRAY['admin'::user_role, 'hr'::user_role]));

-- Function to generate card number
CREATE OR REPLACE FUNCTION public.generate_card_number()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    year_suffix TEXT;
    next_sequence INTEGER;
    new_number TEXT;
BEGIN
    year_suffix := RIGHT(EXTRACT(YEAR FROM now())::TEXT, 2);
    
    SELECT COALESCE(MAX(
        CAST(RIGHT(card_number, 4) AS INTEGER)
    ), 0) + 1
    INTO next_sequence
    FROM public.student_cards
    WHERE card_number LIKE ('CRD' || year_suffix || '%');
    
    new_number := 'CRD' || year_suffix || LPAD(next_sequence::TEXT, 4, '0');
    
    RETURN new_number;
END;
$$;

-- Trigger for updated_at
CREATE TRIGGER update_student_card_templates_updated_at
  BEFORE UPDATE ON public.student_card_templates
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_student_cards_updated_at
  BEFORE UPDATE ON public.student_cards
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default template
INSERT INTO public.student_card_templates (
  name, 
  description, 
  template_data, 
  is_default, 
  is_active
) VALUES (
  'Template Standard',
  'Template par défaut pour les cartes étudiants',
  '{
    "layout": "standard",
    "colors": {
      "primary": "#10B981",
      "secondary": "#1F2937",
      "text": "#FFFFFF"
    },
    "fields": [
      "student_name",
      "student_number", 
      "program_name",
      "expiry_date",
      "photo",
      "qr_code"
    ],
    "dimensions": {
      "width": 85.6,
      "height": 54,
      "unit": "mm"
    }
  }',
  true,
  true
);