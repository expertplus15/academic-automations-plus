-- Create storage bucket for imports
INSERT INTO storage.buckets (id, name, public) VALUES ('imports', 'imports', false);

-- Create storage policies for imports bucket
CREATE POLICY "Authenticated users can upload import files" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'imports' AND auth.role() = 'authenticated');

CREATE POLICY "Users can view their own import files" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'imports' AND auth.role() = 'authenticated');

-- Create import jobs table
CREATE TABLE IF NOT EXISTS public.import_jobs (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    file_name VARCHAR NOT NULL,
    file_path TEXT NOT NULL,
    file_size BIGINT,
    type VARCHAR NOT NULL,
    status VARCHAR NOT NULL DEFAULT 'pending',
    processed_records INTEGER DEFAULT 0,
    total_records INTEGER DEFAULT 0,
    errors JSONB DEFAULT '[]',
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create PDF generations table
CREATE TABLE IF NOT EXISTS public.pdf_generations (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    type VARCHAR NOT NULL,
    student_id UUID REFERENCES public.students(id),
    template_id VARCHAR,
    file_name VARCHAR NOT NULL,
    file_url TEXT,
    status VARCHAR NOT NULL DEFAULT 'pending',
    generated_at TIMESTAMP WITH TIME ZONE,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create export jobs table
CREATE TABLE IF NOT EXISTS public.export_jobs (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    type VARCHAR NOT NULL,
    format VARCHAR NOT NULL,
    file_name VARCHAR NOT NULL,
    file_url TEXT,
    status VARCHAR NOT NULL DEFAULT 'pending',
    records_count INTEGER DEFAULT 0,
    filters JSONB DEFAULT '{}',
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.import_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pdf_generations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.export_jobs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own import jobs" 
ON public.import_jobs 
FOR SELECT 
USING (created_by = auth.uid() OR get_current_user_role() = ANY (ARRAY['admin'::user_role, 'teacher'::user_role]));

CREATE POLICY "Users can create import jobs" 
ON public.import_jobs 
FOR INSERT 
WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can view their own PDF generations" 
ON public.pdf_generations 
FOR SELECT 
USING (created_by = auth.uid() OR get_current_user_role() = ANY (ARRAY['admin'::user_role, 'teacher'::user_role]));

CREATE POLICY "Users can create PDF generations" 
ON public.pdf_generations 
FOR INSERT 
WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can view their own export jobs" 
ON public.export_jobs 
FOR SELECT 
USING (created_by = auth.uid() OR get_current_user_role() = ANY (ARRAY['admin'::user_role, 'teacher'::user_role]));

CREATE POLICY "Users can create export jobs" 
ON public.export_jobs 
FOR INSERT 
WITH CHECK (created_by = auth.uid());

-- Create updated_at triggers
CREATE TRIGGER update_import_jobs_updated_at
    BEFORE UPDATE ON public.import_jobs
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Add indexes for performance
CREATE INDEX idx_import_jobs_created_by ON public.import_jobs(created_by);
CREATE INDEX idx_import_jobs_status ON public.import_jobs(status);
CREATE INDEX idx_pdf_generations_student_id ON public.pdf_generations(student_id);
CREATE INDEX idx_export_jobs_type ON public.export_jobs(type);