import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface TeacherSpecialty {
  id: string;
  name: string;
  code: string;
  description?: string;
  category: 'technical' | 'pedagogical' | 'research' | 'administrative';
  level_required: 'basic' | 'intermediate' | 'advanced' | 'expert';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface TeacherSpecialtyAssignment {
  id: string;
  teacher_id: string;
  specialty_id: string;
  proficiency_level: 'basic' | 'intermediate' | 'advanced' | 'expert';
  years_experience: number;
  certified_date?: string;
  certification_authority?: string;
  is_primary: boolean;
  notes?: string;
  created_at: string;
  updated_at: string;
  // Relations
  teacher_profile?: {
    employee_number: string;
    profile: {
      full_name: string;
    };
  };
  specialty?: TeacherSpecialty;
}

export function useTeacherSpecialties() {
  const [specialties, setSpecialties] = useState<TeacherSpecialty[]>([]);
  const [assignments, setAssignments] = useState<TeacherSpecialtyAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSpecialties = async () => {
    try {
      setLoading(true);
      // Données factices pour la Phase 3
      const mockSpecialties: TeacherSpecialty[] = [
        {
          id: '1',
          name: 'Mathématiques Avancées',
          code: 'MATH_ADV',
          description: 'Enseignement des mathématiques de niveau supérieur',
          category: 'technical',
          level_required: 'advanced',
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: '2',
          name: 'Pédagogie Numérique',
          code: 'PEDAG_NUM',
          description: 'Intégration des outils numériques dans l\'enseignement',
          category: 'pedagogical',
          level_required: 'intermediate',
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: '3',
          name: 'Recherche Scientifique',
          code: 'RECH_SCI',
          description: 'Conduite de projets de recherche',
          category: 'research',
          level_required: 'expert',
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
      ];

      const mockAssignments: TeacherSpecialtyAssignment[] = [
        {
          id: '1',
          teacher_id: 'teacher1',
          specialty_id: '1',
          proficiency_level: 'advanced',
          years_experience: 5,
          certified_date: '2020-01-15',
          certification_authority: 'Ministère de l\'Education',
          is_primary: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          teacher_profile: {
            employee_number: 'EMP001',
            profile: { full_name: 'Dr. Marie Dubois' }
          },
          specialty: mockSpecialties[0]
        },
        {
          id: '2',
          teacher_id: 'teacher2',
          specialty_id: '2',
          proficiency_level: 'expert',
          years_experience: 8,
          is_primary: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          teacher_profile: {
            employee_number: 'EMP002',
            profile: { full_name: 'Prof. Jean Martin' }
          },
          specialty: mockSpecialties[1]
        }
      ];

      setSpecialties(mockSpecialties);
      setAssignments(mockAssignments);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const createSpecialty = async (specialtyData: Partial<TeacherSpecialty>) => {
    return { data: null, error: 'Fonction temporairement désactivée' };
  };

  const updateSpecialty = async (id: string, updates: Partial<TeacherSpecialty>) => {
    return { data: null, error: 'Fonction temporairement désactivée' };
  };

  const assignSpecialty = async (assignmentData: Partial<TeacherSpecialtyAssignment>) => {
    return { data: null, error: 'Fonction temporairement désactivée' };
  };

  const updateAssignment = async (id: string, updates: Partial<TeacherSpecialtyAssignment>) => {
    return { data: null, error: 'Fonction temporairement désactivée' };
  };

  useEffect(() => {
    fetchSpecialties();
  }, []);

  return {
    specialties,
    assignments,
    loading,
    error,
    createSpecialty,
    updateSpecialty,
    assignSpecialty,
    updateAssignment,
    refreshSpecialties: fetchSpecialties
  };
}