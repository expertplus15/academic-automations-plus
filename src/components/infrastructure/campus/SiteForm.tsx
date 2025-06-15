
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

const siteSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  code: z.string().min(2, 'Le code doit contenir au moins 2 caractères'),
  address: z.string().optional(),
  description: z.string().optional(),
});

type SiteFormData = z.infer<typeof siteSchema>;

interface SiteFormProps {
  campusId: string;
  site?: any;
  onSuccess?: () => void;
}

export function SiteForm({ campusId, site, onSuccess }: SiteFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<SiteFormData>({
    resolver: zodResolver(siteSchema),
    defaultValues: site ? {
      name: site.name,
      code: site.code,
      address: site.address || '',
      description: site.description || '',
    } : {
      name: '',
      code: '',
      address: '',
      description: '',
    }
  });

  const onSubmit = async (data: SiteFormData) => {
    setIsSubmitting(true);

    try {
      const payload = {
        name: data.name,
        code: data.code,
        address: data.address || null,
        description: data.description || null,
        campus_id: campusId,
      };

      let result;
      if (site) {
        result = await supabase
          .from('sites')
          .update(payload)
          .eq('id', site.id);
      } else {
        result = await supabase
          .from('sites')
          .insert(payload);
      }

      if (result.error) {
        throw result.error;
      }

      toast({
        title: site ? 'Site modifié' : 'Site créé',
        description: `Le site a été ${site ? 'modifié' : 'créé'} avec succès.`,
      });

      onSuccess?.();
    } catch (error) {
      console.error('Error submitting site:', error);
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
          <Label htmlFor="name">Nom du site</Label>
          <Input
            id="name"
            {...form.register('name')}
            placeholder="ex: Site Principal"
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
          placeholder="ex: Bâtiment A, 123 Rue de l'Université"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          {...form.register('description')}
          placeholder="Description du site..."
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'En cours...' : (site ? 'Modifier' : 'Créer')}
        </Button>
      </div>
    </form>
  );
}
