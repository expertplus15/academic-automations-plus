import React from 'react';
import { RefreshCw } from 'lucide-react';

export function LoadingState() {
  return (
    <div className="flex items-center justify-center h-screen bg-background">
      <div className="text-center">
        <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
        <p className="text-lg font-medium">Chargement des templates...</p>
        <p className="text-sm text-muted-foreground">Récupération des types de documents</p>
      </div>
    </div>
  );
}