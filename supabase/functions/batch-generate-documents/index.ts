import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const authHeader = req.headers.get('Authorization')!;
    const { data: { user }, error: authError } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
    
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const body = await req.json();
    const { template_id, student_ids, batch_data } = body;

    if (!template_id || !student_ids || !Array.isArray(student_ids)) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get template
    const { data: template, error: templateError } = await supabase
      .from('document_templates')
      .select('*')
      .eq('id', template_id)
      .eq('is_active', true)
      .single();

    if (templateError || !template) {
      return new Response(JSON.stringify({ error: 'Template not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const results = [];
    const errors = [];

    // Process each student
    for (const student_id of student_ids) {
      try {
        // Get student data
        const { data: student, error: studentError } = await supabase
          .from('students')
          .select(`
            *,
            profiles!inner(full_name, email),
            programs(name),
            academic_levels(name)
          `)
          .eq('id', student_id)
          .single();

        if (studentError || !student) {
          errors.push({
            student_id,
            error: 'Student not found'
          });
          continue;
        }

        // Create document request
        const { data: request, error: requestError } = await supabase
          .from('document_requests')
          .insert({
            template_id,
            student_id,
            request_data: batch_data || {},
            requested_by: user.id,
            status: template.requires_approval ? 'pending' : 'approved'
          })
          .select()
          .single();

        if (requestError) {
          errors.push({
            student_id,
            error: requestError.message
          });
          continue;
        }

        // If auto-approved, generate document
        if (!template.requires_approval) {
          // Generate document number
          const { data: docNumber } = await supabase.rpc('generate_document_number', {
            doc_type: template.template_type.toUpperCase().substring(0, 3)
          });

          // Create generated document record
          const { data: generatedDoc, error: genError } = await supabase
            .from('generated_documents')
            .insert({
              request_id: request.id,
              document_number: docNumber,
              file_path: `documents/${docNumber}.pdf`,
              generated_by: user.id,
              expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
            })
            .select()
            .single();

          if (genError) {
            errors.push({
              student_id,
              error: genError.message
            });
            continue;
          }

          results.push({
            student_id,
            student_name: student.profiles.full_name,
            request_id: request.id,
            document_id: generatedDoc.id,
            document_number: docNumber,
            status: 'generated'
          });
        } else {
          results.push({
            student_id,
            student_name: student.profiles.full_name,
            request_id: request.id,
            status: 'pending_approval'
          });
        }

      } catch (error) {
        errors.push({
          student_id,
          error: error.message
        });
      }
    }

    return new Response(JSON.stringify({ 
      total_processed: student_ids.length,
      successful: results.length,
      failed: errors.length,
      results,
      errors
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});