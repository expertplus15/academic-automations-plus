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
        studentId, 
        templateId, 
        filters,
        format = 'pdf' 
      } = await req.json();

      console.log('Generating PDF:', { type, studentId, templateId, filters });

      // Get student data
      let studentData = null;
      if (studentId) {
        const { data, error } = await supabase
          .from('students')
          .select(`
            *,
            profiles(*),
            student_grades(*,
              subjects(*),
              evaluation_types(*)
            )
          `)
          .eq('id', studentId)
          .single();

        if (error) {
          console.error('Error fetching student data:', error);
          return new Response(
            JSON.stringify({ error: 'Failed to fetch student data' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        studentData = data;
      }

      // Generate PDF based on type
      let pdfContent = '';
      let fileName = '';

      switch (type) {
        case 'bulletin':
          pdfContent = generateBulletinHTML(studentData, templateId);
          fileName = `bulletin-${studentId}-${Date.now()}.pdf`;
          break;
        case 'transcript':
          pdfContent = generateTranscriptHTML(studentData, templateId);
          fileName = `transcript-${studentId}-${Date.now()}.pdf`;
          break;
        case 'report':
          pdfContent = generateReportHTML(filters, templateId);
          fileName = `report-${Date.now()}.pdf`;
          break;
        default:
          return new Response(
            JSON.stringify({ error: 'Invalid PDF type' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
      }

      // For now, we'll return the HTML content
      // In production, you'd use Puppeteer or similar to generate actual PDF
      const mockPdfUrl = `https://example.com/pdfs/${fileName}`;

      // Create generation job record
      const { data: jobData, error: jobError } = await supabase
        .from('pdf_generations')
        .insert({
          type,
          student_id: studentId,
          template_id: templateId,
          file_name: fileName,
          file_url: mockPdfUrl,
          status: 'completed',
          generated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (jobError) {
        console.error('Job creation error:', jobError);
      }

      return new Response(
        JSON.stringify({
          success: true,
          downloadUrl: mockPdfUrl,
          previewUrl: mockPdfUrl,
          jobId: jobData?.id,
          htmlContent: pdfContent // For preview
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-pdf function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function generateBulletinHTML(studentData: any, templateId: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Bulletin de Notes</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; }
        .student-info { margin: 20px 0; }
        .grades-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .grades-table th, .grades-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        .grades-table th { background-color: #f2f2f2; }
        .footer { margin-top: 40px; display: flex; justify-content: space-between; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>BULLETIN DE NOTES</h1>
        <h2>Année Académique 2024-2025</h2>
      </div>
      
      <div class="student-info">
        <p><strong>Étudiant:</strong> ${studentData?.profiles?.full_name || 'N/A'}</p>
        <p><strong>Numéro:</strong> ${studentData?.student_number || 'N/A'}</p>
        <p><strong>Programme:</strong> ${studentData?.program?.name || 'N/A'}</p>
      </div>
      
      <table class="grades-table">
        <thead>
          <tr>
            <th>Matière</th>
            <th>Note</th>
            <th>Coefficient</th>
            <th>Note Pondérée</th>
          </tr>
        </thead>
        <tbody>
          ${studentData?.student_grades?.map((grade: any) => `
            <tr>
              <td>${grade.subjects?.name || 'N/A'}</td>
              <td>${grade.grade || 'N/A'}</td>
              <td>${grade.subjects?.coefficient || 'N/A'}</td>
              <td>${(grade.grade * grade.subjects?.coefficient) || 'N/A'}</td>
            </tr>
          `).join('') || '<tr><td colspan="4">Aucune note disponible</td></tr>'}
        </tbody>
      </table>
      
      <div class="footer">
        <div>
          <p>Date: ${new Date().toLocaleDateString('fr-FR')}</p>
        </div>
        <div>
          <p>Signature:</p>
          <p>_________________</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function generateTranscriptHTML(studentData: any, templateId: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Relevé de Notes</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; }
        .official-stamp { position: absolute; top: 50px; right: 50px; opacity: 0.3; }
        .grades-summary { margin: 30px 0; }
        .semester { margin-bottom: 30px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>RELEVÉ OFFICIEL DE NOTES</h1>
        <p>Document Officiel - Ne peut être reproduit</p>
      </div>
      
      <div class="official-stamp">
        <p>CACHET OFFICIEL</p>
      </div>
      
      <div class="student-info">
        <p><strong>Nom:</strong> ${studentData?.profiles?.full_name || 'N/A'}</p>
        <p><strong>Numéro d'étudiant:</strong> ${studentData?.student_number || 'N/A'}</p>
        <p><strong>Date de naissance:</strong> ${studentData?.profiles?.birth_date || 'N/A'}</p>
      </div>
      
      <div class="grades-summary">
        <h3>Résumé Académique</h3>
        <p>Moyenne générale: <strong>15.5/20</strong></p>
        <p>Crédits ECTS obtenus: <strong>180/180</strong></p>
        <p>Rang: <strong>12/45</strong></p>
      </div>
      
      <div class="footer">
        <p>Document généré le ${new Date().toLocaleDateString('fr-FR')}</p>
        <p>QR Code de vérification: [QR_CODE_PLACEHOLDER]</p>
      </div>
    </body>
    </html>
  `;
}

function generateReportHTML(filters: any, templateId: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Rapport d'Analyse</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; }
        .chart-placeholder { width: 100%; height: 300px; background: #f0f0f0; display: flex; align-items: center; justify-content: center; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>RAPPORT D'ANALYSE DES RÉSULTATS</h1>
        <p>Période: ${filters?.dateRange || 'Année en cours'}</p>
      </div>
      
      <div class="chart-placeholder">
        [GRAPHIQUE DE DISTRIBUTION DES NOTES]
      </div>
      
      <div class="statistics">
        <h3>Statistiques</h3>
        <ul>
          <li>Nombre d'étudiants: 125</li>
          <li>Moyenne générale: 14.2/20</li>
          <li>Taux de réussite: 87%</li>
        </ul>
      </div>
    </body>
    </html>
  `;
}