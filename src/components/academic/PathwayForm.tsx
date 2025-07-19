import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { usePrograms } from '@/hooks/usePrograms';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const pathwaySchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  code: z.string().min(2, 'Le code doit contenir au moins 2 caractères'),
  description: z.string().optional(),
  program_id: z.string().min(1, 'Veuillez sélectionner un programme'),
  credits_required: z.number().min(1, 'Les crédits requis doivent être supérieurs à 0').optional(),
  max_students: z.number().min(1, 'Le nombre maximum d\'étudiants doit être supérieur à 0').optional(),
  is_mandatory: z.boolean().default(false),
});

type PathwayFormData = z.infer<typeof pathwaySchema>;

interface PathwayFormProps {
  pathway?: any;
  onSuccess: () => void;
  onCancel: () => void;
}

export function PathwayForm({ pathway, onSuccess, onCancel }: PathwayFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { programs, loading: programsLoading } = usePrograms();
  const { toast } = useToast();

  const form = useForm<PathwayFormData>({
    resolver: zodResolver(pathwaySchema),
    defaultValues: {
      name: pathway?.name || '',
      code: pathway?.code || '',
      description: pathway?.description || '',
      program_id: pathway?.program_id || '',
      credits_required: pathway?.credits_required || undefined,
      max_students: pathway?.max_students || undefined,
      is_mandatory: pathway?.is_mandatory || false,
    },
  });

  const onSubmit = async (data: PathwayFormData) => {
    setIsSubmitting(true);
    try {
      // Convertir les nombres undefined en null pour la base de données
      const formattedData = {
        name: data.name,
        code: data.code,
        description: data.description,
        program_id: data.program_id,
        credits_required: data.credits_required || null,
        max_students: data.max_students || null,
        is_mandatory: data.is_mandatory,
      };

      if (pathway) {
        // Modification
        const { error } = await supabase
          .from('specializations')
          .update(formattedData)
          .eq('id', pathway.id);

        if (error) throw error;

        toast({
          title: 'Filière modifiée',
          description: 'La filière a été modifiée avec succès.',
        });
      } else {
        // Création
        const { error } = await supabase
          .from('specializations')
          .insert(formattedData);

        if (error) throw error;

        toast({
          title: 'Filière créée',
          description: 'La nouvelle filière a été créée avec succès.',
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom de la filière</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Intelligence Artificielle" {...field} />
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
                  <Input placeholder="Ex: IA-SPEC" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Description de la filière..."
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="program_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Programme parent</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value} disabled={programsLoading}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un programme" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {programs.map((program) => (
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

        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="credits_required"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Crédits requis (optionnel)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="Ex: 60"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="max_students"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre maximum d'étudiants (optionnel)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="Ex: 30"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="is_mandatory"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 mt-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Filière obligatoire</FormLabel>
                    <div className="text-sm text-muted-foreground">
                      Cette filière est-elle obligatoire pour tous les étudiants du programme ?
                    </div>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onCancel}>
            Annuler
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {pathway ? 'Modifier' : 'Créer'}
          </Button>
        </div>
      </form>
    </Form>
  );
}