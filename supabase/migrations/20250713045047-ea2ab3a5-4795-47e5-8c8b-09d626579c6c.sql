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