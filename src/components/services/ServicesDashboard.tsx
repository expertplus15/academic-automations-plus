import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Coffee, 
  Bus, 
  UtensilsCrossed, 
  Home, 
  BookOpen, 
  Heart, 
  MapPin,
  TrendingUp,
  Users,
  Clock,
  AlertCircle,
  CheckCircle,
  Plus
} from 'lucide-react';

export function ServicesDashboard() {
  const services = [
    {
      title: "Transport Scolaire",
      description: "Lignes de bus, horaires en temps réel, réservations",
      icon: Bus,
      color: "text-blue-500",
      bgColor: "bg-blue-500",
      stats: { active: "12 lignes", users: "2,847 étudiants" },
      status: "active",
      alerts: 2
    },
    {
      title: "Restauration",
      description: "Menus, commandes en ligne, paiements dématérialisés",
      icon: UtensilsCrossed,
      color: "text-green-500",
      bgColor: "bg-green-500",
      stats: { active: "3 restaurants", users: "1,567 repas/jour" },
      status: "active",
      alerts: 0
    },
    {
      title: "Hébergement",
      description: "Résidences universitaires, chambres, facturation",
      icon: Home,
      color: "text-purple-500",
      bgColor: "bg-purple-500",
      stats: { active: "456 chambres", users: "89% occupancy" },
      status: "maintenance",
      alerts: 1
    },
    {
      title: "Bibliothèque",
      description: "Catalogue numérique, emprunts, réservations",
      icon: BookOpen,
      color: "text-orange-500",
      bgColor: "bg-orange-500",
      stats: { active: "25,000 ouvrages", users: "156 emprunts actifs" },
      status: "active",
      alerts: 0
    }
  ];

  const quickActions = [
    { label: "Nouveau service", icon: Plus, action: () => {} },
    { label: "Gérer horaires", icon: Clock, action: () => {} },
    { label: "Voir rapports", icon: TrendingUp, action: () => {} },
    { label: "Gestion utilisateurs", icon: Users, action: () => {} }
  ];

  const recentActivities = [
    { time: "09:30", action: "Nouvelle réservation transport", user: "Marie Dupont", status: "success" },
    { time: "09:15", action: "Commande restaurant validée", user: "Pierre Martin", status: "success" },
    { time: "08:45", action: "Maintenance chambre 205", user: "Équipe technique", status: "warning" },
    { time: "08:30", action: "Emprunt livre numérique", user: "Julie Moreau", status: "info" }
  ];

  return (
    <div className="flex-1 p-6 space-y-6">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-2xl p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
            <Coffee className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Services aux Étudiants</h1>
            <p className="text-white/80 text-lg">Transport, restauration, hébergement et services périphériques</p>
          </div>
        </div>
        
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

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Services Grid - Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">Services Disponibles</h2>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nouveau Service
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {services.map((service, index) => (
              <Card key={index} className="bg-card rounded-xl shadow-sm border-0 hover:shadow-lg transition-all duration-200">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${service.bgColor}`}>
                        <service.icon className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-base font-semibold text-foreground">{service.title}</h3>
                    </div>
                    {service.alerts > 0 && (
                      <Badge className="bg-red-500 text-white text-xs">
                        {service.alerts}
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm mb-4">{service.description}</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Statut:</span>
                      <span className="font-medium text-foreground">{service.stats.active}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Utilisation:</span>
                      <span className="font-medium text-foreground">{service.stats.users}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                      {service.status === 'active' && (
                        <>
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-sm text-green-500">Actif</span>
                        </>
                      )}
                      {service.status === 'maintenance' && (
                        <>
                          <AlertCircle className="w-4 h-4 text-orange-500" />
                          <span className="text-sm text-orange-500">Maintenance</span>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Sidebar Content */}
        <div className="space-y-6">
          
          {/* Quick Actions */}
          <Card className="bg-card">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Actions Rapides</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={action.action}
                >
                  <action.icon className="w-4 h-4 mr-3" />
                  {action.label}
                </Button>
              ))}
            </CardContent>
          </Card>

          {/* Recent Activities */}
          <Card className="bg-card">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Activités Récentes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="text-xs text-muted-foreground mt-0.5 w-12">
                    {activity.time}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.user}</p>
                  </div>
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.status === 'success' ? 'bg-green-500' :
                    activity.status === 'warning' ? 'bg-orange-500' :
                    'bg-blue-500'
                  }`} />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Services Overview */}
          <Card className="bg-card">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Vue d'ensemble</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Services actifs</span>
                <span className="font-medium">5/6</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Utilisateurs connectés</span>
                <span className="font-medium">342</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Taux de satisfaction</span>
                <span className="font-medium text-green-500">94%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Incidents ouverts</span>
                <span className="font-medium text-orange-500">3</span>
              </div>
            </CardContent>
          </Card>
          
        </div>
      </div>
    </div>
  );
}