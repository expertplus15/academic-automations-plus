import React from 'react';
import { ModuleLayout } from '@/components/layouts/ModuleLayout';
import { ResultsModuleSidebar } from '@/components/ResultsModuleSidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CalculationDashboard } from '@/components/results/optimization/CalculationDashboard';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Zap, Shield, BarChart3 } from 'lucide-react';

export default function Optimization() {
  return (
    <ModuleLayout sidebar={<ResultsModuleSidebar />}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Optimisation des Calculs</h1>
            <p className="text-muted-foreground mt-2">
              Surveillance et optimisation des performances de calcul en temps réel
            </p>
          </div>
          <Badge variant="outline" className="h-8">
            <Zap className="w-4 h-4 mr-2" />
            Système Optimisé
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Performance</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">98.5%</div>
              <p className="text-xs text-muted-foreground">Taux de réussite</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Vitesse</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">142ms</div>
              <p className="text-xs text-muted-foreground">Temps moyen</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cache</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">87%</div>
              <p className="text-xs text-muted-foreground">Taux de hit</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Queue</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">3</div>
              <p className="text-xs text-muted-foreground">Tâches en attente</p>
            </CardContent>
          </Card>
        </div>

        <CalculationDashboard />
      </div>
    </ModuleLayout>
  );
}