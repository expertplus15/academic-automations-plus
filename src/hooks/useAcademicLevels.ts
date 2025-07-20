
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface AcademicLevel {
  id: string;
  name: string;
  code: string;
  order_index: number;
  program_id?: string;
}

export function useAcademicLevels(programId?: string) {
  const [data, setData] = useState<AcademicLevel[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchLevels = async () => {
      setLoading(true);
      setError('');
      
      try {
        console.log('🔍 [ACADEMIC_LEVELS] Fetching levels for program:', programId || 'ALL');
        
        let query = supabase
          .from('academic_levels')
          .select('id, name, code, order_index, program_id')
          .order('order_index');

        // Filtrer par programme si spécifié
        if (programId) {
          query = query.or(`program_id.eq.${programId},program_id.is.null`);
        }

        const { data: levels, error } = await query;

        if (error) {
          console.error('❌ [ACADEMIC_LEVELS] Error fetching levels:', error);
          throw error;
        }
        
        console.log('✅ [ACADEMIC_LEVELS] Successfully fetched', levels?.length || 0, 'levels for program:', programId || 'ALL');
        setData(levels || []);
      } catch (err) {
        console.error('💥 [ACADEMIC_LEVELS] Unexpected error:', err);
        setError('Erreur lors du chargement des niveaux');
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLevels();
  }, [programId]);

  return { data, loading, error };
}
