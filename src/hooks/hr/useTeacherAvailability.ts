import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface TeacherAvailability {
  id: string;
  teacher_id: string;
  academic_year_id: string;
  day_of_week: number; // 0 = Dimanche, 1 = Lundi, etc.
  start_time: string;
  end_time: string;
  availability_type: 'available' | 'unavailable' | 'preferred' | 'limited';
  max_hours_per_day?: number;
  max_hours_per_week?: number;
  notes?: string;
  is_recurring: boolean;
  specific_date?: string;
  created_at: string;
  updated_at: string;
  // Relations
  teacher_profile?: {
    employee_number: string;
    profile: {
      full_name: string;
    };
  };
}

export function useTeacherAvailability() {
  const [availabilities, setAvailabilities] = useState<TeacherAvailability[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAvailabilities = async () => {
    try {
      setLoading(true);
      // Données factices pour la Phase 3
      const mockAvailabilities: TeacherAvailability[] = [
        {
          id: '1',
          teacher_id: 'teacher1',
          academic_year_id: 'year1',
          day_of_week: 1, // Lundi
          start_time: '08:00',
          end_time: '17:00',
          availability_type: 'available',
          max_hours_per_day: 8,
          max_hours_per_week: 35,
          is_recurring: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          teacher_profile: {
            employee_number: 'EMP001',
            profile: { full_name: 'Dr. Marie Dubois' }
          }
        },
        {
          id: '2',
          teacher_id: 'teacher1',
          academic_year_id: 'year1',
          day_of_week: 3, // Mercredi
          start_time: '14:00',
          end_time: '18:00',
          availability_type: 'limited',
          max_hours_per_day: 4,
          notes: 'Réunions de recherche le matin',
          is_recurring: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          teacher_profile: {
            employee_number: 'EMP001',
            profile: { full_name: 'Dr. Marie Dubois' }
          }
        },
        {
          id: '3',
          teacher_id: 'teacher2',
          academic_year_id: 'year1',
          day_of_week: 5, // Vendredi
          start_time: '09:00',
          end_time: '12:00',
          availability_type: 'unavailable',
          notes: 'Formation continue',
          is_recurring: false,
          specific_date: '2024-01-26',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          teacher_profile: {
            employee_number: 'EMP002',
            profile: { full_name: 'Prof. Jean Martin' }
          }
        }
      ];

      setAvailabilities(mockAvailabilities);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const createAvailability = async (availabilityData: Partial<TeacherAvailability>) => {
    return { data: null, error: 'Fonction temporairement désactivée' };
  };

  const updateAvailability = async (id: string, updates: Partial<TeacherAvailability>) => {
    return { data: null, error: 'Fonction temporairement désactivée' };
  };

  const deleteAvailability = async (id: string) => {
    return { error: 'Fonction temporairement désactivée' };
  };

  useEffect(() => {
    fetchAvailabilities();
  }, []);

  return {
    availabilities,
    loading,
    error,
    createAvailability,
    updateAvailability,
    deleteAvailability,
    refreshAvailabilities: fetchAvailabilities
  };
}