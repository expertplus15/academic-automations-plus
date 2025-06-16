
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useScheduleGeneration } from './useScheduleGeneration';

export interface ConflictAlert {
  id: string;
  type: 'room_overlap' | 'teacher_overlap' | 'student_overlap';
  severity: 'low' | 'medium' | 'high';
  message: string;
  affectedSlots: string[];
  timestamp: Date;
}

export function useConflictDetection(academicYearId?: string) {
  const [conflicts, setConflicts] = useState<ConflictAlert[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const { detectConflicts } = useScheduleGeneration();

  const checkForConflicts = useCallback(async () => {
    if (!academicYearId) return;

    try {
      await detectConflicts(academicYearId);
      
      // Simuler la détection de conflits pour la démo
      // En production, cette logique serait dans detectConflicts
      const mockConflicts: ConflictAlert[] = [
        {
          id: '1',
          type: 'room_overlap',
          severity: 'high',
          message: 'Salle A101 réservée simultanément pour 2 cours',
          affectedSlots: ['slot1', 'slot2'],
          timestamp: new Date()
        }
      ];

      // Simuler des conflits aléatoirement pour la démo
      if (Math.random() > 0.8) {
        setConflicts(mockConflicts);
      } else {
        setConflicts([]);
      }
    } catch (error) {
      console.error('Erreur lors de la détection des conflits:', error);
    }
  }, [academicYearId, detectConflicts]);

  const startMonitoring = useCallback(() => {
    setIsMonitoring(true);
    checkForConflicts();
    
    // Vérifier les conflits toutes les 30 secondes
    const interval = setInterval(checkForConflicts, 30000);
    
    return () => {
      clearInterval(interval);
      setIsMonitoring(false);
    };
  }, [checkForConflicts]);

  const resolveConflict = useCallback((conflictId: string) => {
    setConflicts(prev => prev.filter(c => c.id !== conflictId));
  }, []);

  const clearAllConflicts = useCallback(() => {
    setConflicts([]);
  }, []);

  // Écouter les changements en temps réel sur la table timetables
  useEffect(() => {
    if (!academicYearId) return;

    const channel = supabase
      .channel('timetable_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'timetables'
        },
        () => {
          // Revérifier les conflits quand la table change
          checkForConflicts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [academicYearId, checkForConflicts]);

  return {
    conflicts,
    isMonitoring,
    startMonitoring,
    checkForConflicts,
    resolveConflict,
    clearAllConflicts
  };
}
