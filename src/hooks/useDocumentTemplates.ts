
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface DocumentTemplate {
  id: string;
  name: string;
  code: string;
  description?: string;
  template_type: 'certificate' | 'transcript' | 'attestation';
  template_content: {
    title: string;
    fields: string[];
    template: string;
  };
  is_active: boolean;
  requires_approval: boolean;
  created_at: string;
  updated_at: string;
}

export interface DocumentRequest {
  id: string;
  student_id: string;
  template_id: string;
  status: 'pending' | 'approved' | 'generated' | 'delivered' | 'rejected';
  request_data?: any;
  requested_by?: string;
  approved_by?: string;
  approved_at?: string;
  rejection_reason?: string;
  created_at: string;
  updated_at: string;
  template?: DocumentTemplate;
  student?: {
    student_number: string;
    profiles: { full_name: string };
  };
}

export function useDocumentTemplates() {
  const [templates, setTemplates] = useState<DocumentTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('document_templates')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) {
        setError(error.message);
      } else {
        setTemplates(data || []);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  return { templates, loading, error, refetch: fetchTemplates };
}

export function useDocumentRequests() {
  const [requests, setRequests] = useState<DocumentRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('document_requests')
        .select(`
          *,
          template:document_templates(*),
          student:students(
            student_number,
            profiles(full_name)
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        setError(error.message);
      } else {
        setRequests(data || []);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const createRequest = async (templateId: string, studentId: string, requestData?: any) => {
    const user = await supabase.auth.getUser();
    
    const { data, error } = await supabase
      .from('document_requests')
      .insert({
        template_id: templateId,
        student_id: studentId,
        request_data: requestData,
        requested_by: user.data.user?.id
      })
      .select()
      .single();

    if (!error) {
      fetchRequests(); // Refresh data
    }
    return { data, error };
  };

  const updateRequestStatus = async (requestId: string, status: string, rejectionReason?: string) => {
    const user = await supabase.auth.getUser();
    
    const updateData: any = { status };
    if (status === 'approved') {
      updateData.approved_by = user.data.user?.id;
      updateData.approved_at = new Date().toISOString();
    }
    if (rejectionReason) {
      updateData.rejection_reason = rejectionReason;
    }

    const { error } = await supabase
      .from('document_requests')
      .update(updateData)
      .eq('id', requestId);

    if (!error) {
      fetchRequests(); // Refresh data
    }
    return { error };
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return {
    requests,
    loading,
    error,
    refetch: fetchRequests,
    createRequest,
    updateRequestStatus
  };
}
