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

    if (!template_id) {
      return new Response(JSON.stringify({ error: 'Missing template_id' }), {
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

    // Get student data if student_id is provided
    let student = null;
    if (student_id) {
      const { data: studentData, error: studentError } = await supabase
        .from('students')
        .select(`
          *,
          profiles!inner(full_name, email),
          programs(name),
          academic_levels(name)
        `)
        .eq('id', student_id)
        .single();

      if (studentError) {
        console.error('Student not found:', studentError);
      } else {
        student = studentData;
      }
    }

    // Generate preview content using HTML template
    let previewContent = template.html_template || '<div>Aucun template HTML défini</div>';
    
    // Replace template variables with actual data or default values
    const replacements = {
      '{{student_name}}': student?.profiles?.full_name || '[Nom de l\'étudiant]',
      '{{student_number}}': student?.student_number || '[Numéro étudiant]',
      '{{student_email}}': student?.profiles?.email || '[Email étudiant]',
      '{{program_name}}': student?.programs?.name || '[Programme d\'études]',
      '{{level_name}}': student?.academic_levels?.name || '[Niveau académique]',
      '{{document_number}}': '[NUMÉRO À GÉNÉRER]',
      '{{date}}': new Date().toLocaleDateString('fr-FR'),
      '{{academic_year}}': `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`,
      '{{period}}': 'Semestre 1',
      '{{grades_table}}': '<table><tr><td>Mathématiques</td><td>15/20</td></tr><tr><td>Français</td><td>14/20</td></tr></table>',
      '{{subjects_list}}': '<ul><li>Mathématiques - 15/20</li><li>Français - 14/20</li></ul>',
      '{{course_name}}': '[Nom du cours]',
      '{{final_grade}}': '15',
      ...preview_data
    };

    for (const [key, value] of Object.entries(replacements)) {
      previewContent = previewContent.replace(new RegExp(key, 'g'), value || '');
    }

    // Check for missing variables
    const missingVariables = previewContent.match(/\{\{[^}]+\}\}/g) || [];

    return new Response(JSON.stringify({ 
      html: previewContent,
      missing_variables: missingVariables,
      template_info: {
        name: template.name,
        type: template.template_type,
        requires_approval: template.requires_approval
      },
      student_info: student ? {
        name: student.profiles.full_name,
        number: student.student_number,
        program: student.programs?.name
      } : null
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