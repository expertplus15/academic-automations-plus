
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Student {
  id: string;
  student_number: string;
  program_id: string;
  academic_year_id?: string;
  level_id?: string;
  group_id?: string;
  profile: {
    full_name: string;
    email: string;
  };
  program: {
    id: string;
    name: string;
    code: string;
  };
}

interface UseStudentsFilters {
  academicYearId?: string;
  programId?: string;
  levelId?: string;
  groupId?: string;
  search?: string;
}

export function useStudents(filters: UseStudentsFilters = {}) {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      console.log('🔍 [STUDENTS] Fetching students with filters:', filters);
      
      let query = supabase
        .from('students')
        .select(`
          id,
          student_number,
          program_id,
          academic_year_id,
          level_id,
          group_id,
          profile:profiles!inner (
            full_name,
            email
          ),
          program:programs!inner (
            id,
            name,
            code
          )
        `)
        .eq('status', 'active')
        .order('student_number');

      // Appliquer tous les filtres
      if (filters.academicYearId) {
        query = query.eq('academic_year_id', filters.academicYearId);
      }

      if (filters.programId) {
        query = query.eq('program_id', filters.programId);
      }

      if (filters.levelId) {
        query = query.eq('level_id', filters.levelId);
      }

      if (filters.groupId) {
        query = query.eq('group_id', filters.groupId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('❌ [STUDENTS] Error fetching students:', error);
        throw error;
      }
      
      let filteredData = data || [];

      // Filtrage par recherche textuelle côté client
      if (filters.search && filters.search.trim()) {
        const searchTerm = filters.search.toLowerCase().trim();
        filteredData = filteredData.filter(student => 
          student.profile.full_name.toLowerCase().includes(searchTerm) ||
          student.student_number.toLowerCase().includes(searchTerm) ||
          student.profile.email.toLowerCase().includes(searchTerm)
        );
      }
      
      console.log('✅ [STUDENTS] Successfully fetched', filteredData.length, 'students with applied filters');
      setStudents(filteredData);
    } catch (error) {
      console.error('💥 [STUDENTS] Unexpected error:', error);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [filters.academicYearId, filters.programId, filters.levelId, filters.groupId, filters.search]);

  return {
    students,
    loading,
    fetchStudents,
  };
}
