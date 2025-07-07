import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TreasuryOverviewDashboard } from '@/components/finance/TreasuryOverviewDashboard';
import { TreasuryIncomeDashboard } from '@/components/finance/TreasuryIncomeDashboard';
import { TreasuryExpensesDashboard } from '@/components/finance/TreasuryExpensesDashboard';
import { TreasuryInvoicesDashboard } from '@/components/finance/TreasuryInvoicesDashboard';
import { 
  LayoutDashboard,
  TrendingUp, 
  TrendingDown, 
  FileText,
  CreditCard
} from 'lucide-react';

export function TreasuryPaymentsHub() {

  return (
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
  );
}