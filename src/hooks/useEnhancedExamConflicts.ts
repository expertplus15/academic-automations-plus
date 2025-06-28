
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ConflictDetectionResult {
  conflicts: any[];
  criticalCount: number;
  highCount: number;
  autoResolvableCount: number;
  recommendations: string[];
}

export function useEnhancedExamConflicts() {
  const [loading, setLoading] = useState(false);
  const [lastDetection, setLastDetection] = useState<Date | null>(null);
  const { toast } = useToast();

  const detectConflictsWithAI = useCallback(async (
    academicYearId?: string
  ): Promise<ConflictDetectionResult> => {
    setLoading(true);
    const startTime = performance.now();

    try {
      // Call the enhanced detection function
      const { data: conflicts, error } = await supabase
        .rpc('detect_exam_conflicts', { 
          p_academic_year_id: academicYearId || null 
        });

      if (error) throw error;

      const conflictArray = conflicts || [];
      const criticalCount = conflictArray.filter(c => c.severity === 'critical').length;
      const highCount = conflictArray.filter(c => c.severity === 'high').length;
      const autoResolvableCount = conflictArray.filter(c => c.auto_resolvable).length;

      // Generate AI-powered recommendations
      const recommendations = generateSmartRecommendations(conflictArray);

      const detectionTime = performance.now() - startTime;
      console.log(`🧠 AI Conflict detection completed in ${detectionTime.toFixed(2)}ms`);

      setLastDetection(new Date());

      // Smart notifications based on severity
      if (criticalCount > 0) {
        toast({
          title: "⚠️ Conflits Critiques Détectés",
          description: `${criticalCount} conflit(s) critique(s) nécessitent une résolution immédiate`,
          variant: "destructive",
        });
      } else if (highCount > 0) {
        toast({
          title: "🔍 Conflits Détectés",
          description: `${highCount} conflit(s) de priorité élevée trouvé(s)`,
        });
      } else {
        toast({
          title: "✅ Aucun Conflit",
          description: "Planification optimale détectée",
        });
      }

      return {
        conflicts: conflictArray,
        criticalCount,
        highCount,
        autoResolvableCount,
        recommendations
      };
    } catch (error) {
      console.error('Enhanced conflict detection error:', error);
      toast({
        title: "Erreur de Détection",
        description: "Impossible d'analyser les conflits",
        variant: "destructive",
      });
      
      return {
        conflicts: [],
        criticalCount: 0,
        highCount: 0,
        autoResolvableCount: 0,
        recommendations: []
      };
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const autoResolveConflicts = useCallback(async (conflictIds: string[]) => {
    setLoading(true);
    let resolvedCount = 0;

    try {
      for (const conflictId of conflictIds) {
        // Get conflict details
        const { data: conflict } = await supabase
          .from('exam_conflicts')
          .select('*')
          .eq('id', conflictId)
          .single();

        if (!conflict || !conflict.auto_resolvable) continue;

        // Apply auto-resolution based on conflict type
        const resolved = await applyAutoResolution(conflict);
        if (resolved) {
          // Mark as resolved
          await supabase
            .from('exam_conflicts')
            .update({
              resolution_status: 'resolved',
              resolved_at: new Date().toISOString(),
              resolved_by: 'system',
              resolution_notes: 'Résolution automatique par IA'
            })
            .eq('id', conflictId);
          
          resolvedCount++;
        }
      }

      toast({
        title: "🤖 Résolution Automatique",
        description: `${resolvedCount} conflit(s) résolu(s) automatiquement`,
      });

      return resolvedCount;
    } catch (error) {
      console.error('Auto-resolution error:', error);
      toast({
        title: "Erreur de Résolution",
        description: "Impossible de résoudre automatiquement",
        variant: "destructive",
      });
      return 0;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  return {
    detectConflictsWithAI,
    autoResolveConflicts,
    loading,
    lastDetection
  };
}

function generateSmartRecommendations(conflicts: any[]): string[] {
  const recommendations: string[] = [];
  
  const roomConflicts = conflicts.filter(c => c.conflict_type === 'room_overlap');
  const supervisorConflicts = conflicts.filter(c => c.conflict_type === 'supervisor_overlap');
  const capacityConflicts = conflicts.filter(c => c.conflict_type === 'capacity_exceeded');

  if (roomConflicts.length > 0) {
    recommendations.push(`🏢 ${roomConflicts.length} conflit(s) de salle - Considérez l'ajout de salles supplémentaires ou la modification des horaires`);
  }

  if (supervisorConflicts.length > 0) {
    recommendations.push(`👨‍🏫 ${supervisorConflicts.length} conflit(s) de surveillant - Assignez des surveillants supplémentaires ou réorganisez les créneaux`);
  }

  if (capacityConflicts.length > 0) {
    recommendations.push(`📊 ${capacityConflicts.length} dépassement(s) de capacité - Utilisez des salles plus grandes ou divisez les groupes`);
  }

  // Smart scheduling recommendations
  if (conflicts.length > 5) {
    recommendations.push("🧠 Recommandation IA: Relancez la génération automatique avec des paramètres optimisés");
  }

  return recommendations;
}

async function applyAutoResolution(conflict: any): Promise<boolean> {
  try {
    switch (conflict.conflict_type) {
      case 'room_overlap':
        return await resolveRoomConflict(conflict);
      case 'supervisor_overlap':
        return await resolveSupervisorConflict(conflict);
      case 'capacity_exceeded':
        return await resolveCapacityConflict(conflict);
      default:
        return false;
    }
  } catch (error) {
    console.error('Resolution error for conflict:', conflict.id, error);
    return false;
  }
}

async function resolveRoomConflict(conflict: any): Promise<boolean> {
  // Find alternative rooms
  const affectedSessions = conflict.affected_sessions || [];
  
  for (const sessionData of affectedSessions) {
    // Find available rooms with similar capacity
    const { data: alternativeRooms } = await supabase
      .from('rooms')
      .select('*')
      .eq('status', 'available')
      .gte('capacity', sessionData.required_capacity || 30)
      .limit(5);

    if (alternativeRooms && alternativeRooms.length > 0) {
      // Assign first available room
      await supabase
        .from('exam_sessions')
        .update({ room_id: alternativeRooms[0].id })
        .eq('id', sessionData.session_id);
      
      return true;
    }
  }
  
  return false;
}

async function resolveSupervisorConflict(conflict: any): Promise<boolean> {
  // Find alternative supervisors
  const { data: availableTeachers } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', 'teacher')
    .limit(10);

  if (availableTeachers && availableTeachers.length > 0) {
    const affectedSessions = conflict.affected_sessions || [];
    
    for (const sessionData of affectedSessions) {
      // Assign alternative supervisor
      await supabase
        .from('exam_supervisors')
        .insert({
          session_id: sessionData.session_id,
          teacher_id: availableTeachers[0].id,
          supervisor_role: 'secondary',
          status: 'assigned'
        });
    }
    
    return true;
  }
  
  return false;
}

async function resolveCapacityConflict(conflict: any): Promise<boolean> {
  // Find larger rooms
  const affectedData = conflict.affected_data;
  const requiredCapacity = affectedData?.registered_students || 50;
  
  const { data: largerRooms } = await supabase
    .from('rooms')
    .select('*')
    .eq('status', 'available')
    .gte('capacity', requiredCapacity + 10)
    .limit(3);

  if (largerRooms && largerRooms.length > 0) {
    await supabase
      .from('exam_sessions')
      .update({ room_id: largerRooms[0].id })
      .eq('id', affectedData.session_id);
    
    return true;
  }
  
  return false;
}
