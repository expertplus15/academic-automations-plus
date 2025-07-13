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
    const { template_id, student_id, request_data } = body;

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

    // Get student data (if student_id provided)
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

      if (studentError || !studentData) {
        return new Response(JSON.stringify({ error: 'Student not found' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      student = studentData;
    }

    // Create document request
    const { data: request, error: requestError } = await supabase
      .from('document_requests')
      .insert({
        template_id,
        student_id,
        request_data: request_data || {},
        requested_by: user.id,
        status: template.requires_approval ? 'pending' : 'approved'
      })
      .select()
      .single();

    if (requestError) {
      console.error('Error creating request:', requestError);
      return new Response(JSON.stringify({ error: requestError.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // If auto-approved, generate document immediately
    if (!template.requires_approval) {
      // Generate document number
      const { data: docNumber } = await supabase.rpc('generate_document_number', {
        doc_type: template.template_type.toUpperCase().substring(0, 3)
      });

      // Replace template variables with actual data
      let generatedContent = template.template_content.template;
      
      // Replace common variables
      const replacements = {
        '{{student_name}}': student?.profiles?.full_name || '',
        '{{student_number}}': student?.student_number || '',
        '{{student_email}}': student?.profiles?.email || '',
        '{{program_name}}': student?.programs?.name || '',
        '{{level_name}}': student?.academic_levels?.name || '',
        '{{document_number}}': docNumber,
        '{{date}}': new Date().toLocaleDateString('fr-FR'),
        '{{academic_year}}': new Date().getFullYear().toString(),
        ...request_data
      };

      for (const [key, value] of Object.entries(replacements)) {
        generatedContent = generatedContent.replace(new RegExp(key, 'g'), value || '');
      }

      // Create generated document record
      const { data: generatedDoc, error: genError } = await supabase
        .from('generated_documents')
        .insert({
          request_id: request.id,
          document_number: docNumber,
          file_path: `documents/${docNumber}.pdf`,
          generated_by: user.id,
          expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year
        })
        .select()
        .single();

      if (genError) {
        console.error('Error creating generated document:', genError);
      }

      return new Response(JSON.stringify({ 
        request, 
        document: generatedDoc,
        content: generatedContent,
        status: 'generated'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ 
      request,
      status: 'pending_approval'
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