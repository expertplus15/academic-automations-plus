import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Edit, Trash2, GraduationCap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface LevelsListProps {
  levels: any[];
  loading: boolean;
  onEdit: (level: any) => void;
  onRefresh: () => void;
}

const cycleLabels: Record<string, string> = {
  license: 'Licence',
  master: 'Master',
  doctorat: 'Doctorat',
  prepa: 'Classes Préparatoires',
  bts: 'BTS/DUT',
};

const cycleColors: Record<string, string> = {
  license: 'default',
  master: 'secondary',
  doctorat: 'destructive',
  prepa: 'outline',
  bts: 'secondary',
};

export function LevelsList({ levels, loading, onEdit, onRefresh }: LevelsListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { toast } = useToast();

  const handleDelete = async (level: any) => {
    setDeletingId(level.id);
    try {
      const { error } = await supabase
        .from('academic_levels')
        .delete()
        .eq('id', level.id);

      if (error) throw error;

      toast({
        title: 'Niveau supprimé',
        description: 'Le niveau a été supprimé avec succès.',
      });
      
      onRefresh();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue lors de la suppression.',
        variant: 'destructive',
      });
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Niveaux d'études disponibles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!levels || levels.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Niveaux d'études disponibles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <GraduationCap className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">Aucun niveau</h3>
            <p className="text-muted-foreground">
              Commencez par créer votre premier niveau d'études.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Tri des niveaux par ordre d'affichage
  const sortedLevels = [...levels].sort((a, b) => a.order_index - b.order_index);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Niveaux d'études disponibles ({levels.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Cycle</TableHead>
                <TableHead>Ordre</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedLevels.map((level) => (
                <TableRow key={level.id}>
                  <TableCell className="font-medium">
                    <div className="font-semibold">{level.name}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{level.code}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={cycleColors[level.education_cycle] as any}>
                      {cycleLabels[level.education_cycle] || level.education_cycle}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-medium">{level.order_index}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(level)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            disabled={deletingId === level.id}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Supprimer le niveau</AlertDialogTitle>
                            <AlertDialogDescription>
                              Êtes-vous sûr de vouloir supprimer le niveau "{level.name}" ?
                              Cette action est irréversible.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Annuler</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(level)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Supprimer
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}