
import { ResourceRequirement, ResourceAllocation, AllocationResult } from './types';
import { allocateRoom } from './roomAllocation';
import { allocateEquipment } from './equipmentAllocation';
import { allocateMaterial } from './materialAllocation';

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
      allocation.allocatedResources.push(roomAllocation.resource!);
      totalCost += roomAllocation.cost || 0;
    } else {
      const errorMsg = roomAllocation.error || 'Erreur d\'allocation de salle';
      allocation.conflicts.push(errorMsg);
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
      allocation.allocatedResources.push(equipAllocation.resource!);
      totalCost += equipAllocation.cost || 0;
    } else {
      const errorMsg = equipAllocation.error || 'Erreur d\'allocation d\'équipement';
      allocation.conflicts.push(errorMsg);
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
      allocation.allocatedResources.push(materialAllocation.resource!);
      totalCost += materialAllocation.cost || 0;
    } else {
      const errorMsg = materialAllocation.error || 'Erreur d\'allocation de matériel';
      allocation.conflicts.push(errorMsg);
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

export const determineAvailabilityStatus = (allocations: ResourceAllocation[]): 'available' | 'limited' | 'unavailable' => {
  if (allocations.every(a => a.allocationStatus === 'complete')) {
    return 'available';
  } else if (allocations.some(a => a.allocationStatus === 'complete' || a.allocationStatus === 'partial')) {
    return 'limited';
  } else {
    return 'unavailable';
  }
};
