
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ExamSlot {
  id: string;
  exam_id: string;
  room_id?: string;
  start_time: string;
  end_time: string;
  date: string;
  status: string;
  conflicts?: string[];
}

export interface PlanningConflict {
  type: 'room' | 'time' | 'supervisor';
  severity: 'low' | 'medium' | 'high';
  description: string;
  affected_exams: string[];
}

export function useIntelligentPlanning() {
  const [loading, setLoading] = useState(false);
  const [conflicts, setConflicts] = useState<PlanningConflict[]>([]);
  const { toast } = useToast();

  const generateAutoPlan = useCallback(async (sessionGroupId: string) => {
    try {
      setLoading(true);
      
      // Récupérer les examens de la session
      const { data: exams, error: examsError } = await supabase
        .from('exams')
        .select('*')
        .eq('session_group_id', sessionGroupId);

      if (examsError) throw examsError;

      // Récupérer les salles disponibles
      const { data: rooms, error: roomsError } = await supabase
        .from('rooms')
        .select('*')
        .eq('status', 'available')
        .gte('capacity', 15);

      if (roomsError) throw roomsError;

      if (!rooms || rooms.length === 0) {
        throw new Error('Aucune salle disponible trouvée');
      }

      // Créneaux de base pour examens
      const timeSlots = [
        { start: '08:00', end: '11:00' },
        { start: '14:00', end: '17:00' }
      ];

      // Générer les sessions d'examen
      const examSessions = [];
      let currentDate = new Date('2024-01-15');
      let roomIndex = 0;
      let timeSlotIndex = 0;

      for (const exam of exams || []) {
        // Déterminer la période selon le titre de l'examen
        const isSemester3 = exam.title.includes('Semestre 3');
        const baseDate = isSemester3 ? new Date('2024-01-15') : new Date('2024-06-01');
        
        // Ajuster la date pour éviter les weekends
        while (baseDate.getDay() === 0 || baseDate.getDay() === 6) {
          baseDate.setDate(baseDate.getDate() + 1);
        }

        const timeSlot = timeSlots[timeSlotIndex % timeSlots.length];
        const room = rooms[roomIndex % rooms.length];
        
        // Calculer end_time basé sur la durée de l'examen
        const startTime = new Date(`${baseDate.toISOString().split('T')[0]}T${timeSlot.start}`);
        const endTime = new Date(startTime.getTime() + exam.duration_minutes * 60000);

        const sessionData = {
          exam_id: exam.id,
          room_id: room.id,
          start_time: startTime.toISOString(),
          end_time: endTime.toISOString(),
          status: 'scheduled'
        };

        examSessions.push(sessionData);

        // Avancer aux créneaux suivants
        timeSlotIndex++;
        if (timeSlotIndex % 2 === 0) {
          roomIndex++;
          baseDate.setDate(baseDate.getDate() + 1);
          // Éviter les weekends
          while (baseDate.getDay() === 0 || baseDate.getDay() === 6) {
            baseDate.setDate(baseDate.getDate() + 1);
          }
        }
      }

      // Insérer les sessions en base
      const { error: insertError } = await supabase
        .from('exam_sessions')
        .insert(examSessions);

      if (insertError) throw insertError;

      // Détecter les conflits
      await detectConflicts(sessionGroupId);

      toast({
        title: 'Planification générée',
        description: `${examSessions.length} examens planifiés automatiquement`
      });

      return examSessions;
    } catch (err) {
      toast({
        title: 'Erreur de planification',
        description: err instanceof Error ? err.message : 'Erreur inconnue',
        variant: 'destructive'
      });
      return [];
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const detectConflicts = useCallback(async (sessionGroupId: string) => {
    try {
      const { data: sessions, error } = await supabase
        .from('exam_sessions')
        .select(`
          *,
          exams!inner(session_group_id, title),
          rooms(name)
        `)
        .eq('exams.session_group_id', sessionGroupId);

      if (error) throw error;

      const detectedConflicts: PlanningConflict[] = [];
      
      // Détecter conflits de salles
      const roomConflicts = new Map();
      sessions?.forEach(session => {
        const key = `${session.room_id}-${session.start_time}`;
        if (!roomConflicts.has(key)) {
          roomConflicts.set(key, []);
        }
        roomConflicts.get(key).push(session);
      });

      roomConflicts.forEach((conflictingSessions, key) => {
        if (conflictingSessions.length > 1) {
          detectedConflicts.push({
            type: 'room',
            severity: 'high',
            description: `Conflit de salle : ${conflictingSessions[0].rooms?.name}`,
            affected_exams: conflictingSessions.map((s: any) => s.exams.title)
          });
        }
      });

      setConflicts(detectedConflicts);
      return detectedConflicts;
    } catch (err) {
      console.error('Erreur détection conflits:', err);
      return [];
    }
  }, []);

  const updateExamSession = useCallback(async (
    sessionId: string, 
    updates: Partial<ExamSlot>
  ) => {
    try {
      const { error } = await supabase
        .from('exam_sessions')
        .update(updates)
        .eq('id', sessionId);

      if (error) throw error;

      toast({
        title: 'Session mise à jour',
        description: 'La planification a été modifiée avec succès'
      });

      return true;
    } catch (err) {
      toast({
        title: 'Erreur de mise à jour',
        description: err instanceof Error ? err.message : 'Erreur inconnue',
        variant: 'destructive'
      });
      return false;
    }
  }, [toast]);

  return {
    loading,
    conflicts,
    generateAutoPlan,
    detectConflicts,
    updateExamSession
  };
}
