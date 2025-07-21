import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResultsQuickActions } from '@/components/results/ResultsQuickActions';

export function GradeCalculations() {
  const handleRefresh = () => {
    console.log('Refreshing calculations');
  };

  const handleExport = () => {
    console.log('Exporting calculations');
  };

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <ResultsQuickActions
        onRefresh={handleRefresh}
        onExport={handleExport}
        pendingActions={2}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Calculs des Moyennes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Configuration des calculs automatiques</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Crédits ECTS</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Gestion des crédits européens</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}