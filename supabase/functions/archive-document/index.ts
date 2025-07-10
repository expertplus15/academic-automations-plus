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
    const { document_id, archive_reason } = body;

    if (!document_id) {
      return new Response(JSON.stringify({ error: 'Document ID required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get document details
    const { data: document, error: docError } = await supabase
      .from('generated_documents')
      .select(`
        *,
        request:document_requests(
          *,
          template:document_templates(name),
          student:students(
            student_number,
            profiles(full_name)
          )
        )
      `)
      .eq('id', document_id)
      .single();

    if (docError || !document) {
      return new Response(JSON.stringify({ error: 'Document not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Mark document as invalid (archived)
    const { data: updatedDoc, error: updateError } = await supabase
      .from('generated_documents')
      .update({ 
        is_valid: false,
        expires_at: new Date().toISOString() // Mark as expired
      })
      .eq('id', document_id)
      .select()
      .single();

    if (updateError) {
      console.error('Error archiving document:', updateError);
      return new Response(JSON.stringify({ error: updateError.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Log the archiving action (you could create an audit table for this)
    console.log(`Document ${document.document_number} archived by user ${user.id}. Reason: ${archive_reason || 'Not specified'}`);

    return new Response(JSON.stringify({ 
      message: 'Document archived successfully',
      document: updatedDoc,
      archived_at: new Date().toISOString(),
      archived_by: user.id,
      reason: archive_reason
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