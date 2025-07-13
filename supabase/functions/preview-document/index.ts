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

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    const body = await req.json();
    const { template_id, student_id, preview_data } = body;

    // Get template
    const { data: template, error: templateError } = await supabase
      .from('document_templates')
      .select('*')
      .eq('id', template_id)
      .single();

    if (templateError || !template) {
      return new Response(JSON.stringify({ error: 'Template not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get student data if provided
    let student = null;
    if (student_id) {
      const { data: studentData } = await supabase
        .from('students')
        .select(`
          *,
          profiles!inner(full_name, email),
          programs(name),
          academic_levels(name)
        `)
        .eq('id', student_id)
        .single();

      student = studentData;
    }

    // Use mock data for preview if no student
    if (!student) {
      student = {
        student_number: 'STU001',
        profiles: { full_name: 'Jean Dupont', email: 'jean.dupont@example.com' },
        programs: { name: 'Informatique' },
        academic_levels: { name: 'Licence' }
      };
    }

    // Generate preview content
    let previewContent = template.template_content.template;
    
    const replacements = {
      '{{student_name}}': student?.profiles?.full_name || 'Nom Étudiant',
      '{{student_number}}': student?.student_number || 'NUM001',
      '{{student_email}}': student?.profiles?.email || 'email@example.com',
      '{{program_name}}': student?.programs?.name || 'Programme d\'étude',
      '{{level_name}}': student?.academic_levels?.name || 'Niveau',
      '{{document_number}}': 'PREV' + Date.now(),
      '{{date}}': new Date().toLocaleDateString('fr-FR'),
      '{{academic_year}}': new Date().getFullYear().toString(),
      ...preview_data
    };

    for (const [key, value] of Object.entries(replacements)) {
      previewContent = previewContent.replace(new RegExp(key, 'g'), value || '');
    }

    return new Response(JSON.stringify({ 
      content: previewContent,
      template: template.name,
      type: template.template_type
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Preview error:', error);
    return new Response(JSON.stringify({ error: 'Preview generation failed' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});