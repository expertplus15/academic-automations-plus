import React from 'react';
import { RefreshCw, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function AcademicBanner() {
  return (
    <div className="bg-gradient-to-r from-academic to-blue-500 p-8 rounded-2xl mx-6 mt-6 text-white">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Gestion Académique</h1>
          <p className="text-blue-100 text-lg">
            Tableau de bord principal et gestion des programmes
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button 
            variant="secondary" 
            size="sm" 
            className="bg-white/20 hover:bg-white/30 text-white border-white/30"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Actualiser
          </Button>
          <Button 
            variant="secondary" 
            size="sm" 
            className="bg-white/20 hover:bg-white/30 text-white border-white/30"
          >
            <Settings className="w-4 h-4 mr-2" />
            Paramètres
          </Button>
        </div>
      </div>
    </div>
  );
}