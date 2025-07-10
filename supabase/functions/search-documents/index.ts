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
    const searchQuery = url.searchParams.get('q');
    const templateType = url.searchParams.get('template_type');
    const status = url.searchParams.get('status');
    const studentId = url.searchParams.get('student_id');
    const dateFrom = url.searchParams.get('date_from');
    const dateTo = url.searchParams.get('date_to');
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    let query = supabase
      .from('generated_documents')
      .select(`
        *,
        request:document_requests!inner(
          *,
          template:document_templates(name, template_type),
          student:students(
            student_number,
            profiles(full_name)
          )
        )
      `)
      .order('generated_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // Apply filters
    if (searchQuery) {
      query = query.or(
        `document_number.ilike.%${searchQuery}%,request.student.profiles.full_name.ilike.%${searchQuery}%`
      );
    }

    if (templateType) {
      query = query.eq('request.template.template_type', templateType);
    }

    if (status) {
      query = query.eq('request.status', status);
    }

    if (studentId) {
      query = query.eq('request.student_id', studentId);
    }

    if (dateFrom) {
      query = query.gte('generated_at', dateFrom);
    }

    if (dateTo) {
      query = query.lte('generated_at', dateTo);
    }

    const { data: documents, error, count } = await query;

    if (error) {
      console.error('Error searching documents:', error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get total count for pagination
    let countQuery = supabase
      .from('generated_documents')
      .select('*', { count: 'exact', head: true });

    if (searchQuery) {
      countQuery = countQuery.or(
        `document_number.ilike.%${searchQuery}%`
      );
    }

    const { count: totalCount } = await countQuery;

    return new Response(JSON.stringify({ 
      documents,
      pagination: {
        page,
        limit,
        total: totalCount || 0,
        pages: Math.ceil((totalCount || 0) / limit)
      }
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