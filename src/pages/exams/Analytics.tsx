import { ExamsModuleLayout } from "@/components/layouts/ExamsModuleLayout";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  TrendingUp, 
  Activity, 
  Clock,
  Target,
  Download,
  Filter,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Bot,
  Calendar,
  Users,
  Building
} from 'lucide-react';

export default function ExamsAnalytics() {
  const kpiData = [
    {
      title: "Efficacité planification IA",
      value: "96.2%",
      change: "+3.1%",
      trend: "up",
      description: "Algorithmes d'optimisation"
    },
    {
      title: "Réduction des conflits",
      value: "89%",
      change: "+15%",
      trend: "up", 
      description: "Vs planification manuelle"
    },
    {
      title: "Temps de planification",
      value: "2.4min",
      change: "-78%",
      trend: "up",
      description: "Pour 100+ examens"
    },
    {
      title: "Satisfaction utilisateurs",
      value: "4.8/5",
      change: "+0.3",
      trend: "up",
      description: "Retours enseignants"
    }
  ];

  const roomUtilization = [
    { room: "Amphi A", utilization: 89, capacity: 150, sessions: 24 },
    { room: "Amphi B", utilization: 76, capacity: 120, sessions: 18 },
    { room: "Salle C101", utilization: 92, capacity: 45, sessions: 32 },
    { room: "Salle C102", utilization: 67, capacity: 40, sessions: 21 }
  ];

  const examTypes = [
    { type: "Examens finaux", count: 45, percentage: 38.1 },
    { type: "Partiels", count: 32, percentage: 27.1 },
    { type: "Rattrapages", count: 28, percentage: 23.7 },
    { type: "Examens blancs", count: 13, percentage: 11.0 }
  ];

  const performanceData = [
    { period: "Cette semaine", examens: 28, conflits: 0, efficacite: 98 },
    { period: "Semaine précédente", examens: 23, conflits: 1, efficacite: 95 },
    { period: "Il y a 2 semaines", examens: 31, conflits: 2, efficacite: 93 },
    { period: "Il y a 3 semaines", examens: 19, conflits: 3, efficacite: 89 }
  ];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <ArrowUpRight className="w-4 h-4 text-green-600" />;
      case 'down': return <ArrowDownRight className="w-4 h-4 text-red-600" />;
      default: return <Minus className="w-4 h-4 text-gray-600" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <ExamsModuleLayout 
      title="Analytics - Examens IA"
      subtitle="Analyses avancées et métriques de performance intelligentes"
    >
      <div className="p-8 space-y-8">
        {/* Actions header */}
        <div className="flex justify-between items-center">
          <div className="flex gap-3">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Exporter données
            </Button>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filtres
            </Button>
            <Button variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Actualiser
            </Button>
          </div>
          <Badge variant="outline" className="px-3 py-1">
            <Activity className="w-3 h-3 mr-1" />
            Mis à jour il y a 2 min
          </Badge>
        </div>

        {/* KPIs principaux */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpiData.map((kpi, index) => (
            <Card key={index} className="bg-white rounded-2xl shadow-sm border-0 hover:shadow-md transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-sm text-muted-foreground">{kpi.title}</h3>
                  {getTrendIcon(kpi.trend)}
                </div>
                <div className="space-y-2">
                  <p className="text-3xl font-bold text-foreground">{kpi.value}</p>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-medium ${getTrendColor(kpi.trend)}`}>
                      {kpi.change}
                    </span>
                    <span className="text-xs text-muted-foreground">vs période précédente</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{kpi.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Onglets d'analyses */}
        <Tabs defaultValue="performance" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="performance">Performance IA</TabsTrigger>
            <TabsTrigger value="utilization">Utilisation</TabsTrigger>
            <TabsTrigger value="types">Types d'examens</TabsTrigger>
            <TabsTrigger value="trends">Tendances</TabsTrigger>
          </TabsList>

          <TabsContent value="performance" className="space-y-6">
            <Card className="bg-white rounded-2xl shadow-sm border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="w-5 h-5 text-violet-500" />
                  Performance algorithmes IA (4 dernières semaines)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {performanceData.map((period, index) => (
                    <div key={index} className="flex items-center justify-between p-4 rounded-xl border border-border/50">
                      <div className="flex-1">
                        <h4 className="font-medium">{period.period}</h4>
                        <div className="flex gap-6 mt-2 text-sm text-muted-foreground">
                          <span>📅 {period.examens} examens</span>
                          <span>⚠️ {period.conflits} conflits</span>
                          <span>🎯 {period.efficacite}% efficacité</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-foreground">{period.efficacite}%</div>
                        {index > 0 && (
                          <div className={`text-sm flex items-center gap-1 ${
                            period.efficacite > performanceData[index - 1].efficacite ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {period.efficacite > performanceData[index - 1].efficacite ? (
                              <>+{period.efficacite - performanceData[index - 1].efficacite}% <TrendingUp className="w-3 h-3" /></>
                            ) : (
                              <>{period.efficacite - performanceData[index - 1].efficacite}% <ArrowDownRight className="w-3 h-3" /></>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="utilization" className="space-y-6">
            <Card className="bg-white rounded-2xl shadow-sm border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="w-5 h-5 text-violet-500" />
                  Utilisation des salles
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {roomUtilization.map((room, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{room.room}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">
                            {room.sessions} sessions - Cap. {room.capacity}
                          </span>
                          <Badge variant="outline">{room.utilization}%</Badge>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            room.utilization > 85 ? 'bg-green-500' :
                            room.utilization > 65 ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`}
                          style={{ width: `${room.utilization}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="types" className="space-y-6">
            <Card className="bg-white rounded-2xl shadow-sm border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-violet-500" />
                  Répartition par type d'examen
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {examTypes.map((type, index) => (
                    <div key={index} className="p-4 rounded-xl border border-border/50 text-center">
                      <div className="text-2xl font-bold text-foreground">{type.count}</div>
                      <div className="text-sm font-medium mt-1">{type.type}</div>
                      <div className="text-xs text-muted-foreground">{type.percentage}% du total</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            <Card className="bg-white rounded-2xl shadow-sm border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-violet-500" />
                  Tendances et prévisions IA
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Graphiques de tendances interactifs</p>
                    <p className="text-sm mt-1">Prévisions basées sur l'IA pour les prochaines semaines</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ExamsModuleLayout>
  );
}