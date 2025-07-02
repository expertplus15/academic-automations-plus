import { ExamsModuleLayout } from "@/components/layouts/ExamsModuleLayout";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, 
  Download, 
  Filter,
  Calendar,
  BarChart3,
  PieChart,
  TrendingUp,
  Clock,
  Users,
  Building,
  CheckCircle,
  AlertTriangle,
  Target,
  Activity
} from 'lucide-react';

export default function ExamsReports() {
  const reportTypes = [
    {
      title: "Rapport de planification",
      description: "Analyse complète de la planification des examens",
      icon: Calendar,
      lastGenerated: "Il y a 2 heures",
      size: "2.4 MB",
      format: "PDF"
    },
    {
      title: "Rapport d'utilisation des salles",
      description: "Statistiques d'occupation et optimisation",
      icon: Building,
      lastGenerated: "Il y a 1 jour",
      size: "1.8 MB",
      format: "Excel"
    },
    {
      title: "Rapport de surveillance",
      description: "Attribution et performance des surveillants",
      icon: Users,
      lastGenerated: "Il y a 6 heures",
      size: "987 KB",
      format: "PDF"
    },
    {
      title: "Rapport IA & Optimisation",
      description: "Performance des algorithmes d'optimisation",
      icon: Target,
      lastGenerated: "Il y a 30 min",
      size: "3.2 MB",
      format: "PDF"
    }
  ];

  const weeklyStats = [
    { label: "Examens organisés", value: 127, change: "+15%", trend: "up" },
    { label: "Taux de réussite planification", value: 96.8, change: "+2.3%", trend: "up" },
    { label: "Conflits évités", value: 23, change: "+156%", trend: "up" },
    { label: "Temps gagné", value: 18.5, change: "+34%", trend: "up" }
  ];

  const monthlyData = [
    { period: "Janvier 2024", examens: 342, conflits: 5, satisfaction: 4.8 },
    { period: "Décembre 2023", examens: 298, conflits: 12, satisfaction: 4.5 },
    { period: "Novembre 2023", examens: 276, conflits: 18, satisfaction: 4.2 },
    { period: "Octobre 2023", examens: 259, conflits: 24, satisfaction: 3.9 }
  ];

  const upcomingReports = [
    {
      name: "Bilan semestriel",
      schedule: "Demain à 09:00",
      recipients: 15,
      status: "scheduled"
    },
    {
      name: "Rapport hebdomadaire",
      schedule: "Vendredi à 17:00",
      recipients: 8,
      status: "automated"
    },
    {
      name: "Analytics IA mensuel",
      schedule: "Fin du mois",
      recipients: 5,
      status: "pending"
    }
  ];

  const getFormatBadge = (format: string) => {
    const colors = {
      PDF: "bg-red-100 text-red-700 border-red-200",
      Excel: "bg-green-100 text-green-700 border-green-200",
      Word: "bg-blue-100 text-blue-700 border-blue-200"
    };
    return <Badge className={colors[format as keyof typeof colors] || "bg-gray-100 text-gray-700"}>{format}</Badge>;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <Badge className="bg-blue-100 text-blue-700 border-blue-200"><Clock className="w-3 h-3 mr-1" />Programmé</Badge>;
      case 'automated':
        return <Badge className="bg-green-100 text-green-700 border-green-200"><CheckCircle className="w-3 h-3 mr-1" />Automatique</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200"><AlertTriangle className="w-3 h-3 mr-1" />En attente</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <ExamsModuleLayout 
      title="Rapports & Analytics"
      subtitle="Génération automatique de rapports et analyses de performance"
    >
      <div className="p-8 space-y-8">
        {/* Actions header */}
        <div className="flex justify-between items-center">
          <div className="flex gap-3">
            <Button className="bg-violet-600 hover:bg-violet-700">
              <FileText className="w-4 h-4 mr-2" />
              Générer rapport
            </Button>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filtres
            </Button>
          </div>
          <Badge variant="outline" className="px-3 py-1">
            <Activity className="w-3 h-3 mr-1" />
            Dernière sync il y a 5 min
          </Badge>
        </div>

        {/* Stats rapides */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {weeklyStats.map((stat, index) => (
            <Card key={index} className="bg-white rounded-2xl shadow-sm border-0">
              <CardContent className="p-6">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold text-foreground">
                    {typeof stat.value === 'number' && stat.value % 1 !== 0 ? stat.value.toFixed(1) : stat.value}
                    {stat.label.includes('Taux') ? '%' : ''}
                    {stat.label.includes('Temps') ? 'h' : ''}
                  </p>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-green-600">{stat.change}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="available" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="available">Rapports disponibles</TabsTrigger>
            <TabsTrigger value="scheduled">Programmés</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="templates">Modèles</TabsTrigger>
          </TabsList>

          <TabsContent value="available" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reportTypes.map((report, index) => (
                <Card key={index} className="bg-white rounded-2xl shadow-sm border-0 hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-violet-100 rounded-lg">
                          <report.icon className="w-5 h-5 text-violet-600" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{report.title}</CardTitle>
                          <p className="text-sm text-muted-foreground">{report.description}</p>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Dernière génération:</span>
                      <span>{report.lastGenerated}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getFormatBadge(report.format)}
                        <span className="text-sm text-muted-foreground">{report.size}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button size="sm" className="bg-violet-600 hover:bg-violet-700">
                          Générer
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="scheduled" className="space-y-6">
            <Card className="bg-white rounded-2xl shadow-sm border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-violet-500" />
                  Rapports programmés
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingReports.map((report, index) => (
                    <div key={index} className="flex items-center justify-between p-4 rounded-xl border border-border/50">
                      <div>
                        <p className="font-semibold text-foreground">{report.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {report.schedule} • {report.recipients} destinataires
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        {getStatusBadge(report.status)}
                        <Button variant="ghost" size="sm">
                          <FileText className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card className="bg-white rounded-2xl shadow-sm border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-violet-500" />
                  Évolution mensuelle
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {monthlyData.map((data, index) => (
                    <div key={index} className="flex items-center justify-between p-4 rounded-xl border border-border/50">
                      <div className="flex-1">
                        <h4 className="font-medium">{data.period}</h4>
                        <div className="flex gap-6 mt-2 text-sm text-muted-foreground">
                          <span>📊 {data.examens} examens</span>
                          <span>⚠️ {data.conflits} conflits</span>
                          <span>⭐ {data.satisfaction}/5 satisfaction</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-foreground">{data.examens}</div>
                        {index > 0 && (
                          <div className={`text-sm flex items-center gap-1 ${
                            data.examens > monthlyData[index - 1].examens ? 'text-green-600' : 'text-red-600'
                          }`}>
                            +{data.examens - monthlyData[index - 1].examens} <TrendingUp className="w-3 h-3" />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="templates" className="space-y-6">
            <Card className="bg-white rounded-2xl shadow-sm border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-violet-500" />
                  Modèles de rapports
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Gestionnaire de modèles de rapports</p>
                    <p className="text-sm mt-1">Créez et personnalisez vos modèles</p>
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