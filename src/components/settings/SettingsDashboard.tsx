import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Settings, 
  Building, 
  Users, 
  Palette, 
  Plug, 
  Activity,
  Shield,
  Database,
  Server,
  AlertTriangle,
  CheckCircle,
  Plus,
  FileText
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const systemStats = [
  {
    title: "Utilisateurs Actifs",
    value: "1,247",
    change: "+15%",
    trend: "up",
    icon: Users,
    color: "text-blue-500"
  },
  {
    title: "Établissements",
    value: "3",
    change: "stable", 
    trend: "stable",
    icon: Building,
    color: "text-green-500"
  },
  {
    title: "Intégrations",
    value: "8",
    change: "+2",
    trend: "up", 
    icon: Plug,
    color: "text-purple-500"
  },
  {
    title: "Temps de Réponse",
    value: "124ms",
    change: "-12ms",
    trend: "up",
    icon: Activity,
    color: "text-orange-500"
  }
];

const systemHealth = [
  { component: "Base de données", status: "operational", uptime: "99.9%" },
  { component: "Services d'authentification", status: "operational", uptime: "99.8%" },
  { component: "API Gateway", status: "operational", uptime: "99.7%" },
  { component: "Système de fichiers", status: "warning", uptime: "98.2%" },
  { component: "Service de notifications", status: "operational", uptime: "99.5%" }
];

const quickActions = [
  { title: "Gérer Utilisateurs", description: "Ajouter/modifier des utilisateurs", icon: Users, link: "/settings/users", color: "bg-blue-500" },
  { title: "Configuration Système", description: "Paramètres généraux", icon: Settings, link: "/settings/customization", color: "bg-green-500" },
  { title: "Surveillance", description: "Logs et monitoring", icon: Activity, link: "/settings/monitoring", color: "bg-orange-500" },
  { title: "Intégrations", description: "API et webhooks", icon: Plug, link: "/settings/integrations", color: "bg-purple-500" }
];

const recentActivities = [
  { type: "Configuration", title: "Nouveau thème appliqué", time: "Il y a 2h", status: "success" },
  { type: "Utilisateur", title: "5 nouveaux utilisateurs créés", time: "Il y a 4h", status: "info" },
  { type: "Sécurité", title: "Mise à jour des politiques RLS", time: "Il y a 1j", status: "warning" },
  { type: "Système", title: "Sauvegarde automatique effectuée", time: "Il y a 2j", status: "success" }
];

export function SettingsDashboard() {
  const { hasRole } = useAuth();
  const { toast } = useToast();

  // Admin-only access already enforced at page level
  const canManageSystem = hasRole(['admin']);

  const handleRestrictedAction = (action: string) => {
    if (!canManageSystem) {
      toast({
        title: "Accès refusé",
        description: `Seuls les administrateurs peuvent ${action}`,
        variant: "destructive"
      });
      return;
    }
  };
  return (
    <div className="space-y-6">
      {/* System Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {systemStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                  {stat.trend === "up" ? (
                    <CheckCircle className="h-3 w-3 text-green-500" />
                  ) : (
                    <Database className="h-3 w-3 text-blue-500" />
                  )}
                  <span className={stat.trend === "up" ? "text-green-500" : "text-muted-foreground"}>
                    {stat.change}
                  </span>
                  <span>vs période précédente</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-gray-500" />
            Actions Rapides
          </CardTitle>
          <CardDescription>
            Accès direct aux configurations principales
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Link key={index} to={action.link}>
                  <div className="p-4 rounded-lg border hover:border-primary/50 transition-colors cursor-pointer group">
                    <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center mb-3 group-hover:scale-105 transition-transform`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="font-semibold text-sm mb-1">{action.title}</h3>
                    <p className="text-xs text-muted-foreground">{action.description}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Health */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-500" />
              État du Système
            </CardTitle>
            <CardDescription>
              Surveillance des composants critiques
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {systemHealth.map((component, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center space-x-3">
                    {component.status === 'operational' ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-orange-500" />
                    )}
                    <div>
                      <p className="text-sm font-medium">{component.component}</p>
                      <p className="text-xs text-muted-foreground">Disponibilité: {component.uptime}</p>
                    </div>
                  </div>
                  <Badge 
                    variant={component.status === 'operational' ? 'default' : 'secondary'}
                    className={component.status === 'operational' ? 'bg-green-500' : 'bg-orange-500'}
                  >
                    {component.status === 'operational' ? 'Opérationnel' : 'Attention'}
                  </Badge>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t">
              <Button variant="outline" size="sm" className="w-full">
                <Activity className="h-4 w-4 mr-2" />
                Voir les détails
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-500" />
              Activités Récentes
            </CardTitle>
            <CardDescription>
              Dernières modifications système
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <Badge 
                    variant={activity.status === 'success' ? 'default' : activity.status === 'warning' ? 'secondary' : 'outline'}
                    className="mt-1"
                  >
                    {activity.type}
                  </Badge>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">{activity.title}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t">
              <Button variant="outline" size="sm" className="w-full">
                Voir l'historique complet
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}