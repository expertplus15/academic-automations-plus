-- Create calculation_history table for performance monitoring
CREATE TABLE public.calculation_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  operation_type VARCHAR NOT NULL,
  student_id UUID REFERENCES students(id),
  subject_id UUID REFERENCES subjects(id),
  parameters JSONB DEFAULT '{}',
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  execution_time_ms INTEGER,
  status VARCHAR NOT NULL DEFAULT 'pending',
  error_message TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.calculation_history ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Admins can manage calculation history"
ON public.calculation_history FOR ALL
USING (get_current_user_role() = 'admin'::user_role);

CREATE POLICY "Teachers can view calculation history"
ON public.calculation_history FOR SELECT
USING (get_current_user_role() = ANY(ARRAY['admin'::user_role, 'teacher'::user_role]));

-- Create indexes for performance
CREATE INDEX idx_calculation_history_started_at ON public.calculation_history(started_at);
CREATE INDEX idx_calculation_history_status ON public.calculation_history(status);
CREATE INDEX idx_calculation_history_student_id ON public.calculation_history(student_id);

-- Function to record calculation start
CREATE OR REPLACE FUNCTION public.record_calculation_start(
  p_operation_type VARCHAR,
  p_student_id UUID DEFAULT NULL,
  p_subject_id UUID DEFAULT NULL,
  p_parameters JSONB DEFAULT '{}'
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_id UUID;
BEGIN
  INSERT INTO public.calculation_history (
    operation_type, student_id, subject_id, parameters, status
  ) VALUES (
    p_operation_type, p_student_id, p_subject_id, p_parameters, 'running'
  ) RETURNING id INTO v_id;
  
  RETURN v_id;
END;
$$;

-- Function to record calculation completion
CREATE OR REPLACE FUNCTION public.record_calculation_complete(
  p_id UUID,
  p_status VARCHAR DEFAULT 'success',
  p_error_message TEXT DEFAULT NULL,
  p_metadata JSONB DEFAULT '{}'
) RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.calculation_history 
  SET 
    completed_at = now(),
    execution_time_ms = EXTRACT(EPOCH FROM (now() - started_at)) * 1000,
    status = p_status,
    error_message = p_error_message,
    metadata = p_metadata
  WHERE id = p_id;
END;
$$;