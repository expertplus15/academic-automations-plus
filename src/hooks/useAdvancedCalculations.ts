import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface ECTSCalculationConfig {
  id: string;
  program_id: string;
  academic_year_id: string;
  subject_id?: string;
  ects_credits: number;
  coefficient: number;
  minimum_grade: number;
  compensation_allowed: boolean;
  calculation_formula?: string;
}

export interface GradeSimulation {
  id: string;
  student_id: string;
  academic_year_id: string;
  simulation_name: string;
  simulation_type: 'what_if' | 'projection' | 'scenario';
  original_data: Record<string, any>;
  simulated_data: Record<string, any>;
  results: Record<string, any>;
  created_at: string;
}

export interface AcademicHonor {
  id: string;
  student_id: string;
  academic_year_id: string;
  semester?: number;
  honor_type: 'mention' | 'distinction' | 'award' | 'recognition';
  honor_level: string;
  criteria_met: Record<string, any>;
  average_score?: number;
  ects_earned?: number;
  calculated_at: string;
}

export function useAdvancedCalculations() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ectsConfigs, setEctsConfigs] = useState<ECTSCalculationConfig[]>([]);
  const [simulations, setSimulations] = useState<GradeSimulation[]>([]);

  // Calculate ECTS with compensation
  const calculateECTSWithCompensation = async (
    student_id: string,
    academic_year_id: string,
    semester?: number
  ) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .rpc('calculate_ects_with_compensation', {
          p_student_id: student_id,
          p_academic_year_id: academic_year_id,
          p_semester: semester
        });

      if (error) throw error;
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du calcul ECTS');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Fetch ECTS configuration
  const fetchECTSConfig = async (program_id: string, academic_year_id: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('ects_calculation_config')
        .select(`
          *,
          subjects(name, code),
          programs(name, code)
        `)
        .eq('program_id', program_id)
        .eq('academic_year_id', academic_year_id);

      if (error) throw error;

      setEctsConfigs(data || []);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement de la configuration ECTS');
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Update ECTS configuration
  const updateECTSConfig = async (config: Partial<ECTSCalculationConfig> & { id: string }) => {
    try {
      const { data, error } = await supabase
        .from('ects_calculation_config')
        .update(config)
        .eq('id', config.id)
        .select()
        .single();

      if (error) throw error;
      
      // Refresh configs
      if (ectsConfigs.length > 0) {
        const { program_id, academic_year_id } = ectsConfigs[0];
        await fetchECTSConfig(program_id, academic_year_id);
      }
      
      return data;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Erreur lors de la mise à jour de la configuration');
    }
  };

  // Create grade simulation
  const createGradeSimulation = async (simulation: Omit<GradeSimulation, 'id' | 'created_at'>) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('grade_simulations')
        .insert([simulation])
        .select()
        .single();

      if (error) throw error;
      
      await fetchSimulations(simulation.student_id);
      return data;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Erreur lors de la création de la simulation');
    } finally {
      setLoading(false);
    }
  };

  // Fetch simulations for a student
  const fetchSimulations = async (student_id: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('grade_simulations')
        .select('*')
        .eq('student_id', student_id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const mappedData = (data || []).map(item => ({
        id: item.id,
        student_id: item.student_id,
        academic_year_id: item.academic_year_id,
        simulation_name: item.simulation_name,
        simulation_type: item.simulation_type as 'what_if' | 'projection' | 'scenario',
        original_data: typeof item.original_data === 'object' ? item.original_data as Record<string, any> : {},
        simulated_data: typeof item.simulated_data === 'object' ? item.simulated_data as Record<string, any> : {},
        results: typeof item.results === 'object' ? item.results as Record<string, any> : {},
        created_at: item.created_at
      }));
      setSimulations(mappedData);
      return mappedData;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des simulations');
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Simulate "what-if" scenario
  const simulateWhatIf = async (
    student_id: string,
    academic_year_id: string,
    hypothetical_grades: Array<{
      subject_id: string;
      grade: number;
    }>
  ) => {
    try {
      setLoading(true);

      // Get current grades
      const { data: currentGrades, error: gradesError } = await supabase
        .from('student_grades')
        .select(`
          *,
          subjects(name, code, credits_ects)
        `)
        .eq('student_id', student_id)
        .eq('academic_year_id', academic_year_id);

      if (gradesError) throw gradesError;

      // Apply hypothetical grades
      const simulatedGrades = currentGrades?.map(grade => {
        const hypothetical = hypothetical_grades.find(h => h.subject_id === grade.subject_id);
        return hypothetical ? { ...grade, grade: hypothetical.grade } : grade;
      }) || [];

      // Calculate new average
      const totalCredits = simulatedGrades.reduce((sum, g) => sum + (g.subjects?.credits_ects || 1), 0);
      const weightedSum = simulatedGrades.reduce((sum, g) => 
        sum + (g.grade * (g.subjects?.credits_ects || 1)), 0);
      const newAverage = totalCredits > 0 ? weightedSum / totalCredits : 0;

      // Calculate ECTS impact
      const ectsResult = await calculateECTSWithCompensation(student_id, academic_year_id);

      const simulation = {
        student_id,
        academic_year_id,
        simulation_name: `Simulation What-If ${new Date().toLocaleDateString()}`,
        simulation_type: 'what_if' as const,
        original_data: { grades: currentGrades, average: 0 },
        simulated_data: { grades: simulatedGrades, hypothetical_grades },
        results: {
          new_average: newAverage,
          ects_impact: ectsResult,
          grade_changes: hypothetical_grades.length
        }
      };

      return await createGradeSimulation(simulation);
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Erreur lors de la simulation');
    } finally {
      setLoading(false);
    }
  };

  // Calculate academic honors
  const calculateAcademicHonors = async (
    student_id: string,
    academic_year_id: string,
    semester?: number
  ) => {
    try {
      // Get student's performance data
      const ectsData = await calculateECTSWithCompensation(student_id, academic_year_id, semester);
      
      const honors: Array<Omit<AcademicHonor, 'id'>> = [];
      
      const ectsDataTyped = ectsData as any;
      if (ectsDataTyped.earned_ects >= 30 && ectsDataTyped.completion_rate >= 100) {
        const averageScore = ectsDataTyped.earned_ects / ectsDataTyped.total_ects * 20; // Simplified calculation
        
        if (averageScore >= 16) {
          honors.push({
            student_id,
            academic_year_id,
            semester,
            honor_type: 'mention',
            honor_level: averageScore >= 18 ? 'Très Bien' : 'Bien',
            criteria_met: { average_score: averageScore, ects_completion: ectsDataTyped.completion_rate },
            average_score: averageScore,
            ects_earned: ectsDataTyped.earned_ects,
            calculated_at: new Date().toISOString()
          });
        }
      }

      // Save honors to database
      if (honors.length > 0) {
        const { data, error } = await supabase
          .from('academic_honors')
          .insert(honors)
          .select();

        if (error) throw error;
        return data;
      }

      return [];
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Erreur lors du calcul des mentions');
    }
  };

  // Get calculation statistics
  const getCalculationStatistics = async (academic_year_id: string, program_id?: string) => {
    try {
      const { data: honors, error: honorsError } = await supabase
        .from('academic_honors')
        .select('honor_level, honor_type')
        .eq('academic_year_id', academic_year_id);

      if (honorsError) throw honorsError;

      const { data: simulations, error: simulationsError } = await supabase
        .from('grade_simulations')
        .select('simulation_type')
        .eq('academic_year_id', academic_year_id);

      if (simulationsError) throw simulationsError;

      return {
        total_honors: honors?.length || 0,
        mentions_distribution: {
          'Très Bien': honors?.filter(h => h.honor_level === 'Très Bien').length || 0,
          'Bien': honors?.filter(h => h.honor_level === 'Bien').length || 0,
          'Assez Bien': honors?.filter(h => h.honor_level === 'Assez Bien').length || 0
        },
        total_simulations: simulations?.length || 0,
        simulation_types: {
          what_if: simulations?.filter(s => s.simulation_type === 'what_if').length || 0,
          projection: simulations?.filter(s => s.simulation_type === 'projection').length || 0,
          scenario: simulations?.filter(s => s.simulation_type === 'scenario').length || 0
        }
      };
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Erreur lors du calcul des statistiques');
    }
  };

  return {
    loading,
    error,
    ectsConfigs,
    simulations,
    calculateECTSWithCompensation,
    fetchECTSConfig,
    updateECTSConfig,
    createGradeSimulation,
    fetchSimulations,
    simulateWhatIf,
    calculateAcademicHonors,
    getCalculationStatistics
  };
}