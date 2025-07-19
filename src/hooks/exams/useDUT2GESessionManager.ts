
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

      // Vérifier si la session existe déjà
      const { data: existingSession } = await supabase
        .from('exam_session_groups')
        .select('*')
        .eq('code', 'S1-2324-DUTGE')
        .single();

      let sessionData;
      
      if (existingSession) {
        sessionData = existingSession;
        console.log('Session existante trouvée:', sessionData);
      } else {
        // Créer une nouvelle session
        const { data: newSession, error: sessionError } = await supabase
          .from('exam_session_groups')
          .insert([{
            code: 'S1-2324-DUTGE',
            name: 'Session 1 - 2023/2024 - DUT Gestion des Entreprises',
            status: 'active',
            program_id: programId,
            academic_year_id: academicYearId
          }])
          .select()
          .single();

        if (sessionError) throw sessionError;
        sessionData = newSession;
      }

      // Créer les 18 examens DUT2-GE s'ils n'existent pas
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
          .eq('session_group_id', sessionData.id)
          .single();

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
              session_group_id: sessionData.id,
              min_supervisors: subject.type === 'oral' ? 3 : 2,
              max_students: 13
            }])
            .select()
            .single();
        }
        return { data: existingExam };
      });

      const examResults = await Promise.all(examPromises);
      const createdExams = examResults.filter(result => result.data).map(result => result.data);

      toast({
        title: "Session DUT2-GE configurée",
        description: `Session ${sessionData.code} avec ${createdExams.length} examens configurés.`,
      });

      return { session: sessionData, exams: createdExams };
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

  const getDUT2GESession = async (sessionId?: string) => {
    try {
      setLoading(true);
      setError(null);

      // Récupérer la session par code ou ID
      let query = supabase.from('exam_session_groups').select(`
        *,
        exams (
          id,
          title,
          exam_type,
          duration_minutes,
          status,
          created_at
        )
      `);

      if (sessionId) {
        query = query.eq('id', sessionId);
      } else {
        query = query.eq('code', 'S1-2324-DUTGE');
      }

      const { data: sessionData, error: sessionError } = await query.single();

      if (sessionError) {
        if (sessionError.code === 'PGRST116') {
          // Session n'existe pas, la créer
          return await createDUT2GESession(PROGRAM_ID, ACADEMIC_YEAR_ID);
        }
        throw sessionError;
      }

      // Transformer les données pour correspondre à l'interface
      const exams: DUT2GEExam[] = (sessionData.exams || []).map((exam: any, index: number) => ({
        id: exam.id,
        subjectId: exam.id,
        subjectName: exam.title.split(' - ')[0],
        semester: exam.title.includes('Semestre 3') ? 3 : 4,
        type: exam.exam_type as 'written' | 'oral' | 'practical',
        scheduledDate: undefined, // À récupérer depuis exam_sessions
        supervisorsAssigned: exam.exam_type === 'oral' ? 3 : 2,
        convocationsSent: 0, // À calculer depuis les données réelles
        status: exam.status,
        duration_minutes: exam.duration_minutes
      }));

      const session: DUT2GESession = {
        id: sessionData.id,
        code: sessionData.code,
        name: sessionData.name,
        status: sessionData.status,
        programId: sessionData.program_id,
        academicYearId: sessionData.academic_year_id,
        examsCount: exams.length,
        createdAt: sessionData.created_at
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
      
      // Calculer les statistiques depuis les vraies données
      const totalExams = exams.length;
      const s3Exams = exams.filter(exam => exam.semester === 3).length;
      const s4Exams = exams.filter(exam => exam.semester === 4).length;
      const oralExams = exams.filter(exam => exam.type === 'oral').length;
      const writtenExams = exams.filter(exam => exam.type === 'written').length;

      // Récupérer les sessions programmées
      const { data: scheduledSessions } = await supabase
        .from('exam_sessions')
        .select('*, exams!inner(*)')
        .eq('exams.session_group_id', session.id);

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
        conflictsResolved: 100, // À calculer depuis detect_exam_conflicts
        scheduledSessions: scheduledCount
      };
    } catch (err) {
      console.error('Erreur calcul statistiques:', err);
      return {
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
      };
    }
  };

  const getDUT2GESessions = async () => {
    try {
      const { data, error } = await supabase
        .from('exam_session_groups')
        .select('*')
        .eq('program_id', PROGRAM_ID)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data.map(session => ({
        id: session.id,
        code: session.code,
        name: session.name,
        status: session.status,
        programId: session.program_id,
        academicYearId: session.academic_year_id,
        examsCount: 18, // Valeur par défaut, à calculer si nécessaire
        createdAt: session.created_at
      }));
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
