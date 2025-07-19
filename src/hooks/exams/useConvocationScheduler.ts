
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ConvocationTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  send_days_before: number;
  reminder_days_before: number;
}

export interface ConvocationBatch {
  session_group_id: string;
  template_id: string;
  students: string[];
  send_date: string;
  reminder_date: string;
}

export function useConvocationScheduler() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const createConvocationTemplates = useCallback(async () => {
    try {
      setLoading(true);

      const templates = [
        {
          name: 'Convocation Examen Écrit DUT2-GE',
          template_type: 'exam_written',
          subject: 'Convocation - Examen {{SUBJECT_NAME}} - Session {{SESSION_NAME}}',
          content: `
Madame, Monsieur,

Vous êtes convoqué(e) à l'examen de {{SUBJECT_NAME}} dans le cadre de la {{SESSION_NAME}}.

Détails de l'examen :
- Date : {{EXAM_DATE}}
- Heure : {{EXAM_TIME}}
- Durée : {{EXAM_DURATION}}
- Salle : {{ROOM_NAME}}
- Type : {{EXAM_TYPE}}

Consignes importantes :
- Présence obligatoire 15 minutes avant le début
- Pièce d'identité et carte d'étudiant obligatoires
- Matériel autorisé : {{MATERIALS_ALLOWED}}
- Téléphones et objets connectés interdits

En cas d'absence justifiée, contactez le secrétariat avant l'épreuve.

Cordialement,
L'équipe pédagogique DUT Gestion des Entreprises
          `,
          send_days_before: 15,
          reminder_days_before: 3,
          is_active: true
        },
        {
          name: 'Convocation Soutenance Orale DUT2-GE',
          template_type: 'exam_oral',
          subject: 'Convocation - Soutenance {{SUBJECT_NAME}} - {{SESSION_NAME}}',
          content: `
Madame, Monsieur,

Vous êtes convoqué(e) à la soutenance de {{SUBJECT_NAME}} dans le cadre de la {{SESSION_NAME}}.

Détails de la soutenance :
- Date : {{EXAM_DATE}}
- Heure : {{EXAM_TIME}}
- Durée : {{EXAM_DURATION}}
- Salle : {{ROOM_NAME}}
- Jury : {{JURY_MEMBERS}}

Consignes spécifiques :
- Présentation orale requise ({{PRESENTATION_DURATION}} min)
- Support de présentation à apporter
- Tenue professionnelle exigée
- Ponctualité impérative

Documents à remettre :
- Rapport final (3 exemplaires)
- Synthèse exécutive
- Annexes techniques

Cordialement,
L'équipe pédagogique DUT Gestion des Entreprises
          `,
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

      toast({
        title: 'Templates créés',
        description: `${templates.length} modèles de convocation configurés`
      });

      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur création templates';
      setError(errorMessage);
      toast({
        title: 'Erreur',
        description: errorMessage,
        variant: 'destructive'
      });
      return [];
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const scheduleConvocations = useCallback(async (sessionGroupId: string) => {
    try {
      setLoading(true);

      // Récupérer les examens de la session
      const { data: exams, error: examsError } = await supabase
        .from('exams')
        .select(`
          *,
          exam_sessions(*)
        `)
        .eq('session_group_id', sessionGroupId);

      if (examsError) throw examsError;

      // Récupérer les étudiants DUT2-GE
      const { data: students, error: studentsError } = await supabase
        .from('students')
        .select(`
          id,
          student_number,
          profiles(email, full_name)
        `)
        .like('student_number', '2324EMD%GE');

      if (studentsError) throw studentsError;

      // Récupérer les templates de convocation
      const { data: templates, error: templatesError } = await supabase
        .from('convocation_templates')
        .select('*')
        .eq('is_active', true);

      if (templatesError) throw templatesError;

      const convocations = [];

      // Générer les convocations pour chaque examen et étudiant
      for (const exam of exams || []) {
        const template = templates?.find(t => 
          (exam.exam_type === 'written' && t.template_type === 'exam_written') ||
          (exam.exam_type === 'oral' && t.template_type === 'exam_oral')
        );

        if (!template || !exam.exam_sessions?.[0]) continue;

        const examSession = exam.exam_sessions[0];
        const examDate = new Date(examSession.start_time);
        const sendDate = new Date(examDate);
        sendDate.setDate(sendDate.getDate() - template.send_days_before);

        for (const student of students || []) {
          convocations.push({
            exam_id: exam.id,
            student_id: student.id,
            template_id: template.id,
            email_recipient: student.profiles?.email,
            status: 'scheduled'
          });
        }
      }

      // Insérer les convocations
      const { error: insertError } = await supabase
        .from('exam_convocations')
        .insert(convocations);

      if (insertError) throw insertError;

      toast({
        title: 'Convocations programmées',
        description: `${convocations.length} convocations créées pour la session DUT2-GE`
      });

      return convocations;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur programmation convocations';
      setError(errorMessage);
      toast({
        title: 'Erreur',
        description: errorMessage,
        variant: 'destructive'
      });
      return [];
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const sendConvocationBatch = useCallback(async (convocationIds: string[]) => {
    try {
      setLoading(true);

      // Simuler l'envoi des convocations
      // En production, ceci intégrerait avec un service d'email comme Resend
      const { error } = await supabase
        .from('exam_convocations')
        .update({ 
          status: 'sent',
          sent_at: new Date().toISOString()
        })
        .in('id', convocationIds);

      if (error) throw error;

      toast({
        title: 'Convocations envoyées',
        description: `${convocationIds.length} convocations envoyées avec succès`
      });

      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur envoi convocations';
      setError(errorMessage);
      toast({
        title: 'Erreur',
        description: errorMessage,
        variant: 'destructive'
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  return {
    loading,
    error,
    createConvocationTemplates,
    scheduleConvocations,
    sendConvocationBatch
  };
}
