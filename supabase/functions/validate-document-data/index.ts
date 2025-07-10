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
    const { template_id, student_id, data_to_validate } = body;

    if (!template_id || !student_id) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const validationResults = {
      is_valid: true,
      errors: [],
      warnings: [],
      missing_fields: [],
      data_quality_score: 100
    };

    // Get template
    const { data: template, error: templateError } = await supabase
      .from('document_templates')
      .select('*')
      .eq('id', template_id)
      .eq('is_active', true)
      .single();

    if (templateError || !template) {
      validationResults.is_valid = false;
      validationResults.errors.push('Template not found or inactive');
      validationResults.data_quality_score -= 50;
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
      validationResults.is_valid = false;
      validationResults.errors.push('Student not found');
      validationResults.data_quality_score -= 50;
    }

    if (template && student) {
      // Validate required fields from template
      const requiredFields = template.template_content.fields || [];
      
      for (const field of requiredFields) {
        const fieldValue = data_to_validate?.[field] || student[field] || student.profiles?.[field];
        
        if (!fieldValue) {
          validationResults.missing_fields.push(field);
          validationResults.data_quality_score -= 10;
          
          if (field.includes('email') || field.includes('name') || field.includes('number')) {
            validationResults.errors.push(`Required field missing: ${field}`);
            validationResults.is_valid = false;
          } else {
            validationResults.warnings.push(`Optional field missing: ${field}`);
          }
        }
      }

      // Validate email format
      if (student.profiles?.email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(student.profiles.email)) {
          validationResults.errors.push('Invalid email format');
          validationResults.is_valid = false;
          validationResults.data_quality_score -= 15;
        }
      }

      // Validate student number format
      if (student.student_number) {
        if (student.student_number.length < 5) {
          validationResults.warnings.push('Student number seems too short');
          validationResults.data_quality_score -= 5;
        }
      }

      // Check for duplicate requests
      const { data: existingRequests } = await supabase
        .from('document_requests')
        .select('id')
        .eq('template_id', template_id)
        .eq('student_id', student_id)
        .eq('status', 'pending');

      if (existingRequests && existingRequests.length > 0) {
        validationResults.warnings.push('Pending request already exists for this template');
        validationResults.data_quality_score -= 10;
      }

      // Validate template-specific data
      if (template.template_type === 'attestation_scolarite') {
        if (!student.enrollment_date) {
          validationResults.warnings.push('Enrollment date missing for school certificate');
          validationResults.data_quality_score -= 5;
        }
      }

      if (template.template_type === 'releve_notes') {
        // Check if student has grades
        const { data: grades } = await supabase
          .from('student_grades')
          .select('id', { count: 'exact', head: true })
          .eq('student_id', student_id);

        if (!grades || grades === 0) {
          validationResults.warnings.push('No grades found for transcript');
          validationResults.data_quality_score -= 20;
        }
      }
    }

    // Ensure score doesn't go below 0
    validationResults.data_quality_score = Math.max(0, validationResults.data_quality_score);

    return new Response(JSON.stringify({ validation: validationResults }), {
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