
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface DUTGEStudent {
  id: string;
  student_number: string;
  profiles: {
    full_name: string;
    email: string;
  };
  program: string;
  level: string;
  status: string;
}

interface DUTGESubject {
  id: string;
  code: string;
  name: string;
  credits_ects: number;
  coefficient: number;
}

interface DUTGEStats {
  totalStudents: number;
  activeStudents: number;
  totalSubjects: number;
  importedGrades: number;
  publishedGrades: number;
}

export function useDUTGEData(academicYearId?: string) {
  const [students, setStudents] = useState<DUTGEStudent[]>([]);
  const [subjects, setSubjects] = useState<DUTGESubject[]>([]);
  const [stats, setStats] = useState<DUTGEStats>({
    totalStudents: 0,
    activeStudents: 0,
    totalSubjects: 0,
    importedGrades: 0,
    publishedGrades: 0
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchDUTGEStudents = async () => {
    try {
      console.log('🔍 [DUTGE] Fetching DUTGE students for academic year:', academicYearId);
      
      let query = supabase
        .from('students')
        .select(`
          id,
          student_number,
          status,
          academic_year_id,
          profiles!inner(full_name, email),
          programs!inner(name, code)
        `)
        .ilike('student_number', 'DUTGE%')
        .eq('status', 'active');

      // Filtrer par année académique si spécifiée
      if (academicYearId) {
        query = query.eq('academic_year_id', academicYearId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('❌ [DUTGE] Error fetching students:', error);
        throw error;
      }

      const dutgeStudents = data?.map(student => ({
        id: student.id,
        student_number: student.student_number,
        profiles: student.profiles,
        program: Array.isArray(student.programs) ? student.programs[0]?.name || 'N/A' : student.programs?.name || 'N/A',
        level: 'DUT2-GE', // Niveau fixe pour DUTGE
        status: student.status
      })) || [];

      console.log('✅ [DUTGE] Successfully fetched', dutgeStudents.length, 'DUTGE students');
      setStudents(dutgeStudents);
      return dutgeStudents;
    } catch (error) {
      console.error('💥 [DUTGE] Error fetching students:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les étudiants DUTGE",
        variant: "destructive",
      });
      return [];
    }
  };

  const fetchDUTGESubjects = async () => {
    try {
      console.log('🔍 [DUTGE] Fetching DUTGE subjects...');
      
      const { data, error } = await supabase
        .from('subjects')
        .select('id, code, name, credits_ects, coefficient, program_id')
        .eq('program_id', (await supabase.from('programs').select('id').eq('code', 'DUTGE').single()).data?.id)
        .eq('status', 'active');

      if (error) {
        console.error('❌ [DUTGE] Error fetching subjects:', error);
        throw error;
      }

      const dutgeSubjects = data?.map(subject => ({
        id: subject.id,
        code: subject.code,
        name: subject.name,
        credits_ects: subject.credits_ects || 0,
        coefficient: subject.coefficient || 1
      })) || [];

      console.log('✅ [DUTGE] Successfully fetched', dutgeSubjects.length, 'DUTGE subjects');
      setSubjects(dutgeSubjects);
      return dutgeSubjects;
    } catch (error) {
      console.error('💥 [DUTGE] Error fetching subjects:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les matières DUTGE",
        variant: "destructive",
      });
      return [];
    }
  };

  const fetchDUTGEStats = async () => {
    try {
      const [studentsData, subjectsData] = await Promise.all([
        fetchDUTGEStudents(),
        fetchDUTGESubjects()
      ]);

      // Fetch grades stats
      const { count: importedGradesCount } = await supabase
        .from('student_grades')
        .select('*', { count: 'exact', head: true })
        .in('student_id', studentsData.map(s => s.id));

      const { count: publishedGradesCount } = await supabase
        .from('student_grades')
        .select('*', { count: 'exact', head: true })
        .in('student_id', studentsData.map(s => s.id))
        .eq('is_published', true);

      setStats({
        totalStudents: studentsData.length,
        activeStudents: studentsData.filter(s => s.status === 'active').length,
        totalSubjects: subjectsData.length,
        importedGrades: importedGradesCount || 0,
        publishedGrades: publishedGradesCount || 0
      });

    } catch (error) {
      console.error('💥 [DUTGE] Error fetching stats:', error);
    }
  };

  const verifyDUTGEPrerequisites = async () => {
    const studentsData = await fetchDUTGEStudents();
    const subjectsData = await fetchDUTGESubjects();
    
    const issues = [];
    
    if (studentsData.length === 0) {
      issues.push('Aucun étudiant DUTGE trouvé dans le système');
    }
    
    if (subjectsData.length === 0) {
      issues.push('Aucune matière DUTGE trouvée dans le système');
    }

    // Check for typical DUTGE subjects
    const requiredSubjects = ['DROIT', 'ECO', 'MARK', 'COMPTA', 'MATH', 'INFO', 'COMM', 'LANG', 'PPP'];
    const missingSubjects = requiredSubjects.filter(req => 
      !subjectsData.some(sub => sub.code.includes(req))
    );
    
    if (missingSubjects.length > 0) {
      issues.push(`Matières manquantes: ${missingSubjects.join(', ')}`);
    }

    return {
      valid: issues.length === 0,
      issues,
      studentsCount: studentsData.length,
      subjectsCount: subjectsData.length
    };
  };

  useEffect(() => {
    setLoading(true);
    fetchDUTGEStats().finally(() => setLoading(false));
  }, [academicYearId]);

  return {
    students,
    subjects,
    stats,
    loading,
    fetchDUTGEStudents,
    fetchDUTGESubjects,
    fetchDUTGEStats,
    verifyDUTGEPrerequisites
  };
}
