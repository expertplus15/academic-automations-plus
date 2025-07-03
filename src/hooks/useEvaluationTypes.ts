import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface EvaluationType {
  id: string;
  name: string;
  code: string;
  description?: string;
  weight_percentage: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface EvaluationTypeInput {
  name: string;
  code: string;
  description?: string;
  weight_percentage: number;
  is_active?: boolean;
}

export function useEvaluationTypes() {
  const [evaluationTypes, setEvaluationTypes] = useState<EvaluationType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch all evaluation types
  const fetchEvaluationTypes = useCallback(async (includeInactive = false) => {
    setLoading(true);
    setError(null);

    try {
      let query = supabase
        .from('evaluation_types')
        .select('*')
        .order('name');

      if (!includeInactive) {
        query = query.eq('is_active', true);
      }

      const { data, error } = await query;

      if (error) throw error;
      setEvaluationTypes(data || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors de la récupération des types d\'évaluation';
      setError(message);
      toast({
        title: "Erreur",
        description: message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Create evaluation type
  const createEvaluationType = useCallback(async (data: EvaluationTypeInput): Promise<EvaluationType | null> => {
    setLoading(true);
    setError(null);

    try {
      const { data: newEvaluationType, error } = await supabase
        .from('evaluation_types')
        .insert({
          ...data,
          is_active: data.is_active ?? true
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Type d'évaluation créé avec succès",
      });

      // Refresh the list
      await fetchEvaluationTypes();
      return newEvaluationType;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors de la création';
      setError(message);
      toast({
        title: "Erreur",
        description: message,
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [fetchEvaluationTypes, toast]);

  // Update evaluation type
  const updateEvaluationType = useCallback(async (id: string, data: Partial<EvaluationTypeInput>): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase
        .from('evaluation_types')
        .update(data)
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Type d'évaluation mis à jour",
      });

      // Refresh the list
      await fetchEvaluationTypes();
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors de la mise à jour';
      setError(message);
      toast({
        title: "Erreur",
        description: message,
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchEvaluationTypes, toast]);

  // Toggle active status
  const toggleEvaluationType = useCallback(async (id: string, isActive: boolean): Promise<boolean> => {
    return updateEvaluationType(id, { is_active: isActive });
  }, [updateEvaluationType]);

  // Delete evaluation type
  const deleteEvaluationType = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase
        .from('evaluation_types')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Type d'évaluation supprimé",
      });

      // Refresh the list
      await fetchEvaluationTypes();
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors de la suppression';
      setError(message);
      toast({
        title: "Erreur",
        description: message,
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchEvaluationTypes, toast]);

  // Get evaluation type by ID
  const getEvaluationTypeById = useCallback((id: string): EvaluationType | undefined => {
    return evaluationTypes.find(type => type.id === id);
  }, [evaluationTypes]);

  // Get active evaluation types only
  const getActiveEvaluationTypes = useCallback((): EvaluationType[] => {
    return evaluationTypes.filter(type => type.is_active);
  }, [evaluationTypes]);

  // Initial fetch
  useEffect(() => {
    fetchEvaluationTypes();
  }, [fetchEvaluationTypes]);

  return {
    evaluationTypes,
    loading,
    error,
    fetchEvaluationTypes,
    createEvaluationType,
    updateEvaluationType,
    toggleEvaluationType,
    deleteEvaluationType,
    getEvaluationTypeById,
    getActiveEvaluationTypes
  };
}