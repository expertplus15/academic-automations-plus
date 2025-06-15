import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Edit, Trash2, Users, BookOpen } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PathwaysListProps {
  pathways: any[];
  loading: boolean;
  onEdit: (pathway: any) => void;
  onRefresh: () => void;
}

export function PathwaysList({ pathways, loading, onEdit, onRefresh }: PathwaysListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { toast } = useToast();

  const handleDelete = async (pathway: any) => {
    setDeletingId(pathway.id);
    try {
      const { error } = await supabase
        .from('specializations')
        .delete()
        .eq('id', pathway.id);

      if (error) throw error;

      toast({
        title: 'Filière supprimée',
        description: 'La filière a été supprimée avec succès.',
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
          <CardTitle>Filières disponibles</CardTitle>
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

  if (!pathways || pathways.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Filières disponibles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">Aucune filière</h3>
            <p className="text-muted-foreground">
              Commencez par créer votre première filière de spécialisation.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Filières disponibles ({pathways.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Programme</TableHead>
                <TableHead>Crédits</TableHead>
                <TableHead>Max étudiants</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pathways.map((pathway) => (
                <TableRow key={pathway.id}>
                  <TableCell className="font-medium">
                    <div>
                      <div className="font-semibold">{pathway.name}</div>
                      {pathway.description && (
                        <div className="text-sm text-muted-foreground mt-1 max-w-xs truncate">
                          {pathway.description}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{pathway.code}</Badge>
                  </TableCell>
                  <TableCell>
                    {pathway.programs ? (
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{pathway.programs.name}</span>
                        <Badge variant="secondary" className="text-xs">
                          {pathway.programs.code}
                        </Badge>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">Non défini</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {pathway.credits_required ? (
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        <span>{pathway.credits_required} ECTS</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {pathway.max_students ? (
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        <span>{pathway.max_students}</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">Illimité</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={pathway.is_mandatory ? "default" : "secondary"}>
                      {pathway.is_mandatory ? "Obligatoire" : "Optionnelle"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(pathway)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            disabled={deletingId === pathway.id}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Supprimer la filière</AlertDialogTitle>
                            <AlertDialogDescription>
                              Êtes-vous sûr de vouloir supprimer la filière "{pathway.name}" ?
                              Cette action est irréversible.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Annuler</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(pathway)}
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