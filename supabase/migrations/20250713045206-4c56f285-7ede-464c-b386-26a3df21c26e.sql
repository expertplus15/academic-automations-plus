-- Create RLS policies for templates
CREATE POLICY "Users can view active templates" 
ON public.document_templates 
FOR SELECT 
USING (is_active = true OR get_current_user_role() = ANY (ARRAY['admin'::user_role, 'teacher'::user_role]));

CREATE POLICY "Users can create templates" 
ON public.document_templates 
FOR INSERT 
WITH CHECK (get_current_user_role() = ANY (ARRAY['admin'::user_role, 'teacher'::user_role]));

CREATE POLICY "Staff can update templates" 
ON public.document_templates 
FOR UPDATE 
USING (get_current_user_role() = ANY (ARRAY['admin'::user_role, 'teacher'::user_role]));

-- Create RLS policies for approvals
CREATE POLICY "Staff can view approvals" 
ON public.grade_approvals 
FOR SELECT 
USING (get_current_user_role() = ANY (ARRAY['admin'::user_role, 'teacher'::user_role]));

CREATE POLICY "Staff can create approvals" 
ON public.grade_approvals 
FOR INSERT 
WITH CHECK (get_current_user_role() = ANY (ARRAY['admin'::user_role, 'teacher'::user_role]));

CREATE POLICY "Staff can update approvals" 
ON public.grade_approvals 
FOR UPDATE 
USING (get_current_user_role() = ANY (ARRAY['admin'::user_role, 'teacher'::user_role]));

-- Create RLS policies for analytics
CREATE POLICY "Staff can view analytics" 
ON public.analytics_metrics 
FOR SELECT 
USING (get_current_user_role() = ANY (ARRAY['admin'::user_role, 'teacher'::user_role]));

CREATE POLICY "System can insert analytics" 
ON public.analytics_metrics 
FOR INSERT 
WITH CHECK (true);

-- Create RLS policies for collaboration sessions
CREATE POLICY "Staff can view collaboration sessions" 
ON public.collaboration_sessions 
FOR SELECT 
USING (get_current_user_role() = ANY (ARRAY['admin'::user_role, 'teacher'::user_role]));

CREATE POLICY "Staff can manage collaboration sessions" 
ON public.collaboration_sessions 
FOR ALL 
USING (get_current_user_role() = ANY (ARRAY['admin'::user_role, 'teacher'::user_role]));

-- Create RLS policies for template versions
CREATE POLICY "Staff can view template versions" 
ON public.template_versions 
FOR SELECT 
USING (get_current_user_role() = ANY (ARRAY['admin'::user_role, 'teacher'::user_role]));

CREATE POLICY "Staff can create template versions" 
ON public.template_versions 
FOR INSERT 
WITH CHECK (get_current_user_role() = ANY (ARRAY['admin'::user_role, 'teacher'::user_role]));

-- Create RLS policies for approval history
CREATE POLICY "Staff can view approval history" 
ON public.approval_history 
FOR SELECT 
USING (get_current_user_role() = ANY (ARRAY['admin'::user_role, 'teacher'::user_role]));

CREATE POLICY "Staff can create approval history" 
ON public.approval_history 
FOR INSERT 
WITH CHECK (get_current_user_role() = ANY (ARRAY['admin'::user_role, 'teacher'::user_role]));