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

    const url = new URL(req.url);
    const period = parseInt(url.searchParams.get('period') || '7'); // days
    const templateId = url.searchParams.get('template_id');
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - period);

    // Build base query
    let query = supabase
      .from('generated_documents')
      .select(`
        *,
        request:document_requests!inner(
          *,
          template:document_templates!inner(name, template_type),
          student:students!inner(
            student_number,
            profiles!inner(full_name, email)
          )
        )
      `)
      .gte('generated_at', startDate.toISOString());

    if (templateId) {
      query = query.eq('request.template_id', templateId);
    }

    const { data: documents, error: docError } = await query;

    if (docError) {
      console.error('Error fetching documents:', docError);
      return new Response(JSON.stringify({ error: docError.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Analyze document quality
    const qualityReport = {
      summary: {
        total_documents: documents?.length || 0,
        period_days: period,
        generated_from: startDate.toISOString(),
        generated_to: new Date().toISOString()
      },
      quality_metrics: {
        valid_documents: 0,
        invalid_documents: 0,
        expired_documents: 0,
        never_downloaded: 0,
        high_download_count: 0
      },
      issues: [],
      recommendations: [],
      template_analysis: {},
      download_patterns: {
        avg_downloads: 0,
        most_downloaded: null,
        least_downloaded: null
      }
    };

    if (documents && documents.length > 0) {
      let totalDownloads = 0;
      let maxDownloads = 0;
      let minDownloads = Infinity;
      let mostDownloaded = null;
      let leastDownloaded = null;

      documents.forEach(doc => {
        const downloads = doc.download_count || 0;
        totalDownloads += downloads;

        if (downloads > maxDownloads) {
          maxDownloads = downloads;
          mostDownloaded = doc;
        }
        if (downloads < minDownloads) {
          minDownloads = downloads;
          leastDownloaded = doc;
        }

        // Quality metrics
        if (doc.is_valid) {
          qualityReport.quality_metrics.valid_documents++;
        } else {
          qualityReport.quality_metrics.invalid_documents++;
          qualityReport.issues.push({
            type: 'invalid_document',
            document_number: doc.document_number,
            message: 'Document marked as invalid'
          });
        }

        if (doc.expires_at && new Date(doc.expires_at) < new Date()) {
          qualityReport.quality_metrics.expired_documents++;
          qualityReport.issues.push({
            type: 'expired_document',
            document_number: doc.document_number,
            expired_at: doc.expires_at
          });
        }

        if (downloads === 0) {
          qualityReport.quality_metrics.never_downloaded++;
        }

        if (downloads > 10) {
          qualityReport.quality_metrics.high_download_count++;
        }

        // Template analysis
        const templateType = doc.request?.template?.template_type || 'unknown';
        if (!qualityReport.template_analysis[templateType]) {
          qualityReport.template_analysis[templateType] = {
            count: 0,
            avg_downloads: 0,
            total_downloads: 0
          };
        }
        qualityReport.template_analysis[templateType].count++;
        qualityReport.template_analysis[templateType].total_downloads += downloads;
      });

      // Calculate averages
      qualityReport.download_patterns.avg_downloads = totalDownloads / documents.length;
      qualityReport.download_patterns.most_downloaded = mostDownloaded;
      qualityReport.download_patterns.least_downloaded = leastDownloaded;

      // Calculate template averages
      Object.keys(qualityReport.template_analysis).forEach(type => {
        const analysis = qualityReport.template_analysis[type];
        analysis.avg_downloads = analysis.total_downloads / analysis.count;
      });

      // Generate recommendations
      if (qualityReport.quality_metrics.never_downloaded > 0) {
        qualityReport.recommendations.push({
          type: 'download_issue',
          message: `${qualityReport.quality_metrics.never_downloaded} documents have never been downloaded. Consider investigating delivery methods.`
        });
      }

      if (qualityReport.quality_metrics.expired_documents > 0) {
        qualityReport.recommendations.push({
          type: 'expiration_management',
          message: `${qualityReport.quality_metrics.expired_documents} documents have expired. Review expiration policies.`
        });
      }

      if (qualityReport.quality_metrics.invalid_documents > 0) {
        qualityReport.recommendations.push({
          type: 'quality_control',
          message: `${qualityReport.quality_metrics.invalid_documents} documents are marked as invalid. Review generation process.`
        });
      }

      const validityRate = (qualityReport.quality_metrics.valid_documents / documents.length) * 100;
      if (validityRate < 95) {
        qualityReport.recommendations.push({
          type: 'quality_improvement',
          message: `Document validity rate is ${validityRate.toFixed(1)}%. Target should be above 95%.`
        });
      }
    }

    return new Response(JSON.stringify({ report: qualityReport }), {
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