import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface ValidationResult {
  field: string;
  value: any;
  is_valid: boolean;
  error_message?: string;
  warning_message?: string;
}

export interface QualityReport {
  document_count: number;
  validation_rate: number;
  common_errors: Array<{
    error_type: string;
    count: number;
    percentage: number;
  }>;
  template_quality: Array<{
    template_id: string;
    template_name: string;
    success_rate: number;
    error_count: number;
  }>;
  generated_at: string;
}

export function useDocumentValidation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateDocumentData = async (templateId: string, studentId: string, data: any) => {
    try {
      setLoading(true);
      setError(null);

      const { data: result, error } = await supabase.functions.invoke('validate-document-data', {
        body: {
          template_id: templateId,
          student_id: studentId,
          data
        }
      });

      if (error) throw error;
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la validation';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getQualityReport = async (filters?: {
    date_from?: string;
    date_to?: string;
    template_id?: string;
  }) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase.functions.invoke('quality-control-report', {
        body: { filters }
      });

      if (error) throw error;
      return data as QualityReport;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la génération du rapport';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const validateBulkData = async (templateId: string, studentsData: Array<{
    student_id: string;
    data: any;
  }>) => {
    try {
      setLoading(true);
      setError(null);

      const validationPromises = studentsData.map(item =>
        validateDocumentData(templateId, item.student_id, item.data)
      );

      const results = await Promise.allSettled(validationPromises);
      
      return results.map((result, index) => ({
        student_id: studentsData[index].student_id,
        success: result.status === 'fulfilled',
        data: result.status === 'fulfilled' ? result.value : null,
        error: result.status === 'rejected' ? result.reason.message : null
      }));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la validation en lot';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    validateDocumentData,
    getQualityReport,
    validateBulkData
  };
}