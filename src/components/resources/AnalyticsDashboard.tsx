import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart, TrendingUp, Package, Calendar, Building, Download, Filter, Eye, CalendarIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function AnalyticsDashboard() {
  const navigate = useNavigate();
  const kpis = [
    {
      label: "ROI Équipements",
      value: "89.5%",
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-100",
      change: "+5.2%"
    },
    {
      label: "Taux d'utilisation",
      value: "76%",
      icon: Package,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      change: "+12%"
    },
    {
      label: "Coût maintenance",
      value: "24.5K€",
      icon: Calendar,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      change: "-8%"
    },
    {
      label: "Valorisation patrimoine",
      value: "2.8M€",
      icon: Building,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      change: "+15%"
    }
  ];

  const reports = [
    {
      id: 1,
      title: "Rapport mensuel d'inventaire",
      description: "État complet de l'inventaire par catégorie",
      lastGenerated: "2024-01-15",
      type: "inventory"
    },
    {
      id: 2,
      title: "Analyse des coûts de maintenance",
      description: "Évolution des coûts par type d'équipement",
      lastGenerated: "2024-01-10",
      type: "maintenance"
    },
    {
      id: 3,
      title: "Statistiques d'utilisation",
      description: "Taux d'occupation des salles et équipements",
      lastGenerated: "2024-01-08",
      type: "usage"
    },
    {
      id: 4,
      title: "Évaluation patrimoniale",
      description: "Valorisation et amortissements",
      lastGenerated: "2024-01-05",
      type: "valuation"
    }
  ];

  const analytics = [
    {
      title: "Répartition par catégorie",
      description: "Distribution des équipements par type",
      chart: "pie",
      data: "45% Informatique, 25% Audiovisuel, 20% Bureau, 10% Autres"
    },
    {
      title: "Évolution des coûts",
      description: "Tendances sur 12 mois",
      chart: "line",
      data: "Maintenance: -8%, Acquisition: +15%, Valorisation: +12%"
    },
    {
      title: "Performance utilisation",
      description: "Taux d'occupation par mois",
      chart: "bar",
      data: "Jan: 76%, Fév: 82%, Mar: 79%, Avr: 85%"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Quick Actions */}
      <div className="flex gap-4 mb-6">
        <Button onClick={() => navigate('/resources/bookings')} className="bg-primary text-primary-foreground">
          <CalendarIcon className="w-4 h-4 mr-2" />
          Réservation salles
        </Button>
        <Button onClick={() => navigate('/resources/property')} variant="outline">
          <Building className="w-4 h-4 mr-2" />
          Nouveau bien
        </Button>
        <Button onClick={() => navigate('/resources/reports')} variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Générer rapport
        </Button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {kpis.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <Card key={index} className="bg-white rounded-2xl shadow-sm border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{kpi.label}</p>
                    <p className="text-2xl font-bold text-foreground">{kpi.value}</p>
                    <p className={`text-xs mt-1 ${kpi.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                      {kpi.change} vs mois dernier
                    </p>
                  </div>
                  <div className={`p-3 ${kpi.bgColor} rounded-xl`}>
                    <Icon className={`w-6 h-6 ${kpi.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Analytics Charts */}
        <Card className="bg-white rounded-2xl shadow-sm border-0">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <BarChart className="w-5 h-5 text-primary" />
                Analyses graphiques
              </CardTitle>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filtres
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {analytics.map((analytic, index) => (
                <div key={index} className="p-4 rounded-lg border border-border/50">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-medium text-foreground">{analytic.title}</h3>
                      <p className="text-sm text-muted-foreground">{analytic.description}</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="h-32 bg-accent/20 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <BarChart className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-xs text-muted-foreground">{analytic.data}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Reports */}
        <Card className="bg-white rounded-2xl shadow-sm border-0">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Download className="w-5 h-5 text-primary" />
                Rapports automatisés
              </CardTitle>
              <Button onClick={() => navigate('/resources/reports')} className="bg-primary text-primary-foreground" size="sm">
                Générer rapport
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reports.map((report) => (
                <div
                  key={report.id}
                  className="flex items-center justify-between p-4 rounded-xl border border-border/50 hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Download className="w-5 h-5 text-primary" />
                    </div>
                    <div className="space-y-1 flex-1">
                      <h3 className="font-medium text-foreground">{report.title}</h3>
                      <p className="text-sm text-muted-foreground">{report.description}</p>
                      <p className="text-xs text-muted-foreground">
                        Dernière génération: {new Date(report.lastGenerated).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-1" />
                      Voir
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-1" />
                      Télécharger
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <Card className="bg-white rounded-2xl shadow-sm border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Analyses détaillées
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 rounded-xl border border-border/50">
              <Package className="w-8 h-8 mx-auto mb-3 text-blue-600" />
              <h3 className="font-semibold text-foreground mb-2">Inventaire</h3>
              <p className="text-2xl font-bold text-blue-600 mb-1">1,247</p>
              <p className="text-sm text-muted-foreground">équipements trackés</p>
            </div>
            
            <div className="text-center p-6 rounded-xl border border-border/50">
              <Calendar className="w-8 h-8 mx-auto mb-3 text-orange-600" />
              <h3 className="font-semibold text-foreground mb-2">Maintenance</h3>
              <p className="text-2xl font-bold text-orange-600 mb-1">95.2%</p>
              <p className="text-sm text-muted-foreground">taux de conformité</p>
            </div>
            
            <div className="text-center p-6 rounded-xl border border-border/50">
              <Building className="w-8 h-8 mx-auto mb-3 text-green-600" />
              <h3 className="font-semibold text-foreground mb-2">Patrimoine</h3>
              <p className="text-2xl font-bold text-green-600 mb-1">+12.5%</p>
              <p className="text-sm text-muted-foreground">croissance annuelle</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}