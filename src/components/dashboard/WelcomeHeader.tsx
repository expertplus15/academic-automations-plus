import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Zap } from 'lucide-react';

export function WelcomeHeader() {
  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? 'Bonjour' : currentHour < 18 ? 'Bon après-midi' : 'Bonsoir';
  const currentTime = new Date().toLocaleTimeString('fr-FR', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  return (
    <div className="space-y-6">
      {/* Header avec salutation */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">
            {greeting}, Administrateur
          </h1>
          <p className="text-blue-100 text-lg">
            Bienvenue sur votre tableau de bord de gestion académique
          </p>
          <div className="flex items-center gap-2 mt-2 text-blue-200">
            <Clock className="w-4 h-4" />
            <span className="text-sm">{currentTime}</span>
          </div>
        </div>
        <Button 
          variant="secondary" 
          className="bg-white/20 border-white/30 text-white hover:bg-white/30"
        >
          <Zap className="w-4 h-4 mr-2" />
          Accès Rapide
        </Button>
      </div>

      {/* Cartes de statut */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-blue-100 text-sm">Modules Actifs</p>
                <p className="text-white text-2xl font-bold">11</p>
              </div>
              <Badge className="bg-green-500/20 text-green-100 border-green-400/30">
                Actif
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-blue-100 text-sm">Système</p>
                <p className="text-white text-2xl font-bold">Actif</p>
              </div>
              <Badge className="bg-green-500/20 text-green-100 border-green-400/30">
                En ligne
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-blue-100 text-sm">Année Académique</p>
                <p className="text-white text-xl font-bold">2024-25</p>
              </div>
              <Badge className="bg-blue-500/20 text-blue-100 border-blue-400/30">
                Actuelle
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}