import React, { useState } from 'react';
import { ModuleLayout } from '@/components/layouts/ModuleLayout';
import { FinanceModuleSidebar } from '@/components/FinanceModuleSidebar';
import { FinancePageHeader } from '@/components/FinancePageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { CategoryDialog } from '@/components/finance/CategoryDialog';
import { useFinancialCategories } from '@/hooks/finance/useFinancialCategories';
import { Target, Plus, Search } from 'lucide-react';
import type { FinancialCategory } from '@/hooks/finance/useFinancialCategories';

const categoryTypeColors = {
  revenue: 'bg-green-100 text-green-800',
  expense: 'bg-red-100 text-red-800',
  asset: 'bg-blue-100 text-blue-800',
  liability: 'bg-yellow-100 text-yellow-800',
};

const categoryTypeLabels = {
  revenue: 'Produit',
  expense: 'Charge',
  asset: 'Actif',
  liability: 'Passif',
};

export default function ExpenseCategories() {
  const { categories, loading } = useFinancialCategories();
  const [showCategoryDialog, setShowCategoryDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<FinancialCategory | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeCategories = categories.filter(c => c.is_active).length;
  const expenseCategories = categories.filter(c => c.category_type === 'expense').length;
  const revenueCategories = categories.filter(c => c.category_type === 'revenue').length;

  const handleNewCategory = () => {
    setSelectedCategory(null);
    setShowCategoryDialog(true);
  };

  const stats = [
    {
      label: "Total catégories",
      value: categories.length.toString(),
      change: "+2",
      changeType: "positive" as const
    },
    {
      label: "Actives",
      value: activeCategories.toString(),
      change: "0",
      changeType: "neutral" as const
    },
    {
      label: "Dépenses",
      value: expenseCategories.toString(),
      change: "+1",
      changeType: "positive" as const
    },
    {
      label: "Produits",
      value: revenueCategories.toString(),
      change: "+1",
      changeType: "positive" as const
    }
  ];

  return (
    <ModuleLayout sidebar={<FinanceModuleSidebar />}>
      <div className="p-8 space-y-8">
        <FinancePageHeader
          title="Postes de Dépenses"
          subtitle="Configuration et gestion des catégories de dépenses"
          stats={stats}
          showCreateButton={true}
          onCreateClick={handleNewCategory}
          createButtonText="Nouvelle catégorie"
          showExportButton={true}
          showBackButton={true}
          backPath="/finance"
        />

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-purple-500" />
                Catégories financières
              </CardTitle>
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher une catégorie..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">Chargement...</div>
              ) : (
                <div className="space-y-4">
                  {filteredCategories.map((category) => (
                    <div key={category.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <div className="font-medium">{category.code} - {category.name}</div>
                        <div className="text-sm text-muted-foreground">{category.description}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={categoryTypeColors[category.category_type as keyof typeof categoryTypeColors]}>
                          {categoryTypeLabels[category.category_type as keyof typeof categoryTypeLabels]}
                        </Badge>
                        <Badge variant={category.is_active ? 'default' : 'secondary'}>
                          {category.is_active ? 'Actif' : 'Inactif'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <CategoryDialog
          open={showCategoryDialog}
          onClose={() => {
            setShowCategoryDialog(false);
            setSelectedCategory(null);
          }}
          category={selectedCategory}
          mode={selectedCategory ? 'edit' : 'create'}
        />
      </div>
    </ModuleLayout>
  );
}