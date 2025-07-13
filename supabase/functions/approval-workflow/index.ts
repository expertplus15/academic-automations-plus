import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const url = new URL(req.url);
    const action = url.pathname.split('/').pop();

    if (req.method === 'GET') {
      if (action === 'pending') {
        // Get pending approvals for current user
        const { data, error } = await supabase
          .from('grade_approvals')
          .select(`
            *,
            student_grades(
              grade,
              student_id,
              subject_id,
              subjects(name),
              students(
                student_number,
                profiles(full_name)
              )
            )
          `)
          .eq('status', 'pending')
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }

        return new Response(JSON.stringify(data), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      if (action === 'history') {
        // Get approval history
        const gradeId = url.searchParams.get('gradeId');
        
        const { data, error } = await supabase
          .from('approval_history')
          .select(`
            *,
            grade_approvals(workflow_stage, status)
          `)
          .order('created_at', { ascending: false })
          .limit(100);

        if (error) {
          throw error;
        }

        return new Response(JSON.stringify(data), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
    }

    if (req.method === 'POST') {
      const body = await req.json();

      if (action === 'submit') {
        // Submit grade for approval
        const { gradeId, stage = 'teacher_entry' } = body;

        // Check if approval already exists
        const { data: existing } = await supabase
          .from('grade_approvals')
          .select('id')
          .eq('grade_id', gradeId)
          .single();

        if (existing) {
          return new Response(
            JSON.stringify({ error: 'Grade already in approval workflow' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Create new approval
        const { data: approval, error } = await supabase
          .from('grade_approvals')
          .insert({
            grade_id: gradeId,
            workflow_stage: stage,
            current_stage: stage,
            status: 'pending'
          })
          .select()
          .single();

        if (error) {
          throw error;
        }

        // Add to history
        await supabase
          .from('approval_history')
          .insert({
            approval_id: approval.id,
            action: 'submit',
            to_stage: stage,
            performer_id: body.userId
          });

        return new Response(JSON.stringify(approval), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      if (action === 'approve') {
        // Approve grade
        const { approvalId, comments, nextStage } = body;

        const { data: approval, error: fetchError } = await supabase
          .from('grade_approvals')
          .select('*')
          .eq('id', approvalId)
          .single();

        if (fetchError) {
          throw fetchError;
        }

        const newStage = nextStage || getNextStage(approval.current_stage);
        const newStatus = newStage ? 'pending' : 'approved';

        // Update approval
        const { data, error } = await supabase
          .from('grade_approvals')
          .update({
            current_stage: newStage || approval.current_stage,
            status: newStatus,
            approver_id: body.userId,
            approval_date: newStatus === 'approved' ? new Date().toISOString() : null,
            comments
          })
          .eq('id', approvalId)
          .select()
          .single();

        if (error) {
          throw error;
        }

        // Add to history
        await supabase
          .from('approval_history')
          .insert({
            approval_id: approvalId,
            action: 'approve',
            from_stage: approval.current_stage,
            to_stage: newStage,
            performer_id: body.userId,
            reason: comments
          });

        // If fully approved, publish the grade
        if (newStatus === 'approved') {
          await supabase
            .from('student_grades')
            .update({ is_published: true })
            .eq('id', approval.grade_id);
        }

        return new Response(JSON.stringify(data), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      if (action === 'reject') {
        // Reject grade
        const { approvalId, reason } = body;

        const { data, error } = await supabase
          .from('grade_approvals')
          .update({
            status: 'rejected',
            approver_id: body.userId,
            comments: reason
          })
          .eq('id', approvalId)
          .select()
          .single();

        if (error) {
          throw error;
        }

        // Add to history
        await supabase
          .from('approval_history')
          .insert({
            approval_id: approvalId,
            action: 'reject',
            performer_id: body.userId,
            reason
          });

        return new Response(JSON.stringify(data), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      if (action === 'request-changes') {
        // Request changes
        const { approvalId, changes } = body;

        const { data, error } = await supabase
          .from('grade_approvals')
          .update({
            status: 'changes_requested',
            approver_id: body.userId,
            comments: changes
          })
          .eq('id', approvalId)
          .select()
          .single();

        if (error) {
          throw error;
        }

        // Add to history
        await supabase
          .from('approval_history')
          .insert({
            approval_id: approvalId,
            action: 'request_changes',
            performer_id: body.userId,
            reason: changes
          });

        return new Response(JSON.stringify(data), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
    }

    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in approval-workflow function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function getNextStage(currentStage: string): string | null {
  const stages = {
    'teacher_entry': 'department_review',
    'department_review': 'admin_validation',
    'admin_validation': 'final_approval',
    'final_approval': null
  };

  return stages[currentStage as keyof typeof stages] || null;
}