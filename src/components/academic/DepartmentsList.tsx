import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Building, Users, GraduationCap, Plus, Edit, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface Department {
  id: string;
  name: string;
  code: string;
  head_id?: string;
  created_at: string;
  description?: string;
}

interface DepartmentsListProps {
  departments: Department[] | undefined;
  loading?: boolean;
  onEdit?: (department: Department) => void;
  onRefresh?: () => void;
}

export function DepartmentsList({ departments, loading, onEdit, onRefresh }: DepartmentsListProps) {
  const { toast } = useToast();

  const handleDelete = async (departmentId: string) => {
    try {
      const { error } = await supabase
        .from('departments')
        .delete()
        .eq('id', departmentId);

      if (error) throw error;

      toast({
        title: 'Département supprimé',
        description: 'Le département a été supprimé avec succès.',
      });

      onRefresh?.();
    } catch (error) {
      toast({
        title: 'Erreur',
        description: error instanceof Error ? error.message : 'Impossible de supprimer le département',
        variant: 'destructive'
      });
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-muted rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments?.map((department) => (
          <Card key={department.id} className="border hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Building className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{department.name}</h3>
                    <p className="text-sm text-muted-foreground">{department.code}</p>
                  </div>
                </div>
                <div className="flex space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit?.(department)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Supprimer le département</AlertDialogTitle>
                        <AlertDialogDescription>
                          Êtes-vous sûr de vouloir supprimer le département "{department.name}" ? 
                          Cette action est irréversible et supprimera également tous les programmes associés.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(department.id)}
                          className="bg-destructive hover:bg-destructive/90"
                        >
                          Supprimer
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
              
              {department.description && (
                <p className="text-sm text-muted-foreground mb-4">{department.description}</p>
              )}
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Enseignants</span>
                  </div>
                  <Badge variant="secondary">-</Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <GraduationCap className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Programmes</span>
                  </div>
                  <Badge variant="secondary">-</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {(!departments || departments.length === 0) && !loading && (
          <div className="col-span-full text-center py-12">
            <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">
              Aucun département configuré
            </p>
            <p className="text-sm text-muted-foreground">
              Créez votre premier département pour commencer à organiser votre structure académique.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}