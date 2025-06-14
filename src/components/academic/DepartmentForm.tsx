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
import { useTable } from '@/hooks/useSupabase';

const departmentSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  code: z.string().min(2, 'Le code doit contenir au moins 2 caractères'),
  description: z.string().optional(),
  head_id: z.string().uuid().optional().or(z.literal(''))
});

type DepartmentFormData = z.infer<typeof departmentSchema>;

interface DepartmentFormProps {
  department?: any;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function DepartmentForm({ department, onSuccess, onCancel }: DepartmentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { data: teachers } = useTable('profiles', '*', { role: 'teacher' });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset
  } = useForm<DepartmentFormData>({
    resolver: zodResolver(departmentSchema),
    defaultValues: department ? {
      name: department.name,
      code: department.code,
      description: department.description || '',
      head_id: department.head_id || ''
    } : {}
  });

  const onSubmit = async (data: DepartmentFormData) => {
    setIsSubmitting(true);
    try {
      const payload = {
        name: data.name,
        code: data.code,
        description: data.description || null,
        head_id: data.head_id || null
      };

      let result;
      if (department) {
        result = await supabase
          .from('departments')
          .update(payload)
          .eq('id', department.id);
      } else {
        result = await supabase
          .from('departments')
          .insert(payload);
      }

      if (result.error) throw result.error;

      toast({
        title: department ? 'Département modifié' : 'Département créé',
        description: `Le département a été ${department ? 'modifié' : 'créé'} avec succès.`,
      });

      reset();
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
        <CardTitle>{department ? 'Modifier le département' : 'Créer un nouveau département'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom du département *</Label>
              <Input
                id="name"
                {...register('name')}
                placeholder="Ex: Informatique"
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="code">Code du département *</Label>
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

          <div className="space-y-2">
            <Label>Chef de département</Label>
            <Select onValueChange={(value) => setValue('head_id', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un enseignant" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Aucun</SelectItem>
                {teachers?.map((teacher) => (
                  <SelectItem key={teacher.id} value={teacher.id}>
                    {teacher.full_name} ({teacher.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.head_id && (
              <p className="text-sm text-destructive">{errors.head_id.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Description du département..."
              rows={4}
            />
          </div>

          <div className="flex justify-end space-x-4">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Annuler
              </Button>
            )}
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (department ? 'Modification...' : 'Création...') : (department ? 'Modifier' : 'Créer le département')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}