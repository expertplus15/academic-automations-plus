import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useAcademicYears } from '@/hooks/useAcademicYears';
import { supabase } from '@/integrations/supabase/client';
import { StudentPromotionDialog } from './StudentPromotionDialog';
import { 
  Calendar, 
  CheckCircle, 
  Archive, 
  AlertCircle,
  Users,
  BookOpen,
  Settings,
  TrendingUp
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export function AcademicSystemSettings() {
  const { academicYears, currentYear, loading, refetch } = useAcademicYears();
  const [processingAction, setProcessingAction] = useState<string | null>(null);
  const { toast } = useToast();

  const handleValidateYear = async (yearId: string) => {
    try {
      setProcessingAction(yearId);
      const { error } = await supabase.rpc('validate_academic_year', {
        p_year_id: yearId
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Année validée",
        description: "L'année académique a été validée avec succès",
      });
      refetch();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Erreur lors de la validation",
        variant: "destructive"
      });
    } finally {
      setProcessingAction(null);
    }
  };

  const handleArchiveYear = async (yearId: string) => {
    try {
      setProcessingAction(yearId);
      const { error } = await supabase.rpc('archive_academic_year', {
        p_year_id: yearId
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Année archivée",
        description: "L'année académique a été archivée avec succès",
      });
      refetch();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Erreur lors de l'archivage",
        variant: "destructive"
      });
    } finally {
      setProcessingAction(null);
    }
  };

  const getStatusBadge = (year: any) => {
    if (year.is_archived) {
      return <Badge variant="outline" className="bg-gray-100">Archivée</Badge>;
    }
    if (year.validation_status === 'validated') {
      return <Badge variant="default" className="bg-green-500">Validée</Badge>;
    }
    if (year.validation_status === 'draft') {
      return <Badge variant="secondary">Brouillon</Badge>;
    }
    return null;
  };

  const getActionButtons = (year: any) => {
    const buttons = [];
    
    if (year.validation_status === 'draft') {
      buttons.push(
        <Button
          key="validate"
          size="sm"
          onClick={() => handleValidateYear(year.id)}
          disabled={processingAction === year.id}
          className="gap-1"
        >
          <CheckCircle className="w-3 h-3" />
          Valider
        </Button>
      );
    }

    if (year.validation_status === 'validated' && !year.is_archived) {
      buttons.push(
        <Button
          key="archive"
          size="sm"
          variant="outline"
          onClick={() => handleArchiveYear(year.id)}
          disabled={processingAction === year.id}
          className="gap-1"
        >
          <Archive className="w-3 h-3" />
          Archiver
        </Button>
      );
    }

    return buttons;
  };

  const stats = [
    {
      title: "Années totales",
      value: academicYears.length,
      icon: Calendar,
      color: "text-blue-500"
    },
    {
      title: "Année courante",
      value: currentYear ? "1" : "0",
      icon: TrendingUp,
      color: "text-green-500"
    },
    {
      title: "Validées",
      value: academicYears.filter(y => y.validation_status === 'validated').length,
      icon: CheckCircle,
      color: "text-purple-500"
    },
    {
      title: "Archivées",
      value: academicYears.filter(y => y.is_archived).length,
      icon: Archive,
      color: "text-gray-500"
    }
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-64 mb-4"></div>
          <div className="grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Gestion des Années Académiques</h3>
          <p className="text-sm text-muted-foreground">
            Configuration et validation des années académiques
          </p>
        </div>
        <Button variant="outline" className="gap-2">
          <Settings className="w-4 h-4" />
          Paramètres avancés
        </Button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Liste des années académiques */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Années académiques
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {academicYears.map((year) => (
              <div key={year.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{year.name}</h4>
                      {year.is_current && (
                        <Badge variant="destructive" className="text-xs">
                          Actuelle
                        </Badge>
                      )}
                      {getStatusBadge(year)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {format(new Date(year.start_date), 'dd MMM yyyy', { locale: fr })} - {' '}
                      {format(new Date(year.end_date), 'dd MMM yyyy', { locale: fr })}
                    </div>
                    {year.validated_by_profile && (
                      <div className="text-xs text-muted-foreground mt-1">
                        Validé par {year.validated_by_profile.full_name}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getActionButtons(year)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Actions avancées */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Actions sur les étudiants
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Promotion automatique des étudiants</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Transférer automatiquement les étudiants vers la nouvelle année académique
              </p>
              <StudentPromotionDialog
                trigger={
                  <Button variant="outline" className="gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Promouvoir les étudiants
                  </Button>
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
