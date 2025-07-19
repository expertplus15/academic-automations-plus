import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

// Types pour la session DUT2-GE
export interface DUT2GESession {
  id: string;
  code: string;
  name: string;
  status: 'draft' | 'active' | 'completed';
  programId: string;
  academicYearId: string;
  examsCount: number;
  createdAt: string;
}

export interface DUT2GEExam {
  id: string;
  subjectId: string;
  subjectName: string;
  semester: number;
  type: 'written' | 'oral' | 'practical';
  scheduledDate?: string;
  supervisorsAssigned: number;
  convocationsSent: number;
  status: string;
  duration_minutes: number;
}

export const useDUT2GESessionManager = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // IDs constants pour DUT2-GE
  const ACADEMIC_YEAR_ID = '550e8400-e29b-41d4-a716-446655440001';
  const PROGRAM_ID = '550e8400-e29b-41d4-a716-446655440002';

  const createDUT2GESession = async (programId: string, academicYearId: string) => {
    try {
      setLoading(true);
      setError(null);

      // Créer les 18 examens DUT2-GE directement dans la table exams
      const examSubjects = [
        // Semestre 3 (S3)
        { name: 'Droit', code: 'droit-s3', semester: 3, type: 'written', duration: 180 },
        { name: 'PEI', code: 'pei-s3', semester: 3, type: 'written', duration: 120 },
        { name: 'Mix Marketing', code: 'mix-s3', semester: 3, type: 'written', duration: 120 },
        { name: 'Calcul Commercial', code: 'calc-s3', semester: 3, type: 'written', duration: 120 },
        { name: 'Techniques Quantitatives', code: 'tq-s3', semester: 3, type: 'written', duration: 120 },
        { name: 'Informatique', code: 'info-s3', semester: 3, type: 'written', duration: 120 },
        { name: 'Communication', code: 'comm-s3', semester: 3, type: 'written', duration: 120 },
        { name: 'Anglais', code: 'ang-s3', semester: 3, type: 'written', duration: 120 },
        { name: 'PPP3', code: 'ppp3', semester: 3, type: 'oral', duration: 30 },
        
        // Semestre 4 (S4)
        { name: 'Finance', code: 'fin-s4', semester: 4, type: 'written', duration: 180 },
        { name: 'Production', code: 'prod-s4', semester: 4, type: 'written', duration: 120 },
        { name: 'Stratégie', code: 'strat-s4', semester: 4, type: 'written', duration: 120 },
        { name: 'Négociation', code: 'nego-s4', semester: 4, type: 'written', duration: 120 },
        { name: 'TCI', code: 'tci-s4', semester: 4, type: 'written', duration: 120 },
        { name: 'Anglais 2', code: 'ang2-s4', semester: 4, type: 'written', duration: 120 },
        { name: 'PPP4', code: 'ppp4', semester: 4, type: 'oral', duration: 30 },
        { name: 'Projet Tutoré', code: 'proj', semester: 4, type: 'oral', duration: 45 },
        { name: 'Stage', code: 'stage', semester: 4, type: 'oral', duration: 45 }
      ];

      const examPromises = examSubjects.map(async (subject) => {
        // Vérifier si l'examen existe déjà
        const { data: existingExam } = await supabase
          .from('exams')
          .select('*')
          .eq('title', `${subject.name} - Semestre ${subject.semester}`)
          .eq('program_id', programId)
          .maybeSingle();

        if (!existingExam) {
          return supabase
            .from('exams')
            .insert([{
              title: `${subject.name} - Semestre ${subject.semester}`,
              exam_type: subject.type,
              duration_minutes: subject.duration,
              status: 'draft',
              academic_year_id: academicYearId,
              program_id: programId,
              min_supervisors: subject.type === 'oral' ? 3 : 2,
              max_students: 13
            }])
            .select()
            .single();
        }
        return { data: existingExam };
      });

      const examResults = await Promise.all(examPromises);
      const dbExams = examResults.filter(result => result.data).map(result => result.data);
      
      // Convertir en DUT2GEExam avec les données du subject
      const createdExams: DUT2GEExam[] = dbExams.map((exam, index) => {
        const subject = examSubjects[index];
        return {
          id: exam.id,
          subjectId: exam.id,
          subjectName: subject.name,
          semester: subject.semester,
          type: subject.type as 'written' | 'oral' | 'practical',
          scheduledDate: undefined,
          supervisorsAssigned: exam.min_supervisors || 2,
          convocationsSent: 0,
          status: exam.status,
          duration_minutes: exam.duration_minutes
        };
      });

      // Créer un objet session par défaut
      const session: DUT2GESession = {
        id: 'dut2ge-session',
        code: 'S1-2324-DUTGE',
        name: 'Session DUT2-GE 2024-25',
        status: 'active',
        programId: programId,
        academicYearId: academicYearId,
        examsCount: createdExams.length,
        createdAt: new Date().toISOString()
      };

      toast({
        title: "Session DUT2-GE configurée",
        description: `${createdExams.length} examens DUT2-GE configurés.`,
      });

      return { session, exams: createdExams };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la création de la session';
      setError(errorMessage);
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive"
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getDUT2GESession = async () => {
    try {
      setLoading(true);
      setError(null);

      // Récupérer les examens DUT2-GE
      const { data: examsData, error: examsError } = await supabase
        .from('exams')
        .select('*')
        .eq('program_id', PROGRAM_ID)
        .order('title');

      if (examsError) throw examsError;

      // S'il n'y a pas d'examens, les créer
      if (!examsData || examsData.length === 0) {
        return await createDUT2GESession(PROGRAM_ID, ACADEMIC_YEAR_ID);
      }

      // Transformer les données pour correspondre à l'interface
      const exams: DUT2GEExam[] = examsData.map((exam: any, index: number) => ({
        id: exam.id,
        subjectId: exam.id,
        subjectName: exam.title.split(' - ')[0],
        semester: exam.title.includes('Semestre 3') ? 3 : 4,
        type: exam.exam_type as 'written' | 'oral' | 'practical',
        scheduledDate: undefined,
        supervisorsAssigned: exam.min_supervisors || 2,
        convocationsSent: 0,
        status: exam.status,
        duration_minutes: exam.duration_minutes
      }));

      const session: DUT2GESession = {
        id: 'dut2ge-session',
        code: 'S1-2324-DUTGE',
        name: 'Session DUT2-GE 2024-25',
        status: 'active',
        programId: PROGRAM_ID,
        academicYearId: ACADEMIC_YEAR_ID,
        examsCount: exams.length,
        createdAt: new Date().toISOString()
      };

      return { session, exams };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la récupération de la session';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getSessionStats = async () => {
    try {
      const { session, exams } = await getDUT2GESession();
      
      if (!exams) return getDefaultStats();

      // Calculer les statistiques depuis les vraies données
      const totalExams = exams.length;
      const s3Exams = exams.filter(exam => exam.semester === 3).length;
      const s4Exams = exams.filter(exam => exam.semester === 4).length;
      const oralExams = exams.filter(exam => exam.type === 'oral').length;
      const writtenExams = exams.filter(exam => exam.type === 'written').length;

      // Récupérer les sessions programmées
      const { data: scheduledSessions } = await supabase
        .from('exam_sessions')
        .select('exam_id')
        .in('exam_id', exams.map(e => e.id));

      const scheduledCount = scheduledSessions?.length || 0;
      const progressPercentage = totalExams > 0 ? Math.round((scheduledCount / totalExams) * 100) : 0;

      return {
        totalExams,
        totalSupervisors: exams.reduce((sum, exam) => sum + exam.supervisorsAssigned, 0),
        totalConvocations: exams.reduce((sum, exam) => sum + exam.convocationsSent, 0),
        s3Exams,
        s4Exams,
        oralExams,
        writtenExams,
        progressPercentage,
        conflictsResolved: 100,
        scheduledSessions: scheduledCount
      };
    } catch (err) {
      console.error('Erreur calcul statistiques:', err);
      return getDefaultStats();
    }
  };

  const getDefaultStats = () => ({
    totalExams: 0,
    totalSupervisors: 0,
    totalConvocations: 0,
    s3Exams: 0,
    s4Exams: 0,
    oralExams: 0,
    writtenExams: 0,
    progressPercentage: 0,
    conflictsResolved: 0,
    scheduledSessions: 0
  });

  const getDUT2GESessions = async () => {
    try {
      const { session } = await getDUT2GESession();
      return [session];
    } catch (err) {
      console.error('Erreur récupération sessions:', err);
      return [];
    }
  };

  const DUT2GE_SUBJECTS = [
    'Droit', 'PEI', 'Mix Marketing', 'Calcul Commercial', 'Techniques Quantitatives', 
    'Informatique', 'Communication', 'Anglais', 'PPP3',
    'Finance', 'Production', 'Stratégie', 'Négociation', 'TCI', 
    'Anglais 2', 'PPP4', 'Projet Tutoré', 'Stage'
  ];

  return {
    createDUT2GESession,
    getDUT2GESession,
    getDUT2GESessions,
    getSessionStats,
    DUT2GE_SUBJECTS,
    loading,
    error
  };
};