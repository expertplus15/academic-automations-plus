import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface TeacherProfile {
  id: string;
  profile_id: string;
  employee_number: string;
  department_id?: string | null;
  hire_date: string;
  status: string;
  specialties: any;
  qualifications: any;
  phone?: string | null;
  emergency_contact: any;
  salary_grade?: string | null;
  office_location?: string | null;
  bio?: string | null;
  cv_url?: string | null;
  photo_url?: string | null;
  created_at: string;
  updated_at: string;
  // Legacy properties for compatibility
  qualification_level?: string;
  years_experience?: number;
  // Relations
  profile?: {
    full_name?: string | null;
    email: string;
  } | null;
  department?: {
    name: string;
    code: string;
  } | null;
}

export function useTeacherProfiles() {
  const [teacherProfiles, setTeacherProfiles] = useState<TeacherProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchTeacherProfiles = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('teacher_profiles')
        .select(`
          *,
          profile:profiles(full_name, email),
          department:departments(name, code)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTeacherProfiles(data || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors du chargement des profils';
      setError(message);
      toast({
        title: "Erreur",
        description: message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createTeacherProfile = async (profileData: any) => {
    try {
      const { data, error } = await supabase
        .from('teacher_profiles')
        .insert([profileData])
        .select(`
          *,
          profile:profiles(full_name, email),
          department:departments(name, code)
        `)
        .single();

      if (error) throw error;

      setTeacherProfiles(prev => [data as TeacherProfile, ...prev]);
      toast({
        title: "Succès",
        description: "Profil enseignant créé avec succès",
      });
      
      return { data, error: null };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors de la création';
      toast({
        title: "Erreur",
        description: message,
        variant: "destructive",
      });
      return { data: null, error: message };
    }
  };

  const updateTeacherProfile = async (id: string, updates: Partial<TeacherProfile>) => {
    try {
      const { data, error } = await supabase
        .from('teacher_profiles')
        .update(updates)
        .eq('id', id)
        .select(`
          *,
          profile:profiles(full_name, email),
          department:departments(name, code)
        `)
        .single();

      if (error) throw error;

      setTeacherProfiles(prev => prev.map(profile => 
        profile.id === id ? { ...profile, ...data } : profile
      ));
      
      toast({
        title: "Succès",
        description: "Profil mis à jour avec succès",
      });
      
      return { data, error: null };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors de la mise à jour';
      toast({
        title: "Erreur",
        description: message,
        variant: "destructive",
      });
      return { data: null, error: message };
    }
  };

  const deleteTeacherProfile = async (id: string) => {
    try {
      const { error } = await supabase
        .from('teacher_profiles')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setTeacherProfiles(prev => prev.filter(profile => profile.id !== id));
      toast({
        title: "Succès",
        description: "Profil supprimé avec succès",
      });
      
      return { error: null };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors de la suppression';
      toast({
        title: "Erreur",
        description: message,
        variant: "destructive",
      });
      return { error: message };
    }
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