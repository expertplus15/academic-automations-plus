import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Users, BookOpen } from 'lucide-react';
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Group {
  id: string;
  name: string;
  code: string;
  group_type: string;
  max_students: number;
  current_students?: number;
  academic_year_id?: string;
  program_id?: string;
  programs?: { name: string; code: string };
}

interface GroupsListProps {
  groups: Group[];
  loading: boolean;
  onEdit: (group: Group) => void;
  onRefresh: () => void;
}

export function GroupsList({ groups, loading, onEdit, onRefresh }: GroupsListProps) {
  const [deleting, setDeleting] = useState<string | null>(null);
  const { toast } = useToast();

  const handleDelete = async (group: Group) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer la classe "${group.name}" ?`)) {
      setDeleting(group.id);
      try {
        const { error } = await supabase
          .from('class_groups')
          .delete()
          .eq('id', group.id);

        if (error) throw error;

        toast({
          title: 'Succès',
          description: 'Classe supprimée avec succès',
        });

        onRefresh();
      } catch (error) {
        console.error('Error deleting group:', error);
        toast({
          title: 'Erreur',
          description: 'Une erreur est survenue lors de la suppression',
          variant: 'destructive'
        });
      } finally {
        setDeleting(null);
      }
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-3 bg-muted rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (groups.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Users className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Aucune classe trouvée</h3>
          <p className="text-muted-foreground text-center mb-4">
            Commencez par créer votre première classe pour organiser vos étudiants.
          </p>
        </CardContent>
      </Card>
    );
  }

  const getGroupTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      main: 'Classe Principale',
      td: 'Travaux Dirigés',
      tp: 'Travaux Pratiques',
      class: 'Classe',
      td_group: 'Groupe TD',
      tp_group: 'Groupe TP',
      project_group: 'Groupe Projet'
    };
    return labels[type] || type;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {groups.map((group) => (
        <Card key={group.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">{group.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{group.code}</p>
                {group.programs && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {group.programs.name}
                  </p>
                )}
              </div>
              <Badge variant="secondary">
                {getGroupTypeLabel(group.group_type)}
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span>Effectif</span>
              </div>
              <span className="font-medium">
                {group.current_students || 0} / {group.max_students}
              </span>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(group)}
                disabled={deleting === group.id}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDelete(group)}
                disabled={deleting === group.id}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}