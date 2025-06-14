import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { usePrograms, useTable } from '@/hooks/useSupabase';

const subjectSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  code: z.string().min(2, 'Le code doit contenir au moins 2 caractères'),
  description: z.string().optional(),
  credits_ects: z.coerce.number().min(1).max(30),
  coefficient: z.coerce.number().min(0.5).max(5),
  hours_theory: z.coerce.number().min(0).max(200),
  hours_practice: z.coerce.number().min(0).max(200),
  hours_project: z.coerce.number().min(0).max(200),
  status: z.string(),
  program_id: z.string().optional(),
  level_id: z.string().optional(),
  class_group_id: z.string().optional(),
});

type SubjectFormData = z.infer<typeof subjectSchema>;

interface SubjectFormProps {
  subject?: any;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function SubjectForm({ subject, onSuccess, onCancel }: SubjectFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { data: programs, loading: programsLoading } = usePrograms();
  const { data: levels } = useTable('academic_levels');
  const { data: classGroups } = useTable('class_groups');

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<SubjectFormData>({
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
      coefficient: 1
    }
  });

  const onSubmit = async (data: SubjectFormData) => {
    setIsSubmitting(true);
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
        program_id: data.program_id || null,
        level_id: data.level_id || null,
        class_group_id: data.class_group_id || null,
        teaching_methods: [],
        evaluation_methods: [],
        prerequisites: []
      };

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

      if (result.error) throw result.error;

      toast({
        title: subject ? 'Matière modifiée' : 'Matière créée',
        description: `La matière a été ${subject ? 'modifiée' : 'créée'} avec succès.`,
      });

      onSuccess?.();
    } catch (error) {
      toast({
        title: 'Erreur',
        description: error instanceof Error ? error.message : 'Une erreur est survenue',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const watchedHours = watch(['hours_theory', 'hours_practice', 'hours_project']);
  const totalHours = (watchedHours[0] || 0) + (watchedHours[1] || 0) + (watchedHours[2] || 0);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="general">Informations générales</TabsTrigger>
          <TabsTrigger value="academic">Configuration académique</TabsTrigger>
          <TabsTrigger value="schedule">Horaires et volumes</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Informations de base</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom de la matière *</Label>
                  <Input
                    id="name"
                    {...register('name')}
                    placeholder="Ex: Bases de données relationnelles"
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive">{errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="code">Code de la matière *</Label>
                  <Input
                    id="code"
                    {...register('code')}
                    placeholder="Ex: BD101"
                  />
                  {errors.code && (
                    <p className="text-sm text-destructive">{errors.code.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  {...register('description')}
                  placeholder="Description détaillée de la matière..."
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label>Statut</Label>
                <Select onValueChange={(value) => setValue('status', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Statut de la matière" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Actif</SelectItem>
                    <SelectItem value="inactive">Inactif</SelectItem>
                    <SelectItem value="draft">Brouillon</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="academic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configuration académique</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="credits_ects">Crédits ECTS *</Label>
                  <Input
                    id="credits_ects"
                    type="number"
                    min="1"
                    max="30"
                    {...register('credits_ects')}
                    placeholder="6"
                  />
                  {errors.credits_ects && (
                    <p className="text-sm text-destructive">{errors.credits_ects.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="coefficient">Coefficient *</Label>
                  <Input
                    id="coefficient"
                    type="number"
                    step="0.5"
                    min="0.5"
                    max="5"
                    {...register('coefficient')}
                    placeholder="1"
                  />
                  {errors.coefficient && (
                    <p className="text-sm text-destructive">{errors.coefficient.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Programme</Label>
                <Select onValueChange={(value) => setValue('program_id', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un programme (optionnel)" />
                  </SelectTrigger>
                  <SelectContent>
                    {programs?.map((program) => (
                      <SelectItem key={program.id} value={program.id}>
                        {program.name} ({program.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Niveau académique</Label>
                  <Select onValueChange={(value) => setValue('level_id', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un niveau (optionnel)" />
                    </SelectTrigger>
                    <SelectContent>
                      {levels?.map((level) => (
                        <SelectItem key={level.id} value={level.id}>
                          {level.name} ({level.code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Classe</Label>
                  <Select onValueChange={(value) => setValue('class_group_id', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une classe (optionnel)" />
                    </SelectTrigger>
                    <SelectContent>
                      {classGroups?.map((group) => (
                        <SelectItem key={group.id} value={group.id}>
                          {group.name} ({group.code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Volume horaire</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="hours_theory">Heures de théorie</Label>
                  <Input
                    id="hours_theory"
                    type="number"
                    min="0"
                    max="200"
                    {...register('hours_theory')}
                    placeholder="0"
                  />
                  {errors.hours_theory && (
                    <p className="text-sm text-destructive">{errors.hours_theory.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hours_practice">Heures de pratique</Label>
                  <Input
                    id="hours_practice"
                    type="number"
                    min="0"
                    max="200"
                    {...register('hours_practice')}
                    placeholder="0"
                  />
                  {errors.hours_practice && (
                    <p className="text-sm text-destructive">{errors.hours_practice.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hours_project">Heures de projet</Label>
                  <Input
                    id="hours_project"
                    type="number"
                    min="0"
                    max="200"
                    {...register('hours_project')}
                    placeholder="0"
                  />
                  {errors.hours_project && (
                    <p className="text-sm text-destructive">{errors.hours_project.message}</p>
                  )}
                </div>
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Volume horaire total:</span>
                  <span className="text-lg font-bold">{totalHours} heures</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end space-x-4">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Annuler
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting || programsLoading}>
          {isSubmitting ? (subject ? 'Modification...' : 'Création...') : (subject ? 'Modifier' : 'Créer la matière')}
        </Button>
      </div>
    </form>
  );
}