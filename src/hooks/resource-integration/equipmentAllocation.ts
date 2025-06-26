
import { supabase } from '@/integrations/supabase/client';
import { ResourceRequirement, AllocationResult } from './types';

export const allocateEquipment = async (session: any, requirement: ResourceRequirement): Promise<AllocationResult> => {
  try {
    // Fallback: vérifier dans les équipements de salle
    const roomEquipment = await checkRoomEquipment(session.room_id, requirement);
    if (roomEquipment.success) {
      return roomEquipment;
    }

    return {
      success: false,
      error: `Équipement ${requirement.name} non disponible en quantité suffisante`,
      alternatives: [],
      cost: 0
    };
  } catch (error) {
    console.error('Erreur lors de l\'allocation d\'équipement:', error);
    return {
      success: true, // Fallback: considérer comme réussi si erreur système
      resource: requirement,
      cost: 0
    };
  }
};

export const checkRoomEquipment = async (roomId: string, requirement: ResourceRequirement): Promise<AllocationResult> => {
  try {
    const { data: room } = await supabase
      .from('rooms')
      .select('equipment')
      .eq('id', roomId)
      .single();

    const roomEquipment = room?.equipment;
    let hasEquipment = false;

    if (Array.isArray(roomEquipment)) {
      hasEquipment = roomEquipment.some((eq: any) => 
        eq.type === requirement.name.toLowerCase() && 
        (eq.quantity || 1) >= requirement.quantity
      );
    }

    if (hasEquipment) {
      return {
        success: true,
        resource: {
          ...requirement,
          id: `room_${roomId}_${requirement.name}`,
          name: `${requirement.name} (salle)`
        },
        cost: 0 // Équipement de salle gratuit
      };
    }

    return {
      success: false,
      error: `Équipement ${requirement.name} non disponible dans la salle`,
      alternatives: [],
      cost: 0
    };
  } catch (error) {
    console.error('Erreur vérification équipement salle:', error);
    return {
      success: false,
      error: 'Erreur vérification équipement salle',
      alternatives: [],
      cost: 0
    };
  }
};

export const calculateEquipmentCost = (equipment: any, quantity: number, session: any): number => {
  const baseCost = equipment.hourly_rate || 0;
  const duration = (new Date(session.end_time).getTime() - new Date(session.start_time).getTime()) / (1000 * 60 * 60);
  return baseCost * quantity * duration;
};
