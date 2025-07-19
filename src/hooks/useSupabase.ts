
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useTable(tableName: string, select = '*', filters?: Record<string, any>) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  console.log(`🔍 [DIAGNOSTIC] useTable called for: ${tableName}`, { select, filters });

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log(`🔄 [DIAGNOSTIC] Fetching ${tableName}...`);
      
      let query = supabase.from(tableName).select(select);
      
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          query = query.eq(key, value);
        });
      }
      
      const { data: result, error: fetchError } = await query;
      
      console.log(`📊 [DIAGNOSTIC] Query result for ${tableName}:`, {
        success: !fetchError,
        dataCount: result?.length || 0,
        error: fetchError,
        sampleData: result?.[0]
      });

      if (fetchError) {
        console.error(`❌ [DIAGNOSTIC] Error fetching ${tableName}:`, fetchError);
        throw fetchError;
      }

      setData(result || []);
    } catch (err) {
      console.error(`❌ [DIAGNOSTIC] Exception in useTable for ${tableName}:`, err);
      setError(err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [tableName, select, JSON.stringify(filters)]);

  return { data, loading, error, refetch: fetchData };
}
