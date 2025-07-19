
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

// Types pour les convocations
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

  const scheduleConvocations = async (sessionGroupId: string, examIds: string[]) => {
    try {
      setLoading(true);
      setError(null);

      // Récupérer les examens avec leurs sessions programmées
      const { data: examSessions, error: examError } = await supabase
        .from('exam_sessions')
        .select(`
          *,
          exams!inner(id, title, session_group_id)
        `)
        .eq('exams.session_group_id', sessionGroupId)
        .in('exam_id', examIds);

      if (examError) throw examError;

      // Récupérer les étudiants du programme DUT2-GE
      const { data: students, error: studentsError } = await supabase
        .from('students')
        .select('id, profiles!inner(full_name, email)')
        .eq('program_id', '550e8400-e29b-41d4-a716-446655440002')
        .eq('status', 'active');

      if (studentsError) throw studentsError;

      if (!students || students.length === 0) {
        throw new Error('Aucun étudiant trouvé pour ce programme');
      }

      // Récupérer les templates de convocation
      const { data: templates, error: templatesError } = await supabase
        .from('convocation_templates')
        .select('*')
        .eq('is_active', true);

      if (templatesError) throw templatesError;

      const convocationsToInsert = [];

      // Créer les convocations pour chaque étudiant et chaque examen
      for (const session of examSessions || []) {
        const isOral = session.exams.title.includes('PPP') || 
                      session.exams.title.includes('Projet') || 
                      session.exams.title.includes('Stage');
        
        const template = templates?.find(t => 
          isOral ? t.template_type === 'oral' : t.template_type === 'written'
        );

        if (!template) continue;

        for (const student of students) {
          // Convocation initiale
          const initialDate = new Date(session.start_time);
          initialDate.setDate(initialDate.getDate() - (template.send_days_before || 15));

          convocationsToInsert.push({
            exam_session_id: session.id,
            student_id: student.id,
            template_id: template.id,
            scheduled_send_date: initialDate.toISOString(),
            convocation_type: 'initial',
            status: 'scheduled'
          });

          // Convocation de rappel
          const reminderDate = new Date(session.start_time);
          reminderDate.setDate(reminderDate.getDate() - (template.reminder_days_before || 3));

          convocationsToInsert.push({
            exam_session_id: session.id,
            student_id: student.id,
            template_id: template.id,
            scheduled_send_date: reminderDate.toISOString(),
            convocation_type: 'reminder',
            status: 'scheduled'
          });
        }
      }

      // Insérer les convocations en base
      if (convocationsToInsert.length > 0) {
        const { error: insertError } = await supabase
          .from('exam_convocations')
          .insert(convocationsToInsert);

        if (insertError) throw insertError;
      }

      toast({
        title: "Convocations programmées",
        description: `${convocationsToInsert.length} convocations programmées pour ${students.length} étudiants.`,
      });

      return { success: true, scheduledCount: convocationsToInsert.length };
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

      // Marquer les convocations comme envoyées
      const { error: updateError } = await supabase
        .from('exam_convocations')
        .update({
          status: 'sent',
          sent_date: new Date().toISOString()
        })
        .in('id', convocationIds);

      if (updateError) throw updateError;

      toast({
        title: "Convocations envoyées",
        description: `${convocationIds.length} convocations envoyées avec succès.`,
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

  const getConvocationStats = async (sessionGroupId?: string) => {
    try {
      let query = supabase
        .from('exam_convocations')
        .select(`
          *,
          exam_sessions!inner(
            exams!inner(session_group_id)
          )
        `);

      if (sessionGroupId) {
        query = query.eq('exam_sessions.exams.session_group_id', sessionGroupId);
      }

      const { data: convocations, error } = await query;

      if (error) throw error;

      const total = convocations?.length || 0;
      const sent = convocations?.filter(c => c.status === 'sent').length || 0;
      const scheduled = convocations?.filter(c => c.status === 'scheduled').length || 0;
      const delivered = convocations?.filter(c => c.status === 'delivered').length || 0;
      const failed = convocations?.filter(c => c.status === 'failed').length || 0;
      const reminders = convocations?.filter(c => c.convocation_type === 'reminder').length || 0;
      const initial = convocations?.filter(c => c.convocation_type === 'initial').length || 0;

      return {
        total,
        sent,
        scheduled,
        delivered,
        failed,
        reminders,
        initial,
        successRate: total > 0 ? Math.round((delivered / total) * 100) : 0,
        pendingReminders: convocations?.filter(c => 
          c.convocation_type === 'reminder' && c.status === 'scheduled'
        ).length || 0
      };
    } catch (err) {
      console.error('Erreur statistiques convocations:', err);
      return {
        total: 0,
        sent: 0,
        scheduled: 0,
        delivered: 0,
        failed: 0,
        reminders: 0,
        initial: 0,
        successRate: 0,
        pendingReminders: 0
      };
    }
  };

  const getConvocationsByExam = async (examId: string) => {
    try {
      const { data, error } = await supabase
        .from('exam_convocations')
        .select(`
          *,
          students!inner(profiles!inner(full_name, email)),
          exam_sessions!inner(exams!inner(title))
        `)
        .eq('exam_sessions.exam_id', examId);

      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error('Erreur convocations par examen:', err);
      return [];
    }
  };

  const getConvocationsByStudent = async (studentId: string) => {
    try {
      const { data, error } = await supabase
        .from('exam_convocations')
        .select(`
          *,
          exam_sessions!inner(
            *,
            exams!inner(title)
          )
        `)
        .eq('student_id', studentId);

      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error('Erreur convocations par étudiant:', err);
      return [];
    }
  };

  const createConvocationTemplates = async () => {
    try {
      // Vérifier si les templates existent déjà
      const { data: existing } = await supabase
        .from('convocation_templates')
        .select('*');

      if (existing && existing.length > 0) {
        return existing;
      }

      // Créer les templates par défaut
      const templates = [
        {
          name: 'Convocation Examen Écrit',
          template_type: 'written',
          subject: 'Convocation à l\'examen de {{SUBJECT}}',
          content: `Cher(e) {{STUDENT_NAME}},

Vous êtes convoqué(e) à l'examen de {{SUBJECT}} qui aura lieu le {{EXAM_DATE}} à {{EXAM_TIME}}.

Lieu: {{LOCATION}}
Durée: {{DURATION}}
Documents autorisés: {{AUTHORIZED_DOCS}}

Cordialement,
L'équipe pédagogique`,
          send_days_before: 15,
          reminder_days_before: 3,
          is_active: true
        },
        {
          name: 'Convocation Soutenance Orale',
          template_type: 'oral',
          subject: 'Convocation à la soutenance de {{SUBJECT}}',
          content: `Cher(e) {{STUDENT_NAME}},

Vous êtes convoqué(e) à la soutenance de {{SUBJECT}} qui aura lieu le {{EXAM_DATE}} à {{EXAM_TIME}}.

Lieu: {{LOCATION}}
Durée: {{DURATION}}
Jury: {{JURY_MEMBERS}}

Merci de vous présenter 15 minutes avant l'heure prévue.

Cordialement,
L'équipe pédagogique`,
          send_days_before: 7,
          reminder_days_before: 2,
          is_active: true
        }
      ];

      const { data, error } = await supabase
        .from('convocation_templates')
        .insert(templates)
        .select();

      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Erreur création templates:', err);
      return [];
    }
  };

  return {
    scheduleConvocations,
    sendConvocations,
    createConvocationTemplates,
    getConvocationStats,
    getConvocationsByExam,
    getConvocationsByStudent,
    loading,
    error
  };
};
