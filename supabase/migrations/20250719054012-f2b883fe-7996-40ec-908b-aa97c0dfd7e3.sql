-- Créer la table pour les instances de workflow
CREATE TABLE IF NOT EXISTS public.workflow_instances (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  exam_id UUID REFERENCES public.exams(id) ON DELETE CASCADE,
  exam_title CHARACTER VARYING NOT NULL,
  current_step CHARACTER VARYING NOT NULL,
  status CHARACTER VARYING NOT NULL DEFAULT 'active',
  steps JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Créer la table pour les notifications
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  type CHARACTER VARYING NOT NULL,
  title CHARACTER VARYING NOT NULL,
  message TEXT NOT NULL,
  severity CHARACTER VARYING NOT NULL DEFAULT 'info',
  target_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  target_role CHARACTER VARYING,
  related_entity_id UUID,
  related_entity_type CHARACTER VARYING,
  is_read BOOLEAN NOT NULL DEFAULT false,
  scheduled_for TIMESTAMP WITH TIME ZONE DEFAULT now(),
  data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Activer RLS sur les nouvelles tables
ALTER TABLE public.workflow_instances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour workflow_instances
CREATE POLICY "Users can view workflow instances" 
ON public.workflow_instances 
FOR SELECT 
USING (auth.role() = 'authenticated');

CREATE POLICY "Teachers and admins can manage workflow instances" 
ON public.workflow_instances 
FOR ALL 
USING (get_current_user_role() = ANY (ARRAY['admin'::user_role, 'teacher'::user_role]));

-- Politiques RLS pour notifications
CREATE POLICY "Users can view their notifications" 
ON public.notifications 
FOR SELECT 
USING (
  target_user_id = auth.uid() OR 
  (target_role IS NOT NULL AND get_current_user_role()::text = target_role) OR
  get_current_user_role() = 'admin'::user_role
);

CREATE POLICY "System can create notifications" 
ON public.notifications 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can update their notifications" 
ON public.notifications 
FOR UPDATE 
USING (
  target_user_id = auth.uid() OR 
  get_current_user_role() = 'admin'::user_role
);

-- Trigger pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_workflow_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_workflow_instances_updated_at
    BEFORE UPDATE ON public.workflow_instances
    FOR EACH ROW
    EXECUTE FUNCTION update_workflow_updated_at();

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_workflow_instances_exam_id ON public.workflow_instances(exam_id);
CREATE INDEX IF NOT EXISTS idx_workflow_instances_status ON public.workflow_instances(status);
CREATE INDEX IF NOT EXISTS idx_notifications_target_user_id ON public.notifications(target_user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_scheduled_for ON public.notifications(scheduled_for);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON public.notifications(is_read);