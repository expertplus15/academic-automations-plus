import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface AcademicStats {
  programs: number;
  specializations: number; 
  levels: number;
  classes: number;
  subjects: number;
  departments: number;
}

export function useAcademicStats() {
  const [stats, setStats] = useState<AcademicStats>({
    programs: 0,
    specializations: 0,
    levels: 0,
    classes: 0,
    subjects: 0,
    departments: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('🔍 [DEBUG] Fetching academic statistics...');

      // Utiliser la nouvelle fonction SQL pour les statistiques
      const { data, error } = await supabase.rpc('get_academic_stats');

      if (error) {
        console.warn('⚠️ [DEBUG] RPC function failed, using fallback method:', error);
        throw error;
      }

      const statsData = (data as any) || {};
      
      const newStats = {
        programs: Number(statsData.programs) || 0,
        specializations: Number(statsData.specializations) || 0,
        levels: Number(statsData.levels) || 0,
        classes: Number(statsData.classes) || 0,
        subjects: Number(statsData.subjects) || 0,
        departments: Number(statsData.departments) || 0
      };

      console.log('✅ [DEBUG] Academic statistics loaded (RPC):', newStats);
      setStats(newStats);

    } catch (err) {
      console.warn('⚠️ [DEBUG] RPC failed, falling back to individual queries...', err);
      
      try {
        // Fallback vers l'ancienne méthode si la fonction RPC échoue
        const [
          programsResult,
          specializationsResult,
          levelsResult,
          classesResult,
          subjectsResult,
          departmentsResult
        ] = await Promise.all([
          supabase.from('programs').select('id', { count: 'exact', head: true }),
          supabase.from('specializations').select('id', { count: 'exact', head: true }),
          supabase.from('academic_levels').select('id', { count: 'exact', head: true }),
          supabase.from('class_groups').select('id', { count: 'exact', head: true }),
          supabase.from('subjects').select('id', { count: 'exact', head: true }),
          supabase.from('departments').select('id', { count: 'exact', head: true })
        ]);

        // Check for errors
        const errors = [
          programsResult.error,
          specializationsResult.error,
          levelsResult.error,
          classesResult.error,
          subjectsResult.error,
          departmentsResult.error
        ].filter(Boolean);

        if (errors.length > 0) {
          throw new Error(`Erreur lors du chargement des statistiques: ${errors[0]?.message}`);
        }

        const newStats = {
          programs: programsResult.count || 0,
          specializations: specializationsResult.count || 0,
          levels: levelsResult.count || 0,
          classes: classesResult.count || 0,
          subjects: subjectsResult.count || 0,
          departments: departmentsResult.count || 0
        };

        console.log('✅ [DEBUG] Academic statistics loaded (fallback):', newStats);
        setStats(newStats);

      } catch (fallbackErr) {
        const message = fallbackErr instanceof Error ? fallbackErr.message : 'Erreur lors du chargement des statistiques';
        console.error('❌ [DEBUG] Stats loading error (both methods failed):', fallbackErr);
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return { stats, loading, error, refetch: fetchStats };
}