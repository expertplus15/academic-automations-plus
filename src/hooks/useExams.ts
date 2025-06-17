
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Exam {
  id: string;
  subject_id?: string;
  academic_year_id?: string;
  program_id?: string;
  exam_type: string;
  title: string;
  description?: string;
  duration_minutes: number;
  max_students?: number;
  min_supervisors: number;
  instructions: any;
  materials_required: any;
  status: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface ExamSession {
  id: string;
  exam_id: string;
  room_id?: string;
  start_time: string;
  end_time: string;
  actual_students_count: number;
  status: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface ExamConflict {
  conflict_id: string;
  conflict_type: string;
  severity: string;
  title: string;
  description: string;
  affected_data: any;
}

export function useExams() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [sessions, setSessions] = useState<ExamSession[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchExams = async (academicYearId?: string) => {
    try {
      setLoading(true);
      let query = supabase.from('exams').select('*').order('created_at', { ascending: false });
      
      if (academicYearId) {
        query = query.eq('academic_year_id', academicYearId);
      }

      const { data, error } = await query;

      if (error) {
        setError(error.message);
      } else {
        // Mapping des données pour assurer la compatibilité des types
        const mappedExams = (data || []).map((exam: any) => ({
          id: exam.id,
          subject_id: exam.subject_id,
          academic_year_id: exam.academic_year_id,
          program_id: exam.program_id,
          exam_type: exam.exam_type,
          title: exam.title,
          description: exam.description,
          duration_minutes: exam.duration_minutes,
          max_students: exam.max_students,
          min_supervisors: exam.min_supervisors,
          instructions: exam.instructions,
          materials_required: exam.materials_required,
          status: exam.status,
          created_by: exam.created_by,
          created_at: exam.created_at,
          updated_at: exam.updated_at
        }));
        setExams(mappedExams);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const fetchSessions = async (examId?: string) => {
    try {
      setLoading(true);
      let query = supabase.from('exam_sessions').select('*').order('start_time', { ascending: true });
      
      if (examId) {
        query = query.eq('exam_id', examId);
      }

      const { data, error } = await query;

      if (error) {
        setError(error.message);
      } else {
        setSessions(data || []);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const createExam = async (examData: {
    subject_id?: string;
    academic_year_id?: string;
    program_id?: string;
    exam_type?: string;
    title: string;
    description?: string;
    duration_minutes?: number;
    max_students?: number;
    min_supervisors?: number;
    instructions?: any;
    materials_required?: any;
    status?: string;
  }) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('exams')
        .insert(examData)
        .select()
        .single();

      if (error) {
        setError(error.message);
        return null;
      } else {
        await fetchExams();
        return data;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la création');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateExam = async (examId: string, examData: {
    subject_id?: string;
    academic_year_id?: string;
    program_id?: string;
    exam_type?: string;
    title?: string;
    description?: string;
    duration_minutes?: number;
    max_students?: number;
    min_supervisors?: number;
    instructions?: any;
    materials_required?: any;
    status?: string;
  }) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('exams')
        .update(examData)
        .eq('id', examId)
        .select()
        .single();

      if (error) {
        setError(error.message);
        return null;
      } else {
        await fetchExams();
        return data;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la modification');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteExam = async (examId: string) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('exams')
        .delete()
        .eq('id', examId);

      if (error) {
        setError(error.message);
        return false;
      } else {
        await fetchExams();
        return true;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression');
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExams();
    fetchSessions();
  }, []);

  return {
    exams,
    sessions,
    loading,
    error,
    fetchExams,
    fetchSessions,
    createExam,
    updateExam,
    deleteExam
  };
}
