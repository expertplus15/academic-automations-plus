-- Create system_settings table for general configuration
CREATE TABLE public.system_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  institution_name TEXT DEFAULT 'Mon Établissement',
  institution_logo_url TEXT,
  institution_address TEXT,
  institution_email TEXT,
  institution_phone TEXT,
  default_language VARCHAR(10) DEFAULT 'fr',
  default_currency VARCHAR(10) DEFAULT 'EUR',
  default_timezone VARCHAR(50) DEFAULT 'Europe/Paris',
  date_format VARCHAR(20) DEFAULT 'DD/MM/YYYY',
  academic_year_auto_init BOOLEAN DEFAULT false,
  grade_scale_max NUMERIC DEFAULT 20.00,
  passing_grade_min NUMERIC DEFAULT 10.00,
  attendance_required_percentage NUMERIC DEFAULT 75.00,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Admins can manage system settings" 
ON public.system_settings 
FOR ALL 
USING (get_current_user_role() = 'admin'::user_role);

CREATE POLICY "Authenticated users can view system settings" 
ON public.system_settings 
FOR SELECT 
USING (auth.role() = 'authenticated'::text);

-- Insert default settings
INSERT INTO public.system_settings (
  institution_name,
  default_language,
  default_currency,
  default_timezone,
  date_format,
  grade_scale_max,
  passing_grade_min,
  attendance_required_percentage
) VALUES (
  'Mon Établissement',
  'fr',
  'EUR', 
  'Europe/Paris',
  'DD/MM/YYYY',
  20.00,
  10.00,
  75.00
);

-- Create trigger for updated_at
CREATE TRIGGER update_system_settings_updated_at
BEFORE UPDATE ON public.system_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();