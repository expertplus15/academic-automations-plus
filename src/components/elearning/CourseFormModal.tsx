import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
import { useCourses } from '@/hooks/useCourses';
import { useCourseCategories } from '@/hooks/useCourseCategories';

const courseFormSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  code: z.string().min(1, "Le code est requis"),
  description: z.string().optional(),
  category_id: z.string().optional(),
  difficulty_level: z.enum(['beginner', 'intermediate', 'advanced']),
  estimated_duration: z.coerce.number().min(1).optional(),
  enrollment_limit: z.coerce.number().min(1).optional(),
  is_published: z.boolean().default(false),
  enrollment_start_date: z.string().optional(),
  enrollment_end_date: z.string().optional(),
  course_start_date: z.string().optional(),
  course_end_date: z.string().optional(),
});

type CourseFormData = z.infer<typeof courseFormSchema>;

interface CourseFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  course?: any;
  onSuccess?: () => void;
}

export function CourseFormModal({ open, onOpenChange, course, onSuccess }: CourseFormModalProps) {
  const { createCourse, updateCourse } = useCourses();
  const { categories } = useCourseCategories();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CourseFormData>({
    resolver: zodResolver(courseFormSchema),
    defaultValues: {
      title: '',
      code: '',
      description: '',
      category_id: '',
      difficulty_level: 'beginner',
      estimated_duration: undefined,
      enrollment_limit: undefined,
      is_published: false,
      enrollment_start_date: '',
      enrollment_end_date: '',
      course_start_date: '',
      course_end_date: '',
    },
  });

  useEffect(() => {
    if (course) {
      form.reset({
        title: course.title || '',
        code: course.code || '',
        description: course.description || '',
        category_id: course.category_id || '',
        difficulty_level: course.difficulty_level || 'beginner',
        estimated_duration: course.estimated_duration || undefined,
        enrollment_limit: course.enrollment_limit || undefined,
        is_published: course.is_published || false,
        enrollment_start_date: course.enrollment_start_date || '',
        enrollment_end_date: course.enrollment_end_date || '',
        course_start_date: course.course_start_date || '',
        course_end_date: course.course_end_date || '',
      });
    } else {
      form.reset({
        title: '',
        code: '',
        description: '',
        category_id: '',
        difficulty_level: 'beginner',
        estimated_duration: undefined,
        enrollment_limit: undefined,
        is_published: false,
        enrollment_start_date: '',
        enrollment_end_date: '',
        course_start_date: '',
        course_end_date: '',
      });
    }
  }, [course, form]);

  const onSubmit = async (data: CourseFormData) => {
    try {
      setIsSubmitting(true);
      
      const courseData = {
        title: data.title,
        code: data.code,
        description: data.description,
        category_id: data.category_id,
        difficulty_level: data.difficulty_level,
        estimated_duration: data.estimated_duration,
        enrollment_limit: data.enrollment_limit,
        is_published: data.is_published,
        enrollment_start_date: data.enrollment_start_date,
        enrollment_end_date: data.enrollment_end_date,
        course_start_date: data.course_start_date,
        course_end_date: data.course_end_date,
        status: data.is_published ? 'active' : 'draft',
        instructor_id: null, // Will be set by auth context
      };

      if (course) {
        await updateCourse(course.id, courseData);
      } else {
        await createCourse(courseData);
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
            {course ? 'Modifier le cours' : 'Créer un nouveau cours'}
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
                    <FormLabel>Titre du cours *</FormLabel>
                    <FormControl>
                      <Input placeholder="Titre du cours" {...field} />
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
                    <FormLabel>Code du cours *</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: INF101" {...field} />
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
                      placeholder="Description du cours..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Catégorie</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner une catégorie" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
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
                name="difficulty_level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Niveau de difficulté</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="beginner">Débutant</SelectItem>
                        <SelectItem value="intermediate">Intermédiaire</SelectItem>
                        <SelectItem value="advanced">Avancé</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="estimated_duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Durée estimée (minutes)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="120" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="enrollment_limit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Limite d'inscriptions</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="50" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="course_start_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date de début</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="course_end_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date de fin</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="is_published"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Publier le cours</FormLabel>
                    <div className="text-sm text-muted-foreground">
                      Le cours sera visible aux étudiants
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

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Annuler
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Sauvegarde...' : course ? 'Modifier' : 'Créer'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}