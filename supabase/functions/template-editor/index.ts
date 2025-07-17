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
      if (action === 'templates') {
        // Get all templates
        const { data, error } = await supabase
          .from('document_templates')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false });

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

      if (action === 'create') {
        // Create new template
        const { name, type, description, content } = body;

        const { data, error } = await supabase
          .from('document_templates')
          .insert({
            name,
            type,
            description,
            content,
            created_by: body.userId || null
          })
          .select()
          .single();

        if (error) {
          throw error;
        }

        // Create initial version
        await supabase
          .from('template_versions')
          .insert({
            template_id: data.id,
            version: 1,
            content,
            changes: 'Initial version',
            created_by: body.userId || null
          });

        return new Response(JSON.stringify(data), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      if (action === 'update') {
        // Update template
        const { id, content, changes } = body;

        // Get current template
        const { data: currentTemplate, error: fetchError } = await supabase
          .from('document_templates')
          .select('*')
          .eq('id', id)
          .single();

        if (fetchError) {
          throw fetchError;
        }

        // Update template
        const { data, error } = await supabase
          .from('document_templates')
          .update({
            content,
            version: currentTemplate.version + 1,
            updated_at: new Date().toISOString()
          })
          .eq('id', id)
          .select()
          .single();

        if (error) {
          throw error;
        }

        // Create new version
        await supabase
          .from('template_versions')
          .insert({
            template_id: id,
            version: data.version,
            content,
            changes: changes || 'Template updated',
            created_by: body.userId || null
          });

        return new Response(JSON.stringify(data), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      if (action === 'preview') {
        // Generate template preview
        const { templateId, sampleData } = body;

        const { data: template, error } = await supabase
          .from('document_templates')
          .select('*')
          .eq('id', templateId)
          .single();

        if (error) {
          throw error;
        }

        // Generate preview HTML
        const previewHtml = generatePreviewHTML(template, sampleData);

        return new Response(JSON.stringify({
          success: true,
          previewHtml,
          templateName: template.name
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
    }

    if (req.method === 'DELETE') {
      const { id } = await req.json();

      // Soft delete by setting is_active to false
      const { data, error } = await supabase
        .from('document_templates')
        .update({ is_active: false })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in template-editor function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function generatePreviewHTML(template: any, sampleData: any): string {
  // Parse template content and replace placeholders with sample data
  let html = template.content.html || '<p>Template en cours de développement</p>';
  
  // Enhanced placeholders with more academic variables
  const placeholders = {
    // Variables étudiant
    '{{nom}}': sampleData?.nom || 'DUPONT',
    '{{prenom}}': sampleData?.prenom || 'Jean',
    '{{student_name}}': sampleData?.studentName || 'DUPONT Jean',
    '{{matricule}}': sampleData?.matricule || 'STU2024001',
    '{{student_number}}': sampleData?.studentNumber || 'STU2024001',
    '{{date_naissance}}': sampleData?.date_naissance || '15/05/1998',
    '{{lieu_naissance}}': sampleData?.lieu_naissance || 'Paris',
    '{{nationalite}}': sampleData?.nationalite || 'Française',
    
    // Variables académiques
    '{{programme}}': sampleData?.programme || 'Licence Informatique',
    '{{program}}': sampleData?.program || 'Licence Informatique',
    '{{niveau}}': sampleData?.niveau || 'L3',
    '{{classe}}': sampleData?.classe || 'L3 Informatique',
    '{{semestre}}': sampleData?.semestre || 'Semestre 1',
    '{{semester}}': sampleData?.semester || 'Semestre 1',
    '{{annee_academique}}': sampleData?.annee_academique || '2023/2024',
    '{{academic_year}}': sampleData?.academicYear || '2023/2024',
    
    // Variables notes et résultats
    '{{moyenne_generale}}': sampleData?.moyenne_generale || '14.2',
    '{{mention}}': sampleData?.mention || 'Bien',
    '{{decision}}': sampleData?.decision || 'Admis',
    '{{credits_obtenus}}': sampleData?.credits_obtenus || '30',
    '{{total_credits}}': sampleData?.total_credits || '30',
    '{{rang_classe}}': sampleData?.rang_classe || '5ème sur 28',
    
    // Variables institutionnelles
    '{{republique}}': sampleData?.republique || 'République Française',
    '{{ministere}}': sampleData?.ministere || 'Ministère de l\'Enseignement Supérieur',
    '{{ecole}}': sampleData?.ecole || 'École Supérieure de Management',
    '{{institution}}': sampleData?.institution || 'École Supérieure',
    '{{directeur_general}}': sampleData?.directeur_general || 'LE DIRECTEUR GÉNÉRAL',
    
    // Variables de document
    '{{numero_attestation}}': sampleData?.numero_attestation || 'ATT2024001',
    '{{numero_bulletin}}': sampleData?.numero_bulletin || 'BUL2024001',
    '{{numero_certificat}}': sampleData?.numero_certificat || 'CERT2024001',
    '{{type_certificat}}': sampleData?.type_certificat || 'CERTIFICAT DE RÉUSSITE',
    
    // Variables de date et lieu
    '{{date}}': new Date().toLocaleDateString('fr-FR'),
    '{{date_emission}}': sampleData?.date_emission || new Date().toLocaleDateString('fr-FR'),
    '{{lieu_emission}}': sampleData?.lieu_emission || 'Paris',
    '{{date_aujourd_hui}}': new Date().toLocaleDateString('fr-FR'),
    '{{annee_courante}}': new Date().getFullYear().toString()
  };

  Object.entries(placeholders).forEach(([placeholder, value]) => {
    html = html.replace(new RegExp(placeholder, 'g'), value as string);
  });

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Aperçu - ${template.name}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
        .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 20px; }
        .content { margin: 20px 0; }
        .footer { margin-top: 40px; border-top: 1px solid #ddd; padding-top: 20px; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
        .preview-banner { background: #fffbf0; border: 2px dashed #f59e0b; padding: 10px; text-align: center; margin-bottom: 20px; color: #92400e; }
      </style>
    </head>
    <body>
      <div class="preview-banner">
        <strong>MODE APERÇU</strong> - Ce document est généré pour prévisualisation uniquement
      </div>
      ${html}
    </body>
    </html>
  `;
}