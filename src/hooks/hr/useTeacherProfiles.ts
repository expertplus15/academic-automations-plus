import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface TeacherProfile {
  id: string;
  profile_id: string;
  employee_number: string;
  hire_date: string;
  status: 'active' | 'inactive' | 'on_leave' | 'terminated';
  phone?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  address?: string;
  qualification_level?: string;
  years_experience: number;
  national_id?: string;
  social_security_number?: string;
  bank_details?: Record<string, any>;
  notes?: string;
  created_at: string;
  updated_at: string;
  // Profile relation
  profile?: {
    full_name: string;
    email: string;
  };
}

export function useTeacherProfiles() {
  const [teacherProfiles, setTeacherProfiles] = useState<TeacherProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTeacherProfiles = async () => {
    try {
      setLoading(true);
      // Temporaire: données factices en attendant la mise à jour des types
      setTeacherProfiles([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const createTeacherProfile = async (profileData: Partial<TeacherProfile>) => {
    // Temporaire: retourne une erreur en attendant la mise à jour des types
    return { data: null, error: 'Fonction temporairement désactivée' };
  };

  const updateTeacherProfile = async (id: string, updates: Partial<TeacherProfile>) => {
    // Temporaire: retourne une erreur en attendant la mise à jour des types
    return { data: null, error: 'Fonction temporairement désactivée' };
  };

  const deleteTeacherProfile = async (id: string) => {
    // Temporaire: retourne une erreur en attendant la mise à jour des types
    return { error: 'Fonction temporairement désactivée' };
  };

  useEffect(() => {
    fetchTeacherProfiles();
  }, []);

  return {
    teacherProfiles,
    loading,
    error,
    createTeacherProfile,
    updateTeacherProfile,
    deleteTeacherProfile,
    refreshTeacherProfiles: fetchTeacherProfiles
  };
}