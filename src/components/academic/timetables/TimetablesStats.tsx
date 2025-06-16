
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Users, MapPin, Brain } from 'lucide-react';

export function TimetablesStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Heures par semaine
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">24h</div>
          <p className="text-xs text-muted-foreground">+2h par rapport à la semaine dernière</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Users className="h-4 w-4" />
            Classes actives
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">12</div>
          <p className="text-xs text-muted-foreground">Réparties sur 3 programmes</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Salles utilisées
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">8/15</div>
          <p className="text-xs text-muted-foreground">Taux d'occupation: 53%</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Brain className="h-4 w-4" />
            Conflits résolus
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">95%</div>
          <p className="text-xs text-muted-foreground">Par l'algorithme IA</p>
        </CardContent>
      </Card>
    </div>
  );
}
