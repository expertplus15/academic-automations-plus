import { ExamsModuleLayout } from "@/components/layouts/ExamsModuleLayout";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Calendar, 
  Building, 
  Users, 
  Bot,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertTriangle,
  Zap,
  BarChart3,
  Activity,
  Target,
  Eye,
  Edit,
  MoreHorizontal,
  RefreshCw
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useExamsData } from '@/hooks/useExamsData';
import { useExamConflictDetection } from '@/hooks/useExamConflictDetection';
import { ConflictsList } from '@/components/exams/ConflictsList';
import { formatConflictMessage } from '@/utils/pluralization';
import { StatusBadge } from '@/components/ui/status-badge';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useEffect } from 'react';

export default function ExamsDashboard() {
  const { stats, loading, error, refreshStats } = useExamsData();
  const { conflicts, detectConflicts } = useExamConflictDetection();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Détecter les conflits au chargement
  useEffect(() => {
    detectConflicts("current");
  }, [detectConflicts]);

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
      label: formatConflictMessage(conflicts.length),
      value: conflicts.length.toString(),
      change: conflicts.length === 0 ? "Aucun" : "-85%",
      changeType: conflicts.length === 0 ? "positive" : "negative" as const,
      icon: AlertTriangle,
      trend: [20, 15, 8, 5, conflicts.length],
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
      value: "94%",
      change: "+8%",
      changeType: "positive" as const,
      icon: Bot,
      trend: [82, 85, 88, 91, 94],
      color: "emerald"
    }
  ];

  const upcomingExams = [
    {
      id: 1,
      subject: "Mathématiques Avancées",
      date: "2024-01-20",
      time: "09:00",
      room: "Amphi A",
      students: 120,
      status: "confirmed",
      supervisor: "Dr. Marie Dubois",
      priority: "high"
    },
    {
      id: 2,
      subject: "Informatique Théorique",
      date: "2024-01-22",
      time: "14:00",
      room: "Salle B102",
      students: 85,
      status: "scheduled",
      supervisor: "Prof. Jean Martin",
      priority: "medium"
    },
    {
      id: 3,
      subject: "Économie Générale",
      date: "2024-01-25",
      time: "10:30",
      room: "Amphi C",
      students: 150,
      status: "pending",
      supervisor: "Dr. Sophie Laurent",
      priority: "low"
    }
  ];

  const aiOptimization = [
    { metric: "Utilisation salles", current: 87, target: 95, percentage: 92 },
    { metric: "Réduction conflits", current: 94, target: 98, percentage: 96 },
    { metric: "Attribution surveillants", current: 89, target: 95, percentage: 94 }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <StatusBadge variant="success-outline" icon={<CheckCircle className="w-3 h-3" />}>Confirmé</StatusBadge>;
      case 'scheduled':
        return <StatusBadge variant="info-outline" icon={<Calendar className="w-3 h-3" />}>Planifié</StatusBadge>;
      case 'pending':
        return <StatusBadge variant="warning-outline" icon={<Clock className="w-3 h-3" />}>En attente</StatusBadge>;
      default:
        return <StatusBadge variant="default">{status}</StatusBadge>;
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

  return (
    <ExamsModuleLayout 
      title="Tableau de Bord - Examens IA"
      subtitle="Vue d'ensemble intelligente des examens et optimisations temps réel"
    >
      <div className="p-8 space-y-8">
        {/* Actions rapides */}
        <div className="flex flex-wrap gap-4 justify-between items-center">
          <div className="flex gap-3">
            <Button 
              className="bg-violet-600 hover:bg-violet-700"
              onClick={() => navigate('/exams/optimization')}
            >
              <Bot className="w-4 h-4 mr-2" />
              Planification IA
            </Button>
            <Button variant="outline" onClick={() => navigate('/exams/create')}>
              <Calendar className="w-4 h-4 mr-2" />
              Nouvel examen
            </Button>
            <Button variant="outline" onClick={() => navigate('/exams/analytics')}>
              <BarChart3 className="w-4 h-4 mr-2" />
              Analytics
            </Button>
            {conflicts.length > 0 && (
              <Button 
                variant="destructive" 
                onClick={() => navigate('/exams/optimization')}
                className="animate-pulse"
              >
                <AlertTriangle className="w-4 h-4 mr-2" />
                Résoudre {conflicts.length} conflit(s)
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={async () => {
                await refreshStats();
                await detectConflicts("current");
              }} 
              disabled={loading}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Actualisation...' : 'Actualiser'}
            </Button>
            <Button variant="ghost" size="sm">
              <Activity className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Eye className="w-4 h-4" />
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

        {/* Optimisation IA */}
        <Card className="bg-white rounded-2xl shadow-sm border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-violet-500" />
              Optimisation IA en temps réel
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {aiOptimization.map((metric, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{metric.metric}</span>
                  <span className="text-sm text-muted-foreground">
                    {metric.current}% / {metric.target}%
                  </span>
                </div>
                <Progress value={metric.percentage} className="h-2" />
                <div className="text-xs text-muted-foreground">
                  Performance: {metric.percentage}% de l'objectif
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Examens à venir avec détails */}
        <Card className="bg-white rounded-2xl shadow-sm border-0">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-violet-500" />
                Examens à venir (7 prochains jours)
              </CardTitle>
              <Button variant="outline" size="sm">
                Voir planning complet
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingExams.map((exam) => (
                <div
                  key={exam.id}
                  className={`flex items-center justify-between p-4 rounded-xl border-l-4 border border-border/50 hover:bg-accent/50 transition-colors ${getPriorityColor(exam.priority)}`}
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="p-2 bg-violet-100 rounded-lg">
                      <Calendar className="w-4 h-4 text-violet-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-foreground">{exam.subject}</p>
                        <Badge variant="outline" className="text-xs">
                          {exam.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{exam.supervisor}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                        <span>📍 {exam.room}</span>
                        <span>👥 {exam.students} étudiants</span>
                        <span>🕘 {exam.time}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="flex items-center gap-2 mb-1">
                        {getStatusBadge(exam.status)}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {exam.date}
                      </span>
                    </div>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="w-4 h-4 mr-2" />
                          Voir détails
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="w-4 h-4 mr-2" />
                          Modifier
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Users className="w-4 h-4 mr-2" />
                          Surveiller
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Conflits détectés */}
        <ConflictsList />
      </div>
    </ExamsModuleLayout>
  );
}