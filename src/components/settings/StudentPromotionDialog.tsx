
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { useAcademicYears } from '@/hooks/useAcademicYears';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { TrendingUp, Users, AlertCircle } from 'lucide-react';

interface StudentPromotionDialogProps {
  trigger: React.ReactNode;
}

export function StudentPromotionDialog({ trigger }: StudentPromotionDialogProps) {
  const [open, setOpen] = useState(false);
  const [fromYearId, setFromYearId] = useState<string>('');
  const [toYearId, setToYearId] = useState<string>('');
  const [processing, setProcessing] = useState(false);
  const { academicYears } = useAcademicYears();
  const { toast } = useToast();

  // Pré-remplir avec les IDs connus
  const year2023_2024 = '69154c70-02c8-4705-8def-d1bca954d4a4';
  const year2024_2025 = 'f1ec50ec-0c44-4d39-bb8c-7196ed385a3a';

  const handlePromote = async () => {
    if (!fromYearId || !toYearId) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner les deux années académiques",
        variant: "destructive"
      });
      return;
    }

    if (fromYearId === toYearId) {
      toast({
        title: "Erreur",
        description: "Les années source et destination doivent être différentes",
        variant: "destructive"
      });
      return;
    }

    setProcessing(true);
    try {
      const { data, error } = await supabase.rpc('promote_students_to_next_year', {
        p_from_year_id: fromYearId,
        p_to_year_id: toYearId
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Promotion réussie",
        description: `${data || 0} étudiants ont été promus avec succès`,
      });
      
      setOpen(false);
      setFromYearId('');
      setToYearId('');
    } catch (error: any) {
      console.error('Erreur lors de la promotion:', error);
      toast({
        title: "Erreur",
        description: error.message || "Erreur lors de la promotion des étudiants",
        variant: "destructive"
      });
    } finally {
      setProcessing(false);
    }
  };

  const getYearDisplay = (year: any) => {
    const badges = [];
    if (year.is_current) badges.push(<Badge key="current" variant="destructive" className="text-xs">Actuelle</Badge>);
    if (year.validation_status === 'validated') badges.push(<Badge key="validated" variant="default" className="text-xs">Validée</Badge>);
    if (year.is_archived) badges.push(<Badge key="archived" variant="outline" className="text-xs">Archivée</Badge>);
    
    return (
      <div className="flex items-center justify-between">
        <span>{year.name}</span>
        <div className="flex gap-1">{badges}</div>
      </div>
    );
  };

  const validatedYears = academicYears.filter(year => year.validation_status === 'validated');

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Promotion des étudiants
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Cette action va transférer tous les étudiants actifs de l'année source vers l'année destination.
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <label className="text-sm font-medium">Année source (départ)</label>
            <Select value={fromYearId} onValueChange={setFromYearId}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner l'année source" />
              </SelectTrigger>
              <SelectContent>
                {validatedYears.map((year) => (
                  <SelectItem key={year.id} value={year.id}>
                    {getYearDisplay(year)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Année destination (arrivée)</label>
            <Select value={toYearId} onValueChange={setToYearId}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner l'année destination" />
              </SelectTrigger>
              <SelectContent>
                {validatedYears.map((year) => (
                  <SelectItem key={year.id} value={year.id}>
                    {getYearDisplay(year)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Suggestion pour le transfert 2023-2024 → 2024-2025 */}
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">Suggestion</span>
            </div>
            <p className="text-sm text-blue-700 mb-2">
              Transfert des étudiants de 2023-2024 vers 2024-2025 ?
            </p>
            <Button 
              size="sm" 
              variant="outline" 
              className="text-blue-600 border-blue-300 hover:bg-blue-100"
              onClick={() => {
                setFromYearId(year2023_2024);
                setToYearId(year2024_2025);
              }}
            >
              Pré-remplir
            </Button>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Annuler
            </Button>
            <Button 
              onClick={handlePromote} 
              disabled={processing || !fromYearId || !toYearId}
              className="gap-2"
            >
              {processing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Promotion en cours...
                </>
              ) : (
                <>
                  <TrendingUp className="w-4 h-4" />
                  Promouvoir les étudiants
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
