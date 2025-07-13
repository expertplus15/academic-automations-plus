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

    if (req.method === 'POST') {
      const { 
        type, 
        format, 
        filters = {},
        templateType = 'standard'
      } = await req.json();

      console.log('Exporting data:', { type, format, filters, templateType });

      let data = [];
      let fileName = '';

      // Fetch data based on type
      switch (type) {
        case 'grades':
          const { data: gradesData, error: gradesError } = await supabase
            .from('student_grades')
            .select(`
              *,
              students(student_number, profiles(full_name)),
              subjects(name, code),
              evaluation_types(name)
            `)
            .eq('is_published', true);
          
          if (gradesError) throw gradesError;
          data = gradesData;
          fileName = `grades-export-${Date.now()}`;
          break;

        case 'students':
          const { data: studentsData, error: studentsError } = await supabase
            .from('students')
            .select(`
              *,
              profiles(*),
              programs(name),
              academic_levels(name)
            `)
            .eq('status', 'active');
          
          if (studentsError) throw studentsError;
          data = studentsData;
          fileName = `students-export-${Date.now()}`;
          break;

        case 'analytics':
          // Generate analytics data
          data = await generateAnalyticsData(supabase, filters);
          fileName = `analytics-export-${Date.now()}`;
          break;

        default:
          return new Response(
            JSON.stringify({ error: 'Invalid export type' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
      }

      // Generate export based on format
      let exportContent = '';
      let contentType = '';

      if (format === 'csv') {
        exportContent = generateCSV(data, type);
        contentType = 'text/csv';
        fileName += '.csv';
      } else if (format === 'excel') {
        exportContent = generateExcelData(data, type);
        contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        fileName += '.xlsx';
      } else {
        return new Response(
          JSON.stringify({ error: 'Invalid format. Use csv or excel' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // For now, return download URL (in production, upload to storage)
      const mockDownloadUrl = `https://example.com/exports/${fileName}`;

      // Create export job record
      const { data: jobData, error: jobError } = await supabase
        .from('export_jobs')
        .insert({
          type,
          format,
          file_name: fileName,
          file_url: mockDownloadUrl,
          status: 'completed',
          records_count: data.length,
          filters: filters,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (jobError) {
        console.error('Job creation error:', jobError);
      }

      return new Response(
        JSON.stringify({
          success: true,
          downloadUrl: mockDownloadUrl,
          fileName,
          recordsCount: data.length,
          jobId: jobData?.id,
          preview: data.slice(0, 5) // First 5 records for preview
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in export-data function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function generateCSV(data: any[], type: string): string {
  if (data.length === 0) return '';

  let headers: string[] = [];
  let rows: string[] = [];

  switch (type) {
    case 'grades':
      headers = ['Étudiant', 'Numéro', 'Matière', 'Type Évaluation', 'Note', 'Note Max', 'Date'];
      rows = data.map(grade => [
        grade.students?.profiles?.full_name || '',
        grade.students?.student_number || '',
        grade.subjects?.name || '',
        grade.evaluation_types?.name || '',
        grade.grade || '',
        grade.max_grade || '',
        grade.evaluation_date || ''
      ].join(','));
      break;

    case 'students':
      headers = ['Nom Complet', 'Numéro', 'Email', 'Programme', 'Niveau', 'Statut'];
      rows = data.map(student => [
        student.profiles?.full_name || '',
        student.student_number || '',
        student.profiles?.email || '',
        student.programs?.name || '',
        student.academic_levels?.name || '',
        student.status || ''
      ].join(','));
      break;

    case 'analytics':
      headers = ['Métrique', 'Valeur', 'Période'];
      rows = data.map(item => [
        item.metric || '',
        item.value || '',
        item.period || ''
      ].join(','));
      break;
  }

  return [headers.join(','), ...rows].join('\n');
}

function generateExcelData(data: any[], type: string): string {
  // In a real implementation, you'd use a library like ExcelJS
  // For now, return CSV content (which Excel can open)
  return generateCSV(data, type);
}

async function generateAnalyticsData(supabase: any, filters: any) {
  // Generate mock analytics data
  return [
    { metric: 'Moyenne Générale', value: '14.5', period: 'Semestre 1' },
    { metric: 'Taux de Réussite', value: '87%', period: 'Semestre 1' },
    { metric: 'Nombre d\'Étudiants', value: '125', period: 'Semestre 1' },
    { metric: 'Notes > 15', value: '45', period: 'Semestre 1' },
    { metric: 'Notes < 10', value: '8', period: 'Semestre 1' }
  ];
}