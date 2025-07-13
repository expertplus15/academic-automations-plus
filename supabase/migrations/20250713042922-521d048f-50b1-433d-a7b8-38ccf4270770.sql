-- Create templates table for Template Editor
CREATE TABLE IF NOT EXISTS public.document_templates (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR NOT NULL,
    type VARCHAR NOT NULL, -- 'bulletin', 'transcript', 'report', 'custom'
    description TEXT,
    content JSONB NOT NULL DEFAULT '{}', -- Template structure and content
    preview_url TEXT,
    is_active BOOLEAN DEFAULT true,
    is_default BOOLEAN DEFAULT false,
    version INTEGER DEFAULT 1,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create template versions for version history
CREATE TABLE IF NOT EXISTS public.template_versions (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    template_id UUID REFERENCES public.document_templates(id) ON DELETE CASCADE,
    version INTEGER NOT NULL,
    content JSONB NOT NULL,
    changes TEXT,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create grade approval workflow table
CREATE TABLE IF NOT EXISTS public.grade_approvals (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    grade_id UUID REFERENCES public.student_grades(id) ON DELETE CASCADE,
    workflow_stage VARCHAR NOT NULL, -- 'teacher_entry', 'department_review', 'admin_validation', 'final_approval'
    current_stage VARCHAR NOT NULL DEFAULT 'teacher_entry',
    status VARCHAR NOT NULL DEFAULT 'pending', -- 'pending', 'approved', 'rejected', 'changes_requested'
    approver_id UUID REFERENCES auth.users(id),
    approval_date TIMESTAMP WITH TIME ZONE,
    comments TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create workflow history for audit trail
CREATE TABLE IF NOT EXISTS public.approval_history (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    approval_id UUID REFERENCES public.grade_approvals(id) ON DELETE CASCADE,
    action VARCHAR NOT NULL, -- 'submit', 'approve', 'reject', 'request_changes', 'resubmit'
    from_stage VARCHAR,
    to_stage VARCHAR,
    performer_id UUID REFERENCES auth.users(id),
    reason TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create real-time analytics table
CREATE TABLE IF NOT EXISTS public.analytics_metrics (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    metric_type VARCHAR NOT NULL, -- 'grade_average', 'success_rate', 'attendance_rate', etc.
    metric_name VARCHAR NOT NULL,
    value NUMERIC,
    string_value TEXT,
    dimensions JSONB DEFAULT '{}', -- Additional dimensions (program, level, semester, etc.)
    time_period VARCHAR, -- 'real_time', 'daily', 'weekly', 'monthly', 'semester'
    reference_date DATE,
    calculated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create real-time collaboration sessions
CREATE TABLE IF NOT EXISTS public.collaboration_sessions (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    session_type VARCHAR NOT NULL, -- 'grade_matrix', 'template_editor', 'dashboard'
    resource_id VARCHAR, -- ID of the resource being collaborated on
    active_users JSONB DEFAULT '[]',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    expires_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.document_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.template_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grade_approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.approval_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collaboration_sessions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for templates
CREATE POLICY "Users can view active templates" 
ON public.document_templates 
FOR SELECT 
USING (is_active = true OR created_by = auth.uid() OR get_current_user_role() = ANY (ARRAY['admin'::user_role, 'teacher'::user_role]));

CREATE POLICY "Users can create templates" 
ON public.document_templates 
FOR INSERT 
WITH CHECK (created_by = auth.uid());

CREATE POLICY "Template creators can update their templates" 
ON public.document_templates 
FOR UPDATE 
USING (created_by = auth.uid() OR get_current_user_role() = 'admin'::user_role);

-- Create RLS policies for approvals
CREATE POLICY "Users can view relevant approvals" 
ON public.grade_approvals 
FOR SELECT 
USING (
    approver_id = auth.uid() OR 
    grade_id IN (SELECT id FROM public.student_grades WHERE recorded_by = auth.uid()) OR
    get_current_user_role() = ANY (ARRAY['admin'::user_role, 'teacher'::user_role])
);

CREATE POLICY "Users can create approvals" 
ON public.grade_approvals 
FOR INSERT 
WITH CHECK (get_current_user_role() = ANY (ARRAY['admin'::user_role, 'teacher'::user_role]));

CREATE POLICY "Approvers can update approvals" 
ON public.grade_approvals 
FOR UPDATE 
USING (approver_id = auth.uid() OR get_current_user_role() = 'admin'::user_role);

-- Create RLS policies for analytics
CREATE POLICY "Staff can view analytics" 
ON public.analytics_metrics 
FOR SELECT 
USING (get_current_user_role() = ANY (ARRAY['admin'::user_role, 'teacher'::user_role]));

CREATE POLICY "System can insert analytics" 
ON public.analytics_metrics 
FOR INSERT 
WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX idx_document_templates_type ON public.document_templates(type);
CREATE INDEX idx_document_templates_active ON public.document_templates(is_active);
CREATE INDEX idx_grade_approvals_status ON public.grade_approvals(status);
CREATE INDEX idx_grade_approvals_stage ON public.grade_approvals(current_stage);
CREATE INDEX idx_analytics_metrics_type ON public.analytics_metrics(metric_type);
CREATE INDEX idx_analytics_metrics_date ON public.analytics_metrics(reference_date);
CREATE INDEX idx_collaboration_sessions_resource ON public.collaboration_sessions(resource_id);

-- Create triggers for updated_at
CREATE TRIGGER update_document_templates_updated_at
    BEFORE UPDATE ON public.document_templates
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_grade_approvals_updated_at
    BEFORE UPDATE ON public.grade_approvals
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_collaboration_sessions_updated_at
    BEFORE UPDATE ON public.collaboration_sessions
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();