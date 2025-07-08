import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

type PerformanceEvaluation = {
  id: string;
  teacher_profile_id: string;
  evaluator_id: string;
  evaluation_period_start: string;
  evaluation_period_end: string;
  overall_score?: number | null;
  criteria_scores: any;
  strengths?: string | null;
  areas_for_improvement?: string | null;
  goals_next_period?: string | null;
  status: string;
  submitted_at?: string | null;
  approved_at?: string | null;
  approved_by?: string | null;
  created_at: string;
  updated_at: string;
  // Relations
  teacher_profile?: {
    employee_number: string;
    profile: {
      full_name?: string | null;
      email: string;
    } | null;
  };
  evaluator?: {
    full_name?: string | null;
    email: string;
  };
  approver?: {
    full_name?: string | null;
    email: string;
  };
}

export function usePerformanceEvaluations(teacherProfileId?: string) {
  const [evaluations, setEvaluations] = useState<PerformanceEvaluation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchEvaluations();
  }, [teacherProfileId]);

  const fetchEvaluations = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('performance_evaluations')
        .select(`
          *,
          teacher_profile:teacher_profiles(
            employee_number,
            profile:profiles(full_name, email)
          ),
          evaluator:profiles!performance_evaluations_evaluator_id_fkey(full_name, email),
          approver:profiles!performance_evaluations_approved_by_fkey(full_name, email)
        `)
        .order('evaluation_period_start', { ascending: false });

      if (teacherProfileId) {
        query = query.eq('teacher_profile_id', teacherProfileId);
      }

      const { data, error } = await query;

      if (error) throw error;
      setEvaluations(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des évaluations');
      toast({
        title: "Erreur",
        description: "Impossible de charger les évaluations",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createEvaluation = async (evaluationData: any) => {
    try {
      const { data, error } = await supabase
        .from('performance_evaluations')
        .insert([evaluationData])
        .select(`
          *,
          teacher_profile:teacher_profiles(
            employee_number,
            profile:profiles(full_name, email)
          ),
          evaluator:profiles!performance_evaluations_evaluator_id_fkey(full_name, email)
        `)
        .single();

      if (error) throw error;

      setEvaluations(prev => [data, ...prev]);
      toast({
        title: "Succès",
        description: "Évaluation créée avec succès",
      });
      
      return data;
    } catch (err) {
      toast({
        title: "Erreur",
        description: "Impossible de créer l'évaluation",
        variant: "destructive",
      });
      throw err;
    }
  };

  const updateEvaluation = async (id: string, updates: any) => {
    try {
      const { data, error } = await supabase
        .from('performance_evaluations')
        .update(updates)
        .eq('id', id)
        .select(`
          *,
          teacher_profile:teacher_profiles(
            employee_number,
            profile:profiles(full_name, email)
          ),
          evaluator:profiles!performance_evaluations_evaluator_id_fkey(full_name, email),
          approver:profiles!performance_evaluations_approved_by_fkey(full_name, email)
        `)
        .single();

      if (error) throw error;

      setEvaluations(prev => prev.map(evaluation => 
        evaluation.id === id ? { ...evaluation, ...data } : evaluation
      ));
      
      toast({
        title: "Succès",
        description: "Évaluation mise à jour avec succès",
      });
      
      return data;
    } catch (err) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour l'évaluation",
        variant: "destructive",
      });
      throw err;
    }
  };

  const submitEvaluation = async (id: string) => {
    return updateEvaluation(id, {
      status: 'completed',
      submitted_at: new Date().toISOString()
    });
  };

  const approveEvaluation = async (id: string) => {
    return updateEvaluation(id, {
      status: 'approved',
      approved_at: new Date().toISOString()
    });
  };

  const deleteEvaluation = async (id: string) => {
    try {
      const { error } = await supabase
        .from('performance_evaluations')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setEvaluations(prev => prev.filter(evaluation => evaluation.id !== id));
      toast({
        title: "Succès",
        description: "Évaluation supprimée avec succès",
      });
    } catch (err) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'évaluation",
        variant: "destructive",
      });
      throw err;
    }
  };

  return {
    evaluations,
    loading,
    error,
    fetchEvaluations,
    createEvaluation,
    updateEvaluation,
    submitEvaluation,
    approveEvaluation,
    deleteEvaluation,
  };
}