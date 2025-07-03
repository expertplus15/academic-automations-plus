import React from 'react';
import { ModuleLayout } from '@/components/layouts/ModuleLayout';
import { FinanceModuleSidebar } from '@/components/FinanceModuleSidebar';
import { FinancePageHeader } from '@/components/FinancePageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download, Calculator, Eye } from 'lucide-react';

export default function Statements() {
  const stats = [
    {
      label: "Grand Livre",
      value: "2,847",
      change: "Écritures",
      changeType: "neutral" as const
    },
    {
      label: "Balance Générale",
      value: "€0",
      change: "Équilibrée",
      changeType: "positive" as const
    },
    {
      label: "Dernière Clôture",
      value: "Mars 2024",
      change: "J+2",
      changeType: "positive" as const
    },
    {
      label: "Contrôles Auto",
      value: "12/12",
      change: "Validés",
      changeType: "positive" as const
    }
  ];

  return (
    <ModuleLayout sidebar={<FinanceModuleSidebar />}>
      <div className="p-8 space-y-8">
        <FinancePageHeader
          title="États Comptables"
          subtitle="Grand livre, balance et contrôles automatiques"
          stats={stats}
          showCreateButton={true}
          createButtonText="Nouvel État"
          showExportButton={true}
          showBackButton={true}
          backPath="/finance"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-500" />
                Grand Livre
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Détail chronologique de toutes les écritures comptables
              </p>
              <Button className="w-full gap-2">
                <Eye className="w-4 h-4" />
                Consulter
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-green-500" />
                Balance Générale
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Soldes de tous les comptes avec contrôles d'équilibre
              </p>
              <Button variant="outline" className="w-full gap-2">
                <Download className="w-4 h-4" />
                Exporter Balance
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="w-5 h-5 text-purple-500" />
                Exports Automatiques
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Génération programmée vers expert-comptable (FEC, etc.)
              </p>
              <Button variant="outline" className="w-full gap-2">
                <Download className="w-4 h-4" />
                Planifier Export
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </ModuleLayout>
  );
}