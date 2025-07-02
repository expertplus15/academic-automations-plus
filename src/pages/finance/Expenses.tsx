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
  Filter, 
  Receipt, 
  Eye, 
  Edit,
  Plus,
  Users,
  Building,
  TrendingUp
} from 'lucide-react';

export default function Expenses() {
  const [searchTerm, setSearchTerm] = useState('');

  const stats = [
    {
      label: "Dépenses du mois",
      value: "€45,230",
      change: "+8.2%",
      changeType: "negative" as const
    },
    {
      label: "Fournisseurs actifs",
      value: "23",
      change: "+2",
      changeType: "positive" as const
    },
    {
      label: "En attente validation",
      value: "€8,400",
      change: "5 dossiers",
      changeType: "neutral" as const
    },
    {
      label: "Budget restant",
      value: "€124,800",
      change: "68%",
      changeType: "positive" as const
    }
  ];

  // Mock data pour les dépenses
  const mockExpenses = [
    {
      id: "EXP-2024-001",
      expenseNumber: "EXP240001",
      supplier: "Fournitures Bureau Plus",
      category: "Fournitures administratives",
      amount: 1250,
      date: "2024-01-15",
      status: "validated",
      description: "Commande papeterie et fournitures bureau"
    },
    {
      id: "EXP-2024-002", 
      expenseNumber: "EXP240002",
      supplier: "Électricité de France",
      category: "Charges énergétiques",
      amount: 3400,
      date: "2024-01-20",
      status: "pending",
      description: "Facture électricité - Janvier 2024"
    },
    {
      id: "EXP-2024-003",
      expenseNumber: "EXP240003", 
      supplier: "Maintenance Informatique",
      category: "Services techniques",
      amount: 850,
      date: "2024-01-18",
      status: "paid",
      description: "Maintenance serveurs et réseau"
    }
  ];

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
      validated: "bg-green-100 text-green-700 border-green-200", 
      paid: "bg-blue-100 text-blue-700 border-blue-200",
      rejected: "bg-red-100 text-red-700 border-red-200"
    };

    const labels = {
      pending: "En attente",
      validated: "Validée",
      paid: "Payée",
      rejected: "Rejetée"
    };

    return (
      <Badge className={variants[status as keyof typeof variants] || variants.pending}>
        {labels[status as keyof typeof labels] || status}
      </Badge>
    );
  };

  const filteredExpenses = mockExpenses.filter(expense =>
    expense.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
    expense.expenseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    expense.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ModuleLayout sidebar={<FinanceModuleSidebar />}>
      <div className="p-8 space-y-8">
        <FinancePageHeader
          title="Gestion des Dépenses"
          subtitle="Suivi et validation des dépenses de l'établissement"
          stats={stats}
          showCreateButton={true}
          createButtonText="Nouvelle dépense"
          showExportButton={true}
          showBackButton={true}
          backPath="/finance"
          onCreateClick={() => console.log('Create expense')}
        />

        {/* Actions rapides */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white rounded-2xl shadow-sm border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-[rgb(245,158,11)]" />
                Actions rapides
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full gap-2 bg-[rgb(245,158,11)] hover:bg-[rgb(245,158,11)]/90">
                <Plus className="w-4 h-4" />
                Saisir une dépense
              </Button>
              <Button variant="outline" className="w-full gap-2">
                <Building className="w-4 h-4" />
                Gérer les fournisseurs
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white rounded-2xl shadow-sm border-0">
            <CardHeader>
              <CardTitle className="text-lg">Validation en attente</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-foreground mb-2">€8,400</p>
              <p className="text-sm text-muted-foreground mb-4">
                5 dépenses à valider
              </p>
              <Button variant="outline" className="w-full gap-2">
                <Eye className="w-4 h-4" />
                Voir les demandes
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white rounded-2xl shadow-sm border-0">
            <CardHeader>
              <CardTitle className="text-lg">Budget mensuel</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-foreground mb-2">68%</p>
              <p className="text-sm text-muted-foreground mb-4">
                Reste €124,800 disponible
              </p>
              <Button variant="outline" className="w-full gap-2">
                <TrendingUp className="w-4 h-4" />
                Voir le budget
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Filtres et recherche */}
        <Card className="bg-white rounded-2xl shadow-sm border-0">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher par fournisseur, numéro, catégorie..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="gap-2">
                  <Filter className="w-4 h-4" />
                  Statut
                </Button>
                <Button variant="outline" className="gap-2">
                  <Users className="w-4 h-4" />
                  Fournisseur
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Liste des dépenses */}
        <Card className="bg-white rounded-2xl shadow-sm border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Receipt className="w-5 h-5 text-[rgb(245,158,11)]" />
              Dépenses récentes ({filteredExpenses.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredExpenses.map((expense, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 rounded-xl border border-border/50 hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-[rgb(245,158,11)]/10 rounded-xl">
                      <Receipt className="w-5 h-5 text-[rgb(245,158,11)]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-foreground">{expense.expenseNumber}</p>
                        {getStatusBadge(expense.status)}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {expense.supplier} • {expense.category}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {expense.description}
                      </p>
                    </div>
                  </div>

                  <div className="text-right space-y-1">
                    <div className="flex items-center gap-2 justify-end">
                      <span className="font-semibold text-foreground text-lg">
                        €{expense.amount.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {new Date(expense.date).toLocaleDateString('fr-FR')}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" className="gap-1">
                      <Eye className="w-3 h-3" />
                      Détails
                    </Button>
                    {expense.status === 'pending' && (
                      <Button size="sm" className="gap-1 bg-green-600 hover:bg-green-700">
                        <Eye className="w-3 h-3" />
                        Valider
                      </Button>
                    )}
                    {expense.status === 'validated' && (
                      <Button size="sm" variant="outline" className="gap-1">
                        <Edit className="w-3 h-3" />
                        Éditer
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </ModuleLayout>
  );
}