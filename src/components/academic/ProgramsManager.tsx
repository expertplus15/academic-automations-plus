import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Search, Edit, Trash2, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const programSchema = z.object({
  code: z.string().min(2, 'Code minimum 2 caractères'),
  name: z.string().min(3, 'Nom minimum 3 caractères'),
  description: z.string().optional(),
  program_type: z.enum(['DUT', 'Licence', 'Master', 'Doctorat', 'BTS', 'Autre']),
  duration_years: z.number().min(1).max(8),
  total_credits: z.number().min(60).max(480),
  is_active: z.boolean().default(true)
});

type ProgramForm = z.infer<typeof programSchema>;

interface Program extends ProgramForm {
  id: string;
  created_at: string;
  levels_count?: number;
  students_count?: number;
}

export function ProgramsManager() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const form = useForm<ProgramForm>({
    resolver: zodResolver(programSchema),
    defaultValues: {
      code: '',
      name: '',
      description: '',
      program_type: 'DUT',
      duration_years: 2,
      total_credits: 120,
      is_active: true
    }
  });

  React.useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('programs')
        .select(`
          *,
          academic_levels(count),
          students(count)
        `)
        .order('name');

      if (error) throw error;

      const programsWithCounts = data?.map(program => ({
        ...program,
        levels_count: program.academic_levels?.length || 0,
        students_count: program.students?.length || 0
      })) || [];

      setPrograms(programsWithCounts);
    } catch (error) {
      console.error('Error fetching programs:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les programmes",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: ProgramForm) => {
    try {
      if (editingProgram) {
        const { error } = await supabase
          .from('programs')
          .update(data)
          .eq('id', editingProgram.id);

        if (error) throw error;

        toast({
          title: "Succès",
          description: "Programme modifié avec succès"
        });
      } else {
        const { error } = await supabase
          .from('programs')
          .insert([data]);

        if (error) throw error;

        toast({
          title: "Succès",
          description: "Programme créé avec succès"
        });
      }

      setIsDialogOpen(false);
      setEditingProgram(null);
      form.reset();
      fetchPrograms();
    } catch (error) {
      console.error('Error saving program:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder le programme",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (program: Program) => {
    setEditingProgram(program);
    form.reset(program);
    setIsDialogOpen(true);
  };

  const handleDelete = async (programId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce programme ?')) return;

    try {
      const { error } = await supabase
        .from('programs')
        .delete()
        .eq('id', programId);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Programme supprimé avec succès"
      });

      fetchPrograms();
    } catch (error) {
      console.error('Error deleting program:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le programme",
        variant: "destructive"
      });
    }
  };

  const filteredPrograms = programs.filter(program =>
    program.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    program.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Gestion des Programmes</h2>
          <p className="text-muted-foreground">
            Configurez les programmes académiques (DUT, Licences, Masters...)
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingProgram(null);
              form.reset();
            }}>
              <Plus className="w-4 h-4 mr-2" />
              Nouveau Programme
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingProgram ? 'Modifier le programme' : 'Créer un nouveau programme'}
              </DialogTitle>
              <DialogDescription>
                Remplissez les informations du programme académique
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Code Programme</FormLabel>
                        <FormControl>
                          <Input placeholder="DUTGE" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="program_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="DUT">DUT</SelectItem>
                            <SelectItem value="BTS">BTS</SelectItem>
                            <SelectItem value="Licence">Licence</SelectItem>
                            <SelectItem value="Master">Master</SelectItem>
                            <SelectItem value="Doctorat">Doctorat</SelectItem>
                            <SelectItem value="Autre">Autre</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Intitulé</FormLabel>
                      <FormControl>
                        <Input placeholder="DUT Gestion des Entreprises" {...field} />
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
                        <Input placeholder="Formation en gestion d'entreprise..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="duration_years"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Durée (années)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="1" 
                            max="8" 
                            {...field} 
                            onChange={e => field.onChange(parseInt(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="total_credits"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Crédits ECTS</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="60" 
                            max="480" 
                            {...field} 
                            onChange={e => field.onChange(parseInt(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Annuler
                  </Button>
                  <Button type="submit">
                    {editingProgram ? 'Modifier' : 'Créer'}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center space-x-2">
        <Search className="w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher un programme..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="grid gap-4">
        {loading ? (
          <div className="text-center py-8">Chargement...</div>
        ) : filteredPrograms.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <GraduationCap className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">Aucun programme trouvé</h3>
              <p className="text-muted-foreground mb-4">
                Commencez par créer votre premier programme académique
              </p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Créer un programme
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredPrograms.map((program) => (
            <Card key={program.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <GraduationCap className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="flex items-center space-x-2">
                        <span>{program.name}</span>
                        <Badge variant="secondary">{program.code}</Badge>
                        <Badge variant={program.is_active ? "default" : "secondary"}>
                          {program.is_active ? "Actif" : "Inactif"}
                        </Badge>
                      </CardTitle>
                      <CardDescription>{program.description}</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(program)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(program.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Type:</span>
                    <p className="font-medium">{program.program_type}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Durée:</span>
                    <p className="font-medium">{program.duration_years} an(s)</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Crédits ECTS:</span>
                    <p className="font-medium">{program.total_credits}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Étudiants:</span>
                    <p className="font-medium">{program.students_count || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}