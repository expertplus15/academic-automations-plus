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
  Folder,
  Eye,
  Edit,
  Trash2,
  ArrowUpDown
} from 'lucide-react';

export default function Categories() {
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    {
      id: '1',
      name: 'Frais de scolarité',
      code: 'SCO001',
      type: 'income',
      description: 'Revenus des frais d\'inscription et de scolarité',
      parentCategory: null,
      isActive: true,
      transactionCount: 245,
      totalAmount: 580000
    },
    {
      id: '2',
      name: 'Salaires enseignants',
      code: 'SAL001',
      type: 'expense',
      description: 'Rémunération du personnel enseignant',
      parentCategory: null,
      isActive: true,
      transactionCount: 156,
      totalAmount: 320000
    },
    {
      id: '3',
      name: 'Équipements pédagogiques',
      code: 'EQU001',
      type: 'expense',
      description: 'Achat et maintenance du matériel pédagogique',
      parentCategory: null,
      isActive: true,
      transactionCount: 89,
      totalAmount: 85000
    },
    {
      id: '4',
      name: 'Bourses d\'excellence',
      code: 'BOU001',
      type: 'expense',
      description: 'Bourses accordées aux étudiants méritants',
      parentCategory: null,
      isActive: true,
      transactionCount: 23,
      totalAmount: 45000
    },
    {
      id: '5',
      name: 'Services numériques',
      code: 'NUM001',
      type: 'income',
      description: 'Revenus des services en ligne et plateformes',
      parentCategory: null,
      isActive: false,
      transactionCount: 12,
      totalAmount: 8500
    }
  ];

  const stats = [
    {
      label: "Catégories actives",
      value: categories.filter(c => c.isActive).length.toString(),
      change: "+2",
      changeType: "positive" as const
    },
    {
      label: "Catégories de revenus",
      value: categories.filter(c => c.type === 'income').length.toString(),
      change: "+1",
      changeType: "positive" as const
    },
    {
      label: "Catégories de dépenses",
      value: categories.filter(c => c.type === 'expense').length.toString(),
      change: "0",
      changeType: "neutral" as const
    },
    {
      label: "Transactions totales",
      value: categories.reduce((sum, c) => sum + c.transactionCount, 0).toString(),
      change: "+15%",
      changeType: "positive" as const
    }
  ];

  const getTypeBadge = (type: string) => {
    const variants = {
      income: "bg-green-100 text-green-700 border-green-200",
      expense: "bg-red-100 text-red-700 border-red-200"
    };
    const labels = {
      income: "Revenus",
      expense: "Dépenses"
    };
    return { variant: variants[type as keyof typeof variants], label: labels[type as keyof typeof labels] };
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ModuleLayout sidebar={<FinanceModuleSidebar />}>
      <div className="p-8 space-y-8">
        <FinancePageHeader
          title="Catégories financières"
          subtitle="Configuration et gestion des catégories comptables"
          stats={stats}
          showCreateButton={true}
          createButtonText="Nouvelle catégorie"
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
                    placeholder="Rechercher une catégorie..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="gap-2">
                  <ArrowUpDown className="w-4 h-4" />
                  Type
                </Button>
                <Button variant="outline" className="gap-2">
                  <Badge className="w-4 h-4" />
                  Statut
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Organisation hiérarchique */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-white rounded-2xl shadow-sm border-0">
            <CardHeader>
              <CardTitle className="text-base">Catégories de revenus</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {categories.filter(c => c.type === 'income').map((category) => (
                  <div key={category.id} className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:bg-accent/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Folder className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{category.name}</p>
                        <p className="text-xs text-muted-foreground">{category.code}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-green-600">€{category.totalAmount.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">{category.transactionCount} trans.</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white rounded-2xl shadow-sm border-0">
            <CardHeader>
              <CardTitle className="text-base">Catégories de dépenses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {categories.filter(c => c.type === 'expense').map((category) => (
                  <div key={category.id} className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:bg-accent/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-red-100 rounded-lg">
                        <Folder className="w-4 h-4 text-red-600" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{category.name}</p>
                        <p className="text-xs text-muted-foreground">{category.code}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-red-600">€{category.totalAmount.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">{category.transactionCount} trans.</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Liste détaillée */}
        <Card className="bg-white rounded-2xl shadow-sm border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Folder className="w-5 h-5 text-[rgb(245,158,11)]" />
              Toutes les catégories ({filteredCategories.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredCategories.map((category) => {
                const typeInfo = getTypeBadge(category.type);
                return (
                  <div
                    key={category.id}
                    className="flex items-center justify-between p-4 rounded-xl border border-border/50 hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-[rgb(245,158,11)]/10 rounded-xl">
                        <Folder className="w-5 h-5 text-[rgb(245,158,11)]" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold text-foreground">{category.name}</p>
                          <Badge variant="outline" className="text-xs">
                            {category.code}
                          </Badge>
                          <Badge className={typeInfo.variant}>
                            {typeInfo.label}
                          </Badge>
                          {!category.isActive && (
                            <Badge className="bg-gray-100 text-gray-700 border-gray-200">
                              Inactive
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">
                          {category.description}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>{category.transactionCount} transactions</span>
                          <span>Total: €{category.totalAmount.toLocaleString()}</span>
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
                      <Button size="sm" variant="outline" className="gap-1 text-red-600 hover:text-red-700">
                        <Trash2 className="w-3 h-3" />
                        Supprimer
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </ModuleLayout>
  );
}