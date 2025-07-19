import { useState } from 'react';
import { toast } from '@/hooks/use-toast';

// Mock data for convocation scheduling
export interface ConvocationTemplate {
  id: string;
  name: string;
  type: 'written' | 'oral';
  subject: string;
  content: string;
  daysBeforeExam: number;
}

export interface ScheduledConvocation {
  id: string;
  examId: string;
  examName: string;
  studentId: string;
  studentName: string;
  templateId: string;
  scheduledDate: string;
  sentDate?: string;
  status: 'scheduled' | 'sent' | 'delivered' | 'failed';
  type: 'initial' | 'reminder';
}

export const useConvocationScheduler = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mock templates
  const templates: ConvocationTemplate[] = [
    {
      id: '1',
      name: 'Convocation Examen Écrit',
      type: 'written',
      subject: 'Convocation à l\'examen de {{SUBJECT}}',
      content: `Cher(e) {{STUDENT_NAME}},

Vous êtes convoqué(e) à l'examen de {{SUBJECT}} qui aura lieu le {{EXAM_DATE}} à {{EXAM_TIME}}.

Lieu: {{LOCATION}}
Durée: {{DURATION}}
Documents autorisés: {{AUTHORIZED_DOCS}}

Cordialement,
L'équipe pédagogique`,
      daysBeforeExam: 15
    },
    {
      id: '2',
      name: 'Convocation Soutenance Orale',
      type: 'oral',
      subject: 'Convocation à la soutenance de {{SUBJECT}}',
      content: `Cher(e) {{STUDENT_NAME}},

Vous êtes convoqué(e) à la soutenance de {{SUBJECT}} qui aura lieu le {{EXAM_DATE}} à {{EXAM_TIME}}.

Lieu: {{LOCATION}}
Durée: {{DURATION}}
Jury: {{JURY_MEMBERS}}

Merci de vous présenter 15 minutes avant l'heure prévue.

Cordialement,
L'équipe pédagogique`,
      daysBeforeExam: 7
    }
  ];

  // Mock scheduled convocations
  const scheduledConvocations: ScheduledConvocation[] = [
    // Initial convocations for all 13 students × 18 exams = 234 convocations
    // Plus reminders = 468 total scheduled
    ...Array.from({ length: 260 }, (_, i) => ({
      id: `conv-${i + 1}`,
      examId: `exam-${(i % 18) + 1}`,
      examName: ['Droit', 'PEI', 'Mix', 'Calc', 'TQ', 'Info', 'Comm', 'Ang', 'PPP3', 'Fin', 'Prod', 'Strat', 'Nego', 'TCI', 'Ang2', 'PPP4', 'Projet', 'Stage'][i % 18],
      studentId: `student-${(i % 13) + 1}`,
      studentName: `Étudiant ${(i % 13) + 1}`,
      templateId: i % 18 < 8 ? '1' : '2', // First 8 are written, rest are oral
      scheduledDate: new Date(2024, 0, 1 + Math.floor(i / 13)).toISOString(),
      sentDate: Math.random() > 0.4 ? new Date(2024, 0, 1 + Math.floor(i / 13)).toISOString() : undefined,
      status: (Math.random() > 0.4 ? 'sent' : 'scheduled') as 'scheduled' | 'sent' | 'delivered' | 'failed',
      type: (i < 234 ? 'initial' : 'reminder') as 'initial' | 'reminder'
    }))
  ];

  const scheduleConvocations = async (sessionGroupId: string, examIds: string[]) => {
    try {
      setLoading(true);
      setError(null);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      const stats = getConvocationStats();
      
      toast({
        title: "Convocations programmées",
        description: `${stats.total} convocations ont été programmées avec succès.`,
      });

      return { success: true, scheduledCount: stats.total };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la programmation des convocations';
      setError(errorMessage);
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive"
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const sendConvocations = async (convocationIds: string[]) => {
    try {
      setLoading(true);
      setError(null);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      toast({
        title: "Convocations envoyées",
        description: `${convocationIds.length} convocations ont été envoyées avec succès.`,
      });

      return { success: true, sentCount: convocationIds.length };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de l\'envoi des convocations';
      setError(errorMessage);
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive"
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getConvocationStats = () => {
    const total = scheduledConvocations.length;
    const sent = scheduledConvocations.filter(c => c.status === 'sent').length;
    const scheduled = scheduledConvocations.filter(c => c.status === 'scheduled').length;
    const delivered = scheduledConvocations.filter(c => c.status === 'delivered').length;
    const failed = scheduledConvocations.filter(c => c.status === 'failed').length;
    const reminders = scheduledConvocations.filter(c => c.type === 'reminder').length;
    const initial = scheduledConvocations.filter(c => c.type === 'initial').length;

    return {
      total,
      sent,
      scheduled,
      delivered,
      failed,
      reminders,
      initial,
      successRate: total > 0 ? Math.round((delivered / total) * 100) : 0,
      pendingReminders: scheduledConvocations.filter(c => c.type === 'reminder' && c.status === 'scheduled').length
    };
  };

  const getConvocationsByExam = (examId: string) => {
    return scheduledConvocations.filter(c => c.examId === examId);
  };

  const getConvocationsByStudent = (studentId: string) => {
    return scheduledConvocations.filter(c => c.studentId === studentId);
  };

  const createConvocationTemplates = async () => {
    return templates;
  };

  return {
    scheduleConvocations,
    sendConvocations,
    createConvocationTemplates,
    getConvocationStats,
    getConvocationsByExam,
    getConvocationsByStudent,
    templates,
    scheduledConvocations,
    loading,
    error
  };
};