import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useVirtualSessions } from '@/hooks/useVirtualSessions';
import { useCourses } from '@/hooks/useCourses';

const sessionFormSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  description: z.string().optional(),
  course_id: z.string().min(1, "Le cours est requis"),
  platform: z.enum(['zoom', 'teams', 'custom']),
  scheduled_start_time: z.string().min(1, "L'heure de début est requise"),
  scheduled_end_time: z.string().min(1, "L'heure de fin est requise"),
  max_participants: z.coerce.number().min(1).max(1000),
  meeting_url: z.string().url().optional().or(z.literal('')),
  password: z.string().optional(),
  recording_enabled: z.boolean().default(true),
  auto_record: z.boolean().default(false),
  is_recurring: z.boolean().default(false),
});

type SessionFormData = z.infer<typeof sessionFormSchema>;

interface VirtualSessionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  session?: any;
  onSuccess?: () => void;
}

export function VirtualSessionModal({ open, onOpenChange, session, onSuccess }: VirtualSessionModalProps) {
  const { createSession, updateSession } = useVirtualSessions();
  const { courses } = useCourses();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<SessionFormData>({
    resolver: zodResolver(sessionFormSchema),
    defaultValues: {
      title: '',
      description: '',
      course_id: '',
      platform: 'zoom',
      scheduled_start_time: '',
      scheduled_end_time: '',
      max_participants: 100,
      meeting_url: '',
      password: '',
      recording_enabled: true,
      auto_record: false,
      is_recurring: false,
    },
  });

  useEffect(() => {
    if (session) {
      const startTime = new Date(session.scheduled_start_time);
      const endTime = new Date(session.scheduled_end_time);
      
      form.reset({
        title: session.title || '',
        description: session.description || '',
        course_id: session.course_id || '',
        platform: session.platform || 'zoom',
        scheduled_start_time: startTime.toISOString().slice(0, 16),
        scheduled_end_time: endTime.toISOString().slice(0, 16),
        max_participants: session.max_participants || 100,
        meeting_url: session.meeting_url || '',
        password: session.password || '',
        recording_enabled: session.recording_enabled ?? true,
        auto_record: session.auto_record ?? false,
        is_recurring: session.is_recurring ?? false,
      });
    } else {
      form.reset({
        title: '',
        description: '',
        course_id: '',
        platform: 'zoom',
        scheduled_start_time: '',
        scheduled_end_time: '',
        max_participants: 100,
        meeting_url: '',
        password: '',
        recording_enabled: true,
        auto_record: false,
        is_recurring: false,
      });
    }
  }, [session, form]);

  const onSubmit = async (data: SessionFormData) => {
    try {
      setIsSubmitting(true);
      
      const sessionData = {
        ...data,
        scheduled_start_time: new Date(data.scheduled_start_time).toISOString(),
        scheduled_end_time: new Date(data.scheduled_end_time).toISOString(),
        status: 'scheduled' as const,
        metadata: {},
      };

      if (session) {
        await updateSession(session.id, sessionData);
      } else {
        await createSession(sessionData);
      }

      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {session ? 'Modifier la session' : 'Créer une nouvelle session'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Titre de la session *</FormLabel>
                    <FormControl>
                      <Input placeholder="Titre de la session" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="course_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cours *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un cours" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {courses.map((course) => (
                          <SelectItem key={course.id} value={course.id}>
                            {course.title}
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
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Description de la session..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="platform"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Plateforme</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="zoom">Zoom</SelectItem>
                        <SelectItem value="teams">Microsoft Teams</SelectItem>
                        <SelectItem value="custom">Personnalisé</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="scheduled_start_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Début *</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="scheduled_end_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fin *</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="max_participants"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Participants maximum</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="100" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="meeting_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL de la réunion</FormLabel>
                    <FormControl>
                      <Input placeholder="https://zoom.us/j/..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mot de passe (optionnel)</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Mot de passe de la réunion" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="recording_enabled"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Enregistrement activé</FormLabel>
                      <div className="text-sm text-muted-foreground">
                        Autoriser l'enregistrement de cette session
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

              <FormField
                control={form.control}
                name="auto_record"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Enregistrement automatique</FormLabel>
                      <div className="text-sm text-muted-foreground">
                        Démarrer l'enregistrement automatiquement
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

              <FormField
                control={form.control}
                name="is_recurring"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Session récurrente</FormLabel>
                      <div className="text-sm text-muted-foreground">
                        Répéter cette session selon un planning
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
            </div>

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Annuler
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Sauvegarde...' : session ? 'Modifier' : 'Créer'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}