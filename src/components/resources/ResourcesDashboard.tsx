import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Package, 
  QrCode, 
  Wrench, 
  ShoppingCart, 
  Calendar, 
  Building, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAssets } from '@/hooks/resources/useAssets';

export function ResourcesDashboard() {
  const { assets, loading } = useAssets();

  const stats = [
    {
      label: "Total équipements",
      value: loading ? "..." : assets.length.toString(),
      icon: Package,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      change: "+12%"
    },
    {
      label: "Valeur patrimoine",
      value: loading ? "..." : `${Math.round(assets.reduce((sum, a) => sum + (a.current_value || 0), 0) / 1000)}K€`,
      icon: Building,
      color: "text-green-600",
      bgColor: "bg-green-100",
      change: "+5.2%"
    },
    {
      label: "Maintenances dues",
      value: loading ? "..." : assets.filter(a => a.status === 'maintenance').length.toString(),
      icon: Wrench,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      urgent: !loading && assets.filter(a => a.status === 'maintenance').length > 0
    },
    {
      label: "QR codes générés",
      value: loading ? "..." : assets.filter(a => a.qr_code).length.toString(),
      icon: QrCode,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      change: "+8%"
    }
  ];

  const quickActions = [
    {
      title: "Ajouter équipement",
      description: "Nouveau matériel avec QR code",
      icon: QrCode,
      url: "/resources/inventory",
      color: "bg-blue-600"
    },
    {
      title: "Planifier maintenance",
      description: "Programmer intervention",
      icon: Wrench,
      url: "/resources/maintenance",
      color: "bg-orange-600"
    },
    {
      title: "Nouvelle demande achat",
      description: "Créer bon de commande",
      icon: ShoppingCart,
      url: "/resources/procurement",
      color: "bg-green-600"
    },
    {
      title: "Réserver salle",
      description: "Booking équipement/local",
      icon: Calendar,
      url: "/resources/bookings",
      color: "bg-purple-600"
    }
  ];

  const recentAlerts = [
    {
      id: 1,
      type: "maintenance",
      message: "Maintenance préventive due pour Projecteur Salle A1",
      priority: "high",
      time: "Il y a 2h"
    },
    {
      id: 2,
      type: "reservation",
      message: "Conflit de réservation - Salle B3 le 15/01",
      priority: "medium",
      time: "Il y a 4h"
    },
    {
      id: 3,
      type: "inventory",
      message: "Stock faible - Câbles HDMI (5 restants)",
      priority: "low",
      time: "Il y a 6h"
    }
  ];

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'maintenance': return <Wrench className="w-4 h-4" />;
      case 'reservation': return <Calendar className="w-4 h-4" />;
      case 'inventory': return <Package className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-orange-600 bg-orange-100';
      case 'low': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="bg-white rounded-2xl shadow-sm border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    {stat.change && (
                      <p className="text-xs text-green-600 mt-1">
                        <TrendingUp className="w-3 h-3 inline mr-1" />
                        {stat.change}
                      </p>
                    )}
                    {stat.urgent && (
                      <p className="text-xs text-orange-600 mt-1">
                        <AlertTriangle className="w-3 h-3 inline mr-1" />
                        Action requise
                      </p>
                    )}
                  </div>
                  <div className={`p-3 ${stat.bgColor} rounded-xl`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Actions */}
        <Card className="bg-white rounded-2xl shadow-sm border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-primary" />
              Actions rapides
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <Link key={index} to={action.url}>
                    <Card className="border border-border/50 hover:bg-accent/50 transition-colors cursor-pointer">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className={`p-2 ${action.color} rounded-lg`}>
                            <Icon className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-foreground text-sm">{action.title}</h3>
                            <p className="text-xs text-muted-foreground mt-1">{action.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Recent Alerts */}
        <Card className="bg-white rounded-2xl shadow-sm border-0">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-primary" />
                Alertes récentes
              </CardTitle>
              <Button variant="outline" size="sm" asChild>
                <Link to="/resources/analytics">Voir tout</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-start gap-3 p-3 rounded-lg border border-border/50 hover:bg-accent/50 transition-colors"
                >
                  <div className={`p-2 rounded-lg ${getPriorityColor(alert.priority)}`}>
                    {getAlertIcon(alert.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{alert.message}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="w-3 h-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{alert.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Module Overview */}
      <Card className="bg-white rounded-2xl shadow-sm border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5 text-primary" />
            Vue d'ensemble des modules
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link to="/resources/inventory" className="group">
              <div className="text-center p-6 rounded-xl border border-border/50 hover:bg-accent/50 transition-colors">
                <QrCode className="w-8 h-8 mx-auto mb-3 text-blue-600 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold text-foreground mb-1">Inventaire</h3>
                <p className="text-sm text-muted-foreground">1,247 équipements</p>
              </div>
            </Link>
            
            <Link to="/resources/maintenance" className="group">
              <div className="text-center p-6 rounded-xl border border-border/50 hover:bg-accent/50 transition-colors">
                <Wrench className="w-8 h-8 mx-auto mb-3 text-orange-600 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold text-foreground mb-1">Maintenance</h3>
                <p className="text-sm text-muted-foreground">23 interventions dues</p>
              </div>
            </Link>
            
            <Link to="/resources/procurement" className="group">
              <div className="text-center p-6 rounded-xl border border-border/50 hover:bg-accent/50 transition-colors">
                <ShoppingCart className="w-8 h-8 mx-auto mb-3 text-green-600 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold text-foreground mb-1">Achats</h3>
                <p className="text-sm text-muted-foreground">12 demandes en cours</p>
              </div>
            </Link>
            
            <Link to="/resources/property" className="group">
              <div className="text-center p-6 rounded-xl border border-border/50 hover:bg-accent/50 transition-colors">
                <Building className="w-8 h-8 mx-auto mb-3 text-purple-600 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold text-foreground mb-1">Patrimoine</h3>
                <p className="text-sm text-muted-foreground">2.4M€ de valeur</p>
              </div>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}