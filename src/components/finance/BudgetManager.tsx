import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { 
  Calculator, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Plus,
  Eye,
  Edit,
  Copy,
  Bot
} from 'lucide-react';

export function BudgetManager() {
  const { toast } = useToast();

  const handleDuplicateTemplate = () => {
    toast({
      title: "Budget Dupliqué",
      description: "Template du budget 2023-2024 copié avec succès",
    });
  };

  const handleAIGeneration = () => {
    toast({
      title: "Génération IA",
      description: "Analyse historique en cours, budget généré automatiquement",
    });
  };

  const handleTemplateType = () => {
    toast({
      title: "Template Sélectionné",
      description: "Template adapté au type d'établissement appliqué",
    });
  };
  const [selectedBudget, setSelectedBudget] = useState('2024-2025');

  const budgets = [
    {
      id: '2024-2025',
      name: 'Budget 2024-2025',
      status: 'active',
      progress: 75,
      total: 950000,
      consumed: 712500,
      remaining: 237500
    },
    {
      id: '2023-2024',
      name: 'Budget 2023-2024',
      status: 'closed',
      progress: 100,
      total: 850000,
      consumed: 847000,
      remaining: 3000
    }
  ];

  const categories = [
    { name: 'Personnel enseignant', budget: 450000, consumed: 337500, progress: 75 },
    { name: 'Frais pédagogiques', budget: 180000, consumed: 162000, progress: 90 },
    { name: 'Infrastructure', budget: 120000, consumed: 84000, progress: 70 },
    { name: 'Marketing', budget: 80000, consumed: 56000, progress: 70 },
    { name: 'Administration', budget: 70000, consumed: 49000, progress: 70 },
    { name: 'R&D', budget: 50000, consumed: 24000, progress: 48 }
  ];

  const alerts = [
    { type: 'warning', message: 'Frais pédagogiques - Seuil 85% atteint', category: 'Frais pédagogiques' },
    { type: 'info', message: 'Prévision dépassement R&D en Q4', category: 'R&D' },
    { type: 'success', message: 'Infrastructure sous budget de 15%', category: 'Infrastructure' }
  ];

  const getStatusBadge = (status: string) => {
    const variants = {
      active: "bg-green-100 text-green-700 border-green-200",
      draft: "bg-yellow-100 text-yellow-700 border-yellow-200", 
      closed: "bg-gray-100 text-gray-700 border-gray-200"
    };
    const labels = { active: "Actif", draft: "Brouillon", closed: "Clôturé" };
    return { variant: variants[status as keyof typeof variants], label: labels[status as keyof typeof labels] };
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'warning': return <AlertTriangle className="w-4 h-4 text-orange-500" />;
      case 'info': return <Clock className="w-4 h-4 text-blue-500" />;
      case 'success': return <CheckCircle className="w-4 h-4 text-green-500" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header avec sélection budget */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Gestionnaire Budgétaire Unifié</h2>
          <p className="text-muted-foreground">Pilotage intelligent avec IA intégrée</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            <Bot className="w-4 h-4" />
            Assistant IA
          </Button>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Nouveau Budget
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="planning">Planification</TabsTrigger>
          <TabsTrigger value="tracking">Suivi</TabsTrigger>
          <TabsTrigger value="analysis">Analyses</TabsTrigger>
          <TabsTrigger value="predictions">Prédictions IA</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Vue d'ensemble budgétaire */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-blue-500" />
                  Budget Total
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">€950K</div>
                <p className="text-sm text-muted-foreground">Budget 2024-2025</p>
                <Progress value={75} className="mt-3" />
                <p className="text-xs text-muted-foreground mt-2">75% consommé</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                  Consommé
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">€712K</div>
                <p className="text-sm text-green-600">+5% vs prévisions</p>
                <div className="mt-3 text-sm">
                  <span className="text-muted-foreground">Restant: </span>
                  <span className="font-medium">€238K</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-orange-500" />
                  Alertes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-600">{alerts.length}</div>
                <p className="text-sm text-muted-foreground">Alertes actives</p>
                <div className="mt-3 space-y-1">
                  {alerts.slice(0, 2).map((alert, index) => (
                    <div key={index} className="flex items-center gap-2 text-xs">
                      {getAlertIcon(alert.type)}
                      <span className="truncate">{alert.category}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Répartition par catégories */}
          <Card>
            <CardHeader>
              <CardTitle>Répartition Budgétaire par Catégorie</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {categories.map((category, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{category.name}</span>
                      <div className="text-right">
                        <span className="font-semibold">€{(category.consumed / 1000).toFixed(0)}K</span>
                        <span className="text-muted-foreground"> / €{(category.budget / 1000).toFixed(0)}K</span>
                      </div>
                    </div>
                    <Progress value={category.progress} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{category.progress}% consommé</span>
                      <span>Restant: €{((category.budget - category.consumed) / 1000).toFixed(0)}K</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="planning" className="space-y-6">
          {/* Interface de planification */}
          <Card>
            <CardHeader>
              <CardTitle>Assistant de Planification Budgétaire</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold">Templates Intelligents</h3>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start gap-2" onClick={handleDuplicateTemplate}>
                      <Copy className="w-4 h-4" />
                      Dupliquer budget 2023-2024
                    </Button>
                    <Button variant="outline" className="w-full justify-start gap-2" onClick={handleAIGeneration}>
                      <Bot className="w-4 h-4" />
                      Génération IA basée historique
                    </Button>
                    <Button variant="outline" className="w-full justify-start gap-2" onClick={handleTemplateType}>
                      <Calculator className="w-4 h-4" />
                      Template par type d'établissement
                    </Button>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="font-semibold">Workflow Collaboratif</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Saisie décentralisée activée</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-orange-500" />
                      <span>En attente validation Direction</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-gray-400" />
                      <span>Consolidation automatique prête</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tracking" className="space-y-6">
          {/* Interface de suivi */}
          <Card>
            <CardHeader>
              <CardTitle>Suivi Temps Réel</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="font-medium">Seuils OK</span>
                    </div>
                    <div className="text-2xl font-bold text-green-600">4</div>
                    <p className="text-sm text-muted-foreground">Catégories sous contrôle</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="w-4 h-4 text-orange-500" />
                      <span className="font-medium">Alertes 80%</span>
                    </div>
                    <div className="text-2xl font-bold text-orange-600">1</div>
                    <p className="text-sm text-muted-foreground">Seuil de vigilance atteint</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="w-4 h-4 text-red-500" />
                      <span className="font-medium">Blocages 95%</span>
                    </div>
                    <div className="text-2xl font-bold text-red-600">0</div>
                    <p className="text-sm text-muted-foreground">Aucun blocage actif</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-6">
          {/* Interface d'analyses */}
          <Card>
            <CardHeader>
              <CardTitle>Analyses d'Écarts Automatiques</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <TrendingUp className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">Analyses Avancées</h3>
                <p className="text-muted-foreground mb-4">
                  Volume vs Prix vs Mix automatique avec explications contextuelles IA
                </p>
                <Button className="gap-2">
                  <Bot className="w-4 h-4" />
                  Générer Analyse IA
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="predictions" className="space-y-6">
          {/* Interface prédictions IA */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-purple-500" />
                Prédictions IA Fin d'Année
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold">Projections Automatiques</h3>
                  <div className="space-y-3">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Consommation prévue</span>
                        <span className="font-bold text-blue-600">€895K</span>
                      </div>
                      <p className="text-sm text-blue-600 mt-1">Confiance: 90%</p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Économies potentielles</span>
                        <span className="font-bold text-green-600">€55K</span>
                      </div>
                      <p className="text-sm text-green-600 mt-1">Optimisations IA identifiées</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="font-semibold">Recommandations IA</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <Bot className="w-4 h-4 text-purple-500 mt-0.5" />
                      <span>Renégocier contrats fournisseurs Q4 (-8% potentiel)</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Bot className="w-4 h-4 text-purple-500 mt-0.5" />
                      <span>Reporter achats non-urgents en N+1</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Bot className="w-4 h-4 text-purple-500 mt-0.5" />
                      <span>Optimiser planning interventions externes</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}