import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CreateStudentData {
  full_name: string;
  email: string;
  phone?: string;
  program_id: string;
  year_level: number;
}

interface UpdateStudentData {
  full_name?: string;
  email?: string;
  phone?: string;
  program_id?: string;
  year_level?: number;
  status?: 'active' | 'suspended' | 'graduated' | 'dropped';
}

export function useStudentsCRUD() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const createStudent = async (data: CreateStudentData) => {
    try {
      setLoading(true);

      // First create user account
      const tempPassword = Math.random().toString(36).slice(-8);
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: tempPassword,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            full_name: data.full_name,
            role: 'student'
          }
        }
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('Échec de création du compte utilisateur');

      // Get program to generate student number
      const { data: program, error: programError } = await supabase
        .from('programs')
        .select('code')
        .eq('id', data.program_id)
        .single();

      if (programError) throw programError;

      // Generate student number
      const { data: studentNumber, error: numberError } = await supabase
        .rpc('generate_student_number', {
          program_code: program.code,
          enrollment_year: new Date().getFullYear()
        });

      if (numberError) throw numberError;

      // Wait for profile creation (trigger)
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Create student record
      const { data: student, error: studentError } = await supabase
        .from('students')
        .insert({
          profile_id: authData.user.id,
          student_number: studentNumber,
          program_id: data.program_id,
          year_level: data.year_level,
          status: 'active',
          enrollment_date: new Date().toISOString()
        })
        .select(`
          *,
          profiles!students_profile_id_fkey (full_name, email),
          programs!students_program_id_fkey (name, code)
        `)
        .single();

      if (studentError) throw studentError;

      toast({
        title: "Étudiant créé avec succès",
        description: `Numéro étudiant: ${studentNumber}`
      });

      return { success: true, student, studentNumber };

    } catch (error) {
      console.error('Error creating student:', error);
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Erreur lors de la création",
        variant: "destructive"
      });
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  const updateStudent = async (studentId: string, data: UpdateStudentData) => {
    try {
      setLoading(true);

      // Get current student data
      const { data: currentStudent, error: fetchError } = await supabase
        .from('students')
        .select('profile_id')
        .eq('id', studentId)
        .single();

      if (fetchError) throw fetchError;

      // Update profile if needed
      if (data.full_name || data.email || data.phone) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            ...(data.full_name && { full_name: data.full_name }),
            ...(data.email && { email: data.email }),
            ...(data.phone && { phone: data.phone })
          })
          .eq('id', currentStudent.profile_id);

        if (profileError) throw profileError;
      }

      // Update student record
      const { data: student, error: studentError } = await supabase
        .from('students')
        .update({
          ...(data.program_id && { program_id: data.program_id }),
          ...(data.year_level && { year_level: data.year_level }),
          ...(data.status && { status: data.status })
        })
        .eq('id', studentId)
        .select(`
          *,
          profiles!students_profile_id_fkey (full_name, email, phone),
          programs!students_program_id_fkey (name, code)
        `)
        .single();

      if (studentError) throw studentError;

      toast({
        title: "Étudiant mis à jour",
        description: "Les informations ont été mises à jour avec succès"
      });

      return { success: true, student };

    } catch (error) {
      console.error('Error updating student:', error);
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Erreur lors de la mise à jour",
        variant: "destructive"
      });
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  const deleteStudent = async (studentId: string) => {
    try {
      setLoading(true);

      // Get student profile ID first
      const { data: student, error: fetchError } = await supabase
        .from('students')
        .select('profile_id, student_number')
        .eq('id', studentId)
        .single();

      if (fetchError) throw fetchError;

      // Soft delete by updating status
      const { error: updateError } = await supabase
        .from('students')
        .update({ status: 'dropped' })
        .eq('id', studentId);

      if (updateError) throw updateError;

      toast({
        title: "Étudiant supprimé",
        description: `L'étudiant ${student.student_number} a été supprimé`
      });

      return { success: true };

    } catch (error) {
      console.error('Error deleting student:', error);
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Erreur lors de la suppression",
        variant: "destructive"
      });
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  const suspendStudent = async (studentId: string, reason?: string) => {
    return updateStudent(studentId, { status: 'suspended' });
  };

  const reactivateStudent = async (studentId: string) => {
    return updateStudent(studentId, { status: 'active' });
  };

  return {
    loading,
    createStudent,
    updateStudent,
    deleteStudent,
    suspendStudent,
    reactivateStudent
  };
}