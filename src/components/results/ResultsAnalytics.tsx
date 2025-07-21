import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResultsQuickActions } from '@/components/results/ResultsQuickActions';

export function ResultsAnalytics() {
  const handleRefresh = () => {
    console.log('Refreshing analytics');
  };

  const handleExport = () => {
    console.log('Exporting analytics');
  };

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <ResultsQuickActions
        onRefresh={handleRefresh}
        onExport={handleExport}
        onFilter={() => console.log('Filter analytics')}
        pendingActions={1}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Statistiques Générales</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Vue d'ensemble des résultats</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Analyse Comparative</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Comparaison entre périodes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tendances</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Évolution des performances</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}