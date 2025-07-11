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

    const { action, documentId, signatureData, comments, workflowId, signers } = await req.json();

    let response;

    switch (action) {
      case 'request_signature':
        // Créer une demande de signature
        if (!documentId || !signers || !Array.isArray(signers)) {
          throw new Error('Document ID et signataires requis');
        }

        const signatureRequests = await Promise.all(
          signers.map((signerId: string, index: number) =>
            supabase.from('document_signatures').insert({
              document_id: documentId,
              signer_id: signerId,
              workflow_id: workflowId,
              signature_order: index + 1,
              status: 'pending'
            })
          )
        );

        // Créer des notifications pour les signataires
        await Promise.all(
          signers.map((signerId: string) =>
            supabase.from('system_notifications').insert({
              user_id: signerId,
              title: 'Demande de signature',
              message: `Un document nécessite votre signature`,
              type: 'info',
              metadata: { document_id: documentId }
            })
          )
        );

        response = { success: true, data: signatureRequests };
        break;

      case 'sign_document':
        // Signer un document
        if (!documentId || !signatureData) {
          throw new Error('Document ID et données de signature requis');
        }

        const { data: signature, error: signError } = await supabase
          .from('document_signatures')
          .update({
            status: 'signed',
            signed_at: new Date().toISOString(),
            signature_data: signatureData,
            comments: comments,
            ip_address: req.headers.get('cf-connecting-ip') || req.headers.get('x-forwarded-for')
          })
          .eq('document_id', documentId)
          .eq('signer_id', user.id)
          .eq('status', 'pending')
          .select()
          .single();

        if (signError) {
          throw signError;
        }

        // Log audit
        await supabase.from('audit_logs').insert({
          user_id: user.id,
          action: 'SIGN_DOCUMENT',
          table_name: 'document_signatures',
          record_id: signature.id,
          new_values: signature,
          ip_address: req.headers.get('cf-connecting-ip') || req.headers.get('x-forwarded-for'),
          user_agent: req.headers.get('user-agent')
        });

        response = { success: true, data: signature };
        break;

      case 'reject_signature':
        // Rejeter une signature
        if (!documentId || !comments) {
          throw new Error('Document ID et commentaires requis pour un rejet');
        }

        const { data: rejectedSignature, error: rejectError } = await supabase
          .from('document_signatures')
          .update({
            status: 'rejected',
            comments: comments,
            ip_address: req.headers.get('cf-connecting-ip') || req.headers.get('x-forwarded-for')
          })
          .eq('document_id', documentId)
          .eq('signer_id', user.id)
          .eq('status', 'pending')
          .select()
          .single();

        if (rejectError) {
          throw rejectError;
        }

        response = { success: true, data: rejectedSignature };
        break;

      case 'get_pending_signatures':
        // Récupérer les signatures en attente pour l'utilisateur
        const { data: pendingSignatures, error: pendingError } = await supabase
          .from('document_signatures')
          .select(`
            *,
            generated_documents!document_signatures_document_id_fkey(
              id,
              document_number,
              file_path
            )
          `)
          .eq('signer_id', user.id)
          .eq('status', 'pending')
          .order('created_at', { ascending: true });

        if (pendingError) {
          throw pendingError;
        }

        response = { success: true, data: pendingSignatures };
        break;

      default:
        throw new Error('Action non reconnue');
    }

    return new Response(
      JSON.stringify(response),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error in manage-document-signatures function:', error);
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