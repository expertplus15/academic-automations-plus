
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface AcademicLevel {
  id: string;
  name: string;
  code: string;
  order_index: number;
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
        console.log('🔍 [LEVELS] Fetching academic levels for program:', programId);
        
        let query = supabase
          .from('academic_levels')
          .select('id, name, code, order_index')
          .order('order_index');

        // Si on a un programme spécifique, on peut filtrer les niveaux
        // Pour DUTGE, on ne garde que les niveaux DUT
        if (programId) {
          const { data: program } = await supabase
            .from('programs')
            .select('code')
            .eq('id', programId)
            .single();
          
          if (program?.code === 'DUTGE') {
            query = query.ilike('code', 'DUT%GE');
          }
        }

        const { data: levels, error } = await query;

        if (error) {
          console.error('❌ [LEVELS] Error fetching levels:', error);
          throw error;
        }
        
        console.log('✅ [LEVELS] Successfully fetched', levels?.length || 0, 'levels');
        setData(levels || []);
      } catch (err) {
        console.error('💥 [LEVELS] Unexpected error:', err);
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
