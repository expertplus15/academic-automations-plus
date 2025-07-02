import React, { useState } from 'react';
import { ModuleLayout } from '@/components/layouts/ModuleLayout';
import { FinanceModuleSidebar } from '@/components/FinanceModuleSidebar';
import { FinancePageHeader } from '@/components/FinancePageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search,
  Calculator,
  Eye,
  Edit,
  Copy,
  CheckCircle,
  Clock
} from 'lucide-react';

export default function BudgetPlanning() {
  const [searchTerm, setSearchTerm] = useState('');

  const budgetPlans = [
    {
      id: '1',
      name: 'Budget 2024-2025',
      fiscalYear: '2024-2025',
      totalAmount: 950000,
      categories: 8,
      status: 'draft',
      lastModified: '2024-01-20',
      createdBy: 'Admin Finance'
    },
    {
      id: '2',
      name: 'Budget 2023-2024',
      fiscalYear: '2023-2024',
      totalAmount: 850000,
      categories: 8,
      status: 'approved',
      lastModified: '2023-09-15',
      createdBy: 'Admin Finance'
    },
    {
      id: '3',
      name: 'Budget prévisionnel 2025-2026',
      fiscalYear: '2025-2026',
      totalAmount: 1050000,
      categories: 9,
      status: 'planning',
      lastModified: '2024-01-15',
      createdBy: 'Directeur Financier'
    }
  ];

  const stats = [
    {
      label: "Budgets en cours",
      value: budgetPlans.filter(b => b.status === 'draft').length.toString(),
      change: "+1",
      changeType: "neutral" as const
    },
    {
      label: "Budget total planifié",
      value: `€${budgetPlans.find(b => b.status === 'draft')?.totalAmount.toLocaleString() || '0'}`,
      change: "+11.8%",
      changeType: "positive" as const
    },
    {
      label: "Catégories budgétaires",
      value: "9",
      change: "+1",
      changeType: "positive" as const
    },
    {
      label: "Progression",
      value: "75%",
      change: "+25%",
      changeType: "positive" as const
    }
  ];

  const getStatusBadge = (status: string) => {
    const variants = {
      draft: "bg-yellow-100 text-yellow-700 border-yellow-200",
      approved: "bg-green-100 text-green-700 border-green-200",
      planning: "bg-blue-100 text-blue-700 border-blue-200",
      archived: "bg-gray-100 text-gray-700 border-gray-200"
    };
    const labels = {
      draft: "Brouillon",
      approved: "Approuvé",
      planning: "Planification",
      archived: "Archivé"
    };
    return { variant: variants[status as keyof typeof variants], label: labels[status as keyof typeof labels] };
  };

  const filteredPlans = budgetPlans.filter(plan =>
    plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plan.fiscalYear.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ModuleLayout sidebar={<FinanceModuleSidebar />}>
      <div className="p-8 space-y-8">
        <FinancePageHeader
          title="Planification budgétaire"
          subtitle="Élaboration et gestion des budgets prévisionnels"
          stats={stats}
          showCreateButton={true}
          createButtonText="Nouveau budget"
          showExportButton={true}
          showBackButton={true}
          backPath="/finance"
        />

        {/* Filtres et recherche */}
        <Card className="bg-white rounded-2xl shadow-sm border-0">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher un budget..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="gap-2">
                  <Badge className="w-4 h-4" />
                  Statut
                </Button>
                <Button variant="outline" className="gap-2">
                  <Calculator className="w-4 h-4" />
                  Année fiscale
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Liste des budgets */}
        <Card className="bg-white rounded-2xl shadow-sm border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="w-5 h-5 text-[rgb(245,158,11)]" />
              Plans budgétaires ({filteredPlans.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredPlans.map((plan) => {
                const statusInfo = getStatusBadge(plan.status);
                return (
                  <div
                    key={plan.id}
                    className="flex items-center justify-between p-4 rounded-xl border border-border/50 hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-[rgb(245,158,11)]/10 rounded-xl">
                        <Calculator className="w-5 h-5 text-[rgb(245,158,11)]" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold text-foreground">{plan.name}</p>
                          <Badge variant="outline" className="text-xs">
                            {plan.fiscalYear}
                          </Badge>
                          <Badge className={statusInfo.variant}>
                            {statusInfo.label}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>Budget total: €{plan.totalAmount.toLocaleString()}</span>
                          <span>{plan.categories} catégories</span>
                          <span>Modifié: {new Date(plan.lastModified).toLocaleDateString('fr-FR')}</span>
                          <span>Par: {plan.createdBy}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" className="gap-1">
                        <Eye className="w-3 h-3" />
                        Voir
                      </Button>
                      <Button size="sm" variant="outline" className="gap-1">
                        <Edit className="w-3 h-3" />
                        Modifier
                      </Button>
                      <Button size="sm" variant="outline" className="gap-1">
                        <Copy className="w-3 h-3" />
                        Dupliquer
                      </Button>
                      {plan.status === 'draft' && (
                        <Button size="sm" className="gap-1 bg-[rgb(245,158,11)] hover:bg-[rgb(245,158,11)]/90">
                          <CheckCircle className="w-3 h-3" />
                          Approuver
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Outils de planification */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white rounded-2xl shadow-sm border-0">
            <CardHeader>
              <CardTitle className="text-base">Assistant de planification</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Utilisez l'assistant pour créer un budget basé sur les données historiques.
              </p>
              <Button className="w-full bg-[rgb(245,158,11)] hover:bg-[rgb(245,158,11)]/90">
                Lancer l'assistant
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white rounded-2xl shadow-sm border-0">
            <CardHeader>
              <CardTitle className="text-base">Modèles prédéfinis</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Choisissez parmi nos modèles de budget standardisés.
              </p>
              <Button variant="outline" className="w-full">
                Parcourir les modèles
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white rounded-2xl shadow-sm border-0">
            <CardHeader>
              <CardTitle className="text-base">Import de données</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Importez vos données budgétaires depuis un fichier Excel.
              </p>
              <Button variant="outline" className="w-full">
                Importer Excel
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </ModuleLayout>
  );
}