import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Search, Edit, Trash2, Layers, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { usePrograms } from '@/hooks/usePrograms';
import { supabase } from '@/integrations/supabase/client';

const levelSchema = z.object({
  code: z.string().min(2, 'Code minimum 2 caractères'),
  name: z.string().min(3, 'Nom minimum 3 caractères'),
  education_cycle: z.enum(['L1', 'L2', 'L3', 'M1', 'M2', 'D1', 'D2', 'D3', 'BTS1', 'BTS2', 'DUT1', 'DUT2']),
  order_index: z.number().min(1),
  duration_years: z.number().optional(),
  semesters: z.number().min(1).max(4),
  ects_credits: z.number().min(30).max(60)
});

type LevelForm = z.infer<typeof levelSchema>;

interface Level extends LevelForm {
  id: string;
  created_at: string;
  classes_count?: number;
  students_count?: number;
}

export function LevelsManager() {
  const [levels, setLevels] = useState<Level[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProgram, setSelectedProgram] = useState<string>('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingLevel, setEditingLevel] = useState<Level | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { programs } = usePrograms();

  const form = useForm<LevelForm>({
    resolver: zodResolver(levelSchema),
    defaultValues: {
      code: '',
      name: '',
      education_cycle: 'DUT1',
      order_index: 1,
      duration_years: 1,
      semesters: 2,
      ects_credits: 60
    }
  });

  React.useEffect(() => {
    fetchLevels();
  }, []);

  const fetchLevels = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('academic_levels')
        .select(`
          *,
          class_groups(count),
          students(count)
        `)
        .order('order_index');

      if (error) throw error;

      const levelsWithCounts = data?.map(level => ({
        id: level.id,
        code: level.code,
        name: level.name,
        education_cycle: level.education_cycle as any,
        order_index: level.order_index,
        duration_years: level.duration_years,
        semesters: level.semesters,
        ects_credits: level.ects_credits,
        created_at: level.created_at,
        classes_count: 0,
        students_count: 0
      })) || [];

      setLevels(levelsWithCounts);
    } catch (error) {
      console.error('Error fetching levels:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les niveaux",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: LevelForm) => {
    try {
      if (editingLevel) {
        const { error } = await supabase
          .from('academic_levels')
          .update(data)
          .eq('id', editingLevel.id);

        if (error) throw error;

        toast({
          title: "Succès",
          description: "Niveau modifié avec succès"
        });
      } else {
        const { error } = await supabase
          .from('academic_levels')
          .insert([data]);

        if (error) throw error;

        toast({
          title: "Succès",
          description: "Niveau créé avec succès"
        });
      }

      setIsDialogOpen(false);
      setEditingLevel(null);
      form.reset();
      fetchLevels();
    } catch (error) {
      console.error('Error saving level:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder le niveau",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (level: Level) => {
    setEditingLevel(level);
    form.reset(level);
    setIsDialogOpen(true);
  };

  const handleDelete = async (levelId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce niveau ?')) return;

    try {
      const { error } = await supabase
        .from('academic_levels')
        .delete()
        .eq('id', levelId);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Niveau supprimé avec succès"
      });

      fetchLevels();
    } catch (error) {
      console.error('Error deleting level:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le niveau",
        variant: "destructive"
      });
    }
  };

  const filteredLevels = levels.filter(level =>
    level.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    level.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getCycleColor = (cycle: string) => {
    const colors = {
      'DUT1': 'bg-blue-500',
      'DUT2': 'bg-blue-600',
      'BTS1': 'bg-green-500',
      'BTS2': 'bg-green-600',
      'L1': 'bg-purple-500',
      'L2': 'bg-purple-600',
      'L3': 'bg-purple-700',
      'M1': 'bg-orange-500',
      'M2': 'bg-orange-600',
      'D1': 'bg-red-500',
      'D2': 'bg-red-600',
      'D3': 'bg-red-700'
    };
    return colors[cycle as keyof typeof colors] || 'bg-gray-500';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Gestion des Niveaux</h2>
          <p className="text-muted-foreground">
            Configurez les niveaux d'études (1ère année, 2ème année...)
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingLevel(null);
              form.reset();
            }}>
              <Plus className="w-4 h-4 mr-2" />
              Nouveau Niveau
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingLevel ? 'Modifier le niveau' : 'Créer un nouveau niveau'}
              </DialogTitle>
              <DialogDescription>
                Définissez les caractéristiques du niveau d'études
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
                        <FormLabel>Code Niveau</FormLabel>
                        <FormControl>
                          <Input placeholder="DUTGE1" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="education_cycle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cycle d'études</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="DUT1">DUT 1ère année</SelectItem>
                            <SelectItem value="DUT2">DUT 2ème année</SelectItem>
                            <SelectItem value="BTS1">BTS 1ère année</SelectItem>
                            <SelectItem value="BTS2">BTS 2ème année</SelectItem>
                            <SelectItem value="L1">Licence 1</SelectItem>
                            <SelectItem value="L2">Licence 2</SelectItem>
                            <SelectItem value="L3">Licence 3</SelectItem>
                            <SelectItem value="M1">Master 1</SelectItem>
                            <SelectItem value="M2">Master 2</SelectItem>
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
                        <Input placeholder="1ère année DUT Gestion des Entreprises" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="order_index"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ordre</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="1" 
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
                    name="semesters"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Semestres</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="1" 
                            max="4" 
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
                    name="ects_credits"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Crédits ECTS</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="30" 
                            max="60" 
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
                    {editingLevel ? 'Modifier' : 'Créer'}
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
          placeholder="Rechercher un niveau..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="grid gap-4">
        {loading ? (
          <div className="text-center py-8">Chargement...</div>
        ) : filteredLevels.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <Layers className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">Aucun niveau trouvé</h3>
              <p className="text-muted-foreground mb-4">
                Commencez par créer votre premier niveau d'études
              </p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Créer un niveau
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredLevels.map((level) => (
            <Card key={level.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 rounded-lg ${getCycleColor(level.education_cycle)} flex items-center justify-center`}>
                      <Layers className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="flex items-center space-x-2">
                        <span>{level.name}</span>
                        <Badge variant="secondary">{level.code}</Badge>
                        <Badge variant="outline">{level.education_cycle}</Badge>
                      </CardTitle>
                      <CardDescription>
                        Ordre: {level.order_index} • {level.semesters} semestre(s) • {level.ects_credits} ECTS
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(level)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(level.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Cycle:</span>
                    <p className="font-medium">{level.education_cycle}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Semestres:</span>
                    <p className="font-medium">{level.semesters}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Classes:</span>
                    <p className="font-medium">{level.classes_count || 0}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Étudiants:</span>
                    <p className="font-medium">{level.students_count || 0}</p>
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