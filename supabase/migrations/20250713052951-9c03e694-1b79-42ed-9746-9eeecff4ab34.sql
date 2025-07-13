-- Créer les tables pour la synchronisation des modules
CREATE TABLE IF NOT EXISTS public.module_sync_operations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_module VARCHAR NOT NULL,
  target_module VARCHAR NOT NULL, 
  operation_type VARCHAR NOT NULL,
  entity_id VARCHAR NOT NULL,
  entity_type VARCHAR NOT NULL,
  sync_data JSONB DEFAULT '{}',
  status VARCHAR DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  triggered_by UUID REFERENCES auth.users,
  created_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ,
  error_message TEXT,
  retry_count INTEGER DEFAULT 0,
  max_retries INTEGER DEFAULT 3
);

CREATE TABLE IF NOT EXISTS public.module_sync_configurations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_module VARCHAR NOT NULL,
  target_module VARCHAR NOT NULL,
  operation_type VARCHAR NOT NULL,
  is_enabled BOOLEAN DEFAULT true,
  auto_sync BOOLEAN DEFAULT false,
  sync_frequency VARCHAR DEFAULT 'manual' CHECK (sync_frequency IN ('realtime', 'hourly', 'daily', 'weekly', 'manual')),
  last_sync_at TIMESTAMPTZ,
  next_sync_at TIMESTAMPTZ,
  sync_rules JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.sync_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module VARCHAR NOT NULL,
  event_type VARCHAR NOT NULL,
  entity_id VARCHAR,
  event_data JSONB DEFAULT '{}',
  triggered_by UUID REFERENCES auth.users,
  created_at TIMESTAMPTZ DEFAULT now(),
  processed BOOLEAN DEFAULT false
);

-- Activer RLS
ALTER TABLE public.module_sync_operations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.module_sync_configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sync_events ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour administrators
CREATE POLICY "Admin can manage sync operations" ON public.module_sync_operations 
FOR ALL USING (get_current_user_role() = 'admin');

CREATE POLICY "Admin can manage sync configurations" ON public.module_sync_configurations 
FOR ALL USING (get_current_user_role() = 'admin');

CREATE POLICY "Admin can manage sync events" ON public.sync_events 
FOR ALL USING (get_current_user_role() = 'admin');

-- Fonction pour déclencher la synchronisation
CREATE OR REPLACE FUNCTION public.trigger_module_sync(
  p_source_module VARCHAR,
  p_target_module VARCHAR,
  p_operation_type VARCHAR,
  p_entity_id VARCHAR,
  p_entity_type VARCHAR,
  p_sync_data JSONB DEFAULT '{}'
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_operation_id UUID;
BEGIN
  INSERT INTO public.module_sync_operations (
    source_module, target_module, operation_type,
    entity_id, entity_type, sync_data, triggered_by
  ) VALUES (
    p_source_module, p_target_module, p_operation_type,
    p_entity_id, p_entity_type, p_sync_data, auth.uid()
  ) RETURNING id INTO v_operation_id;
  
  RETURN v_operation_id;
END;
$$;

-- Fonction pour traiter les événements de sync
CREATE OR REPLACE FUNCTION public.process_sync_events()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Auto-sync académique -> étudiants
  IF NEW.module = 'academic' AND NEW.event_type IN ('grade_created', 'grade_updated') THEN
    PERFORM public.trigger_module_sync(
      'academic', 'students', 'grade_sync',
      NEW.entity_id, 'grade', NEW.event_data
    );
  END IF;
  
  -- Auto-sync étudiants -> examens  
  IF NEW.module = 'students' AND NEW.event_type IN ('enrollment_created', 'enrollment_updated') THEN
    PERFORM public.trigger_module_sync(
      'students', 'exams', 'enrollment_sync', 
      NEW.entity_id, 'enrollment', NEW.event_data
    );
  END IF;
  
  -- Auto-sync examens -> planning
  IF NEW.module = 'exams' AND NEW.event_type IN ('exam_created', 'exam_updated') THEN
    PERFORM public.trigger_module_sync(
      'exams', 'academic', 'schedule_sync',
      NEW.entity_id, 'exam', NEW.event_data  
    );
  END IF;
  
  RETURN NEW;
END;
$$;

-- Trigger pour automatiser la synchronisation
CREATE TRIGGER sync_events_processor
  AFTER INSERT ON public.sync_events
  FOR EACH ROW
  EXECUTE FUNCTION public.process_sync_events();

-- Trigger pour updated_at
CREATE TRIGGER update_sync_configs_updated_at
  BEFORE UPDATE ON public.module_sync_configurations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Ajouter des configurations par défaut
INSERT INTO public.module_sync_configurations (source_module, target_module, operation_type, is_enabled, auto_sync, sync_frequency) VALUES
('academic', 'students', 'grade_sync', true, true, 'realtime'),
('students', 'exams', 'enrollment_sync', true, true, 'realtime'),  
('exams', 'academic', 'schedule_sync', true, true, 'realtime'),
('academic', 'results', 'transcript_sync', true, false, 'daily');

-- Activer le realtime pour ces tables
ALTER TABLE public.module_sync_operations REPLICA IDENTITY FULL;
ALTER TABLE public.sync_events REPLICA IDENTITY FULL;

ALTER publication supabase_realtime ADD TABLE public.module_sync_operations;
ALTER publication supabase_realtime ADD TABLE public.sync_events;