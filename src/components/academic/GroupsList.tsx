import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Edit, Trash2, Users, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface GroupsListProps {
  groups: any[];
  loading: boolean;
  onEdit: (group: any) => void;
  onRefresh: () => void;
}

const groupTypeLabels: Record<string, string> = {
  class: 'Classe',
  td: 'Travaux Dirigés',
  tp: 'Travaux Pratiques',
  project: 'Groupe de Projet',
};

const groupTypeColors: Record<string, string> = {
  class: 'default',
  td: 'secondary',
  tp: 'outline',
  project: 'destructive',
};

export function GroupsList({ groups, loading, onEdit, onRefresh }: GroupsListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { toast } = useToast();

  const handleDelete = async (group: any) => {
    setDeletingId(group.id);
    try {
      const { error } = await supabase
        .from('class_groups')
        .delete()
        .eq('id', group.id);

      if (error) throw error;

      toast({
        title: 'Groupe supprimé',
        description: 'Le groupe a été supprimé avec succès.',
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
          <CardTitle>Groupes et Classes</CardTitle>
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

  if (!groups || groups.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Groupes et Classes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">Aucun groupe</h3>
            <p className="text-muted-foreground">
              Commencez par créer votre premier groupe ou classe.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Groupes et Classes ({groups.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Programme</TableHead>
                <TableHead>Étudiants</TableHead>
                <TableHead>Capacité</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {groups.map((group) => (
                <TableRow key={group.id}>
                  <TableCell className="font-medium">
                    <div>
                      <div className="font-semibold">{group.name}</div>
                      {group.metadata?.description && (
                        <div className="text-sm text-muted-foreground">
                          {group.metadata.description}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{group.code}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={groupTypeColors[group.group_type] as any}>
                      {groupTypeLabels[group.group_type] || group.group_type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {group.programs ? (
                      <div className="text-sm">
                        <div className="font-medium">{group.programs.name}</div>
                        <div className="text-muted-foreground">{group.programs.code}</div>
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-sm">Non spécifié</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        {group.current_students || 0}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-medium">{group.max_students}</span>
                      <span className="text-sm text-muted-foreground">max</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(group)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            disabled={deletingId === group.id}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Supprimer le groupe</AlertDialogTitle>
                            <AlertDialogDescription>
                              Êtes-vous sûr de vouloir supprimer le groupe "{group.name}" ?
                              Cette action est irréversible.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Annuler</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(group)}
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