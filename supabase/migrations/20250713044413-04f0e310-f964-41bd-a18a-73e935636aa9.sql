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
    created_by UUID,
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
    created_by UUID,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create grade approval workflow table
CREATE TABLE IF NOT EXISTS public.grade_approvals (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    grade_id UUID,
    workflow_stage VARCHAR NOT NULL, -- 'teacher_entry', 'department_review', 'admin_validation', 'final_approval'
    current_stage VARCHAR NOT NULL DEFAULT 'teacher_entry',
    status VARCHAR NOT NULL DEFAULT 'pending', -- 'pending', 'approved', 'rejected', 'changes_requested'
    approver_id UUID,
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
    performer_id UUID,
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