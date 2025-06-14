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
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { usePrograms } from '@/hooks/useSupabase';

const courseSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  code: z.string().min(2, 'Le code doit contenir au moins 2 caractères'),
  description: z.string().optional(),
  credits: z.coerce.number().min(1).max(10),
  program_id: z.string().uuid('Veuillez sélectionner un programme'),
  year_level: z.coerce.number().min(1).max(7),
  semester: z.coerce.number().min(1).max(2),
});

type CourseFormData = z.infer<typeof courseSchema>;

interface CourseFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function CourseForm({ onSuccess, onCancel }: CourseFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { data: programs, loading: programsLoading } = usePrograms();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema)
  });

  const onSubmit = async (data: CourseFormData) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('courses')
        .insert({
          name: data.name,
          code: data.code,
          description: data.description || null,
          credits: data.credits,
          program_id: data.program_id,
          year_level: data.year_level,
          semester: data.semester
        });

      if (error) throw error;

      toast({
        title: 'Cours créé',
        description: 'Le cours a été créé avec succès.',
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

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Créer un nouveau cours</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom du cours *</Label>
              <Input
                id="name"
                {...register('name')}
                placeholder="Ex: Bases de données"
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="code">Code du cours *</Label>
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="credits">Crédits *</Label>
              <Input
                id="credits"
                type="number"
                min="1"
                max="10"
                {...register('credits')}
                placeholder="3"
              />
              {errors.credits && (
                <p className="text-sm text-destructive">{errors.credits.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="year_level">Année *</Label>
              <Select onValueChange={(value) => setValue('year_level', parseInt(value))}>
                <SelectTrigger>
                  <SelectValue placeholder="Année" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 7].map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      Année {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.year_level && (
                <p className="text-sm text-destructive">{errors.year_level.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="semester">Semestre *</Label>
              <Select onValueChange={(value) => setValue('semester', parseInt(value))}>
                <SelectTrigger>
                  <SelectValue placeholder="Semestre" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Semestre 1</SelectItem>
                  <SelectItem value="2">Semestre 2</SelectItem>
                </SelectContent>
              </Select>
              {errors.semester && (
                <p className="text-sm text-destructive">{errors.semester.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Programme *</Label>
            <Select onValueChange={(value) => setValue('program_id', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un programme" />
              </SelectTrigger>
              <SelectContent>
                {programs?.map((program) => (
                  <SelectItem key={program.id} value={program.id}>
                    {program.name} ({program.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.program_id && (
              <p className="text-sm text-destructive">{errors.program_id.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Description du cours..."
              rows={4}
            />
          </div>

          <div className="flex justify-end space-x-4">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Annuler
              </Button>
            )}
            <Button type="submit" disabled={isSubmitting || programsLoading}>
              {isSubmitting ? 'Création...' : 'Créer le cours'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}