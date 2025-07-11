import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface TeacherProfile {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  department?: string;
  subjects: string[];
  status: 'active' | 'inactive' | 'pending';
  hire_date: string;
  contract_type: string;
}

interface ContractInfo {
  id: string;
  teacher_id: string;
  contract_type: string;
  start_date: string;
  end_date?: string;
  status: 'active' | 'expired' | 'pending';
  hours_per_week: number;
}

interface HRStats {
  totalTeachers: number;
  activeTeachers: number;
  pendingTeachers: number;
  totalContracts: number;
  activeContracts: number;
  expiringSoon: number;
  hasData: boolean;
}

export function useHRModule() {
  const [teachers, setTeachers] = useState<TeacherProfile[]>([]);
  const [contracts, setContracts] = useState<ContractInfo[]>([]);
  const [stats, setStats] = useState<HRStats>({
    totalTeachers: 0,
    activeTeachers: 0,
    pendingTeachers: 0,
    totalContracts: 0,
    activeContracts: 0,
    expiringSoon: 0,
    hasData: false
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHRData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Try to get teacher profiles from the profiles table with teacher role
      const { data: teacherProfiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'teacher');

      if (profilesError) throw profilesError;

      // Mock teacher data if none exists in the database
      const mockTeachers: TeacherProfile[] = teacherProfiles?.length > 0 
        ? teacherProfiles.map(profile => ({
            id: profile.id,
            full_name: profile.full_name || 'Nom non disponible',
            email: profile.email || '',
            phone: profile.phone,
            department: 'Informatique', // Mock department
            subjects: ['Programmation', 'Base de données'], // Mock subjects
            status: 'active',
            hire_date: '2023-09-01',
            contract_type: 'CDI'
          }))
        : [];

      // Mock contract data
      const mockContracts: ContractInfo[] = mockTeachers.map(teacher => ({
        id: `contract_${teacher.id}`,
        teacher_id: teacher.id,
        contract_type: teacher.contract_type,
        start_date: teacher.hire_date,
        end_date: undefined,
        status: 'active',
        hours_per_week: 35
      }));

      const totalTeachers = mockTeachers.length;
      const activeTeachers = mockTeachers.filter(t => t.status === 'active').length;
      const pendingTeachers = mockTeachers.filter(t => t.status === 'pending').length;
      const totalContracts = mockContracts.length;
      const activeContracts = mockContracts.filter(c => c.status === 'active').length;

      setTeachers(mockTeachers);
      setContracts(mockContracts);
      setStats({
        totalTeachers,
        activeTeachers,
        pendingTeachers,
        totalContracts,
        activeContracts,
        expiringSoon: 0, // Mock value
        hasData: totalTeachers > 0
      });

    } catch (err) {
      console.error('Error fetching HR data:', err);
      setError('Erreur lors du chargement des données RH');
    } finally {
      setLoading(false);
    }
  };

  const addTeacher = async (teacherData: Partial<TeacherProfile>) => {
    try {
      // In a real implementation, this would add to the database
      console.log('Adding teacher:', teacherData);
      await fetchHRData(); // Refresh data
    } catch (err) {
      console.error('Error adding teacher:', err);
    }
  };

  const importTeachers = async (file: File) => {
    try {
      // In a real implementation, this would process the file and import data
      console.log('Importing teachers from file:', file.name);
      await fetchHRData(); // Refresh data
    } catch (err) {
      console.error('Error importing teachers:', err);
    }
  };

  useEffect(() => {
    fetchHRData();
  }, []);

  return {
    teachers,
    contracts,
    stats,
    loading,
    error,
    addTeacher,
    importTeachers,
    refreshData: fetchHRData
  };
}