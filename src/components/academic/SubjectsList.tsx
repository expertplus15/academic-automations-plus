import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Clock, Edit, Trash2, BookOpen } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface Subject {
  id: string;
  name: string;
  code: string;
  description?: string;
  credits_ects: number;
  coefficient: number;
  hours_theory: number;
  hours_practice: number;
  hours_project: number;
  status: string;
  program_id?: string;
  level_id?: string;
  class_group_id?: string;
  prerequisites?: any;
  teaching_methods?: any;
  evaluation_methods?: any;
}

interface SubjectsListProps {
  subjects: Subject[] | undefined;
  loading: boolean;
  onEdit?: (subject: Subject) => void;
  onRefresh?: () => void;
}

export function SubjectsList({ subjects, loading, onEdit, onRefresh }: SubjectsListProps) {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');

  const handleDelete = async (subjectId: string, subjectName: string) => {
    try {
      const { error } = await supabase
        .from('subjects')
        .delete()
        .eq('id', subjectId);

      if (error) throw error;

      toast({
        title: 'Matière supprimée',
        description: `La matière "${subjectName}" a été supprimée avec succès.`,
      });

      onRefresh?.();
    } catch (error) {
      toast({
        title: 'Erreur',
        description: error instanceof Error ? error.message : 'Une erreur est survenue',
        variant: 'destructive'
      });
    }
  };

  const filteredSubjects = subjects?.filter(subject =>
    subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subject.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTotalHours = (subject: Subject) => {
    return (subject.hours_theory || 0) + (subject.hours_practice || 0) + (subject.hours_project || 0);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Matières</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-24 bg-muted rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Matières et Programmes d'Études
          </CardTitle>
        </div>
        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher une matière..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredSubjects?.map((subject) => (
            <div key={subject.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <div>
                    <h3 className="font-semibold text-lg">{subject.name}</h3>
                    <p className="text-sm text-muted-foreground">{subject.code}</p>
                  </div>
                  <Badge variant="outline">{subject.credits_ects} ECTS</Badge>
                  <Badge variant="secondary">
                    Coeff. {subject.coefficient}
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {getTotalHours(subject)}h
                  </Badge>
                  <Badge 
                    variant={subject.status === 'active' ? 'default' : 'secondary'}
                  >
                    {subject.status === 'active' ? 'Actif' : 'Inactif'}
                  </Badge>
                </div>
                {subject.description && (
                  <p className="text-sm text-muted-foreground mb-2">
                    {subject.description}
                  </p>
                )}
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  {subject.hours_theory > 0 && (
                    <span>Théorie: {subject.hours_theory}h</span>
                  )}
                  {subject.hours_practice > 0 && (
                    <span>Pratique: {subject.hours_practice}h</span>
                  )}
                  {subject.hours_project > 0 && (
                    <span>Projet: {subject.hours_project}h</span>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {onEdit && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => onEdit(subject)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                )}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Supprimer la matière</AlertDialogTitle>
                      <AlertDialogDescription>
                        Êtes-vous sûr de vouloir supprimer la matière "{subject.name}" ? Cette action est irréversible.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Annuler</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(subject.id, subject.name)}>
                        Supprimer
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))}
          
          {filteredSubjects?.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                Aucune matière trouvée
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}