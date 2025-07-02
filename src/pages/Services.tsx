import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Car, UtensilsCrossed, Home, BookOpen, Heart, MapPin } from 'lucide-react';

export default function Services() {
  const services = [
    {
      title: "Transport Scolaire",
      description: "Lignes de bus, horaires en temps réel, réservations",
      icon: Car,
      color: "bg-blue-500",
      stats: { active: "12 lignes", users: "2,847 étudiants" }
    },
    {
      title: "Restauration",
      description: "Menus, commandes en ligne, paiements dématérialisés",
      icon: UtensilsCrossed,
      color: "bg-green-500",
      stats: { active: "3 restaurants", users: "1,567 repas/jour" }
    },
    {
      title: "Hébergement",
      description: "Résidences universitaires, chambres, facturation",
      icon: Home,
      color: "bg-purple-500",
      stats: { active: "456 chambres", users: "89% occupancy" }
    },
    {
      title: "Bibliothèque",
      description: "Catalogue numérique, emprunts, réservations",
      icon: BookOpen,
      color: "bg-orange-500",
      stats: { active: "25,000 ouvrages", users: "156 emprunts actifs" }
    },
    {
      title: "Activités Extra-scolaires",
      description: "Sports, clubs, associations, événements",
      icon: Heart,
      color: "bg-red-500",
      stats: { active: "23 associations", users: "1,234 participants" }
    },
    {
      title: "Orientation & Carrières",
      description: "Conseils orientation, stages, job board",
      icon: MapPin,
      color: "bg-indigo-500",
      stats: { active: "567 offres", users: "234 placements" }
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">Services aux Étudiants</h1>
          <p className="text-xl text-muted-foreground">Transport, restauration, hébergement et services périphériques</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <Card key={index} className="bg-white rounded-2xl shadow-sm border-0 hover:shadow-lg transition-all duration-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className={`p-3 rounded-xl ${service.color}`}>
                    <service.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">{service.title}</h3>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{service.description}</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Statut:</span>
                    <span className="font-medium text-foreground">{service.stats.active}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Utilisation:</span>
                    <span className="font-medium text-foreground">{service.stats.users}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-2xl shadow-lg border-0">
          <CardContent className="p-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">🎯 Écosystème Étudiant Complet</h2>
              <p className="text-lg mb-6 text-white/90">
                Tous les services périphériques centralisés dans une seule plateforme
              </p>
              <div className="grid grid-cols-3 gap-8 text-center">
                <div>
                  <div className="text-3xl font-bold">6</div>
                  <div className="text-white/80">Services intégrés</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">94%</div>
                  <div className="text-white/80">Satisfaction</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">4,567</div>
                  <div className="text-white/80">Utilisateurs actifs</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}