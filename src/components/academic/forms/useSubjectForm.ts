
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const subjectSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  code: z.string().min(2, 'Le code doit contenir au moins 2 caractères'),
  description: z.string().optional(),
  credits_ects: z.coerce.number().min(1).max(30),
  coefficient: z.coerce.number().min(0.5).max(5),
  hours_theory: z.coerce.number().min(0).max(200),
  hours_practice: z.coerce.number().min(0).max(200),
  hours_project: z.coerce.number().min(0).max(200),
  status: z.enum(['active', 'inactive', 'archived']),
  program_id: z.string().optional(),
  level_id: z.string().optional(),
  class_group_id: z.string().optional(),
});

export type SubjectFormData = z.infer<typeof subjectSchema>;

export function useSubjectForm(subject?: any, onSuccess?: () => void) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<SubjectFormData>({
    resolver: zodResolver(subjectSchema),
    defaultValues: subject ? {
      name: subject.name,
      code: subject.code,
      description: subject.description || '',
      credits_ects: subject.credits_ects,
      coefficient: subject.coefficient,
      hours_theory: subject.hours_theory || 0,
      hours_practice: subject.hours_practice || 0,
      hours_project: subject.hours_project || 0,
      status: subject.status || 'active',
      program_id: subject.program_id || '',
      level_id: subject.level_id || '',
      class_group_id: subject.class_group_id || ''
    } : {
      status: 'active',
      hours_theory: 0,
      hours_practice: 0,
      hours_project: 0,
      coefficient: 1,
      credits_ects: 6,
      description: '',
      program_id: '',
      level_id: '',
      class_group_id: ''
    }
  });

  const onSubmit = async (data: SubjectFormData) => {
    setIsSubmitting(true);
    console.log('Submitting subject data:', data);
    
    try {
      const payload = {
        name: data.name,
        code: data.code,
        description: data.description || null,
        credits_ects: data.credits_ects,
        coefficient: data.coefficient,
        hours_theory: data.hours_theory,
        hours_practice: data.hours_practice,
        hours_project: data.hours_project,
        status: data.status,
        program_id: data.program_id && data.program_id.trim() !== '' ? data.program_id : null,
        level_id: data.level_id && data.level_id.trim() !== '' ? data.level_id : null,
        class_group_id: data.class_group_id && data.class_group_id.trim() !== '' ? data.class_group_id : null,
        teaching_methods: [],
        evaluation_methods: [],
        prerequisites: []
      };

      console.log('Payload being sent to Supabase:', payload);

      let result;
      if (subject) {
        result = await supabase
          .from('subjects')
          .update(payload)
          .eq('id', subject.id);
      } else {
        result = await supabase
          .from('subjects')
          .insert(payload);
      }

      console.log('Supabase result:', result);

      if (result.error) {
        console.error('Supabase error:', result.error);
        throw result.error;
      }

      toast({
        title: subject ? 'Matière modifiée' : 'Matière créée',
        description: `La matière a été ${subject ? 'modifiée' : 'créée'} avec succès.`,
      });

      // Force refetch after a small delay to ensure data is updated
      setTimeout(() => {
        onSuccess?.();
      }, 100);
    } catch (error) {
      console.error('Error submitting subject:', error);
      toast({
        title: 'Erreur',
        description: error instanceof Error ? error.message : 'Une erreur est survenue',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    isSubmitting,
    onSubmit
  };
}
