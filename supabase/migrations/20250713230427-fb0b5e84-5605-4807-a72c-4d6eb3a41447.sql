-- Check if document_requests table exists, if not create it
CREATE TABLE IF NOT EXISTS public.document_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID NOT NULL REFERENCES public.document_templates(id),
  student_id UUID REFERENCES public.students(id),
  request_data JSONB DEFAULT '{}',
  requested_by UUID REFERENCES auth.users(id),
  status VARCHAR NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Check if generated_documents table exists, if not create it  
CREATE TABLE IF NOT EXISTS public.generated_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID REFERENCES public.document_requests(id),
  document_number VARCHAR NOT NULL,
  file_path VARCHAR,
  download_url TEXT,
  generated_by UUID REFERENCES auth.users(id),
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add missing columns to document_templates if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'document_templates' AND column_name = 'requires_approval') THEN
    ALTER TABLE public.document_templates ADD COLUMN requires_approval BOOLEAN DEFAULT false;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'document_templates' AND column_name = 'template_type') THEN
    ALTER TABLE public.document_templates ADD COLUMN template_type VARCHAR DEFAULT 'bulletin';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'document_templates' AND column_name = 'template_content') THEN
    ALTER TABLE public.document_templates ADD COLUMN template_content JSONB DEFAULT '{"template": ""}';
  END IF;
END $$;

-- Enable RLS on new tables
ALTER TABLE public.document_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.generated_documents ENABLE ROW LEVEL SECURITY;

-- RLS policies for document_requests
DROP POLICY IF EXISTS "Users can view their own document requests" ON public.document_requests;
CREATE POLICY "Users can view their own document requests" ON public.document_requests
  FOR SELECT USING (requested_by = auth.uid() OR auth.uid() IN (
    SELECT id FROM public.profiles WHERE role IN ('admin', 'hr')
  ));

DROP POLICY IF EXISTS "Users can create document requests" ON public.document_requests;
CREATE POLICY "Users can create document requests" ON public.document_requests
  FOR INSERT WITH CHECK (requested_by = auth.uid());

DROP POLICY IF EXISTS "Admin can manage all document requests" ON public.document_requests;
CREATE POLICY "Admin can manage all document requests" ON public.document_requests
  FOR ALL USING (auth.uid() IN (
    SELECT id FROM public.profiles WHERE role IN ('admin', 'hr')
  ));

-- RLS policies for generated_documents  
DROP POLICY IF EXISTS "Users can view their own generated documents" ON public.generated_documents;
CREATE POLICY "Users can view their own generated documents" ON public.generated_documents
  FOR SELECT USING (generated_by = auth.uid() OR auth.uid() IN (
    SELECT id FROM public.profiles WHERE role IN ('admin', 'hr')
  ));

DROP POLICY IF EXISTS "System can create generated documents" ON public.generated_documents;
CREATE POLICY "System can create generated documents" ON public.generated_documents
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admin can manage all generated documents" ON public.generated_documents;
CREATE POLICY "Admin can manage all generated documents" ON public.generated_documents
  FOR ALL USING (auth.uid() IN (
    SELECT id FROM public.profiles WHERE role IN ('admin', 'hr')
  ));

-- Insert default templates with proper code values
INSERT INTO public.document_templates (name, code, template_type, template_content, is_active, requires_approval) 
VALUES 
  ('Bulletin Standard', 'BULL_STD', 'bulletin', '{"template": "BULLETIN DE NOTES\n\nÉtudiant: {{student_name}}\nNuméro: {{student_number}}\nProgramme: {{program_name}}\nNiveau: {{level_name}}\n\nDocument généré le {{date}}\nNuméro de document: {{document_number}}"}', true, false),
  ('Relevé de Notes', 'RELEV_STD', 'transcript', '{"template": "RELEVÉ DE NOTES OFFICIEL\n\nÉtudiant: {{student_name}}\nNuméro: {{student_number}}\nEmail: {{student_email}}\nProgramme: {{program_name}}\n\nAnnée académique: {{academic_year}}\n\nDocument généré le {{date}}\nNuméro de document: {{document_number}}"}', true, true),
  ('Attestation de Scolarité', 'ATTEST_SCO', 'certificate', '{"template": "ATTESTATION DE SCOLARITÉ\n\nNous attestons que {{student_name}}, numéro étudiant {{student_number}}, est régulièrement inscrit(e) dans notre établissement.\n\nProgramme: {{program_name}}\nNiveau: {{level_name}}\n\nFait le {{date}}\nNuméro de document: {{document_number}}"}', true, false)
ON CONFLICT (code) DO NOTHING;