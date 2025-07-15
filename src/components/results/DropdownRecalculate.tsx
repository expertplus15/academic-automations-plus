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
  Loader2,
  ExternalLink
} from 'lucide-react';
import { useCalculationContext } from '@/contexts/CalculationContext';

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
  const { 
    state, 
    executeCalculation, 
    executeCalculationWithNavigation,
    navigateToCalculations 
  } = useCalculationContext();

  const handleCalculateAverages = async () => {
    if (!programId || !academicYearId) return;

    setLoading('averages');
    try {
      const success = await executeCalculation('averages', { programId, academicYearId });
      onCalculationComplete?.('averages', success);
    } finally {
      setLoading(null);
    }
  };

  const handleCalculateECTS = async () => {
    if (!programId || !academicYearId) return;

    setLoading('ects');
    try {
      const success = await executeCalculation('ects', { programId, academicYearId });
      onCalculationComplete?.('ects', success);
    } finally {
      setLoading(null);
    }
  };

  const handleRecalculateAll = async () => {
    if (!programId || !academicYearId) return;

    setLoading('all');
    try {
      const success = await executeCalculation('all', { programId, academicYearId });
      onCalculationComplete?.('all', success);
    } finally {
      setLoading(null);
    }
  };

  const handleAdvancedCalculations = () => {
    navigateToCalculations();
  };

  const handleAdvancedCalculationsWithContext = () => {
    const currentTab = state.lastCalculationType === 'ects' ? 'processing' : 'auto';
    navigateToCalculations(currentTab);
  };

  const isLoading = loading !== null || state.activeCalculations.size > 0;
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
          onClick={handleAdvancedCalculationsWithContext}
          disabled={isLoading}
          className="cursor-pointer"
        >
          <Settings className="w-4 h-4 mr-2" />
          <div className="flex-1">
            <div className="font-medium">Calculs avancés</div>
            <div className="text-xs text-muted-foreground">Interface complète et paramètres</div>
          </div>
          <ExternalLink className="w-3 h-3 ml-2 text-muted-foreground" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}