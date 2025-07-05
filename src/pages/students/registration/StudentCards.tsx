import React, { useState } from 'react';
import { StudentsModuleLayout } from "@/components/layouts/StudentsModuleLayout";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  CreditCard, 
  Plus,
  Download,
  Printer,
  Settings,
  Users,
  Activity
} from 'lucide-react';
import { useStudentCards } from '@/hooks/students/useStudentCards';
import { CardGenerationDialog } from '@/components/students/cards/CardGenerationDialog';
import { PrintBatchDialog } from '@/components/students/cards/PrintBatchDialog';
import { EnhancedCardsTable } from '@/components/students/cards/EnhancedCardsTable';
import { TemplateManagementDialog } from '@/components/students/cards/TemplateManagementDialog';

export default function StudentCards() {
  const [showGenerationDialog, setShowGenerationDialog] = useState(false);
  const [showPrintDialog, setShowPrintDialog] = useState(false);
  const [showTemplateDialog, setShowTemplateDialog] = useState(false);
  
  const { cards, templates, printBatches, loading, getCardStats } = useStudentCards();
  const stats = getCardStats();

  return (
    <StudentsModuleLayout 
      title="Cartes Étudiants"
      subtitle="Génération et gestion des cartes d'identité étudiantes"
    >
      <div className="p-6 space-y-6">
        {/* Statistics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <CreditCard className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Cartes Actives</p>
                  <p className="text-2xl font-bold">{stats.active}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">En Attente</p>
                  <p className="text-2xl font-bold">{stats.pending}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Printer className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">À Imprimer</p>
                  <p className="text-2xl font-bold">{stats.toPrint}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Download className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Expirées</p>
                  <p className="text-2xl font-bold">{stats.expired}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-500" />
                Actions Rapides
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => setShowGenerationDialog(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Générer Nouvelles Cartes
              </Button>
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => setShowPrintDialog(true)}
                disabled={stats.toPrint === 0}
              >
                <Printer className="w-4 h-4 mr-2" />
                Impression en Lot ({stats.toPrint})
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export PDF
              </Button>
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => setShowTemplateDialog(true)}
              >
                <Settings className="w-4 h-4 mr-2" />
                Gérer Templates
              </Button>
            </CardContent>
          </Card>

          {/* Recent Print Batches */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Derniers Lots d'Impression
              </CardTitle>
            </CardHeader>
            <CardContent>
              {printBatches.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">
                  Aucun lot d'impression créé
                </div>
              ) : (
                <div className="space-y-3">
                  {printBatches.slice(0, 3).map((batch) => (
                    <div key={batch.id} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <div className={`w-2 h-2 rounded-full ${
                        batch.status === 'completed' ? 'bg-emerald-500' :
                        batch.status === 'processing' ? 'bg-blue-500' :
                        batch.status === 'failed' ? 'bg-red-500' : 'bg-yellow-500'
                      }`}></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{batch.batch_name}</p>
                        <p className="text-xs text-muted-foreground">
                          {batch.printed_cards}/{batch.total_cards} cartes - {batch.status}
                        </p>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(batch.created_at).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Cards Table */}
        <EnhancedCardsTable 
          cards={cards} 
          loading={loading}
          onBulkExport={(cardIds) => console.log('Bulk export:', cardIds)}
          onViewCard={(card) => console.log('View card:', card)}
        />

        {/* Dialogs */}
        <CardGenerationDialog
          open={showGenerationDialog}
          onOpenChange={setShowGenerationDialog}
          templates={templates}
        />

        <PrintBatchDialog
          open={showPrintDialog}
          onOpenChange={setShowPrintDialog}
          cards={cards}
        />

        <TemplateManagementDialog
          open={showTemplateDialog}
          onOpenChange={setShowTemplateDialog}
        />
      </div>
    </StudentsModuleLayout>
  );
}