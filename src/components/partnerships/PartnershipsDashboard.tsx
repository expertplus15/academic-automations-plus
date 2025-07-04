import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Handshake, 
  Users, 
  Briefcase, 
  GraduationCap, 
  Globe, 
  Calendar,
  TrendingUp,
  Plus,
  FileText,
  Activity
} from "lucide-react";
import { Link } from "react-router-dom";

const partnershipStats = [
  {
    title: "Partenaires Actifs",
    value: "34",
    change: "+12%",
    trend: "up",
    icon: Handshake,
    color: "text-pink-500"
  },
  {
    title: "Stages en Cours",
    value: "127",
    change: "+8%", 
    trend: "up",
    icon: Briefcase,
    color: "text-blue-500"
  },
  {
    title: "Alumni Actifs",
    value: "1,247",
    change: "+15%",
    trend: "up", 
    icon: GraduationCap,
    color: "text-purple-500"
  },
  {
    title: "Échanges Internationaux",
    value: "23",
    change: "+5%",
    trend: "up",
    icon: Globe,
    color: "text-green-500"
  }
];

const recentActivities = [
  { type: "Nouveau partenaire", title: "Convention signée avec TechCorp", time: "Il y a 2h", status: "success" },
  { type: "Stage validé", title: "Stage de Marie Dubois chez StartupX", time: "Il y a 4h", status: "info" },
  { type: "Event", title: "Forum emploi prévu le 15 mars", time: "Il y a 1j", status: "warning" },
  { type: "Alumni", title: "Nouveau membre réseau: Pierre Martin", time: "Il y a 2j", status: "success" }
];

const quickActions = [
  { title: "Nouveau Partenaire", description: "Ajouter un nouveau partenaire", icon: Plus, link: "/partnerships/crm", color: "bg-pink-500" },
  { title: "Gérer Stages", description: "Suivi des stages actifs", icon: Briefcase, link: "/partnerships/internships", color: "bg-blue-500" },
  { title: "Réseau Alumni", description: "Gérer le réseau d'anciens", icon: Users, link: "/partnerships/alumni", color: "bg-purple-500" },
  { title: "Événements", description: "Organiser un événement", icon: Calendar, link: "/partnerships/events", color: "bg-green-500" }
];

export function PartnershipsDashboard() {
  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {partnershipStats.map((stat, index) => {
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
                  <TrendingUp className="h-3 w-3 text-green-500" />
                  <span className="text-green-500">{stat.change}</span>
                  <span>vs mois dernier</span>
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
            <Activity className="h-5 w-5 text-pink-500" />
            Actions Rapides
          </CardTitle>
          <CardDescription>
            Accès direct aux fonctionnalités principales
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
        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-500" />
              Activités Récentes
            </CardTitle>
            <CardDescription>
              Dernières actions et événements
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
                Voir toutes les activités
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Partnership Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Handshake className="h-5 w-5 text-pink-500" />
              État des Partenariats
            </CardTitle>
            <CardDescription>
              Répartition par secteur d'activité
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { sector: "Technologie", count: 12, percentage: 35, color: "bg-blue-500" },
                { sector: "Finance", count: 8, percentage: 24, color: "bg-green-500" },
                { sector: "Industrie", count: 7, percentage: 21, color: "bg-orange-500" },
                { sector: "Services", count: 4, percentage: 12, color: "bg-purple-500" },
                { sector: "Autres", count: 3, percentage: 8, color: "bg-gray-500" }
              ].map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{item.sector}</span>
                    <span className="font-medium">{item.count} partenaires</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className={`${item.color} h-2 rounded-full transition-all duration-300`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t">
              <Button variant="outline" size="sm" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Nouveau partenaire
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}