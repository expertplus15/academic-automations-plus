-- Create specializations table (pathways)
CREATE TABLE public.specializations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT NOT NULL,
  description TEXT,
  program_id UUID REFERENCES programs(id) ON DELETE CASCADE,
  credits_required INTEGER DEFAULT 60,
  duration_semesters INTEGER DEFAULT 2,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.specializations ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Admin and teachers can manage specializations"
ON public.specializations
FOR ALL
USING (get_current_user_role() = ANY(ARRAY['admin'::user_role, 'teacher'::user_role]));

CREATE POLICY "Authenticated users can view active specializations"
ON public.specializations
FOR SELECT
USING (is_active = true OR get_current_user_role() = ANY(ARRAY['admin'::user_role, 'teacher'::user_role]));

-- Add update trigger
CREATE TRIGGER update_specializations_updated_at
  BEFORE UPDATE ON public.specializations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();