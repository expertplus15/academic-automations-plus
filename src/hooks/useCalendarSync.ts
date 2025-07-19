import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface CalendarEvent {
  id: string;
  type: 'exam' | 'grade_entry' | 'validation' | 'convocation';
  title: string;
  date: string;
  time?: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'overdue';
  relatedId: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  metadata: any;
}

export interface SyncPeriod {
  examDate: string;
  gradeEntryStart: string;
  gradeEntryEnd: string;
  validationDeadline: string;
  documentGeneration: string;
  convocationDate: string;
}

export function useCalendarSync() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Calculer automatiquement les périodes de saisie basées sur les dates d'examens
  const calculateSyncPeriods = useCallback((examDate: string): SyncPeriod => {
    const exam = new Date(examDate);
    
    return {
      examDate: examDate,
      gradeEntryStart: new Date(exam.getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0], // J+1
      gradeEntryEnd: new Date(exam.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // J+7
      validationDeadline: new Date(exam.getTime() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // J+10
      documentGeneration: new Date(exam.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // J+14
      convocationDate: new Date(exam.getTime() - 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // J-15
    };
  }, []);

  // Charger tous les événements du calendrier académique
  const loadCalendarEvents = useCallback(async () => {
    setLoading(true);
    try {
      // Récupérer les sessions d'examens
      const { data: examSessions, error: examError } = await supabase
        .from('exam_sessions')
        .select(`
          id,
          start_time,
          end_time,
          status,
          exams!inner(
            id,
            title,
            subject_id,
            academic_year_id
          )
        `)
        .order('start_time', { ascending: true });

      if (examError) throw examError;

      const calendarEvents: CalendarEvent[] = [];

      // Créer les événements pour chaque session d'examen
      for (const session of examSessions || []) {
        const examDate = session.start_time.split('T')[0];
        const periods = calculateSyncPeriods(examDate);

        // Événement d'examen
        calendarEvents.push({
          id: `exam-${session.id}`,
          type: 'exam',
          title: `Examen: ${session.exams.title}`,
          date: examDate,
          time: session.start_time.split('T')[1]?.substring(0, 5),
          status: session.status === 'completed' ? 'completed' : 
                  new Date(session.start_time) < new Date() ? 'in_progress' : 'scheduled',
          relatedId: session.id,
          priority: 'high',
          metadata: { sessionId: session.id, examId: session.exams.id }
        });

        // Période de saisie des notes
        const gradeEntryStatus = await checkGradeEntryStatus(session.exams.subject_id, session.exams.academic_year_id);
        calendarEvents.push({
          id: `grade-entry-${session.id}`,
          type: 'grade_entry',
          title: `Saisie notes: ${session.exams.title}`,
          date: periods.gradeEntryStart,
          status: gradeEntryStatus,
          relatedId: session.id,
          priority: gradeEntryStatus === 'overdue' ? 'critical' : 'medium',
          metadata: { 
            sessionId: session.id, 
            endDate: periods.gradeEntryEnd,
            subjectId: session.exams.subject_id 
          }
        });

        // Validation des notes
        const validationStatus = await checkValidationStatus(session.exams.subject_id, session.exams.academic_year_id);
        calendarEvents.push({
          id: `validation-${session.id}`,
          type: 'validation',
          title: `Validation: ${session.exams.title}`,
          date: periods.validationDeadline,
          status: validationStatus,
          relatedId: session.id,
          priority: validationStatus === 'overdue' ? 'critical' : 'medium',
          metadata: { sessionId: session.id, subjectId: session.exams.subject_id }
        });

        // Génération de documents
        calendarEvents.push({
          id: `document-${session.id}`,
          type: 'convocation',
          title: `Documents: ${session.exams.title}`,
          date: periods.documentGeneration,
          status: 'scheduled',
          relatedId: session.id,
          priority: 'low',
          metadata: { sessionId: session.id }
        });
      }

      setEvents(calendarEvents);
    } catch (error) {
      console.error('Error loading calendar events:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger le calendrier académique",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [calculateSyncPeriods, toast]);

  // Vérifier le statut de la saisie des notes
  const checkGradeEntryStatus = async (subjectId: string, academicYearId: string) => {
    const { data } = await supabase
      .from('student_grades')
      .select('id, is_published')
      .eq('subject_id', subjectId)
      .eq('academic_year_id', academicYearId);

    if (!data || data.length === 0) return 'scheduled';
    if (data.some(grade => !grade.is_published)) return 'in_progress';
    return 'completed';
  };

  // Vérifier le statut de validation
  const checkValidationStatus = async (subjectId: string, academicYearId: string) => {
    const { data } = await supabase
      .from('student_grades')
      .select('id, is_published')
      .eq('subject_id', subjectId)
      .eq('academic_year_id', academicYearId)
      .eq('is_published', true);

    return data && data.length > 0 ? 'completed' : 'scheduled';
  };

  // Déclencher automatiquement les actions basées sur les dates
  const triggerAutomaticActions = useCallback(async () => {
    const today = new Date().toISOString().split('T')[0];
    const todayEvents = events.filter(event => event.date === today);

    for (const event of todayEvents) {
      if (event.type === 'grade_entry' && event.status === 'scheduled') {
        // Déclencher notification de saisie
        await createNotification({
          type: 'grade_entry_reminder',
          title: 'Saisie de notes requise',
          message: `La période de saisie pour "${event.title}" commence aujourd'hui`,
          severity: 'info',
          related_entity_id: event.relatedId,
          related_entity_type: 'exam_session'
        });
      }

      if (event.type === 'validation' && event.status === 'scheduled') {
        // Déclencher notification de validation
        await createNotification({
          type: 'validation_deadline',
          title: 'Validation requise',
          message: `Validation des notes requise pour "${event.title}"`,
          severity: 'warning',
          related_entity_id: event.relatedId,
          related_entity_type: 'exam_session'
        });
      }
    }
  }, [events]);

  // Créer une notification
  const createNotification = async (notificationData: any) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .insert(notificationData);

      if (error) throw error;
    } catch (error) {
      console.error('Error creating notification:', error);
    }
  };

  return {
    events,
    loading,
    loadCalendarEvents,
    calculateSyncPeriods,
    triggerAutomaticActions
  };
}