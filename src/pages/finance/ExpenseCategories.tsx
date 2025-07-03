import React, { useState } from 'react';
import { ModuleLayout } from '@/components/layouts/ModuleLayout';
import { FinanceModuleSidebar } from '@/components/FinanceModuleSidebar';
import { FinancePageHeader } from '@/components/FinancePageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Target,
  TrendingUp,
  AlertTriangle,
  Search,
  Settings
} from 'lucide-react';

export default function ExpenseCategories() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { toast } = useToast();

  const categories = [
    {
      id: "cat-001",
      code: "MAT-BUR",
      name: "Matériel de bureau",
      description: "Fournitures et équipements de bureau",
      budgetAnnual: 5000,
      usedAmount: 3200,
      accountNumber: "606100",
      isActive: true,
      type: "variable"
    },
    {
      id: "cat-002",
      code: "INFO",
      name: "Équipement informatique",
      description: "Matériel et logiciels informatiques",
      budgetAnnual: 15000,
      usedAmount: 8900,
      accountNumber: "606200",
      isActive: true,
      type: "investment"
    },
    {
      id: "cat-003",
      code: "ENERGY",
      name: "Énergie",
      description: "Électricité, gaz, chauffage",
      budgetAnnual: 3000,
      usedAmount: 2100,
      accountNumber: "606300",
      isActive: true,
      type: "fixed"
    },
    {
      id: "cat-004",
      code: "SERV",
      name: "Services",
      description: "Prestations externes et services",
      budgetAnnual: 8000,
      usedAmount: 4500,
      accountNumber: "606400",
      isActive: true,
      type: "variable"
    },
    {
      id: "cat-005",
      code: "FORM",
      name: "Formation",
      description: "Formation du personnel",
      budgetAnnual: 6000,
      usedAmount: 2800,
      accountNumber: "606500",
      isActive: true,
      type: "variable"
    }
  ];

  const stats = [
    {
      label: "Postes Actifs",
      value: categories.filter(c => c.isActive).length.toString(),
      change: "+2",
      changeType: "positive" as const
    },
    {
      label: "Budget Total",
      value: `€${categories.reduce((sum, c) => sum + c.budgetAnnual, 0).toLocaleString()}`,
      change: "+5%",
      changeType: "positive" as const
    },
    {
      label: "Consommé",
      value: `€${categories.reduce((sum, c) => sum + c.usedAmount, 0).toLocaleString()}`,
      change: "58%",
      changeType: "neutral" as const
    },
    {
      label: "Postes en Alerte",
      value: categories.filter(c => (c.usedAmount / c.budgetAnnual) > 0.8).length.toString(),
      change: "1",
      changeType: "negative" as const
    }
  ];

  const handleCreateCategory = () => {
    toast({
      title: "Poste Créé",
      description: "Nouveau poste de dépense créé avec succès",
    });
    setShowCreateForm(false);
  };

  const handleEditCategory = (categoryId: string) => {
    toast({
      title: "Modification",
      description: `Poste ${categoryId} ouvert en modification`,
    });
  };

  const handleDeleteCategory = (categoryId: string) => {
    toast({
      title: "Suppression",
      description: `Poste ${categoryId} supprimé`,
    });
  };

  const filteredCategories = categories.filter(category => 
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getUsagePercent = (used: number, budget: number) => (used / budget) * 100;

  const getUsageBadge = (percent: number) => {
    if (percent > 90) return <Badge className="bg-red-100 text-red-700 border-red-200">Critique</Badge>;
    if (percent > 80) return <Badge className="bg-orange-100 text-orange-700 border-orange-200">Attention</Badge>;
    if (percent > 60) return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">Surveillé</Badge>;
    return <Badge className="bg-green-100 text-green-700 border-green-200">Normal</Badge>;
  };

  const getTypeBadge = (type: string) => {
    const variants = {
      fixed: "bg-blue-100 text-blue-700 border-blue-200",
      variable: "bg-purple-100 text-purple-700 border-purple-200",
      investment: "bg-green-100 text-green-700 border-green-200"
    };

    const labels = {
      fixed: "Fixe",
      variable: "Variable",
      investment: "Investissement"
    };

    return (
      <Badge className={variants[type as keyof typeof variants]}>
        {labels[type as keyof typeof labels]}
      </Badge>
    );
  };

  return (
    <ModuleLayout sidebar={<FinanceModuleSidebar />}>
      <div className="p-8 space-y-8">
        <FinancePageHeader
          title="Postes de Dépenses"
          subtitle="Configuration et suivi des catégories budgétaires"
          stats={stats}
          showCreateButton={true}
          createButtonText="Nouveau Poste"
          showExportButton={true}
          showBackButton={true}
          backPath="/finance"
        />

        {/* Formulaire de création */}
        <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Nouveau Poste de Dépense</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="code">Code</Label>
                <Input id="code" placeholder="EX: MAT-BUR" />
              </div>
              <div>
                <Label htmlFor="name">Nom</Label>
                <Input id="name" placeholder="Nom du poste" />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" placeholder="Description détaillée" />
              </div>
              <div>
                <Label htmlFor="budget">Budget Annuel (€)</Label>
                <Input id="budget" type="number" placeholder="5000" />
              </div>
              <div>
                <Label htmlFor="account">Compte Comptable</Label>
                <Input id="account" placeholder="606100" />
              </div>
              <div>
                <Label htmlFor="type">Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner le type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fixed">Fixe</SelectItem>
                    <SelectItem value="variable">Variable</SelectItem>
                    <SelectItem value="investment">Investissement</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-3 pt-4">
                <Button className="flex-1" onClick={handleCreateCategory}>
                  Créer
                </Button>
                <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                  Annuler
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Actions et recherche */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <Button onClick={() => setShowCreateForm(true)} className="gap-2">
                <Plus className="w-4 h-4" />
                Nouveau Poste
              </Button>
              
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher un poste..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Liste des postes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-500" />
              Postes de Dépenses ({filteredCategories.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredCategories.map((category, index) => {
                const usagePercent = getUsagePercent(category.usedAmount, category.budgetAnnual);
                
                return (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 rounded-xl border border-border/50 hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="p-3 bg-blue-500/10 rounded-xl">
                        <Target className="w-5 h-5 text-blue-500" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold text-foreground">{category.name}</p>
                          <Badge variant="outline">{category.code}</Badge>
                          {getTypeBadge(category.type)}
                          {getUsageBadge(usagePercent)}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{category.description}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>Compte: {category.accountNumber}</span>
                          <span>Budget: €{category.budgetAnnual.toLocaleString()}</span>
                        </div>
                        
                        {/* Barre de progression */}
                        <div className="mt-3">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm text-muted-foreground">
                              €{category.usedAmount.toLocaleString()} / €{category.budgetAnnual.toLocaleString()}
                            </span>
                            <span className="text-sm font-medium">
                              {Math.round(usagePercent)}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                usagePercent > 90 ? 'bg-red-500' : 
                                usagePercent > 80 ? 'bg-orange-500' : 
                                usagePercent > 60 ? 'bg-yellow-500' : 'bg-green-500'
                              }`}
                              style={{ width: `${Math.min(usagePercent, 100)}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="gap-1"
                        onClick={() => handleEditCategory(category.id)}
                      >
                        <Edit className="w-3 h-3" />
                        Modifier
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="gap-1 text-red-600 border-red-200 hover:bg-red-50"
                        onClick={() => handleDeleteCategory(category.id)}
                      >
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

        {/* Alertes budgétaires */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              Alertes Budgétaires
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {categories
                .filter(c => getUsagePercent(c.usedAmount, c.budgetAnnual) > 80)
                .map((category, index) => (
                  <div key={index} className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                    <p className="text-sm font-medium text-orange-700">
                      {category.name} - {Math.round(getUsagePercent(category.usedAmount, category.budgetAnnual))}% consommé
                    </p>
                    <p className="text-xs text-orange-600">
                      €{category.usedAmount.toLocaleString()} / €{category.budgetAnnual.toLocaleString()}
                    </p>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </ModuleLayout>
  );
}