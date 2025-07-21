import React, { useState } from 'react';
import { useAcademicYears } from '@/hooks/useAcademicYears';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from '@/components/ui/alert-dialog';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CheckCircle, Archive, RotateCcw, Users, Calendar } from 'lucide-react';

export function AcademicYearManagement() {
  const { academicYears, loading, refetch } = useAcademicYears();
  const { toast } = useToast();
  const [operationLoading, setOperationLoading] = useState<string | null>(null);
  const [selectedFromYear, setSelectedFromYear] = useState<string>('');
  const [selectedToYear, setSelectedToYear] = useState<string>('');

  const handleValidateYear = async (yearId: string) => {
    try {
      setOperationLoading(yearId);
      const { error } = await supabase.rpc('validate_academic_year', {
        p_year_id: yearId
      });

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Année académique validée avec succès",
      });
      
      refetch();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de valider l'année académique",
        variant: "destructive",
      });
    } finally {
      setOperationLoading(null);
    }
  };

  const handleArchiveYear = async (yearId: string) => {
    try {
      setOperationLoading(yearId);
      const { error } = await supabase.rpc('archive_academic_year', {
        p_year_id: yearId
      });

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Année académique archivée avec succès",
      });
      
      refetch();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'archiver l'année académique",
        variant: "destructive",
      });
    } finally {
      setOperationLoading(null);
    }
  };

  const handleUnarchiveYear = async (yearId: string) => {
    try {
      setOperationLoading(yearId);
      const { error } = await supabase.rpc('unarchive_academic_year', {
        p_year_id: yearId
      });

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Année académique désarchivée avec succès",
      });
      
      refetch();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de désarchiver l'année académique",
        variant: "destructive",
      });
    } finally {
      setOperationLoading(null);
    }
  };

  const handlePromoteStudents = async () => {
    if (!selectedFromYear || !selectedToYear) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner les années source et destination",
        variant: "destructive",
      });
      return;
    }

    try {
      setOperationLoading('promote');
      const { data: promotedCount, error } = await supabase.rpc('promote_students_to_next_year', {
        p_from_year_id: selectedFromYear,
        p_to_year_id: selectedToYear
      });

      if (error) throw error;

      toast({
        title: "Succès",
        description: `${promotedCount} étudiants ont été promus vers l'année suivante`,
      });
      
      setSelectedFromYear('');
      setSelectedToYear('');
      refetch();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de faire passer les étudiants à l'année suivante",
        variant: "destructive",
      });
    } finally {
      setOperationLoading(null);
    }
  };

  const getStatusBadge = (year: any) => {
    if (year.validation_status === 'archived') {
      return <Badge variant="secondary">Archivée</Badge>;
    }
    if (year.validation_status === 'validated') {
      return <Badge variant="default">Validée</Badge>;
    }
    return <Badge variant="outline">Brouillon</Badge>;
  };

  const getStatusActions = (year: any) => {
    const isLoading = operationLoading === year.id;
    
    if (year.validation_status === 'draft') {
      return (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button size="sm" disabled={isLoading}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Valider
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Valider l'année académique</AlertDialogTitle>
              <AlertDialogDescription>
                Êtes-vous sûr de vouloir valider l'année {year.name} ? 
                Cette action permettra d'archiver l'année et de faire passer les étudiants à l'année suivante.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction onClick={() => handleValidateYear(year.id)}>
                Valider
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      );
    }

    if (year.validation_status === 'validated') {
      return (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button size="sm" variant="outline" disabled={isLoading}>
              <Archive className="h-4 w-4 mr-2" />
              Archiver
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Archiver l'année académique</AlertDialogTitle>
              <AlertDialogDescription>
                Êtes-vous sûr de vouloir archiver l'année {year.name} ? 
                Les données seront conservées mais l'année ne sera plus modifiable.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction onClick={() => handleArchiveYear(year.id)}>
                Archiver
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      );
    }

    if (year.validation_status === 'archived') {
      return (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button size="sm" variant="outline" disabled={isLoading}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Désarchiver
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Désarchiver l'année académique</AlertDialogTitle>
              <AlertDialogDescription>
                Êtes-vous sûr de vouloir désarchiver l'année {year.name} ? 
                Cela permettra de nouveau les modifications sur cette année.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction onClick={() => handleUnarchiveYear(year.id)}>
                Désarchiver
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      );
    }
  };

  const validatedYears = academicYears.filter(y => y.validation_status === 'validated');
  const draftYears = academicYears.filter(y => y.validation_status === 'draft');

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Gestion des Années Académiques
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {academicYears.map((year) => (
              <div
                key={year.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <div>
                    <h3 className="font-medium">{year.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {new Date(year.start_date).toLocaleDateString()} - {new Date(year.end_date).toLocaleDateString()}
                    </p>
                  </div>
                  {getStatusBadge(year)}
                  {year.is_current && (
                    <Badge variant="default">Courante</Badge>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {getStatusActions(year)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Promotion des Étudiants
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Année source (validée)</label>
                <Select value={selectedFromYear} onValueChange={setSelectedFromYear}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner l'année source" />
                  </SelectTrigger>
                  <SelectContent>
                    {validatedYears.map((year) => (
                      <SelectItem key={year.id} value={year.id}>
                        {year.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Année destination</label>
                <Select value={selectedToYear} onValueChange={setSelectedToYear}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner l'année destination" />
                  </SelectTrigger>
                  <SelectContent>
                    {draftYears.map((year) => (
                      <SelectItem key={year.id} value={year.id}>
                        {year.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button 
              onClick={handlePromoteStudents}
              disabled={!selectedFromYear || !selectedToYear || operationLoading === 'promote'}
            >
              <Users className="h-4 w-4 mr-2" />
              Faire passer les étudiants à l'année suivante
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}