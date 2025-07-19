
import { StudentsModuleLayout } from "@/components/layouts/StudentsModuleLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Calendar,
  Users,
  Target,
  Download,
  Filter
} from "lucide-react";

export default function RegistrationAnalytics() {
  const analyticsData = {
    conversionRate: 78.5,
    avgProcessingTime: 2.3,
    satisfactionScore: 4.6,
    dropoffRate: 12.8
  };

  const trends = [
    {
      metric: "Inscriptions",
      value: "+23%",
      period: "vs mois dernier",
      trend: "up"
    },
    {
      metric: "Temps de traitement",
      value: "-15%",
      period: "vs moyenne",
      trend: "down"
    },
    {
      metric: "Taux de conversion",
      value: "+8.5%",
      period: "amélioration",
      trend: "up"
    }
  ];

  const programStats = [
    { program: "DUT Informatique", applications: 45, approved: 38, rate: 84.4 },
    { program: "DUT GEA", applications: 32, approved: 28, rate: 87.5 },
    { program: "DUT GMP", applications: 28, approved: 22, rate: 78.6 },
    { program: "DUT GEII", applications: 23, approved: 19, rate: 82.6 }
  ];

  return (
    <StudentsModuleLayout 
      title="Analytics & Tendances" 
      subtitle="Analyses approfondies des processus d'inscription et performances"
    >
      <div className="p-6 space-y-6">
        {/* Header avec actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            <span className="text-sm text-muted-foreground">Période: 30 derniers jours</span>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filtres
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Exporter
            </Button>
          </div>
        </div>

        {/* KPIs principaux */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Taux de conversion</p>
                  <p className="text-2xl font-bold text-primary">{analyticsData.conversionRate}%</p>
                </div>
                <Target className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-success/10 to-success/5">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Temps moyen</p>
                  <p className="text-2xl font-bold text-success">{analyticsData.avgProcessingTime}j</p>
                </div>
                <Calendar className="h-8 w-8 text-success" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-info/10 to-info/5">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Satisfaction</p>
                  <p className="text-2xl font-bold text-info">{analyticsData.satisfactionScore}/5</p>
                </div>
                <TrendingUp className="h-8 w-8 text-info" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-warning/10 to-warning/5">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Taux d'abandon</p>
                  <p className="text-2xl font-bold text-warning">{analyticsData.dropoffRate}%</p>
                </div>
                <TrendingDown className="h-8 w-8 text-warning" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tendances */}
        <Card>
          <CardHeader>
            <CardTitle>Tendances Clés</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {trends.map((trend, index) => (
                <div key={index} className="text-center p-4 bg-muted/20 rounded-lg">
                  <div className="flex items-center justify-center mb-2">
                    {trend.trend === 'up' ? (
                      <TrendingUp className="w-6 h-6 text-success" />
                    ) : (
                      <TrendingDown className="w-6 h-6 text-success" />
                    )}
                  </div>
                  <p className="text-sm font-medium text-muted-foreground">{trend.metric}</p>
                  <p className="text-2xl font-bold text-success">{trend.value}</p>
                  <p className="text-xs text-muted-foreground">{trend.period}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Performance par programme */}
        <Card>
          <CardHeader>
            <CardTitle>Performance par Programme</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {programStats.map((program, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-muted/20 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">{program.program}</p>
                    <p className="text-sm text-muted-foreground">
                      {program.applications} demandes • {program.approved} acceptées
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge 
                      variant={program.rate > 85 ? "default" : program.rate > 75 ? "secondary" : "outline"}
                      className="mb-1"
                    >
                      {program.rate}% accepté
                    </Badge>
                    <div className="w-24 bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${program.rate}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Insights et recommandations */}
        <Card>
          <CardHeader>
            <CardTitle>Insights & Recommandations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-success/10 border border-success/20 rounded-lg">
                <div className="flex items-start gap-3">
                  <TrendingUp className="w-5 h-5 text-success mt-0.5" />
                  <div>
                    <p className="font-medium text-success">Performance excellente</p>
                    <p className="text-sm text-muted-foreground">
                      Le taux de conversion global a augmenté de 8.5% ce mois-ci. 
                      L'optimisation du processus d'inscription porte ses fruits.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg">
                <div className="flex items-start gap-3">
                  <Target className="w-5 h-5 text-warning mt-0.5" />
                  <div>
                    <p className="font-medium text-warning">Opportunité d'amélioration</p>
                    <p className="text-sm text-muted-foreground">
                      Le programme DUT GMP présente un taux de conversion plus faible. 
                      Considérer une révision des critères d'admission.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </StudentsModuleLayout>
  );
}
