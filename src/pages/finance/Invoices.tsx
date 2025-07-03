import React, { useState } from 'react';
import { ModuleLayout } from '@/components/layouts/ModuleLayout';
import { FinanceModuleSidebar } from '@/components/FinanceModuleSidebar';
import { FinancePageHeader } from '@/components/FinancePageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UnifiedInvoicing } from '@/components/finance/UnifiedInvoicing';
import { 
  Search, 
  Filter, 
  FileText, 
  Eye, 
  Edit,
  Send,
  Download,
  Calendar,
  DollarSign,
  AlertTriangle,
  Users,
  Plus
} from 'lucide-react';

export default function Invoices() {
  const stats = [
    {
      label: "Total facturé",
      value: "€245,300",
      change: "+12.3%",
      changeType: "positive" as const
    },
    {
      label: "Factures émises",
      value: "47",
      change: "+8",
      changeType: "positive" as const
    },
    {
      label: "Devis en cours",
      value: "12",
      change: "+3",
      changeType: "positive" as const
    },
    {
      label: "Conversion devis",
      value: "78%",
      change: "+5%",
      changeType: "positive" as const
    }
  ];

  return (
    <ModuleLayout sidebar={<FinanceModuleSidebar />}>
      <div className="p-8 space-y-8">
        <FinancePageHeader
          title="Facturation Unifiée"
          subtitle="Étudiants, commerciale et devis en un seul endroit"
          stats={stats}
          showCreateButton={false}
          showExportButton={true}
          showBackButton={true}
          backPath="/finance"
        />

        <UnifiedInvoicing />
      </div>
    </ModuleLayout>
  );
}