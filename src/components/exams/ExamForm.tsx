
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Plus, BookOpen, Clock, Users, AlertCircle } from 'lucide-react';
import { useExams } from '@/hooks/useExams';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { examFormSchema, type ExamFormData } from '@/lib/validations';

interface ExamFormProps {
  onSuccess?: () => void;
}

export function ExamForm({ onSuccess }: ExamFormProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { createExam } = useExams();
  const { hasRole } = useAuth();
  const { toast } = useToast();

  const form = useForm<ExamFormData>({
    resolver: zodResolver(examFormSchema),
    defaultValues: {
      title: '',
      description: '',
      exam_type: 'written',
      duration_minutes: 120,
      max_students: 30,
      min_supervisors: 1,
      instructions: {
        general: '',
        materials_allowed: [],
        special_requirements: ''
      },
      materials_required: []
    }
  });

  // Check permissions
  if (!hasRole(['admin', 'teacher'])) {
    return null;
  }

  const handleSubmit = async (data: ExamFormData) => {
    // Double-check permissions
    if (!hasRole(['admin', 'teacher'])) {
      toast({
        title: "Accès refusé",
        description: "Vous n'avez pas les permissions pour créer un examen",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    try {
      const examData = {
        title: data.title,
        description: data.description,
        exam_type: data.exam_type,
        duration_minutes: data.duration_minutes,
        max_students: data.max_students,
        min_supervisors: data.min_supervisors,
        subject_id: data.subject_id,
        academic_year_id: data.academic_year_id,
        program_id: data.program_id,
        instructions: data.instructions,
        materials_required: data.materials_required,
        status: 'draft'
      };
      
      const result = await createExam(examData);
      
      if (result) {
        toast({
          title: "Succès",
          description: "Examen créé avec succès"
        });
        setOpen(false);
        form.reset();
        onSuccess?.();
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors de la création de l'examen",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Nouvel Examen
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-600" />
            Créer un Nouvel Examen
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Informations de base */}
            <Card>
              <CardContent className="p-4 space-y-4">
                <h3 className="font-semibold">Informations générales</h3>
                
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Titre de l'examen *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ex: Examen final de Mathématiques"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Description détaillée de l'examen..."
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="exam_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type d'examen</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="written">Écrit</SelectItem>
                          <SelectItem value="oral">Oral</SelectItem>
                          <SelectItem value="practical">Pratique</SelectItem>
                          <SelectItem value="mixed">Mixte</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Configuration */}
            <Card>
              <CardContent className="p-4 space-y-4">
                <h3 className="font-semibold">Configuration</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="duration_minutes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          Durée (minutes) *
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="30"
                            max="480"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
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
                        <FormLabel className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          Étudiants max
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="1"
                            placeholder="Illimité"
                            {...field}
                            value={field.value || ''}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || undefined)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="min_supervisors"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Surveillants min *</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="1"
                            max="10"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Instructions */}
            <Card>
              <CardContent className="p-4 space-y-4">
                <h3 className="font-semibold">Instructions</h3>
                
                <FormField
                  control={form.control}
                  name="instructions.general"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Instructions générales</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Instructions pour la conduite de l'examen..."
                          rows={4}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="instructions.special_requirements"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Exigences spéciales</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Calculatrices autorisées, documents permis, etc."
                          rows={2}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={loading}
              >
                Annuler
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Création...' : 'Créer l\'Examen'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
