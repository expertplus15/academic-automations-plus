import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const levelSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  code: z.string().min(2, 'Le code doit contenir au moins 2 caractères'),
  education_cycle: z.string().min(1, 'Veuillez sélectionner un cycle'),
  order_index: z.number().min(1, 'L\'ordre doit être supérieur à 0'),
});

type LevelFormData = z.infer<typeof levelSchema>;

interface LevelFormProps {
  level?: any;
  onSuccess: () => void;
  onCancel: () => void;
}

const educationCycles = [
  { value: 'license', label: 'Licence' },
  { value: 'master', label: 'Master' },
  { value: 'doctorat', label: 'Doctorat' },
  { value: 'prepa', label: 'Classes Préparatoires' },
  { value: 'bts', label: 'BTS/DUT' },
];

export function LevelForm({ level, onSuccess, onCancel }: LevelFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<LevelFormData>({
    resolver: zodResolver(levelSchema),
    defaultValues: {
      name: level?.name || '',
      code: level?.code || '',
      education_cycle: level?.education_cycle || '',
      order_index: level?.order_index || 1,
    },
  });

  const onSubmit = async (data: LevelFormData) => {
    setIsSubmitting(true);
    try {
      const formattedData = {
        name: data.name,
        code: data.code,
        education_cycle: data.education_cycle,
        order_index: data.order_index,
      };

      if (level) {
        // Modification
        const { error } = await supabase
          .from('academic_levels')
          .update(formattedData)
          .eq('id', level.id);

        if (error) throw error;

        toast({
          title: 'Niveau modifié',
          description: 'Le niveau a été modifié avec succès.',
        });
      } else {
        // Création
        const { error } = await supabase
          .from('academic_levels')
          .insert(formattedData);

        if (error) throw error;

        toast({
          title: 'Niveau créé',
          description: 'Le nouveau niveau a été créé avec succès.',
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
                <FormLabel>Nom du niveau</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Licence 1ère année" {...field} />
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
                  <Input placeholder="Ex: L1" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="education_cycle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cycle d'études</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un cycle" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {educationCycles.map((cycle) => (
                      <SelectItem key={cycle.value} value={cycle.value}>
                        {cycle.label}
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
            name="order_index"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ordre d'affichage</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="Ex: 1"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onCancel}>
            Annuler
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {level ? 'Modifier' : 'Créer'}
          </Button>
        </div>
      </form>
    </Form>
  );
}