
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface SyncConfig {
  autoSync: boolean;
  enabledModules: string[];
  batchSize: number;
}

interface ExamIntegrationConfigProps {
  config: SyncConfig;
}

export function ExamIntegrationConfig({ config }: ExamIntegrationConfigProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Configuration</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm">Synchronisation automatique</span>
            <Badge variant={config.autoSync ? 'default' : 'secondary'}>
              {config.autoSync ? 'Activée' : 'Désactivée'}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm">Modules actifs</span>
            <span className="text-sm text-muted-foreground">
              {config.enabledModules.length}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm">Taille des lots</span>
            <span className="text-sm text-muted-foreground">
              {config.batchSize}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
