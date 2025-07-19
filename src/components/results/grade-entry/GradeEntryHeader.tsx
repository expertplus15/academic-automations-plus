
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowRightLeft, 
  Grid3X3, 
  Clock, 
  CheckCircle,
  TrendingUp,
  Users
} from 'lucide-react';

export function GradeEntryHeader() {
  return (
    <div className="space-y-4">
      {/* Titre principal */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Saisie des Notes</h2>
        <p className="text-muted-foreground">
          Interface matricielle collaborative et synchronisation automatique avec les examens
        </p>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <ArrowRightLeft className="w-4 h-4 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Sync Examens</p>
                <p className="text-lg font-semibold">Auto</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Grid3X3 className="w-4 h-4 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Saisie</p>
                <p className="text-lg font-semibold">Matricielle</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-orange-500" />
              <div>
                <p className="text-sm text-muted-foreground">Temps Réel</p>
                <p className="text-lg font-semibold">Actif</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">Validation</p>
                <p className="text-lg font-semibold">Auto</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions rapides */}
      <div className="flex items-center gap-3">
        <Badge variant="outline" className="flex items-center gap-1">
          <TrendingUp className="w-3 h-3" />
          Workflow Actif
        </Badge>
        <Badge variant="outline" className="flex items-center gap-1">
          <Users className="w-3 h-3" />
          Collaboration
        </Badge>
        <Badge variant="default" className="flex items-center gap-1">
          <ArrowRightLeft className="w-3 h-3" />
          Sync ON
        </Badge>
      </div>
    </div>
  );
}
