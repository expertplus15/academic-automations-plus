import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TreasuryOverviewDashboard } from '@/components/finance/TreasuryOverviewDashboard';
import { TreasuryIncomeDashboard } from '@/components/finance/TreasuryIncomeDashboard';
import { TreasuryExpensesDashboard } from '@/components/finance/TreasuryExpensesDashboard';
import { TreasuryInvoicesDashboard } from '@/components/finance/TreasuryInvoicesDashboard';
import { TreasuryPeriodContext, TreasuryPeriod } from '@/hooks/finance/useTreasuryPeriod';
import { 
  LayoutDashboard,
  TrendingUp, 
  TrendingDown, 
  FileText,
  CreditCard
} from 'lucide-react';

export function TreasuryPaymentsHub() {
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

  return (
    <TreasuryPeriodContext.Provider value={{
      selectedPeriod,
      setSelectedPeriod,
      getPeriodLabel,
      getPeriodDates
    }}>
      <div className="space-y-6">
        <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <LayoutDashboard className="w-4 h-4" />
            Tableau de Bord
          </TabsTrigger>
          <TabsTrigger value="income" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Encaissements
          </TabsTrigger>
          <TabsTrigger value="expenses" className="flex items-center gap-2">
            <TrendingDown className="w-4 h-4" />
            Dépenses
          </TabsTrigger>
          <TabsTrigger value="invoices" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Factures
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <TreasuryOverviewDashboard />
        </TabsContent>

        <TabsContent value="income" className="space-y-4">
          <TreasuryIncomeDashboard />
        </TabsContent>

        <TabsContent value="expenses" className="space-y-4">
          <TreasuryExpensesDashboard />
        </TabsContent>

        <TabsContent value="invoices" className="space-y-4">
          <TreasuryInvoicesDashboard />
        </TabsContent>
        </Tabs>
      </div>
    </TreasuryPeriodContext.Provider>
  );
}