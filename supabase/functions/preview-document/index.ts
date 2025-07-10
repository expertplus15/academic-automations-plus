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
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
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
    const { template_id, student_id, preview_data } = body;

    if (!template_id || !student_id) {
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
      return new Response(JSON.stringify({ error: 'Student not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Generate preview content
    let previewContent = template.template_content.template;
    
    // Replace template variables with actual data
    const replacements = {
      '{{student_name}}': student.profiles.full_name,
      '{{student_number}}': student.student_number,
      '{{student_email}}': student.profiles.email,
      '{{program_name}}': student.programs?.name || '',
      '{{level_name}}': student.academic_levels?.name || '',
      '{{document_number}}': '[NUMÉRO À GÉNÉRER]',
      '{{date}}': new Date().toLocaleDateString('fr-FR'),
      '{{academic_year}}': new Date().getFullYear().toString(),
      ...preview_data
    };

    for (const [key, value] of Object.entries(replacements)) {
      previewContent = previewContent.replace(new RegExp(key, 'g'), value || '');
    }

    // Check for missing variables
    const missingVariables = previewContent.match(/\{\{[^}]+\}\}/g) || [];

    return new Response(JSON.stringify({ 
      preview_content: previewContent,
      missing_variables: missingVariables,
      template_info: {
        name: template.name,
        type: template.template_type,
        requires_approval: template.requires_approval
      },
      student_info: {
        name: student.profiles.full_name,
        number: student.student_number,
        program: student.programs?.name
      }
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