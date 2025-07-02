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
          <h1 className="text-4xl font-bold text-foreground mb-2">
            {greeting}, Administrateur
          </h1>
          <p className="text-[#64748B] text-lg">
            Bienvenue sur votre tableau de bord de gestion académique
          </p>
          <div className="flex items-center gap-2 mt-2 text-[#64748B]">
            <Clock className="w-4 h-4" />
            <span className="text-sm">{currentTime}</span>
          </div>
        </div>
        <Button 
          className="bg-[#4F78FF] hover:bg-[#4F78FF]/90 text-white rounded-2xl px-6 py-3 font-semibold transition-all duration-200"
        >
          <Zap className="w-4 h-4 mr-2" />
          Accès Rapide
        </Button>
      </div>

      {/* Cartes de statut */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white rounded-2xl shadow-lg border-0">
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-[#64748B] text-sm font-medium">Modules Actifs</p>
                <p className="text-foreground text-2xl font-semibold mt-1">11</p>
              </div>
              <Badge className="bg-green-100 text-green-700 border-0 rounded-full px-3 py-1">
                Actif
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white rounded-2xl shadow-lg border-0">
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-[#64748B] text-sm font-medium">Système</p>
                <p className="text-foreground text-2xl font-semibold mt-1">Actif</p>
              </div>
              <Badge className="bg-green-100 text-green-700 border-0 rounded-full px-3 py-1">
                En ligne
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white rounded-2xl shadow-lg border-0">
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-[#64748B] text-sm font-medium">Année Académique</p>
                <p className="text-foreground text-xl font-semibold mt-1">2024-25</p>
              </div>
              <Badge className="bg-blue-100 text-[#4F78FF] border-0 rounded-full px-3 py-1">
                Actuelle
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}