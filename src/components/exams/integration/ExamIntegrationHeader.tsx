
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, Zap } from 'lucide-react';

interface ExamIntegrationHeaderProps {
  isConnected: boolean;
  onSyncAll: () => void;
  isLoading: boolean;
  selectedExam: string;
}

export function ExamIntegrationHeader({ 
  isConnected, 
  onSyncAll, 
  isLoading, 
  selectedExam 
}: ExamIntegrationHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-blue-600" />
          <h2 className="text-2xl font-semibold leading-none tracking-tight">
            Intégrations Inter-Modules
          </h2>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Synchronisation temps réel entre Examens, Académique, Étudiants et Ressources
        </p>
      </div>
      
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="text-sm text-muted-foreground">
            {isConnected ? 'Connecté' : 'Déconnecté'}
          </span>
        </div>
        
        <Button 
          onClick={onSyncAll}
          disabled={!selectedExam || isLoading}
          size="sm"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Synchroniser Tout
        </Button>
      </div>
    </div>
  );
}
