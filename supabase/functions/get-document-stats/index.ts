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
    const period = url.searchParams.get('period') || '30'; // days
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(period));

    // Get total documents generated
    const { data: totalDocs, error: totalError } = await supabase
      .from('generated_documents')
      .select('id', { count: 'exact', head: true });

    // Get documents generated in period
    const { data: periodDocs, error: periodError } = await supabase
      .from('generated_documents')
      .select('id', { count: 'exact', head: true })
      .gte('generated_at', startDate.toISOString());

    // Get pending requests
    const { data: pendingRequests, error: pendingError } = await supabase
      .from('document_requests')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'pending');

    // Get approved requests
    const { data: approvedRequests, error: approvedError } = await supabase
      .from('document_requests')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'approved');

    // Get active templates
    const { data: activeTemplates, error: templatesError } = await supabase
      .from('document_templates')
      .select('id', { count: 'exact', head: true })
      .eq('is_active', true);

    // Get documents by template type
    const { data: docsByType, error: typeError } = await supabase
      .from('generated_documents')
      .select(`
        id,
        request:document_requests!inner(
          template:document_templates!inner(template_type)
        )
      `);

    // Get most downloaded documents
    const { data: topDownloads, error: downloadsError } = await supabase
      .from('generated_documents')
      .select(`
        document_number,
        download_count,
        request:document_requests!inner(
          template:document_templates!inner(name)
        )
      `)
      .order('download_count', { ascending: false })
      .limit(10);

    // Get recent activity
    const { data: recentActivity, error: activityError } = await supabase
      .from('generated_documents')
      .select(`
        id,
        document_number,
        generated_at,
        request:document_requests!inner(
          template:document_templates!inner(name),
          student:students!inner(
            student_number,
            profiles!inner(full_name)
          )
        )
      `)
      .order('generated_at', { ascending: false })
      .limit(10);

    if (totalError || periodError || pendingError || approvedError || templatesError) {
      console.error('Error fetching stats:', { totalError, periodError, pendingError, approvedError, templatesError });
      return new Response(JSON.stringify({ error: 'Failed to fetch statistics' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Process documents by type
    const typeStats = {};
    if (docsByType) {
      docsByType.forEach(doc => {
        const type = doc.request?.template?.template_type || 'unknown';
        typeStats[type] = (typeStats[type] || 0) + 1;
      });
    }

    const stats = {
      overview: {
        total_documents: totalDocs || 0,
        documents_this_period: periodDocs || 0,
        pending_requests: pendingRequests || 0,
        approved_requests: approvedRequests || 0,
        active_templates: activeTemplates || 0
      },
      by_type: typeStats,
      top_downloads: topDownloads || [],
      recent_activity: recentActivity || [],
      period_days: parseInt(period)
    };

    return new Response(JSON.stringify({ stats }), {
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