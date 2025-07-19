import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { usePrograms } from '@/hooks/usePrograms';
import { useSpecializations } from '@/hooks/useSpecializations';
import { useAcademicLevels } from '@/hooks/academic/useAcademicData';

const groupFormSchema = z.object({
  name: z.string().min(1, 'Le nom est requis'),
  code: z.string().min(1, 'Le code est requis'),
  group_type: z.enum(['main', 'td', 'tp'], {
    required_error: 'Le type de groupe est requis',
  }),
  program_id: z.string().optional(),
  specialization_id: z.string().optional(),
  level_id: z.string().optional(),
  max_students: z.number().min(1, 'Le nombre maximum d\'étudiants doit être supérieur à 0'),
  description: z.string().optional(),
});

type GroupFormData = z.infer<typeof groupFormSchema>;

interface GroupFormProps {
  group?: any;
  onSuccess: () => void;
  onCancel: () => void;
}

const groupTypeLabels = {
  main: 'Classe Principale',
  td: 'Travaux Dirigés (TD)',
  tp: 'Travaux Pratiques (TP)',
};

export function GroupForm({ group, onSuccess, onCancel }: GroupFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { programs, loading: programsLoading } = usePrograms();
  const { data: specializations, loading: specializationsLoading } = useSpecializations('');
  const { data: levels, loading: levelsLoading } = useAcademicLevels();

  const form = useForm<GroupFormData>({
    resolver: zodResolver(groupFormSchema),
    defaultValues: {
      name: group?.name || '',
      code: group?.code || '',
      group_type: group?.group_type || 'main',
      program_id: group?.program_id || 'none',
      specialization_id: group?.metadata?.specialization_id || 'none',
      level_id: group?.metadata?.level_id || 'none',
      max_students: group?.max_students || 30,
      description: group?.metadata?.description || '',
    },
  });

  const onSubmit = async (data: GroupFormData) => {
    setIsSubmitting(true);
    try {
      const groupData = {
        name: data.name,
        code: data.code,
        group_type: data.group_type,
        program_id: data.program_id === 'none' ? null : data.program_id || null,
        max_students: data.max_students,
        metadata: {
          description: data.description || '',
          specialization_id: data.specialization_id === 'none' ? null : data.specialization_id,
          level_id: data.level_id === 'none' ? null : data.level_id,
        },
      };

      if (group) {
        const { error } = await supabase
          .from('class_groups')
          .update(groupData)
          .eq('id', group.id);

        if (error) throw error;

        toast({
          title: 'Groupe modifié',
          description: 'Le groupe a été modifié avec succès.',
        });
      } else {
        const { error } = await supabase
          .from('class_groups')
          .insert(groupData);

        if (error) throw error;

        toast({
          title: 'Groupe créé',
          description: 'Le nouveau groupe a été créé avec succès.',
        });
      }

      onSuccess();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue lors de la sauvegarde.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {group ? 'Modifier le groupe' : 'Créer un nouveau groupe'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom du groupe</FormLabel>
                    <FormControl>
                      <Input placeholder="ex: L1 Info Groupe A" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Code</FormLabel>
                    <FormControl>
                      <Input placeholder="ex: L1-INFO-A" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="group_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type de groupe</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(groupTypeLabels).map(([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="max_students"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre maximum d'étudiants</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        max="200"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="program_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Programme (optionnel)</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un programme" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">Aucun programme spécifique</SelectItem>
                        {!programsLoading && programs.map((program) => (
                          <SelectItem key={program.id} value={program.id}>
                            {program.name} ({program.code})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="specialization_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Filière (optionnelle)</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner une filière" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">Aucune filière spécifique</SelectItem>
                        {!specializationsLoading && specializations?.map((specialization) => (
                          <SelectItem key={specialization.id} value={specialization.id}>
                            {specialization.name} ({specialization.code})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="level_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Niveau d'études (optionnel)</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un niveau" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">Aucun niveau spécifique</SelectItem>
                      {!levelsLoading && levels?.map((level) => (
                        <SelectItem key={level.id} value={level.id}>
                          {level.name} ({level.code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (optionnelle)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Description du groupe..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={onCancel}>
                Annuler
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting
                  ? 'Sauvegarde...'
                  : group
                  ? 'Modifier'
                  : 'Créer'
                }
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}