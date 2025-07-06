
import React from 'react';
import { ModuleLayout } from '@/components/layouts/ModuleLayout';
import { ExamsModuleSidebar } from '@/components/ExamsModuleSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  FileText, 
  Calendar, 
  Building,
  Users,
  Bot,
  Monitor,
  AlertTriangle,
  TrendingUp,
  CheckCircle,
  Clock,
  MapPin,
  Zap,
  BarChart3,
  Activity,
  RefreshCw,
  Eye,
  Target
} from 'lucide-react';
import { useExamsData } from '@/hooks/useExamsData';
import { useExamOptimization } from '@/hooks/useExamOptimization';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';


export default function Exams() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { stats, loading, error, refreshStats, conflicts, exams, sessions } = useExamsData();
  const { runOptimization, loading: optimizationLoading } = useExamOptimization();

  const handleOptimization = async () => {
    try {
      await runOptimization('550e8400-e29b-41d4-a716-446655440001');
      toast({
        title: "Optimisation terminée",
        description: "Planning d'examens optimisé avec succès!",
      });
      refreshStats();
    } catch (error) {
      toast({
        title: "Erreur d'optimisation",
        description: "Une erreur est survenue lors de l'optimisation.",
        variant: "destructive",
      });
    }
  };

  const examStats = [
    {
      label: "Examens planifiés",
      value: stats.scheduledExams.toString(),
      change: `+${Math.round((stats.scheduledExams / Math.max(stats.totalExams, 1)) * 100)}%`,
      changeType: "positive" as const,
      icon: Calendar,
      trend: [65, 78, 82, 94, stats.scheduledExams],
      color: "violet"
    },
    {
      label: "Conflits détectés",
      value: stats.conflictsCount.toString(),
      change: stats.conflictsCount === 0 ? "Aucun" : "-85%",
      changeType: stats.conflictsCount === 0 ? "positive" : "negative" as const,
      icon: AlertTriangle,
      trend: [20, 15, 8, 5, stats.conflictsCount],
      color: "orange"
    },
    {
      label: "Salles utilisées",
      value: `${stats.roomsUsed}/${stats.totalRooms}`,
      change: `+${Math.round((stats.roomsUsed / Math.max(stats.totalRooms, 1)) * 100)}%`,
      changeType: "positive" as const,
      icon: Building,
      trend: [35, 38, 40, 43, 45],
      color: "blue"
    },
    {
      label: "Taux d'optimisation IA",
      value: `${stats.optimizationEfficiency}%`,
      change: "+8%",
      changeType: "positive" as const,
      icon: Bot,
      trend: [82, 85, 88, 91, stats.optimizationEfficiency],
      color: "emerald"
    }
  ];

  // Transform sessions data for display
  const upcomingExams = sessions
    .filter(session => new Date(session.start_time) > new Date())
    .slice(0, 5)
    .map((session, index) => ({
      id: session.id,
      subject: session.exams?.title || 'Examen',
      date: new Date(session.start_time).toLocaleDateString('fr-FR'),
      time: new Date(session.start_time).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      room: session.rooms?.name || 'Salle TBD',
      students: Math.floor(Math.random() * 150) + 50, // Placeholder
      status: session.status,
      supervisor: "Prof. TBD",
      priority: index < 2 ? "high" : index < 4 ? "medium" : "low"
    }));

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <Badge className="bg-blue-100 text-blue-700 border-blue-200"><Calendar className="w-3 h-3 mr-1" />Planifié</Badge>;
      case 'confirmed':
        return <Badge className="bg-green-100 text-green-700 border-green-200"><CheckCircle className="w-3 h-3 mr-1" />Confirmé</Badge>;
      case 'in_progress':
        return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200"><Clock className="w-3 h-3 mr-1" />En cours</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500';
      case 'medium': return 'border-l-yellow-500';
      case 'low': return 'border-l-green-500';
      default: return 'border-l-gray-500';
    }
  };

  const getIcon = (IconComponent: React.ElementType, color: string) => {
    const colorClasses = {
      violet: "text-violet-600 bg-violet-100",
      orange: "text-orange-600 bg-orange-100", 
      blue: "text-blue-600 bg-blue-100",
      emerald: "text-emerald-600 bg-emerald-100"
    };
    return (
      <div className={`p-3 rounded-xl ${colorClasses[color as keyof typeof colorClasses]}`}>
        <IconComponent className="w-6 h-6" />
      </div>
    );
  };

  if (loading) {
    return (
      <ModuleLayout sidebar={<ExamsModuleSidebar />}>
        <div className="p-8 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-500"></div>
        </div>
      </ModuleLayout>
    );
  }

  return (
    <ModuleLayout sidebar={<ExamsModuleSidebar />}>
      <div className="p-8 space-y-8">
        {/* Header avec actions rapides */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Examens IA</h1>
              <p className="text-muted-foreground text-lg mt-1">Tableau de bord intelligent avec optimisation temps réel</p>
            </div>
            <div className="flex gap-3">
              <Button 
                className="bg-green-600 hover:bg-green-700"
                onClick={() => navigate('/exams/creation')}
              >
                <Calendar className="w-4 h-4 mr-2" />
                Nouvel examen
              </Button>
              <Button 
                className="bg-violet-600 hover:bg-violet-700"
                onClick={handleOptimization}
                disabled={optimizationLoading}
              >
                <Bot className="w-4 h-4 mr-2" />
                {optimizationLoading ? 'Optimisation...' : 'Planification IA'}
              </Button>
              <Button variant="outline" onClick={() => navigate('/exams/analytics')}>
                <BarChart3 className="w-4 h-4 mr-2" />
                Analytics
              </Button>
              <Button variant="outline" onClick={refreshStats} disabled={loading}>
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                {loading ? 'Actualisation...' : 'Actualiser'}
              </Button>
            </div>
          </div>
          
          {/* Stats Cards avec tendances */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {examStats.map((stat, index) => (
              <Card key={index} className="bg-white rounded-2xl shadow-sm border-0 hover:shadow-lg transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                      <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <TrendingUp className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-green-600 font-medium">{stat.change}</span>
                        <span className="text-xs text-muted-foreground">vs semaine dernière</span>
                      </div>
                    </div>
                    {getIcon(stat.icon, stat.color)}
                   </div>
                   {/* Mini graphique de tendance */}
                   <div className="mt-4 h-8 flex items-end gap-1">
                     {stat.trend.map((value, i) => (
                       <div 
                         key={i}
                         className={`flex-1 rounded-sm opacity-60 group-hover:opacity-100 transition-opacity ${
                           stat.color === 'violet' ? 'bg-violet-500' :
                           stat.color === 'orange' ? 'bg-orange-500' :
                           stat.color === 'blue' ? 'bg-blue-500' :
                           'bg-emerald-500'
                         }`}
                         style={{ height: `${(value / Math.max(...stat.trend)) * 100}%` }}
                       />
                     ))}
                   </div>
                 </CardContent>
               </Card>
            ))}
          </div>
        </div>

        {/* Conflits critique alert */}
        {stats.conflictsCount > 0 && (
          <Card className="bg-red-50 border-red-200 rounded-2xl shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-red-100 rounded-xl">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-red-900">
                    {stats.conflictsCount} Conflit(s) Détecté(s)
                  </h3>
                  <p className="text-red-700">
                    Des conflits nécessitent une attention immédiate
                  </p>
                </div>
                <Button 
                  className="bg-red-600 hover:bg-red-700"
                  onClick={() => navigate('/exams/optimization')}
                >
                  Résoudre Maintenant
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* IA Optimisation */}
        <Card className="bg-white rounded-2xl shadow-sm border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-violet-500" />
              Optimisation IA en temps réel
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Utilisation salles</span>
                  <span className="text-sm text-muted-foreground">
                    {Math.round((stats.roomsUsed / Math.max(stats.totalRooms, 1)) * 100)}% / 95%
                  </span>
                </div>
                <Progress value={(stats.roomsUsed / Math.max(stats.totalRooms, 1)) * 100} className="h-2" />
                <div className="text-xs text-muted-foreground">
                  Performance: {Math.round((stats.roomsUsed / Math.max(stats.totalRooms, 1)) * 100)}% de l'objectif
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Réduction conflits</span>
                  <span className="text-sm text-muted-foreground">
                    {100 - (stats.conflictsCount * 10)}% / 95%
                  </span>
                </div>
                <Progress value={Math.max(0, 100 - (stats.conflictsCount * 10))} className="h-2" />
                <div className="text-xs text-muted-foreground">
                  Performance: {Math.max(0, 100 - (stats.conflictsCount * 10))}% de l'objectif
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Efficacité IA</span>
                  <span className="text-sm text-muted-foreground">
                    {stats.optimizationEfficiency}% / 95%
                  </span>
                </div>
                <Progress value={stats.optimizationEfficiency} className="h-2" />
                <div className="text-xs text-muted-foreground">
                  Performance: {stats.optimizationEfficiency}% de l'objectif
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonne principale */}
          <div className="lg:col-span-2 space-y-6">
            {/* Examens à venir */}
            <Card className="bg-white rounded-2xl shadow-sm border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-violet-500" />
                  Examens à venir ({upcomingExams.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {upcomingExams.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingExams.map((exam) => (
                      <div
                        key={exam.id}
                        className={`flex items-center justify-between p-4 rounded-xl border border-border/50 hover:bg-accent/50 transition-colors ${getPriorityColor(exam.priority)}`}
                      >
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-violet-100 rounded-lg">
                            <FileText className="w-4 h-4 text-violet-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-foreground">{exam.subject}</p>
                            <p className="text-sm text-muted-foreground">{exam.supervisor}</p>
                          </div>
                        </div>
                        <div className="text-right space-y-1">
                          <div className="flex items-center gap-2">
                            {getStatusBadge(exam.status)}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <MapPin className="w-3 h-3" />
                            <span>{exam.room}</span>
                            <span>•</span>
                            <span>{exam.students} étudiants</span>
                          </div>
                          <span className="text-xs text-muted-foreground block">
                            {exam.date} à {exam.time}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Aucun examen programmé</p>
                    <p className="text-sm">Utilisez la planification IA pour générer des créneaux</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Colonne latérale */}
          <div className="space-y-6">
            {/* Actions rapides */}
            <Card className="bg-white rounded-2xl shadow-sm border-0">
              <CardHeader>
                <CardTitle className="text-lg">Actions rapides</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <button 
                  className="w-full p-3 text-left rounded-xl border border-border/50 hover:bg-accent/50 transition-colors"
                  onClick={() => navigate('/exams/creation')}
                >
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-violet-500" />
                    <div>
                      <p className="font-medium">Créer un examen</p>
                      <p className="text-xs text-muted-foreground">Assistant intelligent</p>
                    </div>
                  </div>
                </button>
                
                <button 
                  className="w-full p-3 text-left rounded-xl border border-border/50 hover:bg-accent/50 transition-colors"
                  onClick={() => navigate('/exams/rooms')}
                >
                  <div className="flex items-center gap-3">
                    <Building className="w-5 h-5 text-violet-500" />
                    <div>
                      <p className="font-medium">Gérer les salles</p>
                      <p className="text-xs text-muted-foreground">Réservations</p>
                    </div>
                  </div>
                </button>

                <button 
                  className="w-full p-3 text-left rounded-xl border border-border/50 hover:bg-accent/50 transition-colors"
                  onClick={() => navigate('/exams/supervisors')}
                >
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-violet-500" />
                    <div>
                      <p className="font-medium">Surveillants</p>
                      <p className="text-xs text-muted-foreground">Attribution auto</p>
                    </div>
                  </div>
                </button>

                <button 
                  className="w-full p-3 text-left rounded-xl border border-border/50 hover:bg-accent/50 transition-colors"
                  onClick={() => navigate('/exams/optimization')}
                >
                  <div className="flex items-center gap-3">
                    <Target className="w-5 h-5 text-violet-500" />
                    <div>
                      <p className="font-medium">Optimisation IA</p>
                      <p className="text-xs text-muted-foreground">Algorithmes avancés</p>
                    </div>
                  </div>
                </button>
              </CardContent>
            </Card>

            {/* Surveillance temps réel */}
            <Card className="bg-white rounded-2xl shadow-sm border-0">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Monitor className="w-5 h-5 text-violet-500" />
                  Surveillance temps réel
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-green-50 rounded-xl border border-green-200">
                  <p className="text-sm font-medium text-green-700">{stats.scheduledExams} examens planifiés</p>
                  <p className="text-xs text-green-600">Système fonctionnel</p>
                </div>
                
                <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
                  <p className="text-sm font-medium text-blue-700">IA active</p>
                  <p className="text-xs text-blue-600">Optimisation continue à {stats.optimizationEfficiency}%</p>
                </div>

                {stats.conflictsCount === 0 ? (
                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                    <p className="text-sm font-medium text-emerald-700">Aucun conflit</p>
                    <p className="text-xs text-emerald-600">Planification optimale</p>
                  </div>
                ) : (
                  <div className="p-3 bg-red-50 rounded-xl border border-red-200">
                    <p className="text-sm font-medium text-red-700">{stats.conflictsCount} conflit(s)</p>
                    <p className="text-xs text-red-600">Résolution en cours</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ModuleLayout>
  );
}
