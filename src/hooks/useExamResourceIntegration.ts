
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useModuleSync } from './useModuleSync';
import { useErrorHandler } from './useErrorHandler';

export interface ResourceRequirement {
  type: 'room' | 'equipment' | 'material';
  id: string;
  name: string;
  quantity: number;
  priority: 'required' | 'preferred' | 'optional';
  specifications?: Record<string, any>;
}

export interface ResourceAllocation {
  examId: string;
  sessionId: string;
  allocatedResources: ResourceRequirement[];
  alternativeOptions: ResourceRequirement[];
  conflicts: string[];
  allocationStatus: 'pending' | 'partial' | 'complete' | 'conflict';
  costEstimate?: number;
}

export interface ExamResourceSync {
  examId: string;
  resourceRequirements: ResourceRequirement[];
  allocations: ResourceAllocation[];
  availabilityStatus: 'available' | 'limited' | 'unavailable';
  syncStatus: 'pending' | 'synced' | 'conflict' | 'error';
  lastSyncAt?: Date;
}

export function useExamResourceIntegration() {
  const [integrationData, setIntegrationData] = useState<ExamResourceSync[]>([]);
  const [loading, setLoading] = useState(false);
  const { publishEvent } = useModuleSync();
  const { handleError } = useErrorHandler();

  const syncExamWithResources = useCallback(async (examId: string) => {
    try {
      setLoading(true);

      // Récupérer les données de l'examen
      const { data: examData, error: examError } = await supabase
        .from('exams')
        .select(`
          *,
          exam_sessions(*),
          subjects(*)
        `)
        .eq('id', examId)
        .single();

      if (examError) throw examError;

      // Analyser les besoins en ressources
      const resourceRequirements = await analyzeResourceRequirements(examData);
      
      // Allouer les ressources pour chaque session
      const allocations = await allocateResources(examData, resourceRequirements);
      
      // Vérifier la disponibilité globale
      const availabilityStatus = determineAvailabilityStatus(allocations);

      // Publier l'événement de synchronisation
      await publishEvent('exams', 'resource_sync_completed', {
        examId,
        resourceRequirements,
        allocations,
        availabilityStatus,
        timestamp: new Date()
      });

      // Mettre à jour l'état local
      const syncData: ExamResourceSync = {
        examId,
        resourceRequirements,
        allocations,
        availabilityStatus,
        syncStatus: allocations.some(a => a.allocationStatus === 'conflict') ? 'conflict' : 'synced',
        lastSyncAt: new Date()
      };

      setIntegrationData(prev => {
        const existing = prev.find(item => item.examId === examId);
        if (existing) {
          return prev.map(item => item.examId === examId ? syncData : item);
        } else {
          return [...prev, syncData];
        }
      });

      return { success: true, syncData };
    } catch (error) {
      handleError(error, { context: 'Exam Resource Integration' });
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  }, [publishEvent, handleError]);

  const analyzeResourceRequirements = async (examData: any): Promise<ResourceRequirement[]> => {
    const requirements: ResourceRequirement[] = [];

    // Besoins en salles basés sur le nombre d'étudiants
    const { data: registrations } = await supabase
      .from('exam_registrations')
      .select('*')
      .eq('exam_id', examData.id)
      .eq('status', 'registered');

    const studentCount = registrations?.length || examData.max_students || 50;
    
    // Calculer le nombre de salles nécessaires
    const roomsNeeded = Math.ceil(studentCount / 30); // 30 étudiants max par salle
    
    for (let i = 0; i < roomsNeeded; i++) {
      requirements.push({
        type: 'room',
        id: `room_${i}`,
        name: `Salle d'examen ${i + 1}`,
        quantity: 1,
        priority: 'required',
        specifications: {
          capacity: Math.min(studentCount - (i * 30), 30),
          examType: examData.exam_type,
          accessibility: true
        }
      });
    }

    // Besoins en équipements basés sur le type d'examen
    const equipmentNeeds = getEquipmentRequirements(examData);
    requirements.push(...equipmentNeeds);

    // Matériels spécifiques à la matière
    const materialNeeds = await getMaterialRequirements(examData);
    requirements.push(...materialNeeds);

    return requirements;
  };

  const getEquipmentRequirements = (examData: any): ResourceRequirement[] => {
    const equipment: ResourceRequirement[] = [];

    // Équipements selon le type d'examen
    switch (examData.exam_type) {
      case 'practical':
        equipment.push({
          type: 'equipment',
          id: 'computers',
          name: 'Ordinateurs',
          quantity: examData.max_students || 30,
          priority: 'required'
        });
        break;
      
      case 'oral':
        equipment.push({
          type: 'equipment',
          id: 'microphones',
          name: 'Microphones',
          quantity: 2,
          priority: 'preferred'
        });
        break;
      
      default:
        // Équipements de base pour examens écrits
        equipment.push({
          type: 'equipment',
          id: 'desks',
          name: 'Tables individuelles',
          quantity: examData.max_students || 30,
          priority: 'required'
        });
    }

    return equipment;
  };

  const getMaterialRequirements = async (examData: any): Promise<ResourceRequirement[]> => {
    const materials: ResourceRequirement[] = [];

    // Récupérer les matériels requis depuis la configuration de l'examen
    const materialsRequired = examData.materials_required;
    if (materialsRequired && Array.isArray(materialsRequired) && materialsRequired.length > 0) {
      for (const material of materialsRequired) {
        materials.push({
          type: 'material',
          id: material.id || material.name.toLowerCase().replace(/\s+/g, '_'),
          name: material.name,
          quantity: material.quantity || 1,
          priority: material.required ? 'required' : 'optional'
        });
      }
    }

    return materials;
  };

  const allocateResources = async (examData: any, requirements: ResourceRequirement[]): Promise<ResourceAllocation[]> => {
    const allocations: ResourceAllocation[] = [];

    for (const session of examData.exam_sessions || []) {
      const allocation = await allocateResourcesForSession(session, requirements);
      allocations.push(allocation);
    }

    return allocations;
  };

  const allocateResourcesForSession = async (session: any, requirements: ResourceRequirement[]): Promise<ResourceAllocation> => {
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

  const allocateRoom = async (session: any, requirement: ResourceRequirement) => {
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

  const allocateEquipment = async (session: any, requirement: ResourceRequirement) => {
    // Logique d'allocation d'équipement
    // À implémenter selon le système de gestion d'équipements
    return {
      success: true,
      resource: requirement,
      conflict: undefined
    };
  };

  const getRequiredRoomType = (examType: string): string => {
    switch (examType) {
      case 'practical': return 'laboratory';
      case 'oral': return 'meeting_room';
      default: return 'classroom';
    }
  };

  const checkRoomScheduleConflict = async (roomId: string, startTime: string, endTime: string): Promise<boolean> => {
    const { data: conflicts } = await supabase
      .from('exam_sessions')
      .select('*')
      .eq('room_id', roomId)
      .eq('status', 'scheduled')
      .or(`and(start_time.lte.${startTime},end_time.gt.${startTime}),and(start_time.lt.${endTime},end_time.gte.${endTime})`);

    return (conflicts?.length || 0) > 0;
  };

  const reserveRoom = async (roomId: string, session: any) => {
    // Mettre à jour la session avec la salle assignée
    await supabase
      .from('exam_sessions')
      .update({ room_id: roomId })
      .eq('id', session.id);
  };

  const determineAvailabilityStatus = (allocations: ResourceAllocation[]): 'available' | 'limited' | 'unavailable' => {
    if (allocations.every(a => a.allocationStatus === 'complete')) {
      return 'available';
    } else if (allocations.some(a => a.allocationStatus === 'complete' || a.allocationStatus === 'partial')) {
      return 'limited';
    } else {
      return 'unavailable';
    }
  };

  const resolveResourceConflict = useCallback(async (examId: string, sessionId: string, resolution: any) => {
    try {
      setLoading(true);
      
      // Appliquer la résolution du conflit
      // Cette logique dépend du type de conflit et de la résolution choisie
      
      // Re-synchroniser après résolution
      await syncExamWithResources(examId);

      await publishEvent('resources', 'conflict_resolved', {
        examId,
        sessionId,
        resolution,
        timestamp: new Date()
      });

    } catch (error) {
      handleError(error, { context: 'Resource Conflict Resolution' });
    } finally {
      setLoading(false);
    }
  }, [syncExamWithResources, publishEvent, handleError]);

  const getIntegrationStatus = useCallback((examId: string) => {
    return integrationData.find(item => item.examId === examId);
  }, [integrationData]);

  return {
    integrationData,
    loading,
    syncExamWithResources,
    resolveResourceConflict,
    getIntegrationStatus
  };
}
