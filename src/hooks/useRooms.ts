
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Room {
  id: string;
  name: string;
  code: string;
  capacity: number;
  room_type: string;
  building?: string;
  status: string;
  equipment: any;
}

export function useRooms() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('rooms')
          .select('id, name, code, capacity, room_type, building, status, equipment')
          .eq('status', 'available')
          .order('name');

        if (error) {
          setError(error.message);
        } else {
          setRooms(data || []);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  return { rooms, loading, error };
}
