import React from 'react';
import { ModuleLayout } from '@/components/layouts/ModuleLayout';
import { FinanceModuleSidebar } from '@/components/FinanceModuleSidebar';
import { FinancePageHeader } from '@/components/FinancePageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Database, Download, Upload, Calendar, CheckCircle } from 'lucide-react';

export default function Backups() {
  const stats = [
    {
      label: "Sauvegardes Totales",
      value: "47",
      change: "+3 cette semaine",
      changeType: "positive" as const
    },
    {
      label: "Espace Utilisé",
      value: "2.8GB",
      change: "68% libre",
      changeType: "positive" as const
    },
    {
      label: "Dernière Sauvegarde",
      value: "2h",
      change: "Automatique",
      changeType: "positive" as const
    },
    {
      label: "Statut Système",
      value: "Opérationnel",
      change: "100%",
      changeType: "positive" as const
    }
  ];

  const backups = [
    { name: "Sauvegarde Quotidienne", date: "2024-07-03 02:00", size: "127MB", type: "Auto", status: "Complète" },
    { name: "Sauvegarde Manuelle", date: "2024-07-02 15:30", size: "134MB", type: "Manuelle", status: "Complète" },
    { name: "Sauvegarde Hebdomadaire", date: "2024-06-30 01:00", size: "145MB", type: "Auto", status: "Complète" },
    { name: "Export Mensuel", date: "2024-06-01 00:00", size: "890MB", type: "Export", status: "Archivée" }
  ];

  return (
    <ModuleLayout sidebar={<FinanceModuleSidebar />}>
      <div className="p-8 space-y-8">
        <FinancePageHeader
          title="Sauvegardes & Archivage"
          subtitle="Gestion des sauvegardes et restaurations"
          stats={stats}
          showCreateButton={true}
          createButtonText="Nouvelle Sauvegarde"
          showExportButton={true}
          showBackButton={true}
          backPath="/finance"
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5 text-blue-500" />
                  Historique des Sauvegardes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {backups.map((backup, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
                          <Database className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">{backup.name}</p>
                          <p className="text-sm text-muted-foreground">{backup.date} • {backup.size}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant={backup.type === 'Auto' ? 'default' : 'secondary'}>
                          {backup.type}
                        </Badge>
                        <Badge variant={backup.status === 'Complète' ? 'default' : 'outline'}>
                          {backup.status}
                        </Badge>
                        <Button size="sm" variant="outline">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  Actions Rapides
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button className="w-full gap-2">
                    <Database className="w-4 h-4" />
                    Sauvegarde Manuelle
                  </Button>
                  <Button variant="outline" className="w-full gap-2">
                    <Upload className="w-4 h-4" />
                    Restaurer
                  </Button>
                  <Button variant="outline" className="w-full gap-2">
                    <Calendar className="w-4 h-4" />
                    Planification
                  </Button>
                  <Button variant="outline" className="w-full gap-2">
                    <Download className="w-4 h-4" />
                    Export Complet
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5 text-purple-500" />
                  Espace de Stockage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Utilisé</span>
                      <span>2.8GB / 10GB</span>
                    </div>
                    <Progress value={28} />
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Espace suffisant pour 47 sauvegardes supplémentaires
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ModuleLayout>
  );
}