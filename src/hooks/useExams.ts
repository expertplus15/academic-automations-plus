
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Exam {
  id: string;
  subject_id?: string;
  academic_year_id?: string;
  program_id?: string;
  exam_type: 'written' | 'oral' | 'practical' | 'mixed';
  title: string;
  description?: string;
  duration_minutes: number;
  max_students?: number;
  min_supervisors: number;
  instructions: any;
  materials_required: any[];
  status: 'draft' | 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
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
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface ExamConflict {
  conflict_id: string;
  conflict_type: 'room_overlap' | 'supervisor_overlap' | 'capacity_exceeded';
  severity: 'low' | 'medium' | 'high' | 'critical';
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
        setExams(data || []);
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

  const createExam = async (examData: Partial<Exam>) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('exams')
        .insert([examData])
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

  const updateExam = async (examId: string, examData: Partial<Exam>) => {
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
