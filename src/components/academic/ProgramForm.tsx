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
import { useDepartments } from '@/hooks/academic/useAcademicData';

const programSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  code: z.string().min(2, 'Le code doit contenir au moins 2 caractères'),
  description: z.string().optional(),
  duration_years: z.coerce.number().min(1).max(7),
  department_id: z.string().uuid('Veuillez sélectionner un département')
});

type ProgramFormData = z.infer<typeof programSchema>;

interface ProgramFormProps {
  program?: any;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function ProgramForm({ program, onSuccess, onCancel }: ProgramFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { data: departments, loading: departmentsLoading } = useDepartments();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<ProgramFormData>({
    resolver: zodResolver(programSchema),
    defaultValues: program ? {
      name: program.name,
      code: program.code,
      description: program.description || '',
      duration_years: program.duration_years,
      department_id: program.department_id
    } : {}
  });

  const onSubmit = async (data: ProgramFormData) => {
    setIsSubmitting(true);
    try {
      const payload = {
        name: data.name,
        code: data.code,
        description: data.description || null,
        duration_years: data.duration_years,
        department_id: data.department_id
      };

      let result;
      if (program) {
        result = await supabase
          .from('programs')
          .update(payload)
          .eq('id', program.id);
      } else {
        result = await supabase
          .from('programs')
          .insert(payload);
      }

      if (result.error) throw result.error;

      toast({
        title: program ? 'Programme modifié' : 'Programme créé',
        description: `Le programme a été ${program ? 'modifié' : 'créé'} avec succès.`,
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
        <CardTitle>{program ? 'Modifier le programme' : 'Créer un nouveau programme'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom du programme *</Label>
              <Input
                id="name"
                {...register('name')}
                placeholder="Ex: Informatique de Gestion"
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="code">Code du programme *</Label>
              <Input
                id="code"
                {...register('code')}
                placeholder="Ex: INFO"
              />
              {errors.code && (
                <p className="text-sm text-destructive">{errors.code.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration_years">Durée (années) *</Label>
              <Input
                id="duration_years"
                type="number"
                min="1"
                max="7"
                {...register('duration_years')}
                placeholder="3"
              />
              {errors.duration_years && (
                <p className="text-sm text-destructive">{errors.duration_years.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Département *</Label>
              <Select onValueChange={(value) => setValue('department_id', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un département" />
                </SelectTrigger>
                <SelectContent>
                  {departments?.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id}>
                      {dept.name} ({dept.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.department_id && (
                <p className="text-sm text-destructive">{errors.department_id.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Description du programme..."
              rows={4}
            />
          </div>

          <div className="flex justify-end space-x-4">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Annuler
              </Button>
            )}
            <Button type="submit" disabled={isSubmitting || departmentsLoading}>
              {isSubmitting ? (program ? 'Modification...' : 'Création...') : (program ? 'Modifier' : 'Créer le programme')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}