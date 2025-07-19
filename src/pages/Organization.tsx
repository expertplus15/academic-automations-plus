
import React from 'react';
import { ModuleLayout } from '@/components/layouts/ModuleLayout';
import { OrganizationModuleSidebar } from '@/components/OrganizationModuleSidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2, Calendar, Clock, Settings, Users, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Organization() {
  const navigate = useNavigate();

  const organizationModules = [
    {
      title: 'Infrastructure',
      description: 'Gestion des bâtiments, salles et espaces',
      icon: Building2,
      route: '/organization/infrastructure',
      color: 'bg-blue-500'
    },
    {
      title: 'Emplois du temps',
      description: 'Planification et gestion des créneaux horaires',
      icon: Clock,
      route: '/organization/timetables',
      color: 'bg-green-500'
    },
    {
      title: 'Calendrier académique',
      description: 'Gestion du calendrier et des événements',
      icon: Calendar,
      route: '/organization/calendar',
      color: 'bg-purple-500'
    },
    {
      title: 'Paramètres',
      description: 'Configuration générale de l\'organisation',
      icon: Settings,
      route: '/organization/settings',
      color: 'bg-gray-500'
    }
  ];

  const stats = [
    { label: 'Bâtiments', value: '3', icon: Building2 },
    { label: 'Salles actives', value: '45', icon: MapPin },
    { label: 'Créneaux/semaine', value: '120', icon: Clock },
    { label: 'Événements ce mois', value: '8', icon: Calendar }
  ];

  return (
    <ModuleLayout 
      sidebar={<OrganizationModuleSidebar />}
      title="Organisation"
      subtitle="Gestion de l'infrastructure et de la planification"
    >
      <div className="p-6 max-w-7xl mx-auto space-y-8">
        {/* En-tête */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full">
            <Building2 className="w-8 h-8 text-emerald-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Module Organisation</h1>
            <p className="text-lg text-muted-foreground mt-2">
              Gérez l'infrastructure, les emplois du temps et la planification de votre établissement
            </p>
          </div>
        </div>

        {/* Statistiques rapides */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <stat.icon className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Modules disponibles */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-foreground">Modules disponibles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {organizationModules.map((module, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 ${module.color} rounded-lg`}>
                      <module.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl">{module.title}</CardTitle>
                      <CardDescription className="mt-2">{module.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={() => navigate(module.route)}
                    className="w-full"
                    variant="outline"
                  >
                    Accéder au module
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Actions rapides */}
        <Card>
          <CardHeader>
            <CardTitle>Actions rapides</CardTitle>
            <CardDescription>
              Accès direct aux fonctionnalités les plus utilisées
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Button onClick={() => navigate('/organization/infrastructure')}>
                <Building2 className="w-4 h-4 mr-2" />
                Gérer les salles
              </Button>
              <Button onClick={() => navigate('/organization/timetables')} variant="outline">
                <Clock className="w-4 h-4 mr-2" />
                Planifier les cours
              </Button>
              <Button onClick={() => navigate('/organization/calendar')} variant="outline">
                <Calendar className="w-4 h-4 mr-2" />
                Voir le calendrier
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </ModuleLayout>
  );
}
