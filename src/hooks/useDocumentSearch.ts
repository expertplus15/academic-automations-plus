import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface SearchFilters {
  document_type?: string;
  student_id?: string;
  date_from?: string;
  date_to?: string;
  status?: string;
  template_id?: string;
}

export interface DocumentSearchResult {
  id: string;
  document_number: string;
  template_name: string;
  student_name: string;
  student_number: string;
  status: string;
  file_path: string;
  generated_at: string;
  download_count: number;
  file_size?: number;
}

export function useDocumentSearch() {
  const [results, setResults] = useState<DocumentSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  const searchDocuments = async (
    query: string = '',
    filters: SearchFilters = {},
    page: number = 1,
    limit: number = 20
  ) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase.functions.invoke('search-documents', {
        body: {
          query,
          filters,
          page,
          limit
        }
      });

      if (error) throw error;

      setResults(data.results || []);
      setTotalCount(data.total_count || 0);
      
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la recherche';
      setError(errorMessage);
      setResults([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  const getRecentDocuments = async (limit: number = 10) => {
    return searchDocuments('', {}, 1, limit);
  };

  const getDocumentsByStudent = async (studentId: string) => {
    return searchDocuments('', { student_id: studentId });
  };

  const getDocumentsByTemplate = async (templateId: string) => {
    return searchDocuments('', { template_id: templateId });
  };

  const clearResults = () => {
    setResults([]);
    setTotalCount(0);
    setError(null);
  };

  return {
    results,
    loading,
    error,
    totalCount,
    searchDocuments,
    getRecentDocuments,
    getDocumentsByStudent,
    getDocumentsByTemplate,
    clearResults
  };
}