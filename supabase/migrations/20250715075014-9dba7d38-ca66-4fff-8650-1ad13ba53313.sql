-- Create calculation_history table for tracking calculation performance
CREATE TABLE IF NOT EXISTS public.calculation_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type VARCHAR NOT NULL,
    parameters JSONB DEFAULT '{}',
    user_id UUID REFERENCES auth.users(id),
    started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    completed_at TIMESTAMP WITH TIME ZONE,
    status VARCHAR NOT NULL DEFAULT 'pending',
    affected_records INTEGER DEFAULT 0,
    execution_time_ms INTEGER,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.calculation_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own calculation history"
ON public.calculation_history
FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own calculation history"
ON public.calculation_history
FOR INSERT
WITH CHECK (user_id = auth.uid());

CREATE POLICY "System can insert calculation history"
ON public.calculation_history
FOR INSERT
WITH CHECK (true);

-- Index for performance
CREATE INDEX idx_calculation_history_user_started ON public.calculation_history(user_id, started_at DESC);
CREATE INDEX idx_calculation_history_type_status ON public.calculation_history(type, status);

-- Function to automatically record calculation history
CREATE OR REPLACE FUNCTION public.record_calculation_start(
    calculation_type VARCHAR,
    calculation_params JSONB DEFAULT '{}',
    user_id_param UUID DEFAULT auth.uid()
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    history_id UUID;
BEGIN
    INSERT INTO public.calculation_history (
        type, parameters, user_id, status
    ) VALUES (
        calculation_type, calculation_params, user_id_param, 'running'
    ) RETURNING id INTO history_id;
    
    RETURN history_id;
END;
$$;

-- Function to complete calculation history
CREATE OR REPLACE FUNCTION public.record_calculation_complete(
    history_id UUID,
    success BOOLEAN DEFAULT true,
    affected_count INTEGER DEFAULT 0,
    error_message TEXT DEFAULT NULL
) RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    UPDATE public.calculation_history 
    SET 
        completed_at = now(),
        status = CASE WHEN success THEN 'success' ELSE 'error' END,
        affected_records = affected_count,
        execution_time_ms = EXTRACT(EPOCH FROM (now() - started_at)) * 1000,
        metadata = CASE 
            WHEN error_message IS NOT NULL THEN 
                jsonb_set(COALESCE(metadata, '{}'), '{error_message}', to_jsonb(error_message))
            ELSE metadata
        END
    WHERE id = history_id;
END;
$$;