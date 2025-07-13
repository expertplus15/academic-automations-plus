import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface StudentData {
  id: string;
  student_number: string;
  enrollment_date: string;
  year_level: number;
  status: string;
  profiles: {
    full_name: string;
    email: string;
  };
  programs: {
    id: string;
    name: string;
    code: string;
    duration_years: number;
  };
  academic_levels?: {
    name: string;
  };
}

interface AcademicContext {
  academic_year: { name: string; start_date: string; end_date: string };
  semester?: number;
  grades?: {
    overall_average: number;
    semester_average: number;
    subjects: Array<{
      name: string;
      grade: number;
      credits_ects: number;
    }>;
  };
  attendance?: {
    rate: number;
  };
  ects?: {
    earned: number;
    total: number;
  };
}

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
    const { template_id, student_id, academic_context = {} } = body;

    if (!template_id || !student_id) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get template with academic relationships
    const { data: template, error: templateError } = await supabase
      .from('document_templates')
      .select(`
        *,
        program:programs(name, code),
        level:academic_levels(name),
        academic_year:academic_years(name, start_date, end_date)
      `)
      .eq('id', template_id)
      .eq('is_active', true)
      .single();

    if (templateError || !template) {
      return new Response(JSON.stringify({ error: 'Template not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get comprehensive student data
    const { data: student, error: studentError } = await supabase
      .from('students')
      .select(`
        *,
        profiles!inner(full_name, email),
        programs(id, name, code, duration_years),
        academic_levels(name)
      `)
      .eq('id', student_id)
      .single() as { data: StudentData | null; error: any };

    if (studentError || !student) {
      return new Response(JSON.stringify({ error: 'Student not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get current academic year
    const { data: currentYear } = await supabase
      .from('academic_years')
      .select('*')
      .eq('is_current', true)
      .single();

    // Calculate academic data for variables
    const academicData: AcademicContext = {
      academic_year: currentYear || { name: '2024-2025', start_date: '2024-09-01', end_date: '2025-06-30' },
      ...academic_context
    };

    // Get grades if template requires them
    if (template.variables && template.variables.includes('grades.overall_average')) {
      const { data: grades } = await supabase
        .from('student_grades')
        .select(`
          grade,
          max_grade,
          subject:subjects(name, credits_ects)
        `)
        .eq('student_id', student_id)
        .eq('is_published', true);

      if (grades && grades.length > 0) {
        const validGrades = grades.filter(g => g.grade !== null);
        const totalGrade = validGrades.reduce((sum, g) => sum + (g.grade * 20 / g.max_grade), 0);
        const average = validGrades.length > 0 ? totalGrade / validGrades.length : 0;

        academicData.grades = {
          overall_average: Math.round(average * 100) / 100,
          semester_average: Math.round(average * 100) / 100, // Simplified for demo
          subjects: validGrades.map(g => ({
            name: g.subject.name,
            grade: Math.round((g.grade * 20 / g.max_grade) * 100) / 100,
            credits_ects: g.subject.credits_ects || 0
          }))
        };
      }
    }

    // Get attendance if needed
    if (template.variables && template.variables.includes('attendance.rate')) {
      const { data: attendance } = await supabase
        .from('attendance_records')
        .select('status')
        .eq('student_id', student_id);

      if (attendance && attendance.length > 0) {
        const presentCount = attendance.filter(a => a.status === 'present').length;
        const rate = (presentCount / attendance.length) * 100;
        academicData.attendance = { rate: Math.round(rate * 100) / 100 };
      }
    }

    // Get institution settings
    const { data: institution } = await supabase
      .from('system_settings')
      .select('*')
      .limit(1)
      .single();

    // Generate document number
    const { data: docNumber } = await supabase.rpc('generate_document_number', {
      doc_type: template.template_type.toUpperCase().substring(0, 3)
    });

    // Create comprehensive variable replacements
    const now = new Date();
    const replacements: Record<string, string> = {
      // Student variables
      'student.full_name': student.profiles.full_name,
      'student.student_number': student.student_number,
      'student.email': student.profiles.email,
      'student.enrollment_date': new Date(student.enrollment_date).toLocaleDateString('fr-FR'),
      'student.year_level': student.year_level.toString(),
      
      // Program variables
      'program.name': student.programs?.name || '',
      'program.code': student.programs?.code || '',
      'program.duration_years': student.programs?.duration_years?.toString() || '',
      
      // Academic year variables
      'academic_year.name': academicData.academic_year.name,
      'academic_year.start_date': new Date(academicData.academic_year.start_date).toLocaleDateString('fr-FR'),
      'academic_year.end_date': new Date(academicData.academic_year.end_date).toLocaleDateString('fr-FR'),
      
      // Grades variables
      'grades.overall_average': academicData.grades?.overall_average?.toString() || 'N/A',
      'grades.semester_average': academicData.grades?.semester_average?.toString() || 'N/A',
      
      // Attendance variables
      'attendance.rate': academicData.attendance?.rate?.toString() || 'N/A',
      
      // ECTS variables
      'ects.earned': academicData.ects?.earned?.toString() || 'N/A',
      'ects.total': academicData.ects?.total?.toString() || 'N/A',
      
      // Institution variables
      'institution.name': institution?.institution_name || 'École Supérieure',
      'institution.address': institution?.institution_address || '',
      
      // Document variables
      'document.issue_date': now.toLocaleDateString('fr-FR'),
      'document.number': docNumber || 'DOC000001'
    };

    // Replace variables in template
    let generatedContent = template.html_template || '';
    
    for (const [key, value] of Object.entries(replacements)) {
      const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
      generatedContent = generatedContent.replace(regex, value);
    }

    // Create generated document record
    const { data: generatedDoc, error: genError } = await supabase
      .from('generated_documents')
      .insert({
        template_id: template_id,
        student_id: student_id,
        document_number: docNumber,
        file_path: `documents/${docNumber}.pdf`,
        generation_data: {
          student_data: student,
          academic_context: academicData,
          variables_used: template.variables
        },
        generated_by: user.id,
        academic_year_id: currentYear?.id,
        program_id: student.programs?.id,
        expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year
      })
      .select()
      .single();

    if (genError) {
      console.error('Error creating generated document:', genError);
      return new Response(JSON.stringify({ error: genError.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ 
      document: generatedDoc,
      content: generatedContent,
      academic_data: academicData,
      status: 'generated'
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