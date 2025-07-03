import React from 'react';
import { ModuleLayout } from '@/components/layouts/ModuleLayout';
import { FinanceModuleSidebar } from '@/components/FinanceModuleSidebar';
import { FinancePageHeader } from '@/components/FinancePageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Receipt, Plus, FileText, Users } from 'lucide-react';

export default function Commercial() {
  const stats = [
    {
      label: "Factures Commerciales",
      value: "47",
      change: "+12%",
      changeType: "positive" as const
    },
    {
      label: "CA Prévisionnel",
      value: "€280K",
      change: "+8.5%",
      changeType: "positive" as const
    },
    {
      label: "Clients Actifs",
      value: "23",
      change: "+3",
      changeType: "positive" as const
    },
    {
      label: "Taux de Conversion",
      value: "78%",
      change: "+5%",
      changeType: "positive" as const
    }
  ];

  return (
    <ModuleLayout sidebar={<FinanceModuleSidebar />}>
      <div className="p-8 space-y-8">
        <FinancePageHeader
          title="Facturation Commerciale"
          subtitle="Gestion des prestations B2B et facturation externe"
          stats={stats}
          showCreateButton={true}
          createButtonText="Nouvelle Facture"
          showExportButton={true}
          showBackButton={true}
          backPath="/finance"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-blue-500" />
                Prestations B2B
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Facturation des formations, audits et conseils externes
              </p>
              <Button className="w-full gap-2">
                <Plus className="w-4 h-4" />
                Nouvelle Prestation
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-green-500" />
                Devis & Contrats
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Gestion des devis commerciaux et contrats cadres
              </p>
              <Button variant="outline" className="w-full gap-2">
                <Plus className="w-4 h-4" />
                Nouveau Devis
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-500" />
                Clients Entreprises
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Base clients B2B et historique des relations
              </p>
              <Button variant="outline" className="w-full gap-2">
                <Plus className="w-4 h-4" />
                Nouveau Client
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </ModuleLayout>
  );
}