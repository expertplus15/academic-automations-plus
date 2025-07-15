import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCalculationNotifications } from '@/hooks/useCalculationNotifications';
import { useGradeCalculations } from '@/hooks/useGradeCalculations';
import { useToast } from '@/hooks/use-toast';

export interface CalculationState {
  activeCalculations: Set<string>;
  lastCalculationType?: string;
  currentContext: 'entry' | 'calculations' | 'results' | 'unknown';
  quickAccessEnabled: boolean;
}

export interface CalculationContextType {
  state: CalculationState;
  notifications: ReturnType<typeof useCalculationNotifications>;
  calculations: ReturnType<typeof useGradeCalculations>;
  
  // Navigation methods
  navigateToCalculations: (tab?: string) => void;
  navigateToEntry: () => void;
  navigateToResults: () => void;
  
  // Calculation methods with context awareness
  executeCalculation: (type: string, params?: any) => Promise<boolean>;
  executeCalculationWithNavigation: (type: string, targetRoute?: string) => Promise<void>;
  
  // State management
  setQuickAccessEnabled: (enabled: boolean) => void;
  updateContext: () => void;
}

const CalculationContext = createContext<CalculationContextType | undefined>(undefined);

export function CalculationProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  const notifications = useCalculationNotifications();
  const calculations = useGradeCalculations();
  
  const [state, setState] = useState<CalculationState>({
    activeCalculations: new Set(),
    currentContext: 'unknown',
    quickAccessEnabled: true,
  });

  // Update context based on current route
  const updateContext = useCallback(() => {
    const path = location.pathname;
    let context: CalculationState['currentContext'] = 'unknown';
    
    if (path.includes('/results/grade-entry') || path.includes('/results/matrix')) {
      context = 'entry';
    } else if (path.includes('/results/calculations')) {
      context = 'calculations';
    } else if (path.includes('/results/') && 
               (path.includes('analytics') || path.includes('reports') || path.includes('documents'))) {
      context = 'results';
    }
    
    setState(prev => ({ ...prev, currentContext: context }));
  }, [location.pathname]);

  useEffect(() => {
    updateContext();
  }, [updateContext]);

  // Navigation methods
  const navigateToCalculations = useCallback((tab?: string) => {
    const path = tab ? `/results/calculations?tab=${tab}` : '/results/calculations';
    navigate(path);
  }, [navigate]);

  const navigateToEntry = useCallback(() => {
    navigate('/results/grade-entry');
  }, [navigate]);

  const navigateToResults = useCallback(() => {
    navigate('/results/analytics');
  }, [navigate]);

  // Enhanced calculation execution with context
  const executeCalculation = useCallback(async (type: string, params: any = {}): Promise<boolean> => {
    const calculationId = `${type}-${Date.now()}`;
    
    setState(prev => ({
      ...prev,
      activeCalculations: new Set([...prev.activeCalculations, calculationId]),
      lastCalculationType: type
    }));

    const notificationId = notifications.notifyCalculationStart(
      type as any,
      `Calcul ${type} en cours...`
    );

    try {
      let success = false;
      
      switch (type) {
        case 'averages':
          if (params.programId && params.academicYearId) {
            const result = await calculations.calculateClassAverages(
              params.programId, 
              params.academicYearId
            );
            success = result.length > 0;
          }
          break;
          
        case 'ects':
          // Simulate ECTS calculation
          await new Promise(resolve => setTimeout(resolve, 1500));
          success = true;
          break;
          
        case 'all':
          if (params.programId && params.academicYearId) {
            success = await calculations.recalculateClassProgress(
              params.programId, 
              params.academicYearId
            );
          }
          break;
          
        default:
          throw new Error(`Type de calcul non supporté: ${type}`);
      }

      if (success) {
        notifications.notifyCalculationSuccess(
          notificationId,
          `Calcul ${type} terminé avec succès`
        );
      } else {
        throw new Error('Calcul échoué');
      }

      return success;
    } catch (error) {
      notifications.notifyCalculationError(
        notificationId,
        error instanceof Error ? error.message : 'Erreur inconnue'
      );
      return false;
    } finally {
      setState(prev => {
        const newActiveCalculations = new Set(prev.activeCalculations);
        newActiveCalculations.delete(calculationId);
        return {
          ...prev,
          activeCalculations: newActiveCalculations
        };
      });
    }
  }, [calculations, notifications]);

  // Execute calculation with smart navigation
  const executeCalculationWithNavigation = useCallback(async (
    type: string, 
    targetRoute?: string
  ) => {
    const success = await executeCalculation(type);
    
    if (success && targetRoute) {
      // Smart navigation with context preservation
      const params = new URLSearchParams();
      params.set('from', state.currentContext);
      params.set('calculation', type);
      
      const fullRoute = targetRoute.includes('?') 
        ? `${targetRoute}&${params.toString()}`
        : `${targetRoute}?${params.toString()}`;
      
      navigate(fullRoute);
    }
  }, [executeCalculation, navigate, state.currentContext]);

  const setQuickAccessEnabled = useCallback((enabled: boolean) => {
    setState(prev => ({ ...prev, quickAccessEnabled: enabled }));
  }, []);

  const contextValue: CalculationContextType = {
    state,
    notifications,
    calculations,
    navigateToCalculations,
    navigateToEntry,
    navigateToResults,
    executeCalculation,
    executeCalculationWithNavigation,
    setQuickAccessEnabled,
    updateContext
  };

  return (
    <CalculationContext.Provider value={contextValue}>
      {children}
    </CalculationContext.Provider>
  );
}

export function useCalculationContext() {
  const context = useContext(CalculationContext);
  if (context === undefined) {
    throw new Error('useCalculationContext must be used within a CalculationProvider');
  }
  return context;
}