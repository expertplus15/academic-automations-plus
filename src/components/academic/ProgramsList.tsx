import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Users, Edit, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface Program {
  id: string;
  name: string;
  code: string;
  description?: string;
  duration_years: number;
  department_id?: string; // Changed to optional to match hook
  created_at: string;
}

interface ProgramsListProps {
  programs: Program[] | undefined;
  loading: boolean;
  onEdit?: (program: Program) => void;
  onRefresh?: () => void;
}

export function ProgramsList({ programs, loading, onEdit, onRefresh }: ProgramsListProps) {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');

  const handleDelete = async (programId: string, programName: string) => {
    try {
      const { error } = await supabase
        .from('programs')
        .delete()
        .eq('id', programId);

      if (error) throw error;

      toast({
        title: 'Programme supprimé',
        description: `Le programme "${programName}" a été supprimé avec succès.`,
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

  const filteredPrograms = programs?.filter(program =>
    program.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    program.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Programmes d'Études</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-20 bg-muted rounded"></div>
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
          <CardTitle>Programmes d'Études</CardTitle>
          <Button asChild>
            <Link to="/academic/programs/new">
              <Plus className="h-4 w-4 mr-2" />
              Nouveau Programme
            </Link>
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un programme..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredPrograms?.map((program) => (
            <div key={program.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50">
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <div>
                    <h3 className="font-semibold text-lg">{program.name}</h3>
                    <p className="text-sm text-muted-foreground">{program.code}</p>
                  </div>
                  <Badge variant="secondary">{program.duration_years} ans</Badge>
                </div>
                {program.description && (
                  <p className="text-sm text-muted-foreground mt-2">
                    {program.description}
                  </p>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link to={`/students?program=${program.id}`}>
                    <Users className="h-4 w-4" />
                  </Link>
                </Button>
                {onEdit && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => onEdit(program)}
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
                      <AlertDialogTitle>Supprimer le programme</AlertDialogTitle>
                      <AlertDialogDescription>
                        Êtes-vous sûr de vouloir supprimer le programme "{program.name}" ? Cette action est irréversible.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Annuler</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(program.id, program.name)}>
                        Supprimer
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))}
          
          {filteredPrograms?.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                Aucun programme trouvé
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}