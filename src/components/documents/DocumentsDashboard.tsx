import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Layout, 
  Archive,
  FileSignature, 
  Send,
  TrendingUp,
  Users,
  Clock,
  AlertCircle,
  CheckCircle,
  Plus
} from 'lucide-react';

export function DocumentsDashboard() {
  const documentServices = [
    {
      title: "Templates & Modèles",
      description: "Création et gestion des modèles de documents",
      icon: Layout,
      color: "text-blue-500",
      bgColor: "bg-blue-500",
      stats: { active: "45 modèles", users: "12 catégories" },
      status: "active",
      alerts: 0
    },
    {
      title: "Générateur Automatique",
      description: "Création de documents à partir de données",
      icon: FileText,
      color: "text-green-500",
      bgColor: "bg-green-500",
      stats: { active: "234 docs générés", users: "Ce mois" },
      status: "active",
      alerts: 0
    },
    {
      title: "Archives & Stockage",
      description: "Stockage sécurisé et recherche avancée",
      icon: Archive,
      color: "text-purple-500",
      bgColor: "bg-purple-500",
      stats: { active: "15,678 documents", users: "98% disponibilité" },
      status: "active",
      alerts: 1
    },
    {
      title: "Signatures Électroniques",
      description: "Validation et signatures numériques",
      icon: FileSignature,
      color: "text-orange-500",
      bgColor: "bg-orange-500",
      stats: { active: "156 en attente", users: "Signatures actives" },
      status: "maintenance",
      alerts: 2
    }
  ];

  const quickActions = [
    { label: "Nouveau template", icon: Plus, action: () => {} },
    { label: "Générer document", icon: FileText, action: () => {} },
    { label: "Voir rapports", icon: TrendingUp, action: () => {} },
    { label: "Gestion utilisateurs", icon: Users, action: () => {} }
  ];

  const recentActivities = [
    { time: "14:30", action: "Template bulletin généré", user: "Système auto", status: "success" },
    { time: "14:15", action: "Signature électronique validée", user: "M. Directeur", status: "success" },
    { time: "13:45", action: "Archive document étudiant", user: "Secrétariat", status: "info" },
    { time: "13:30", action: "Template modifié", user: "Admin documents", status: "warning" }
  ];

  return (
    <div className="flex-1 p-6 space-y-6">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Gestion Documentaire</h1>
            <p className="text-white/80 text-lg">Service centralisé pour tous les modules</p>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold">15,678</div>
            <div className="text-white/80">Documents stockés</div>
          </div>
          <div>
            <div className="text-3xl font-bold">45</div>
            <div className="text-white/80">Templates actifs</div>
          </div>
          <div>
            <div className="text-3xl font-bold">98%</div>
            <div className="text-white/80">Disponibilité</div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Services Grid - Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">Services Documentaires</h2>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nouveau Service
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {documentServices.map((service, index) => (
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

          {/* System Overview */}
          <Card className="bg-card">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Vue d'ensemble</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Services actifs</span>
                <span className="font-medium">4/4</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Documents traités</span>
                <span className="font-medium">1,234</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Espace utilisé</span>
                <span className="font-medium text-blue-500">67%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Signatures en attente</span>
                <span className="font-medium text-orange-500">156</span>
              </div>
            </CardContent>
          </Card>
          
        </div>
      </div>
    </div>
  );
}