import React from 'react';
import { ModuleLayout } from '@/components/layouts/ModuleLayout';
import { FinanceModuleSidebar } from '@/components/FinanceModuleSidebar';
import { FinancePageHeader } from '@/components/FinancePageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calculator, FileText, AlertTriangle } from 'lucide-react';

export default function Accounting() {
  return (
    <ModuleLayout sidebar={<FinanceModuleSidebar />}>
      <div className="p-8 space-y-8">
        <FinancePageHeader
          title="Écritures Automatiques"
          subtitle="Génération automatique des écritures comptables"
          stats={[]}
          showCreateButton={false}
          showExportButton={false}
        />

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-green-500" />
                Fonctionnalité en développement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <AlertTriangle className="w-16 h-16 mx-auto text-yellow-500 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Module en cours d'implémentation</h3>
                <p className="text-muted-foreground mb-6">
                  La génération automatique d'écritures sera disponible dans une prochaine version
                </p>
                <Button disabled>
                  <FileText className="w-4 h-4 mr-2" />
                  Générer écritures
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ModuleLayout>
  );
}