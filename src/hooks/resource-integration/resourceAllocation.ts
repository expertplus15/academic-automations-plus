
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
    allocationStatus: 'pending'
  };

  // Allouer les salles
  const roomRequirements = requirements.filter(r => r.type === 'room');
  for (const roomReq of roomRequirements) {
    const roomAllocation = await allocateRoom(session, roomReq);
    if (roomAllocation.success) {
      allocation.allocatedResources.push(roomAllocation.resource);
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
    } else {
      allocation.conflicts.push(equipAllocation.conflict || 'Erreur d\'allocation d\'équipement');
    }
  }

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
  // Rechercher les salles disponibles
  const { data: availableRooms } = await supabase
    .from('rooms')
    .select('*')
    .eq('status', 'available')
    .gte('capacity', requirement.specifications?.capacity || 30)
    .eq('room_type', getRequiredRoomType(requirement.specifications?.examType));

  if (!availableRooms?.length) {
    return {
      success: false,
      conflict: `Aucune salle disponible pour ${requirement.name}`,
      alternatives: []
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
        }
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
    }))
  };
};

export const allocateEquipment = async (session: any, requirement: ResourceRequirement) => {
  // Logique d'allocation d'équipement
  // À implémenter selon le système de gestion d'équipements
  return {
    success: true,
    resource: requirement,
    conflict: undefined
  };
};

export const getRequiredRoomType = (examType: string): string => {
  switch (examType) {
    case 'practical': return 'laboratory';
    case 'oral': return 'meeting_room';
    default: return 'classroom';
  }
};

export const checkRoomScheduleConflict = async (roomId: string, startTime: string, endTime: string): Promise<boolean> => {
  const { data: conflicts } = await supabase
    .from('exam_sessions')
    .select('*')
    .eq('room_id', roomId)
    .eq('status', 'scheduled')
    .or(`and(start_time.lte.${startTime},end_time.gt.${startTime}),and(start_time.lt.${endTime},end_time.gte.${endTime})`);

  return (conflicts?.length || 0) > 0;
};

export const reserveRoom = async (roomId: string, session: any) => {
  // Mettre à jour la session avec la salle assignée
  await supabase
    .from('exam_sessions')
    .update({ room_id: roomId })
    .eq('id', session.id);
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
