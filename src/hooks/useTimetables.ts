
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type TimetableInsert = Database['public']['Tables']['timetables']['Insert'];
type TimetableUpdate = Database['public']['Tables']['timetables']['Update'];

export interface Timetable {
  id: string;
  subject_id?: string;
  program_id?: string;
  academic_year_id?: string;
  group_id?: string;
  room_id?: string;
  teacher_id?: string;
  day_of_week?: number;
  start_time: string;
  end_time: string;
  slot_type: string;
  status?: string;
  priority?: number;
  weight?: number;
  is_flexible?: boolean;
  preferred_start_time?: string;
  preferred_end_time?: string;
  max_daily_hours?: number;
  min_break_minutes?: number;
  recurrence_pattern?: any;
  exceptions?: any;
  created_at: string;
  updated_at: string;
  // Relations
  subject?: {
    name: string;
    code: string;
  };
  room?: {
    name: string;
    code: string;
  };
  teacher?: {
    full_name: string;
  };
  program?: {
    name: string;
    code: string;
  };
}

export function useTimetables(programId?: string, academicYearId?: string) {
  const [timetables, setTimetables] = useState<Timetable[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTimetables = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching timetables with filters:', { programId, academicYearId });
      
      let query = supabase
        .from('timetables')
        .select(`
          *,
          subject:subjects(name, code),
          room:rooms(name, code),
          teacher:profiles!timetables_teacher_id_fkey(full_name),
          program:programs(name, code)
        `)
        .order('day_of_week')
        .order('start_time');

      if (programId) {
        query = query.eq('program_id', programId);
      }
      if (academicYearId) {
        query = query.eq('academic_year_id', academicYearId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching timetables:', error);
        setError(`Erreur lors du chargement des créneaux: ${error.message}`);
        setTimetables([]);
      } else {
        console.log('Fetched timetables:', data);
        setTimetables(data as Timetable[] || []);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Une erreur inattendue est survenue';
      setError(errorMessage);
      setTimetables([]);
    } finally {
      setLoading(false);
    }
  };

  const createTimetable = async (timetableData: TimetableInsert) => {
    try {
      console.log('Creating timetable with data:', timetableData);
      
      // Validation des données avant insertion
      if (!timetableData.subject_id || !timetableData.room_id || !timetableData.teacher_id) {
        throw new Error('Les champs matière, salle et enseignant sont obligatoires');
      }

      const { data, error } = await supabase
        .from('timetables')
        .insert(timetableData)
        .select(`
          *,
          subject:subjects(name, code),
          room:rooms(name, code),
          teacher:profiles!timetables_teacher_id_fkey(full_name),
          program:programs(name, code)
        `)
        .single();

      if (error) {
        console.error('Error creating timetable:', error);
        // Messages d'erreur plus explicites
        let errorMessage = 'Erreur lors de la création du créneau';
        
        if (error.code === '23503') {
          if (error.message.includes('subject_id')) {
            errorMessage = 'La matière spécifiée n\'existe pas';
          } else if (error.message.includes('room_id')) {
            errorMessage = 'La salle spécifiée n\'existe pas';
          } else if (error.message.includes('teacher_id')) {
            errorMessage = 'L\'enseignant spécifié n\'existe pas';
          } else if (error.message.includes('group_id')) {
            errorMessage = 'Le groupe spécifié n\'existe pas';
          } else {
            errorMessage = 'Une ou plusieurs références sont invalides';
          }
        } else if (error.code === '23505') {
          errorMessage = 'Un conflit de contrainte unique a été détecté';
        }
        
        throw new Error(errorMessage);
      }

      console.log('Successfully created timetable:', data);
      
      // Rafraîchir la liste après création
      await fetchTimetables();
      
      return { data, error: null };
    } catch (err) {
      console.error('Error in createTimetable:', err);
      throw err;
    }
  };

  const updateTimetable = async (id: string, updates: TimetableUpdate) => {
    try {
      console.log('Updating timetable:', id, 'with updates:', updates);
      
      const { data, error } = await supabase
        .from('timetables')
        .update(updates)
        .eq('id', id)
        .select(`
          *,
          subject:subjects(name, code),
          room:rooms(name, code),
          teacher:profiles!timetables_teacher_id_fkey(full_name),
          program:programs(name, code)
        `)
        .single();

      if (error) {
        console.error('Error updating timetable:', error);
        
        let errorMessage = 'Erreur lors de la modification du créneau';
        
        if (error.code === '23503') {
          if (error.message.includes('subject_id')) {
            errorMessage = 'La matière spécifiée n\'existe pas';
          } else if (error.message.includes('room_id')) {
            errorMessage = 'La salle spécifiée n\'existe pas';
          } else if (error.message.includes('teacher_id')) {
            errorMessage = 'L\'enseignant spécifié n\'existe pas';
          } else if (error.message.includes('group_id')) {
            errorMessage = 'Le groupe spécifié n\'existe pas';
          }
        }
        
        throw new Error(errorMessage);
      }

      console.log('Successfully updated timetable:', data);
      
      // Rafraîchir la liste après mise à jour
      await fetchTimetables();
      
      return { data, error: null };
    } catch (err) {
      console.error('Error in updateTimetable:', err);
      throw err;
    }
  };

  const deleteTimetable = async (id: string) => {
    try {
      console.log('Deleting timetable:', id);
      
      const { error } = await supabase
        .from('timetables')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting timetable:', error);
        throw new Error('Erreur lors de la suppression du créneau');
      }

      console.log('Successfully deleted timetable:', id);
      
      // Rafraîchir la liste après suppression
      await fetchTimetables();
      
      return { error: null };
    } catch (err) {
      console.error('Error in deleteTimetable:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchTimetables();
  }, [programId, academicYearId]);

  return {
    timetables,
    loading,
    error,
    refetch: fetchTimetables,
    createTimetable,
    updateTimetable,
    deleteTimetable
  };
}
