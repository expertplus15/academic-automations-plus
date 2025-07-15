import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Award, 
  Clock,
  Target,
  Activity,
  Zap,
  AlertTriangle,
  CheckCircle
} from "lucide-react";

interface StatisticData {
  label: string;
  value: number;
  total?: number;
  change?: number;
  trend?: "up" | "down" | "stable";
  status?: "success" | "warning" | "error" | "info";
}

interface PerformanceMetric {
  category: string;
  metrics: StatisticData[];
}

export function AdvancedStatisticsViewer() {
  const performanceMetrics: PerformanceMetric[] = [
    {
      category: "Calculs de Performance",
      metrics: [
        { label: "Moyennes calculées", value: 2847, total: 3000, change: 12, trend: "up", status: "success" },
        { label: "ECTS validés", value: 1456, total: 1600, change: -3, trend: "down", status: "warning" },
        { label: "Erreurs détectées", value: 23, change: -15, trend: "up", status: "error" },
        { label: "Temps moyen (ms)", value: 1250, change: -8, trend: "up", status: "info" }
      ]
    },
    {
      category: "Qualité des Données",
      metrics: [
        { label: "Données complètes", value: 96, total: 100, status: "success" },
        { label: "Cohérence", value: 89, total: 100, status: "warning" },
        { label: "Intégrité", value: 99, total: 100, status: "success" },
        { label: "Fiabilité", value: 94, total: 100, status: "success" }
      ]
    }
  ];

  const distributionData = [
    { range: "18-20", count: 45, percentage: 15, color: "bg-green-500" },
    { range: "16-18", count: 89, percentage: 30, color: "bg-blue-500" },
    { range: "14-16", count: 102, percentage: 34, color: "bg-yellow-500" },
    { range: "12-14", count: 48, percentage: 16, color: "bg-orange-500" },
    { range: "10-12", count: 12, percentage: 4, color: "bg-red-500" },
    { range: "0-10", count: 4, percentage: 1, color: "bg-gray-500" }
  ];

  const trendData = [
    { period: "Sept", averages: 14.2, ects: 28.5, rate: 92 },
    { period: "Oct", averages: 14.8, ects: 29.1, rate: 94 },
    { period: "Nov", averages: 15.1, ects: 29.8, rate: 96 },
    { period: "Déc", averages: 14.9, ects: 29.3, rate: 95 },
    { period: "Jan", averages: 15.3, ects: 30.2, rate: 97 }
  ];

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case "success": return <CheckCircle className="w-3 h-3 text-green-500" />;
      case "warning": return <AlertTriangle className="w-3 h-3 text-yellow-500" />;
      case "error": return <AlertTriangle className="w-3 h-3 text-red-500" />;
      case "info": return <Activity className="w-3 h-3 text-blue-500" />;
      default: return null;
    }
  };

  const getTrendIcon = (trend?: string) => {
    if (trend === "up") return <TrendingUp className="w-3 h-3 text-green-500" />;
    if (trend === "down") return <TrendingUp className="w-3 h-3 text-red-500 rotate-180" />;
    return <Activity className="w-3 h-3 text-gray-500" />;
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="performance" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="performance" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Performance
          </TabsTrigger>
          <TabsTrigger value="distribution" className="flex items-center gap-2">
            <Target className="w-4 h-4" />
            Distribution
          </TabsTrigger>
          <TabsTrigger value="trends" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Tendances
          </TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-4">
          {performanceMetrics.map((category, categoryIndex) => (
            <Card key={categoryIndex}>
              <CardHeader>
                <CardTitle className="text-base">{category.category}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {category.metrics.map((metric, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{metric.label}</span>
                          {getStatusIcon(metric.status)}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold">
                            {metric.value.toLocaleString()}
                            {metric.total && (
                              <span className="text-muted-foreground font-normal">
                                /{metric.total.toLocaleString()}
                              </span>
                            )}
                          </span>
                          {metric.change !== undefined && (
                            <div className="flex items-center gap-1">
                              {getTrendIcon(metric.trend)}
                              <span className={`text-xs ${
                                metric.trend === "up" ? "text-green-600" : 
                                metric.trend === "down" ? "text-red-600" : 
                                "text-gray-600"
                              }`}>
                                {metric.change > 0 ? "+" : ""}{metric.change}%
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      {metric.total && (
                        <Progress value={(metric.value / metric.total) * 100} className="h-2" />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="distribution" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-500" />
                Distribution des Notes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {distributionData.map((range, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded ${range.color}`}></div>
                        <span className="text-sm font-medium">{range.range}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge variant="outline">{range.count} étudiants</Badge>
                        <span className="text-sm font-bold">{range.percentage}%</span>
                      </div>
                    </div>
                    <Progress value={range.percentage} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5 text-purple-500" />
                Mentions Attribuées
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 border border-border rounded-lg">
                  <div className="text-2xl font-bold text-green-600">23</div>
                  <div className="text-xs text-muted-foreground">Très Bien</div>
                  <Badge variant="default" className="mt-2 bg-green-100 text-green-800 border-green-200">7.7%</Badge>
                </div>
                <div className="text-center p-4 border border-border rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">45</div>
                  <div className="text-xs text-muted-foreground">Bien</div>
                  <Badge variant="secondary" className="mt-2">15%</Badge>
                </div>
                <div className="text-center p-4 border border-border rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">67</div>
                  <div className="text-xs text-muted-foreground">Assez Bien</div>
                  <Badge variant="secondary" className="mt-2">22.3%</Badge>
                </div>
                <div className="text-center p-4 border border-border rounded-lg">
                  <div className="text-2xl font-bold text-gray-600">165</div>
                  <div className="text-xs text-muted-foreground">Passable</div>
                  <Badge variant="outline" className="mt-2">55%</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-500" />
                Évolution Mensuelle
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-5 gap-4">
                  {trendData.map((period, index) => (
                    <div key={index} className="text-center p-4 border border-border rounded-lg">
                      <div className="text-sm font-medium text-muted-foreground mb-3">{period.period}</div>
                      <div className="space-y-2">
                        <div>
                          <div className="text-lg font-bold">{period.averages}</div>
                          <div className="text-xs text-muted-foreground">Moyenne</div>
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-blue-600">{period.ects}</div>
                          <div className="text-xs text-muted-foreground">ECTS</div>
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-green-600">{period.rate}%</div>
                          <div className="text-xs text-muted-foreground">Réussite</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-500" />
                  Prédictions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Février estimé</span>
                    <span className="font-semibold">15.6</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Fin d'année</span>
                    <span className="font-semibold">15.8</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Objectif</span>
                    <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">16.0</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-500" />
                  Timing
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Dernier calcul</span>
                    <span className="font-semibold">14:32</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Durée moyenne</span>
                    <span className="font-semibold">3m 24s</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Prochain auto</span>
                    <Badge variant="secondary">18:00</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Users className="w-4 h-4 text-purple-500" />
                  Impact
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Étudiants traités</span>
                    <span className="font-semibold">2,847</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Programmes</span>
                    <span className="font-semibold">12</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Alertes créées</span>
                    <Badge variant="secondary">34</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}