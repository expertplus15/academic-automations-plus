
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const campusSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  code: z.string().min(2, 'Le code doit contenir au moins 2 caractères'),
  address: z.string().optional(),
  description: z.string().optional(),
});

type CampusFormData = z.infer<typeof campusSchema>;

interface CampusFormProps {
  campus?: any;
  onSuccess?: () => void;
}

export function CampusForm({ campus, onSuccess }: CampusFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<CampusFormData>({
    resolver: zodResolver(campusSchema),
    defaultValues: campus ? {
      name: campus.name,
      code: campus.code,
      address: campus.address || '',
      description: campus.description || '',
    } : {
      name: '',
      code: '',
      address: '',
      description: '',
    }
  });

  const onSubmit = async (data: CampusFormData) => {
    setIsSubmitting(true);

    try {
      const payload = {
        name: data.name,
        code: data.code,
        address: data.address || null,
        description: data.description || null,
      };

      let result;
      if (campus) {
        result = await supabase
          .from('campuses')
          .update(payload)
          .eq('id', campus.id);
      } else {
        result = await supabase
          .from('campuses')
          .insert(payload);
      }

      if (result.error) {
        throw result.error;
      }

      toast({
        title: campus ? 'Campus modifié' : 'Campus créé',
        description: `Le campus a été ${campus ? 'modifié' : 'créé'} avec succès.`,
      });

      onSuccess?.();
    } catch (error) {
      console.error('Error submitting campus:', error);
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
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nom du campus</Label>
          <Input
            id="name"
            {...form.register('name')}
            placeholder="ex: Campus Principal"
          />
          {form.formState.errors.name && (
            <p className="text-sm text-red-600">{form.formState.errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="code">Code</Label>
          <Input
            id="code"
            {...form.register('code')}
            placeholder="ex: MAIN"
          />
          {form.formState.errors.code && (
            <p className="text-sm text-red-600">{form.formState.errors.code.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Adresse</Label>
        <Input
          id="address"
          {...form.register('address')}
          placeholder="ex: 123 Rue de l'Université"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          {...form.register('description')}
          placeholder="Description du campus..."
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'En cours...' : (campus ? 'Modifier' : 'Créer')}
        </Button>
      </div>
    </form>
  );
}
