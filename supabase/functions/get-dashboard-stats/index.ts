import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

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

    // Vérifier l'authentification
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Unauthorized');
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    // Statistiques des documents stockés
    const { count: documentsStored } = await supabase
      .from('generated_documents')
      .select('*', { count: 'exact', head: true })
      .neq('file_path', null);

    // Templates actifs
    const { count: activeTemplates } = await supabase
      .from('document_templates')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true);

    // Documents générés ce mois
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const { count: documentsThisMonth } = await supabase
      .from('generated_documents')
      .select('*', { count: 'exact', head: true })
      .gte('generated_at', startOfMonth.toISOString());

    // Signatures en attente
    const { count: pendingSignatures } = await supabase
      .from('document_signatures')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');

    // Notifications non lues
    const { count: unreadNotifications } = await supabase
      .from('system_notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('is_read', false);

    // Templates les plus utilisés (derniers 30 jours)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data: topTemplates } = await supabase
      .from('document_requests')
      .select(`
        template_id,
        document_templates(name),
        count:id.count()
      `)
      .gte('created_at', thirtyDaysAgo.toISOString())
      .order('count', { ascending: false })
      .limit(5);

    // Évolution mensuelle des documents
    const { data: monthlyTrend } = await supabase
      .from('generated_documents')
      .select('generated_at')
      .gte('generated_at', new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString())
      .order('generated_at', { ascending: true });

    // Grouper par mois
    const monthlyStats = monthlyTrend?.reduce((acc: any, doc: any) => {
      const month = new Date(doc.generated_at).toISOString().slice(0, 7); // YYYY-MM
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {});

    // Disponibilité du système (simulée)
    const availability = 99.5; // Pourrait être calculée selon des métriques réelles

    // Taille moyenne des documents
    const { data: sizeStats } = await supabase
      .from('generated_documents')
      .select('file_size')
      .not('file_size', 'is', null);

    const averageSize = sizeStats?.length 
      ? Math.round(sizeStats.reduce((sum, doc) => sum + (doc.file_size || 0), 0) / sizeStats.length / 1024) // KB
      : 0;

    const stats = {
      documentsStored: documentsStored || 0,
      activeTemplates: activeTemplates || 0,
      documentsThisMonth: documentsThisMonth || 0,
      pendingSignatures: pendingSignatures || 0,
      unreadNotifications: unreadNotifications || 0,
      availability,
      averageDocumentSize: averageSize,
      topTemplates: topTemplates || [],
      monthlyTrend: monthlyStats || {},
      lastUpdated: new Date().toISOString()
    };

    return new Response(
      JSON.stringify({
        success: true,
        data: stats
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error in get-dashboard-stats function:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});