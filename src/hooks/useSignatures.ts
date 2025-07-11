import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface DocumentSignature {
  id: string;
  document_id: string;
  signer_id: string;
  workflow_id?: string;
  signature_order: number;
  status: 'pending' | 'signed' | 'rejected';
  signed_at?: string;
  signature_data?: string;
  comments?: string;
  created_at: string;
  updated_at: string;
  generated_documents?: {
    id: string;
    document_number: string;
    file_path?: string;
  };
}

export interface SignatureWorkflow {
  id: string;
  name: string;
  description?: string;
  steps: any[];
  is_active: boolean;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export function useSignatures() {
  const [pendingSignatures, setPendingSignatures] = useState<DocumentSignature[]>([]);
  const [workflows, setWorkflows] = useState<SignatureWorkflow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPendingSignatures = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke('manage-document-signatures', {
        body: { action: 'get_pending_signatures' }
      });

      if (error) {
        throw error;
      }

      if (data?.success) {
        setPendingSignatures(data.data || []);
      } else {
        throw new Error(data?.error || 'Erreur lors du chargement des signatures');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const fetchWorkflows = async () => {
    try {
      const { data, error } = await supabase
        .from('signature_workflows')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) {
        throw error;
      }

      // Transform data to match interface
      const transformedWorkflows = (data || []).map((workflow: any) => ({
        ...workflow,
        steps: Array.isArray(workflow.steps) ? workflow.steps : []
      }));
      setWorkflows(transformedWorkflows);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des workflows');
    }
  };

  const requestSignature = async (documentId: string, signers: string[], workflowId?: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke('manage-document-signatures', {
        body: {
          action: 'request_signature',
          documentId,
          signers,
          workflowId
        }
      });

      if (error) {
        throw error;
      }

      if (data?.success) {
        await fetchPendingSignatures(); // Rafraîchir la liste
        return data.data;
      } else {
        throw new Error(data?.error || 'Erreur lors de la demande de signature');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signDocument = async (documentId: string, signatureData: string, comments?: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke('manage-document-signatures', {
        body: {
          action: 'sign_document',
          documentId,
          signatureData,
          comments
        }
      });

      if (error) {
        throw error;
      }

      if (data?.success) {
        await fetchPendingSignatures(); // Rafraîchir la liste
        return data.data;
      } else {
        throw new Error(data?.error || 'Erreur lors de la signature');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const rejectSignature = async (documentId: string, comments: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke('manage-document-signatures', {
        body: {
          action: 'reject_signature',
          documentId,
          comments
        }
      });

      if (error) {
        throw error;
      }

      if (data?.success) {
        await fetchPendingSignatures(); // Rafraîchir la liste
        return data.data;
      } else {
        throw new Error(data?.error || 'Erreur lors du rejet');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingSignatures();
    fetchWorkflows();
  }, []);

  return {
    pendingSignatures,
    workflows,
    loading,
    error,
    requestSignature,
    signDocument,
    rejectSignature,
    refreshPendingSignatures: fetchPendingSignatures
  };
}