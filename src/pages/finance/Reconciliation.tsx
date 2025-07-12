import React, { useState } from 'react';
import { ModuleLayout } from '@/components/layouts/ModuleLayout';
import { FinanceModuleSidebar } from '@/components/FinanceModuleSidebar';
import { FinancePageHeader } from '@/components/FinancePageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Zap, Upload, Download, CheckCircle, AlertCircle } from 'lucide-react';

export default function Reconciliation() {
  return (
    <ModuleLayout sidebar={<FinanceModuleSidebar />}>
      <div className="p-8 space-y-8">
        <FinancePageHeader
          title="Réconciliation Automatique"
          subtitle="Import et rapprochement automatique des écritures bancaires"
          stats={[]}
          showCreateButton={false}
          showExportButton={false}
        />

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-500" />
                Fonctionnalité en développement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <AlertTriangle className="w-16 h-16 mx-auto text-yellow-500 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Module en cours d'implémentation</h3>
                <p className="text-muted-foreground mb-6">
                  La réconciliation automatique sera disponible dans une prochaine version
                </p>
                <Button disabled>
                  <Upload className="w-4 h-4 mr-2" />
                  Importer relevé bancaire
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ModuleLayout>
  );
}