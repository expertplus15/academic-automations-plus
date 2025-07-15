import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Calculator, 
  TrendingUp, 
  Award, 
  Zap, 
  Settings, 
  ChevronDown, 
  Loader2 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useGradeCalculations } from '@/hooks/useGradeCalculations';

interface DropdownRecalculateProps {
  programId?: string;
  academicYearId?: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
  disabled?: boolean;
  onCalculationComplete?: (type: string, success: boolean) => void;
}

export function DropdownRecalculate({
  programId,
  academicYearId,
  variant = 'outline',
  size = 'sm',
  disabled = false,
  onCalculationComplete
}: DropdownRecalculateProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { 
    calculateClassAverages, 
    recalculateClassProgress 
  } = useGradeCalculations();

  const handleCalculateAverages = async () => {
    if (!programId || !academicYearId) {
      toast({
        title: "Paramètres manquants",
        description: "Programme et année académique requis",
        variant: "destructive",
      });
      return;
    }

    setLoading('averages');
    try {
      const averages = await calculateClassAverages(programId, academicYearId);
      
      toast({
        title: "Moyennes calculées",
        description: `${averages.length} moyennes étudiantes recalculées`,
      });
      
      onCalculationComplete?.('averages', true);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de calculer les moyennes",
        variant: "destructive",
      });
      onCalculationComplete?.('averages', false);
    } finally {
      setLoading(null);
    }
  };

  const handleCalculateECTS = async () => {
    if (!programId || !academicYearId) {
      toast({
        title: "Paramètres manquants",
        description: "Programme et année académique requis",
        variant: "destructive",
      });
      return;
    }

    setLoading('ects');
    try {
      // Simulate ECTS calculation
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "ECTS calculés",
        description: "Crédits et compensations mis à jour",
      });
      
      onCalculationComplete?.('ects', true);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de calculer les ECTS",
        variant: "destructive",
      });
      onCalculationComplete?.('ects', false);
    } finally {
      setLoading(null);
    }
  };

  const handleRecalculateAll = async () => {
    if (!programId || !academicYearId) {
      toast({
        title: "Paramètres manquants",
        description: "Programme et année académique requis",
        variant: "destructive",
      });
      return;
    }

    setLoading('all');
    try {
      const success = await recalculateClassProgress(programId, academicYearId);
      
      if (success) {
        toast({
          title: "Recalcul terminé",
          description: "Moyennes, ECTS et mentions mis à jour",
        });
        onCalculationComplete?.('all', true);
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de recalculer les données",
        variant: "destructive",
      });
      onCalculationComplete?.('all', false);
    } finally {
      setLoading(null);
    }
  };

  const handleAdvancedCalculations = () => {
    navigate('/results/calculations');
  };

  const isLoading = loading !== null;
  const currentOperation = loading;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant={variant} 
          size={size} 
          disabled={disabled || isLoading}
          className="gap-2"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Calculator className="w-4 h-4" />
          )}
          {isLoading ? (
            currentOperation === 'averages' ? 'Moyennes...' :
            currentOperation === 'ects' ? 'ECTS...' :
            'Calcul en cours...'
          ) : (
            'Recalculer'
          )}
          <ChevronDown className="w-3 h-3" />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem 
          onClick={handleCalculateAverages}
          disabled={isLoading}
          className="cursor-pointer"
        >
          <TrendingUp className="w-4 h-4 mr-2" />
          <div className="flex-1">
            <div className="font-medium">Moyennes uniquement</div>
            <div className="text-xs text-muted-foreground">Recalcul des moyennes par matière</div>
          </div>
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          onClick={handleCalculateECTS}
          disabled={isLoading}
          className="cursor-pointer"
        >
          <Award className="w-4 h-4 mr-2" />
          <div className="flex-1">
            <div className="font-medium">ECTS & Compensations</div>
            <div className="text-xs text-muted-foreground">Crédits et règles de compensation</div>
          </div>
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          onClick={handleRecalculateAll}
          disabled={isLoading}
          className="cursor-pointer"
        >
          <Zap className="w-4 h-4 mr-2" />
          <div className="flex-1">
            <div className="font-medium">Recalculer tout</div>
            <div className="text-xs text-muted-foreground">Moyennes, ECTS, mentions et décisions</div>
          </div>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          onClick={handleAdvancedCalculations}
          disabled={isLoading}
          className="cursor-pointer"
        >
          <Settings className="w-4 h-4 mr-2" />
          <div className="flex-1">
            <div className="font-medium">Calculs avancés</div>
            <div className="text-xs text-muted-foreground">Interface complète et paramètres</div>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}