import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Activity, Package, Settings, Calendar } from 'lucide-react';

export function AcademicStatusCards() {
  const statusCards = [
    {
      title: 'Système',
      value: 'Actif',
      icon: Activity,
      color: 'bg-emerald-500',
      description: 'Fonctionnel'
    },
    {
      title: 'Modules',
      value: '2',
      icon: Package,
      color: 'bg-academic',
      description: 'Disponibles'
    },
    {
      title: 'Configuration',
      value: 'Prêt',
      icon: Settings,
      color: 'bg-violet-500',
      description: 'Niveaux'
    },
    {
      title: 'Année',
      value: '2024-25',
      icon: Calendar,
      color: 'bg-orange-500',
      description: 'Académique'
    }
  ];

  return (
    <div className="grid grid-cols-4 gap-6 mx-6 mt-6">
      {statusCards.map((card, index) => {
        const Icon = card.icon;
        return (
          <Card key={index} className="border-border/40">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    {card.title}
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {card.value}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {card.description}
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${card.color}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}