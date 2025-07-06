import { StudentsModuleLayout } from "@/components/layouts/StudentsModuleLayout";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Calendar, 
  PieChart, 
  Activity,
  Clock,
  Target,
  Download,
  Filter,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  Minus
} from 'lucide-react';
import { CrossModuleNavigation } from '@/components/students/registration/CrossModuleNavigation';
import { QuickInsightsCard } from '@/components/students/registration/QuickInsightsCard';
import { ContextualBreadcrumbs } from '@/components/students/registration/ContextualBreadcrumbs';
import { useRegistrationInsights } from '@/hooks/students/useRegistrationInsights';

export default function RegistrationAnalytics() {
  const { insights, loading } = useRegistrationInsights();
  
  const kpiData = [
    {
      title: "Taux de conversion",
      value: "89.3%",
      change: "+2.4%",
      trend: "up",
      description: "Candidatures vers inscriptions validées"
    },
    {
      title: "Temps moyen de traitement",
      value: "3.2j",
      change: "-0.8j",
      trend: "up", 
      description: "Délai de validation des dossiers"
    },
    {
      title: "Taux d'abandon",
      value: "12.7%",
      change: "+1.2%",
      trend: "down",
      description: "Candidatures non finalisées"
    },
    {
      title: "Satisfaction candidats",
      value: "4.6/5",
      change: "0%",
      trend: "stable",
      description: "Note moyenne processus"
    }
  ];

  const periodData = [
    { period: "Cette semaine", inscriptions: 127, validations: 89, en_cours: 38 },
    { period: "Semaine précédente", inscriptions: 112, validations: 78, en_cours: 34 },
    { period: "Il y a 2 semaines", inscriptions: 98, validations: 67, en_cours: 31 },
    { period: "Il y a 3 semaines", inscriptions: 87, validations: 61, en_cours: 26 }
  ];

  const programData = [
    { program: "Master Informatique", inscriptions: 45, percentage: 35.4, color: "bg-blue-500" },
    { program: "Licence Commerce", inscriptions: 32, percentage: 25.2, color: "bg-green-500" },
    { program: "BTS Design", inscriptions: 28, percentage: 22.0, color: "bg-purple-500" },
    { program: "Master Marketing", inscriptions: 22, percentage: 17.3, color: "bg-orange-500" }
  ];

  const channelData = [
    { channel: "Site web", count: 68, percentage: 53.5 },
    { channel: "Salons étudiants", count: 24, percentage: 18.9 },
    { channel: "Recommandations", count: 19, percentage: 14.9 },
    { channel: "Réseaux sociaux", count: 16, percentage: 12.6 }
  ];

  const documentStatus = [
    { type: "CNI/Passeport", complete: 89, pending: 12, missing: 4 },
    { type: "Diplômes", complete: 76, pending: 18, missing: 11 },
    { type: "Relevés de notes", complete: 82, pending: 15, missing: 8 },
    { type: "Lettre motivation", complete: 94, pending: 8, missing: 3 }
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

  const dashboardInsights = [
    {
      title: "Inscriptions en cours",
      value: `${insights.currentRegistrations}`,
      change: "+15",
      trend: "up" as const,
      description: "Inscriptions actuellement en traitement",
      actionText: "Voir détails",
      targetPath: "/students/registration/dashboard"
    },
    {
      title: "Actions en attente",
      value: `${insights.pendingValidations}`,
      change: "+8",
      trend: "up" as const,
      description: "Validations nécessitant une intervention",
      actionText: "Traiter",
      targetPath: "/students/registration/dashboard"
    }
  ];

  return (
    <StudentsModuleLayout 
      title="Analytics - Inscriptions"
      subtitle="Analyses approfondies et métriques de performance"
    >
      <div className="p-8 space-y-8">
        {/* Breadcrumbs contextuels */}
        <ContextualBreadcrumbs 
          currentPage="analytics"
          activeFilters={{ dateRange: "30 derniers jours", status: "Toutes" }}
        />

        {/* Navigation vers Dashboard */}
        <CrossModuleNavigation 
          currentModule="analytics"
          insights={{
            pendingActions: insights.pendingValidations,
            recentActivity: insights.recentActivity.length
          }}
        />

        {/* Actions header */}
        <div className="flex justify-between items-center">
          <div className="flex gap-3">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Exporter rapport
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
            Mis à jour il y a 5 min
          </Badge>
        </div>

        {/* KPIs principaux avec Quick Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {/* KPIs Analytics */}
          <div className="lg:col-span-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
          
          {/* Quick Dashboard Insights */}
          <div className="lg:col-span-1">
            <QuickInsightsCard 
              sourceModule="analytics"
              data={dashboardInsights}
            />
          </div>
        </div>

        {/* Onglets d'analyses */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="programs">Programmes</TabsTrigger>
            <TabsTrigger value="channels">Canaux</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Évolution temporelle */}
            <Card className="bg-white rounded-2xl shadow-sm border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-emerald-500" />
                  Évolution des inscriptions (4 dernières semaines)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {periodData.map((period, index) => (
                    <div key={index} className="flex items-center justify-between p-4 rounded-xl border border-border/50">
                      <div className="flex-1">
                        <h4 className="font-medium">{period.period}</h4>
                        <div className="flex gap-6 mt-2 text-sm text-muted-foreground">
                          <span>📝 {period.inscriptions} inscriptions</span>
                          <span>✅ {period.validations} validées</span>
                          <span>⏳ {period.en_cours} en cours</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-foreground">{period.inscriptions}</div>
                        {index > 0 && (
                          <div className={`text-sm flex items-center gap-1 ${
                            period.inscriptions > periodData[index - 1].inscriptions ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {period.inscriptions > periodData[index - 1].inscriptions ? (
                              <>+{period.inscriptions - periodData[index - 1].inscriptions} <TrendingUp className="w-3 h-3" /></>
                            ) : (
                              <>{period.inscriptions - periodData[index - 1].inscriptions} <ArrowDownRight className="w-3 h-3" /></>
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

          <TabsContent value="programs" className="space-y-6">
            <Card className="bg-white rounded-2xl shadow-sm border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="w-5 h-5 text-emerald-500" />
                  Répartition par programme
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {programData.map((program, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{program.program}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">{program.inscriptions} inscriptions</span>
                          <Badge variant="outline">{program.percentage}%</Badge>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`${program.color} h-2 rounded-full`}
                          style={{ width: `${program.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="channels" className="space-y-6">
            <Card className="bg-white rounded-2xl shadow-sm border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-emerald-500" />
                  Canaux d'acquisition
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {channelData.map((channel, index) => (
                    <div key={index} className="p-4 rounded-xl border border-border/50 text-center">
                      <div className="text-2xl font-bold text-foreground">{channel.count}</div>
                      <div className="text-sm font-medium mt-1">{channel.channel}</div>
                      <div className="text-xs text-muted-foreground">{channel.percentage}% du total</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents" className="space-y-6">
            <Card className="bg-white rounded-2xl shadow-sm border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-emerald-500" />
                  État des documents requis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {documentStatus.map((doc, index) => (
                    <div key={index} className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{doc.type}</span>
                        <span className="text-sm text-muted-foreground">
                          {doc.complete + doc.pending + doc.missing} total
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div className="text-center p-2 bg-green-50 rounded-lg">
                          <div className="font-semibold text-green-700">{doc.complete}</div>
                          <div className="text-green-600">Complets</div>
                        </div>
                        <div className="text-center p-2 bg-yellow-50 rounded-lg">
                          <div className="font-semibold text-yellow-700">{doc.pending}</div>
                          <div className="text-yellow-600">En attente</div>
                        </div>
                        <div className="text-center p-2 bg-red-50 rounded-lg">
                          <div className="font-semibold text-red-700">{doc.missing}</div>
                          <div className="text-red-600">Manquants</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </StudentsModuleLayout>
  );
}