
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ExamGradeSync {
  examId: string;
  sessionId: string;
  examTitle: string;
  examDate: string;
  studentCount: number;
  gradesCreated: boolean;
  subjectId: string;
  semester: number;
  academicYearId: string;
}

export function useExamGradeSync() {
  const [syncing, setSyncing] = useState(false);
  const [examSessions, setExamSessions] = useState<ExamGradeSync[]>([]);
  const { toast } = useToast();

  // Charger les sessions d'examens prêtes pour la saisie de notes
  const loadExamSessions = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('exam_sessions')
        .select(`
          id,
          start_time,
          end_time,
          actual_students_count,
          exams!inner(
            id,
            title,
            subject_id,
            academic_year_id,
            exam_type
          ),
          exam_registrations(count)
        `)
        .eq('status', 'completed')
        .order('start_time', { ascending: false });

      if (error) throw error;

      const syncData: ExamGradeSync[] = await Promise.all(
        (data || []).map(async (session) => {
          // Vérifier si des notes existent déjà pour cet examen
          const { data: existingGrades } = await supabase
            .from('student_grades')
            .select('id')
            .eq('subject_id', session.exams.subject_id)
            .eq('academic_year_id', session.exams.academic_year_id)
            .limit(1);

          return {
            examId: session.exams.id,
            sessionId: session.id,
            examTitle: session.exams.title,
            examDate: new Date(session.start_time).toLocaleDateString('fr-FR'),
            studentCount: session.actual_students_count || 0,
            gradesCreated: (existingGrades?.length || 0) > 0,
            subjectId: session.exams.subject_id,
            semester: session.start_time.includes('2024-01') || session.start_time.includes('2024-02') ? 1 : 2,
            academicYearId: session.exams.academic_year_id
          };
        })
      );

      setExamSessions(syncData);
    } catch (error) {
      console.error('Error loading exam sessions:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les sessions d'examens",
        variant: "destructive",
      });
    }
  }, [toast]);

  // Créer automatiquement les grilles de notes pour un examen
  const createGradeMatrix = useCallback(async (examSync: ExamGradeSync) => {
    setSyncing(true);
    try {
      // Récupérer les étudiants inscrits à cet examen
      const { data: registrations, error: regError } = await supabase
        .from('exam_registrations')
        .select(`
          student_id,
          students!inner(
            id,
            student_number,
            profiles!inner(full_name)
          )
        `)
        .eq('session_id', examSync.sessionId)
        .eq('status', 'registered');

      if (regError) throw regError;

      if (!registrations || registrations.length === 0) {
        toast({
          title: "Aucun étudiant",
          description: "Aucun étudiant inscrit trouvé pour cet examen",
          variant: "destructive",
        });
        return false;
      }

      // Récupérer les types d'évaluation pour "Examen Final"
      const { data: evalTypes, error: evalError } = await supabase
        .from('evaluation_types')
        .select('id, code')
        .eq('code', 'EF')
        .eq('is_active', true)
        .single();

      if (evalError || !evalTypes) {
        toast({
          title: "Type d'évaluation manquant",
          description: "Le type 'Examen Final' n'existe pas dans le système",
          variant: "destructive",
        });
        return false;
      }

      // Créer les entrées de notes vides pour chaque étudiant
      const gradeEntries = registrations.map(reg => ({
        student_id: reg.student_id,
        subject_id: examSync.subjectId,
        evaluation_type_id: evalTypes.id,
        grade: 0, // Note par défaut à 0, à modifier par l'enseignant
        max_grade: 20,
        semester: examSync.semester,
        academic_year_id: examSync.academicYearId,
        evaluation_date: new Date().toISOString().split('T')[0],
        is_published: false
      }));

      const { error: insertError } = await supabase
        .from('student_grades')
        .insert(gradeEntries);

      if (insertError) throw insertError;

      toast({
        title: "Grille créée",
        description: `Grille de notes créée pour ${registrations.length} étudiants`,
      });

      // Recharger les sessions pour mettre à jour le statut
      await loadExamSessions();
      return true;

    } catch (error) {
      console.error('Error creating grade matrix:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer la grille de notes",
        variant: "destructive",
      });
      return false;
    } finally {
      setSyncing(false);
    }
  }, [toast, loadExamSessions]);

  // Synchroniser plusieurs examens en lot
  const syncBatch = useCallback(async (examSyncs: ExamGradeSync[]) => {
    setSyncing(true);
    let successCount = 0;

    for (const examSync of examSyncs) {
      const success = await createGradeMatrix(examSync);
      if (success) successCount++;
    }

    toast({
      title: "Synchronisation terminée",
      description: `${successCount}/${examSyncs.length} grilles créées avec succès`,
    });

    setSyncing(false);
  }, [createGradeMatrix, toast]);

  return {
    examSessions,
    syncing,
    loadExamSessions,
    createGradeMatrix,
    syncBatch
  };
}
