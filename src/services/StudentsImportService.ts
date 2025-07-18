
import { supabase } from '@/integrations/supabase/client';
import { DutgeStudentData, ImportResult } from '@/pages/students/Import';

export class StudentsImportService {
  private readonly DUTGE_PROGRAM_ID = 'ced83506-8666-487b-a310-f0b1a97b0c5c';
  private readonly ACADEMIC_YEAR_ID = '69154c70-02c8-4705-8def-d1bca954d4a4';

  async importStudents(
    studentsData: DutgeStudentData[],
    onProgress?: (progress: number) => void
  ): Promise<ImportResult> {
    const result: ImportResult = {
      success: 0,
      errors: 0,
      details: [],
      createdStudents: [],
      createdGroups: []
    };

    // Step 1: Create TD groups first
    onProgress?.(5);
    await this.ensureTDGroupsExist();
    result.createdGroups = ['TD1-GE', 'TD2-GE'];

    const totalStudents = studentsData.length;
    
    for (let i = 0; i < totalStudents; i++) {
      const studentData = studentsData[i];
      const progress = 10 + (i / totalStudents) * 85;
      onProgress?.(progress);

      try {
        // Step 2: Create auth user
        const authUser = await this.createAuthUser(studentData);
        
        // Step 3: Wait for profile creation (handled by trigger)
        await this.waitForProfile(authUser.id);
        
        // Step 4: Update profile with complete data
        await this.updateProfile(authUser.id, studentData);
        
        // Step 5: Create student record
        const student = await this.createStudentRecord(authUser.id, studentData, i);
        
        result.success++;
        result.createdStudents.push(student);
        result.details.push({
          student: `${studentData.prenom} ${studentData.nom}`,
          success: true
        });

      } catch (error) {
        console.error(`Error importing student ${studentData.prenom} ${studentData.nom}:`, error);
        result.errors++;
        result.details.push({
          student: `${studentData.prenom} ${studentData.nom}`,
          error: error instanceof Error ? error.message : 'Erreur inconnue'
        });
      }
    }

    onProgress?.(100);
    return result;
  }

  private async createAuthUser(studentData: DutgeStudentData) {
    const tempPassword = this.generateTempPassword();
    
    const uniqueEmail = `${studentData.prenom.toLowerCase().replace(/\s+/g, '')}.${studentData.nom.toLowerCase().replace(/\s+/g, '')}.ge2024@univ.com`;
    
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: uniqueEmail,
      password: tempPassword,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: {
          full_name: `${studentData.prenom} ${studentData.nom}`,
          role: 'student'
        }
      }
    });

    if (authError) {
      throw new Error(`Erreur création utilisateur: ${authError.message}`);
    }

    if (!authData.user) {
      throw new Error('Utilisateur non créé');
    }

    return authData.user;
  }

  private async waitForProfile(userId: string, maxAttempts = 10) {
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', userId)
        .maybeSingle();

      if (profile) {
        return;
      }
    }

    // If profile wasn't created by trigger, create it manually
    const { error } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        email: '',
        full_name: '',
        role: 'student'
      });

    if (error) {
      throw new Error(`Erreur création profil: ${error.message}`);
    }
  }

  private async updateProfile(userId: string, studentData: DutgeStudentData) {
    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: `${studentData.prenom} ${studentData.nom}`,
        email: studentData.email,
        phone: studentData.telephone,
        role: 'student'
      })
      .eq('id', userId);

    if (error) {
      throw new Error(`Erreur mise à jour profil: ${error.message}`);
    }
  }

  private async createStudentRecord(userId: string, studentData: DutgeStudentData, index: number) {
    // Determine TD group (first 9 to TD1-GE, rest to TD2-GE)
    const groupName = index < 9 ? 'TD1-GE' : 'TD2-GE';
    
    // Get the group ID
    const { data: group } = await supabase
      .from('class_groups')
      .select('id')
      .eq('name', groupName)
      .maybeSingle();

    const { data: student, error } = await supabase
      .from('students')
      .insert({
        profile_id: userId,
        student_number: studentData.matricule,
        program_id: this.DUTGE_PROGRAM_ID,
        year_level: 2, // DUT2
        status: 'active',
        enrollment_date: new Date().toISOString(),
        group_id: group?.id || null
      })
      .select(`
        *,
        profiles!students_profile_id_fkey (full_name, email, phone),
        programs!students_program_id_fkey (name, code)
      `)
      .single();

    if (error) {
      throw new Error(`Erreur création étudiant: ${error.message}`);
    }

    // Add group name to response for display
    return {
      ...student,
      group_name: groupName
    };
  }

  private async ensureTDGroupsExist() {
    const groups = [
      {
        name: 'TD1-GE',
        code: 'TD1-GE',
        group_type: 'TD',
        program_id: this.DUTGE_PROGRAM_ID,
        academic_year_id: this.ACADEMIC_YEAR_ID,
        max_students: 30,
        current_students: 0
      },
      {
        name: 'TD2-GE',
        code: 'TD2-GE', 
        group_type: 'TD',
        program_id: this.DUTGE_PROGRAM_ID,
        academic_year_id: this.ACADEMIC_YEAR_ID,
        max_students: 30,
        current_students: 0
      }
    ];

    for (const group of groups) {
      const { data: existing } = await supabase
        .from('class_groups')
        .select('id')
        .eq('name', group.name)
        .maybeSingle();

      if (!existing) {
        const { error } = await supabase
          .from('class_groups')
          .insert(group);

        if (error) {
          console.error(`Error creating group ${group.name}:`, error);
        }
      }
    }
  }

  private generateTempPassword(): string {
    return Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8).toUpperCase();
  }
}
