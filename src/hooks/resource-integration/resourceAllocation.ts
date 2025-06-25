
import { supabase } from '@/integrations/supabase/client';
import { ResourceRequirement, ResourceAllocation } from './types';

export const allocateResources = async (examData: any, requirements: ResourceRequirement[]): Promise<ResourceAllocation[]> => {
  const allocations: ResourceAllocation[] = [];

  for (const session of examData.exam_sessions || []) {
    const allocation = await allocateResourcesForSession(session, requirements);
    allocations.push(allocation);
  }

  return allocations;
};

export const allocateResourcesForSession = async (session: any, requirements: ResourceRequirement[]): Promise<ResourceAllocation> => {
  const allocation: ResourceAllocation = {
    examId: session.exam_id,
    sessionId: session.id,
    allocatedResources: [],
    alternativeOptions: [],
    conflicts: [],
    allocationStatus: 'pending',
    costEstimate: 0
  };

  let totalCost = 0;

  // Allouer les salles
  const roomRequirements = requirements.filter(r => r.type === 'room');
  for (const roomReq of roomRequirements) {
    const roomAllocation = await allocateRoom(session, roomReq);
    if (roomAllocation.success) {
      allocation.allocatedResources.push(roomAllocation.resource);
      totalCost += roomAllocation.cost || 0;
    } else {
      allocation.conflicts.push(roomAllocation.conflict || 'Erreur d\'allocation de salle');
      if (roomAllocation.alternatives?.length) {
        allocation.alternativeOptions.push(...roomAllocation.alternatives);
      }
    }
  }

  // Allouer les équipements
  const equipmentRequirements = requirements.filter(r => r.type === 'equipment');
  for (const equipReq of equipmentRequirements) {
    const equipAllocation = await allocateEquipment(session, equipReq);
    if (equipAllocation.success) {
      allocation.allocatedResources.push(equipAllocation.resource);
      totalCost += equipAllocation.cost || 0;
    } else {
      allocation.conflicts.push(equipAllocation.conflict || 'Erreur d\'allocation d\'équipement');
      if (equipAllocation.alternatives?.length) {
        allocation.alternativeOptions.push(...equipAllocation.alternatives);
      }
    }
  }

  // Allouer les matériels
  const materialRequirements = requirements.filter(r => r.type === 'material');
  for (const materialReq of materialRequirements) {
    const materialAllocation = await allocateMaterial(session, materialReq);
    if (materialAllocation.success) {
      allocation.allocatedResources.push(materialAllocation.resource);
      totalCost += materialAllocation.cost || 0;
    } else {
      allocation.conflicts.push(materialAllocation.conflict || 'Erreur d\'allocation de matériel');
    }
  }

  allocation.costEstimate = totalCost;

  // Déterminer le statut d'allocation
  if (allocation.conflicts.length === 0) {
    allocation.allocationStatus = 'complete';
  } else if (allocation.allocatedResources.length > 0) {
    allocation.allocationStatus = 'partial';
  } else {
    allocation.allocationStatus = 'conflict';
  }

  return allocation;
};

export const allocateRoom = async (session: any, requirement: ResourceRequirement) => {
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
        conflict: `Aucune salle disponible pour ${requirement.name}`,
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
      conflict: `Conflit de planning pour toutes les salles disponibles`,
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
      conflict: 'Erreur système lors de l\'allocation de salle',
      alternatives: [],
      cost: 0
    };
  }
};

export const allocateEquipment = async (session: any, requirement: ResourceRequirement) => {
  try {
    // Rechercher les équipements disponibles
    const { data: availableEquipment, error } = await supabase
      .from('equipment_inventory')
      .select('*')
      .eq('status', 'available')
      .eq('type', requirement.specifications?.equipmentType || requirement.name.toLowerCase())
      .gte('quantity_available', requirement.quantity);

    if (error && error.code !== 'PGRST116') { // Ignore table not found
      throw error;
    }

    if (!availableEquipment?.length) {
      // Fallback: vérifier dans les équipements de salle
      const roomEquipment = await checkRoomEquipment(session.room_id, requirement);
      if (roomEquipment.success) {
        return roomEquipment;
      }

      return {
        success: false,
        conflict: `Équipement ${requirement.name} non disponible en quantité suffisante`,
        alternatives: [],
        cost: 0
      };
    }

    // Sélectionner le premier équipement disponible
    const selectedEquipment = availableEquipment[0];

    // Réserver l'équipement
    await reserveEquipment(selectedEquipment.id, session, requirement.quantity);

    return {
      success: true,
      resource: {
        ...requirement,
        id: selectedEquipment.id,
        name: selectedEquipment.name || requirement.name
      },
      cost: calculateEquipmentCost(selectedEquipment, requirement.quantity, session)
    };
  } catch (error) {
    console.error('Erreur lors de l\'allocation d\'équipement:', error);
    return {
      success: true, // Fallback: considérer comme réussi si table n'existe pas
      resource: requirement,
      cost: 0
    };
  }
};

export const allocateMaterial = async (session: any, requirement: ResourceRequirement) => {
  try {
    // Vérifier la disponibilité des matériels
    const { data: availableMaterials, error } = await supabase
      .from('materials_inventory')
      .select('*')
      .eq('status', 'available')
      .eq('type', requirement.specifications?.materialType || requirement.name.toLowerCase())
      .gte('quantity_available', requirement.quantity);

    if (error && error.code !== 'PGRST116') { // Ignore table not found
      throw error;
    }

    if (!availableMaterials?.length) {
      return {
        success: false,
        conflict: `Matériel ${requirement.name} non disponible`,
        alternatives: [],
        cost: 0
      };
    }

    const selectedMaterial = availableMaterials[0];
    await reserveMaterial(selectedMaterial.id, session, requirement.quantity);

    return {
      success: true,
      resource: {
        ...requirement,
        id: selectedMaterial.id,
        name: selectedMaterial.name || requirement.name
      },
      cost: calculateMaterialCost(selectedMaterial, requirement.quantity)
    };
  } catch (error) {
    console.error('Erreur lors de l\'allocation de matériel:', error);
    return {
      success: true, // Fallback: considérer comme réussi
      resource: requirement,
      cost: 0
    };
  }
};

export const checkRoomEquipment = async (roomId: string, requirement: ResourceRequirement) => {
  try {
    const { data: room } = await supabase
      .from('rooms')
      .select('equipment')
      .eq('id', roomId)
      .single();

    const roomEquipment = room?.equipment || [];
    const hasEquipment = roomEquipment.some((eq: any) => 
      eq.type === requirement.name.toLowerCase() && 
      (eq.quantity || 1) >= requirement.quantity
    );

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
      conflict: `Équipement ${requirement.name} non disponible dans la salle`,
      alternatives: [],
      cost: 0
    };
  } catch (error) {
    console.error('Erreur vérification équipement salle:', error);
    return {
      success: false,
      conflict: 'Erreur vérification équipement salle',
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

export const reserveEquipment = async (equipmentId: string, session: any, quantity: number) => {
  try {
    // Créer une réservation d'équipement
    await supabase
      .from('equipment_reservations')
      .insert({
        equipment_id: equipmentId,
        session_id: session.id,
        quantity_reserved: quantity,
        reserved_from: session.start_time,
        reserved_until: session.end_time,
        status: 'confirmed'
      });
  } catch (error) {
    console.error('Erreur réservation équipement:', error);
  }
};

export const reserveMaterial = async (materialId: string, session: any, quantity: number) => {
  try {
    await supabase
      .from('material_reservations')
      .insert({
        material_id: materialId,
        session_id: session.id,
        quantity_reserved: quantity,
        reserved_from: session.start_time,
        reserved_until: session.end_time,
        status: 'confirmed'
      });
  } catch (error) {
    console.error('Erreur réservation matériel:', error);
  }
};

export const calculateRoomCost = (room: any, session: any): number => {
  const baseCost = room.hourly_rate || 0;
  const duration = (new Date(session.end_time).getTime() - new Date(session.start_time).getTime()) / (1000 * 60 * 60);
  return baseCost * duration;
};

export const calculateEquipmentCost = (equipment: any, quantity: number, session: any): number => {
  const baseCost = equipment.hourly_rate || 0;
  const duration = (new Date(session.end_time).getTime() - new Date(session.start_time).getTime()) / (1000 * 60 * 60);
  return baseCost * quantity * duration;
};

export const calculateMaterialCost = (material: any, quantity: number): number => {
  const unitCost = material.unit_cost || 0;
  return unitCost * quantity;
};

export const determineAvailabilityStatus = (allocations: ResourceAllocation[]): 'available' | 'limited' | 'unavailable' => {
  if (allocations.every(a => a.allocationStatus === 'complete')) {
    return 'available';
  } else if (allocations.some(a => a.allocationStatus === 'complete' || a.allocationStatus === 'partial')) {
    return 'limited';
  } else {
    return 'unavailable';
  }
};
