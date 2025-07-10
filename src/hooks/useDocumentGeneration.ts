import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface GenerationJob {
  id: string;
  template_id: string;
  student_ids: string[];
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress_percentage: number;
  generated_count: number;
  total_count: number;
  error_message?: string;
  created_at: string;
}

export interface GeneratedDocument {
  id: string;
  document_number: string;
  file_path: string;
  download_url?: string;
  generated_at: string;
  expires_at?: string;
  is_valid: boolean;
}

export function useDocumentGeneration() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const generateDocument = async (templateId: string, studentId: string, additionalData?: any) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase.functions.invoke('generate-document', {
        body: {
          template_id: templateId,
          student_id: studentId,
          additional_data: additionalData
        }
      });

      if (error) throw error;
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la génération';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const previewDocument = async (templateId: string, studentId: string, additionalData?: any) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase.functions.invoke('preview-document', {
        body: {
          template_id: templateId,
          student_id: studentId,
          additional_data: additionalData
        }
      });

      if (error) throw error;
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la prévisualisation';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const batchGenerate = async (templateId: string, studentIds: string[], additionalData?: any) => {
    try {
      setLoading(true);
      setError(null);
      setProgress(0);

      const { data, error } = await supabase.functions.invoke('batch-generate-documents', {
        body: {
          template_id: templateId,
          student_ids: studentIds,
          additional_data: additionalData
        }
      });

      if (error) throw error;

      // Poll for progress updates using the returned data
      if (data.job_id) {
        const pollProgress = setInterval(async () => {
          try {
            // Poll the edge function for status instead of direct DB access
            const { data: statusData, error: statusError } = await supabase.functions.invoke('get-generation-status', {
              body: { job_id: data.job_id }
            });

            if (statusData) {
              setProgress(statusData.progress_percentage || 0);
              
              if (statusData.status === 'completed' || statusData.status === 'failed') {
                clearInterval(pollProgress);
                setLoading(false);
                
                if (statusData.status === 'failed') {
                  setError(statusData.error_message || 'Erreur lors de la génération en lot');
                }
              }
            }
          } catch (pollError) {
            clearInterval(pollProgress);
            console.error('Erreur lors du suivi de progression:', pollError);
          }
        }, 2000);
      }

      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la génération en lot';
      setError(errorMessage);
      throw err;
    }
  };

  return {
    loading,
    error,
    progress,
    generateDocument,
    previewDocument,
    batchGenerate
  };
}