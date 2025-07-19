
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface DUT2GESession {
  id: string;
  code: string;
  name: string;
  program_id: string;
  academic_year_id: string;
  session_type: string;
  period_start: string;
  period_end: string;
  status: string;
}

export interface DUT2GEExamConfig {
  semester: number;
  subjects: {
    name: string;
    code: string;
    type: 'written' | 'oral';
    duration: number;
    date?: string;
  }[];
}

const DUT2GE_SUBJECTS: DUT2GEExamConfig[] = [
  {
    semester: 3,
    subjects: [
      { name: 'Droit des affaires', code: 'DROIT', type: 'written', duration: 180 },
      { name: 'Projet entrepreneurial', code: 'PEI', type: 'written', duration: 180 },
      { name: 'Marketing Mix', code: 'MIX', type: 'written', duration: 180 },
      { name: 'Mathématiques appliquées', code: 'CALC', type: 'written', duration: 120 },
      { name: 'Techniques quantitatives', code: 'TQ', type: 'written', duration: 120 },
      { name: 'Informatique', code: 'INFO', type: 'written', duration: 120 },
      { name: 'Communication', code: 'COMM', type: 'written', duration: 120 },
      { name: 'Anglais', code: 'ANG', type: 'written', duration: 90 },
      { name: 'PPP3', code: 'PPP3', type: 'oral', duration: 30 }
    ]
  },
  {
    semester: 4,
    subjects: [
      { name: 'Finance d\'entreprise', code: 'FIN', type: 'written', duration: 180 },
      { name: 'Gestion de production', code: 'PROD', type: 'written', duration: 180 },
      { name: 'Stratégie d\'entreprise', code: 'STRAT', type: 'written', duration: 180 },
      { name: 'Négociation commerciale', code: 'NEGO', type: 'written', duration: 120 },
      { name: 'Technologies info comm', code: 'TCI', type: 'written', duration: 120 },
      { name: 'Anglais 2', code: 'ANG2', type: 'written', duration: 90 },
      { name: 'PPP4', code: 'PPP4', type: 'oral', duration: 30 },
      { name: 'Projet tutoré', code: 'PROJ', type: 'oral', duration: 45 },
      { name: 'Stage professionnel', code: 'STAGE', type: 'oral', duration: 45 }
    ]
  }
];

export function useDUT2GESessionManager() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const createDUT2GESession = useCallback(async (
    academicYearId: string,
    programId: string
  ) => {
    try {
      setLoading(true);
      setError(null);

      // Créer la session principale
      const { data: session, error: sessionError } = await supabase
        .from('exam_session_groups')
        .insert({
          code: 'S1-2324-DUTGE',
          name: 'Session 1 - 2023/2024 - DUT Gestion des Entreprises',
          program_id: programId,
          academic_year_id: academicYearId,
          session_type: 'normale',
          period_start: '2024-01-15',
          period_end: '2024-06-30',
          status: 'planning'
        })
        .select()
        .single();

      if (sessionError) throw sessionError;

      // Créer les examens pour chaque semestre
      const examPromises = DUT2GE_SUBJECTS.flatMap(semesterConfig =>
        semesterConfig.subjects.map(async (subject) => {
          const { error: examError } = await supabase
            .from('exams')
            .insert({
              title: `${subject.name} - Semestre ${semesterConfig.semester}`,
              exam_type: subject.type,
              duration_minutes: subject.duration,
              min_supervisors: subject.type === 'oral' ? 3 : 2,
              max_students: 13,
              session_group_id: session.id,
              academic_year_id: academicYearId,
              program_id: programId,
              status: 'draft'
            });

          if (examError) throw examError;
        })
      );

      await Promise.all(examPromises);

      toast({
        title: 'Session créée avec succès',
        description: `Session DUT2-GE S1-2324 créée avec 18 examens configurés`
      });

      return session;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la création';
      setError(errorMessage);
      toast({
        title: 'Erreur',
        description: errorMessage,
        variant: 'destructive'
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const getDUT2GESessions = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('exam_session_groups')
        .select(`
          *,
          exams(count)
        `)
        .like('code', '%DUTGE%')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de chargement');
      return [];
    }
  }, []);

  return {
    loading,
    error,
    createDUT2GESession,
    getDUT2GESessions,
    DUT2GE_SUBJECTS
  };
}
