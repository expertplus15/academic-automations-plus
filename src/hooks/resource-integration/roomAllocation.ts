
import { supabase } from '@/integrations/supabase/client';
import { ResourceRequirement, AllocationResult } from './types';

export const allocateRoom = async (session: any, requirement: ResourceRequirement): Promise<AllocationResult> => {
  try {
    // Rechercher les salles disponibles
    const { data: availableRooms, error } = await supabase
      .from('rooms')
      .select('*')
      .eq('status', 'available')
      .gte('capacity', requirement.specifications?.capacity || 30)
      .eq('room_type', getRequiredRoomType(requirement.specifications?.examType));

    if (error) throw error;

    if (!availableRooms?.length) {
      return {
        success: false,
        error: `Aucune salle disponible pour ${requirement.name}`,
        alternatives: [],
        cost: 0
      };
    }

    // Vérifier les conflits de planning
    for (const room of availableRooms) {
      const hasConflict = await checkRoomScheduleConflict(room.id, session.start_time, session.end_time);
      
      if (!hasConflict) {
        // Réserver la salle
        await reserveRoom(room.id, session);
        
        return {
          success: true,
          resource: {
            ...requirement,
            id: room.id,
            name: room.name
          },
          cost: calculateRoomCost(room, session)
        };
      }
    }

    return {
      success: false,
      error: `Conflit de planning pour toutes les salles disponibles`,
      alternatives: availableRooms.slice(0, 3).map(room => ({
        ...requirement,
        id: room.id,
        name: room.name
      })),
      cost: 0
    };
  } catch (error) {
    console.error('Erreur lors de l\'allocation de salle:', error);
    return {
      success: false,
      error: 'Erreur système lors de l\'allocation de salle',
      alternatives: [],
      cost: 0
    };
  }
};

export const getRequiredRoomType = (examType: string): string => {
  switch (examType) {
    case 'practical': return 'laboratory';
    case 'oral': return 'meeting_room';
    case 'computer': return 'computer_lab';
    default: return 'classroom';
  }
};

export const checkRoomScheduleConflict = async (roomId: string, startTime: string, endTime: string): Promise<boolean> => {
  try {
    const { data: conflicts } = await supabase
      .from('exam_sessions')
      .select('*')
      .eq('room_id', roomId)
      .eq('status', 'scheduled')
      .or(`and(start_time.lte.${startTime},end_time.gt.${startTime}),and(start_time.lt.${endTime},end_time.gte.${endTime})`);

    return (conflicts?.length || 0) > 0;
  } catch (error) {
    console.error('Erreur vérification conflit salle:', error);
    return true; // En cas d'erreur, considérer comme conflit
  }
};

export const reserveRoom = async (roomId: string, session: any) => {
  try {
    await supabase
      .from('exam_sessions')
      .update({ room_id: roomId })
      .eq('id', session.id);
  } catch (error) {
    console.error('Erreur réservation salle:', error);
  }
};

export const calculateRoomCost = (room: any, session: any): number => {
  const baseCost = room.hourly_rate || 0;
  const duration = (new Date(session.end_time).getTime() - new Date(session.start_time).getTime()) / (1000 * 60 * 60);
  return baseCost * duration;
};
