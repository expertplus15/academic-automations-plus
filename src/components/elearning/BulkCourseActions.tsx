import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  BookOpen, 
  Eye,
  Edit,
  Trash2,
  Download,
  Upload,
  Settings,
  CheckSquare
} from 'lucide-react';

interface BulkCourseActionsProps {
  courses: any[];
  selectedCourses: string[];
  onSelectionChange: (courseIds: string[]) => void;
  onRefresh: () => void;
}

export function BulkCourseActions({ 
  courses, 
  selectedCourses, 
  onSelectionChange,
  onRefresh 
}: BulkCourseActionsProps) {
  const { toast } = useToast();
  const [bulkAction, setBulkAction] = useState('');
  const [loading, setLoading] = useState(false);

  const allSelected = selectedCourses.length === courses.length;
  const someSelected = selectedCourses.length > 0 && selectedCourses.length < courses.length;

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectionChange(courses.map(c => c.id));
    } else {
      onSelectionChange([]);
    }
  };

  const executeBulkAction = async () => {
    if (!bulkAction || selectedCourses.length === 0) return;

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: "Succès",
        description: `Action "${bulkAction}" effectuée sur ${selectedCourses.length} cours`
      });
      onRefresh();
      onSelectionChange([]);
      setBulkAction('');
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-white rounded-2xl shadow-sm border-0">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-cyan-500" />
            Actions Groupées - Cours
          </div>
          {selectedCourses.length > 0 && (
            <Badge variant="secondary">
              {selectedCourses.length} sélectionné{selectedCourses.length > 1 ? 's' : ''}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
          <Checkbox
            checked={allSelected}
            ref={(el) => {
              if (el) (el as HTMLInputElement).indeterminate = someSelected;
            }}
            onCheckedChange={handleSelectAll}
          />
          <span className="text-sm font-medium">
            {allSelected ? 'Tout désélectionner' : 'Tout sélectionner'}
          </span>
        </div>

        {selectedCourses.length > 0 && (
          <>
            <Select value={bulkAction} onValueChange={setBulkAction}>
              <SelectTrigger>
                <SelectValue placeholder="Choisir une action..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="publish">Publier les cours</SelectItem>
                <SelectItem value="unpublish">Dépublier les cours</SelectItem>
                <SelectItem value="duplicate">Dupliquer les cours</SelectItem>
                <SelectItem value="export">Exporter les données</SelectItem>
                <SelectItem value="archive">Archiver les cours</SelectItem>
              </SelectContent>
            </Select>

            <Button 
              onClick={executeBulkAction} 
              disabled={!bulkAction || loading}
              className="w-full"
            >
              {loading ? (
                <>
                  <Settings className="w-4 h-4 mr-2 animate-spin" />
                  Traitement...
                </>
              ) : (
                <>
                  <CheckSquare className="w-4 h-4 mr-2" />
                  Exécuter l'action
                </>
              )}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}