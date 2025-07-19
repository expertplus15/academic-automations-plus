import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { studentFormSchema, type StudentFormData } from '@/lib/validations';
import { Student, CreateStudentData, UpdateStudentData } from '@/hooks/students/useStudentsData';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

interface StudentFormProps {
  open: boolean;
  onClose: () => void;
  student?: Student;
  onSave: (data: CreateStudentData | UpdateStudentData) => Promise<{ success: boolean; error?: any }>;
}

interface Program {
  id: string;
  name: string;
  code: string;
}

export function StudentForm({ open, onClose, student, onSave }: StudentFormProps) {
  const { toast } = useToast();
  const { hasRole } = useAuth();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(false);

  const form = useForm<StudentFormData>({
    resolver: zodResolver(studentFormSchema),
    defaultValues: {
      full_name: '',
      email: '',
      phone: '',
      program_id: '',
      year_level: 1,
      status: 'active'
    }
  });

  useEffect(() => {
    if (student) {
      form.reset({
        full_name: student.profiles.full_name,
        email: student.profiles.email,
        phone: student.profiles.phone || '',
        program_id: student.programs.id,
        year_level: student.year_level,
        status: student.status
      });
    } else {
      form.reset({
        full_name: '',
        email: '',
        phone: '',
        program_id: '',
        year_level: 1,
        status: 'active'
      });
    }
  }, [student, open, form]);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const { data, error } = await supabase
          .from('programs')
          .select('id, name, code')
          .order('name');

        if (error) throw error;
        setPrograms(data || []);
      } catch (error) {
        console.error('Error fetching programs:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les programmes",
          variant: "destructive"
        });
      }
    };

    if (open) {
      fetchPrograms();
    }
  }, [open, toast]);

  const handleSubmit = async (data: StudentFormData) => {
    // Check permissions for creating/updating students
    if (!hasRole(['admin', 'hr'])) {
      toast({
        title: "Accès refusé",
        description: "Vous n'avez pas les permissions pour effectuer cette action",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    const result = await onSave(data);
    
    if (result.success) {
      toast({
        title: "Succès",
        description: student ? "Étudiant mis à jour avec succès" : "Étudiant créé avec succès"
      });
      onClose();
    } else {
      toast({
        title: "Erreur",
        description: result.error?.message || "Une erreur est survenue",
        variant: "destructive"
      });
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {student ? 'Modifier l\'étudiant' : 'Nouvel étudiant'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="full_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom complet (Prénom Nom) *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Prénom Nom de l'étudiant"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email *</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="email@exemple.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Téléphone</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="+33 6 12 34 56 78"
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
                  <FormLabel>Programme *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
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

            <FormField
              control={form.control}
              name="year_level"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Niveau d'étude</FormLabel>
                  <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value.toString()}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {[1, 2, 3, 4, 5].map((level) => (
                        <SelectItem key={level} value={level.toString()}>
                          Niveau {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {student && (
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Statut</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="active">Actif</SelectItem>
                        <SelectItem value="suspended">Suspendu</SelectItem>
                        <SelectItem value="graduated">Diplômé</SelectItem>
                        <SelectItem value="dropped">Abandonné</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Annuler
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Enregistrement...' : (student ? 'Modifier' : 'Créer')}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
