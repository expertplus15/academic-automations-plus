
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ExamRoom {
  id: string;
  name: string;
  code: string;
  capacity: number;
  room_type: string;
  building?: string;
  status: string;
  equipment: any[];
  site_id?: string;
  sites?: {
    name: string;
    code: string;
    campuses?: {
      name: string;
      code: string;
    };
  };
  created_at: string;
  updated_at: string;
}

export interface RoomAvailability {
  room_id: string;
  date: string;
  time_slots: {
    start_time: string;
    end_time: string;
    is_available: boolean;
    exam_id?: string;
    exam_title?: string;
  }[];
}

export function useExamRooms() {
  const [rooms, setRooms] = useState<ExamRoom[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchRooms = async (filters?: {
    minCapacity?: number;
    maxCapacity?: number;
    roomType?: string;
    status?: string;
    hasEquipment?: string[];
  }) => {
    try {
      setLoading(true);
      let query = supabase
        .from('rooms')
        .select(`
          *,
          sites!rooms_site_id_fkey(
            name,
            code,
            campuses!sites_campus_id_fkey(name, code)
          )
        `)
        .order('name');

      if (filters?.minCapacity) {
        query = query.gte('capacity', filters.minCapacity);
      }
      if (filters?.maxCapacity) {
        query = query.lte('capacity', filters.maxCapacity);
      }
      if (filters?.roomType) {
        query = query.eq('room_type', filters.roomType);
      }
      if (filters?.status) {
        query = query.eq('status', filters.status);
      }

      const { data, error } = await query;

      if (error) {
        setError(error.message);
        toast({
          title: 'Erreur',
          description: 'Impossible de charger les salles',
          variant: 'destructive'
        });
      } else {
        let filteredRooms = (data || []).map((room: any) => ({
          ...room,
          equipment: Array.isArray(room.equipment) ? room.equipment : []
        }));
        
        // Filtrage par équipement si spécifié
        if (filters?.hasEquipment && filters.hasEquipment.length > 0) {
          filteredRooms = filteredRooms.filter(room => 
            filters.hasEquipment!.every(equipment => 
              room.equipment && Array.isArray(room.equipment) && room.equipment.includes(equipment)
            )
          );
        }

        setRooms(filteredRooms);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const checkRoomAvailability = async (
    roomId: string, 
    startTime: string, 
    endTime: string
  ): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('exam_sessions')
        .select('id')
        .eq('room_id', roomId)
        .eq('status', 'scheduled')
        .or(`and(start_time.lte.${startTime},end_time.gt.${startTime}),and(start_time.lt.${endTime},end_time.gte.${endTime}),and(start_time.gte.${startTime},end_time.lte.${endTime})`);

      if (error) {
        console.error('Erreur vérification disponibilité:', error);
        return false;
      }

      return (data || []).length === 0;
    } catch (err) {
      console.error('Erreur:', err);
      return false;
    }
  };

  const getRoomUtilization = async (roomId: string, startDate: string, endDate: string) => {
    try {
      const { data, error } = await supabase
        .from('exam_sessions')
        .select('start_time, end_time, exam_id, exams!inner(title)')
        .eq('room_id', roomId)
        .gte('start_time', startDate)
        .lte('end_time', endDate)
        .eq('status', 'scheduled');

      if (error) {
        console.error('Erreur utilisation salle:', error);
        return [];
      }

      return data || [];
    } catch (err) {
      console.error('Erreur:', err);
      return [];
    }
  };

  const createRoom = async (roomData: {
    name: string;
    code: string;
    capacity: number;
    room_type: string;
    building?: string;
    site_id: string;
    equipment?: any[];
    status?: string;
  }) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('rooms')
        .insert({
          ...roomData,
          status: roomData.status || 'available',
          equipment: roomData.equipment || []
        })
        .select()
        .single();

      if (error) {
        setError(error.message);
        toast({
          title: 'Erreur',
          description: 'Impossible de créer la salle',
          variant: 'destructive'
        });
        return null;
      } else {
        toast({
          title: 'Salle créée',
          description: `La salle ${roomData.name} a été créée avec succès`
        });
        await fetchRooms();
        return data;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la création');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateRoom = async (roomId: string, roomData: Partial<ExamRoom>) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('rooms')
        .update(roomData)
        .eq('id', roomId)
        .select()
        .single();

      if (error) {
        setError(error.message);
        toast({
          title: 'Erreur',
          description: 'Impossible de modifier la salle',
          variant: 'destructive'
        });
        return null;
      } else {
        toast({
          title: 'Salle modifiée',
          description: 'La salle a été modifiée avec succès'
        });
        await fetchRooms();
        return data;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la modification');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteRoom = async (roomId: string) => {
    try {
      setLoading(true);
      
      // Vérifier s'il y a des examens programmés dans cette salle
      const { data: sessions, error: checkError } = await supabase
        .from('exam_sessions')
        .select('id')
        .eq('room_id', roomId)
        .in('status', ['scheduled', 'in_progress']);

      if (checkError) {
        throw checkError;
      }

      if (sessions && sessions.length > 0) {
        toast({
          title: 'Suppression impossible',
          description: 'Cette salle a des examens programmés',
          variant: 'destructive'
        });
        return false;
      }

      const { error } = await supabase
        .from('rooms')
        .delete()
        .eq('id', roomId);

      if (error) {
        setError(error.message);
        toast({
          title: 'Erreur',
          description: 'Impossible de supprimer la salle',
          variant: 'destructive'
        });
        return false;
      } else {
        toast({
          title: 'Salle supprimée',
          description: 'La salle a été supprimée avec succès'
        });
        await fetchRooms();
        return true;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression');
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  return {
    rooms,
    loading,
    error,
    fetchRooms,
    checkRoomAvailability,
    getRoomUtilization,
    createRoom,
    updateRoom,
    deleteRoom
  };
}
