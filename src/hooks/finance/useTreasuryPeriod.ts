import { useState, createContext, useContext } from 'react';

export type TreasuryPeriod = 'today' | 'yesterday' | 'week' | 'month' | 'quarter' | 'year';

interface TreasuryPeriodContextType {
  selectedPeriod: TreasuryPeriod;
  setSelectedPeriod: (period: TreasuryPeriod) => void;
  getPeriodLabel: (period: TreasuryPeriod) => string;
  getPeriodDates: (period: TreasuryPeriod) => { start: Date; end: Date };
}

export const TreasuryPeriodContext = createContext<TreasuryPeriodContextType | null>(null);

export function useTreasuryPeriod() {
  const context = useContext(TreasuryPeriodContext);
  if (!context) {
    // Fallback pour les composants qui n'utilisent pas le provider
    const [selectedPeriod, setSelectedPeriod] = useState<TreasuryPeriod>('month');
    
    const getPeriodLabel = (period: TreasuryPeriod): string => {
      switch (period) {
        case 'today': return "Aujourd'hui";
        case 'yesterday': return "Hier";
        case 'week': return "Cette semaine";
        case 'month': return "Ce mois";
        case 'quarter': return "Ce trimestre";
        case 'year': return "Cette année";
        default: return "Ce mois";
      }
    };

    const getPeriodDates = (period: TreasuryPeriod): { start: Date; end: Date } => {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      switch (period) {
        case 'today':
          return { start: today, end: new Date(today.getTime() + 24 * 60 * 60 * 1000 - 1) };
        case 'yesterday':
          const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
          return { start: yesterday, end: new Date(yesterday.getTime() + 24 * 60 * 60 * 1000 - 1) };
        case 'week':
          const weekStart = new Date(today.getTime() - (today.getDay() - 1) * 24 * 60 * 60 * 1000);
          const weekEnd = new Date(weekStart.getTime() + 6 * 24 * 60 * 60 * 1000);
          return { start: weekStart, end: weekEnd };
        case 'month':
          const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
          const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
          return { start: monthStart, end: monthEnd };
        case 'quarter':
          const quarter = Math.floor(now.getMonth() / 3);
          const quarterStart = new Date(now.getFullYear(), quarter * 3, 1);
          const quarterEnd = new Date(now.getFullYear(), quarter * 3 + 3, 0);
          return { start: quarterStart, end: quarterEnd };
        case 'year':
          const yearStart = new Date(now.getFullYear(), 0, 1);
          const yearEnd = new Date(now.getFullYear(), 11, 31);
          return { start: yearStart, end: yearEnd };
        default:
          return { start: new Date(now.getFullYear(), now.getMonth(), 1), end: new Date(now.getFullYear(), now.getMonth() + 1, 0) };
      }
    };

    return {
      selectedPeriod,
      setSelectedPeriod,
      getPeriodLabel,
      getPeriodDates
    };
  }
  return context;
}