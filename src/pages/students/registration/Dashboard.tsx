import { StudentsModuleLayout } from "@/components/layouts/StudentsModuleLayout";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  UserCheck, 
  Clock, 
  AlertTriangle,
  TrendingUp,
  FileText,
  CheckCircle,
  Calendar,
  Target,
  ArrowUpRight,
  Download,
  Filter,
  Search,
  Eye,
  Edit,
  MoreHorizontal,
  Bell,
  ChevronRight
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

export default function RegistrationDashboard() {
  const registrationStats = [
    {
      label: "Inscriptions en cours",
      value: "127",
      change: "+15",
      changeType: "positive" as const,
      icon: Clock,
      trend: [65, 78, 82, 94, 127],
      color: "blue"
    },
    {
      label: "Validations en attente",
      value: "43",
      change: "+8",
      changeType: "warning" as const,
      icon: AlertTriangle,
      trend: [32, 38, 35, 41, 43],
      color: "yellow"
    },
    {
      label: "Inscriptions validées",
      value: "284",
      change: "+67",
      changeType: "positive" as const,
      icon: UserCheck,
      trend: [180, 210, 235, 267, 284],
      color: "green"
    },
    {
      label: "Taux de conversion",
      value: "89%",
      change: "+5%",
      changeType: "positive" as const,
      icon: TrendingUp,
      trend: [82, 85, 87, 88, 89],
      color: "emerald"
    }
  ];

  const dailyTargets = [
    { label: "Objectif inscriptions", current: 127, target: 150, percentage: 85 },
    { label: "Objectif validations", current: 43, target: 50, percentage: 86 },
    { label: "Objectif conversion", current: 89, target: 92, percentage: 97 }
  ];

  const recentRegistrations = [
    {
      id: 1,
      student: "Marie Dubois",
      email: "marie.dubois@email.com",
      program: "Master Informatique",
      status: "validation",
      date: "2024-01-15",
      time: "14:32",
      priority: "high",
      progress: 75
    },
    {
      id: 2,
      student: "Jean Martin",
      email: "jean.martin@email.com", 
      program: "Licence Commerce",
      status: "documents",
      date: "2024-01-14",
      time: "11:20",
      priority: "medium",
      progress: 45
    },
    {
      id: 3,
      student: "Sophie Laurent",
      email: "sophie.laurent@email.com",
      program: "BTS Design Graphique",
      status: "completed",
      date: "2024-01-13",
      time: "16:45",
      priority: "low",
      progress: 100
    },
    {
      id: 4,
      student: "Pierre Moreau",
      email: "pierre.moreau@email.com",
      program: "Master Marketing",
      status: "interview",
      date: "2024-01-12",
      time: "09:15",
      priority: "high",
      progress: 60
    }
  ];

  const alerts = [
    {
      id: 1,
      type: "warning",
      message: "24 inscriptions nécessitent une validation urgente",
      action: "Traiter maintenant"
    },
    {
      id: 2, 
      type: "info",
      message: "Nouveau workflow d'approbation disponible",
      action: "Découvrir"
    },
    {
      id: 3,
      type: "success",
      message: "Objectif mensuel atteint à 94%",
      action: "Voir détails"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-700 border-green-200"><CheckCircle className="w-3 h-3 mr-1" />Complétée</Badge>;
      case 'validation':
        return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200"><Clock className="w-3 h-3 mr-1" />En validation</Badge>;
      case 'documents':
        return <Badge className="bg-blue-100 text-blue-700 border-blue-200"><FileText className="w-3 h-3 mr-1" />Documents</Badge>;
      case 'interview':
        return <Badge className="bg-purple-100 text-purple-700 border-purple-200"><Calendar className="w-3 h-3 mr-1" />Entretien</Badge>;
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
      blue: "text-blue-600 bg-blue-100",
      yellow: "text-yellow-600 bg-yellow-100", 
      green: "text-green-600 bg-green-100",
      emerald: "text-emerald-600 bg-emerald-100"
    };
    return (
      <div className={`p-3 rounded-xl ${colorClasses[color as keyof typeof colorClasses]}`}>
        <IconComponent className="w-6 h-6" />
      </div>
    );
  };

  return (
    <StudentsModuleLayout 
      title="Tableau de Bord - Inscriptions"
      subtitle="Vue d'ensemble des inscriptions et validations en temps réel"
    >
      <div className="p-8 space-y-8">
        {/* Actions rapides */}
        <div className="flex flex-wrap gap-4 justify-between items-center">
          <div className="flex gap-3">
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <Users className="w-4 h-4 mr-2" />
              Nouvelle inscription
            </Button>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Exporter
            </Button>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filtres
            </Button>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm">
              <Bell className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Search className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Alertes importantes */}
        <div className="grid gap-3">
          {alerts.map((alert) => (
            <Card key={alert.id} className={`border-l-4 ${
              alert.type === 'warning' ? 'border-l-yellow-500 bg-yellow-50' :
              alert.type === 'info' ? 'border-l-blue-500 bg-blue-50' :
              'border-l-green-500 bg-green-50'
            }`}>
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <AlertTriangle className={`w-5 h-5 ${
                    alert.type === 'warning' ? 'text-yellow-600' :
                    alert.type === 'info' ? 'text-blue-600' :
                    'text-green-600'
                  }`} />
                  <span className="font-medium">{alert.message}</span>
                </div>
                <Button variant="outline" size="sm">
                  {alert.action}
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats Cards avec tendances */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {registrationStats.map((stat, index) => (
            <Card key={index} className="bg-white rounded-2xl shadow-sm border-0 hover:shadow-lg transition-all duration-300 group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-green-600 font-medium">{stat.change}</span>
                      <span className="text-xs text-muted-foreground">vs hier</span>
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
                        stat.color === 'blue' ? 'bg-blue-500' :
                        stat.color === 'yellow' ? 'bg-yellow-500' :
                        stat.color === 'green' ? 'bg-green-500' :
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

        {/* Objectifs et Progress */}
        <Card className="bg-white rounded-2xl shadow-sm border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-emerald-500" />
              Objectifs quotidiens
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {dailyTargets.map((target, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{target.label}</span>
                  <span className="text-sm text-muted-foreground">
                    {target.current} / {target.target}
                  </span>
                </div>
                <Progress value={target.percentage} className="h-2" />
                <div className="text-xs text-muted-foreground">
                  {target.percentage}% de l'objectif atteint
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Inscriptions récentes avec plus de détails */}
        <Card className="bg-white rounded-2xl shadow-sm border-0">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-500" />
                Inscriptions récentes
              </CardTitle>
              <Button variant="outline" size="sm">
                Voir tout
                <ArrowUpRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentRegistrations.map((registration) => (
                <div
                  key={registration.id}
                  className={`flex items-center justify-between p-4 rounded-xl border-l-4 border border-border/50 hover:bg-accent/50 transition-colors ${getPriorityColor(registration.priority)}`}
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="p-2 bg-emerald-100 rounded-lg">
                      <Users className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-foreground">{registration.student}</p>
                        <Badge variant="outline" className="text-xs">
                          {registration.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{registration.program}</p>
                      <p className="text-xs text-muted-foreground">{registration.email}</p>
                      
                      {/* Barre de progression */}
                      <div className="mt-2 space-y-1">
                        <div className="flex justify-between text-xs">
                          <span>Progression</span>
                          <span>{registration.progress}%</span>
                        </div>
                        <Progress value={registration.progress} className="h-1" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="flex items-center gap-2 mb-1">
                        {getStatusBadge(registration.status)}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {registration.date} à {registration.time}
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
                          <FileText className="w-4 h-4 mr-2" />
                          Documents
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </StudentsModuleLayout>
  );
}