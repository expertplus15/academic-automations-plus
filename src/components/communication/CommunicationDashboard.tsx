import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  MessageSquare, 
  Bell, 
  Users, 
  Mail,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Plus,
  Globe,
  Settings,
  ArrowRight,
  Activity
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

export function CommunicationDashboard() {
  const { hasRole } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Navigation handlers
  const handleNavigateToMessages = () => navigate('/communication/messages');
  const handleNavigateToNotifications = () => navigate('/communication/notifications');
  const handleNavigateToAnnouncements = () => navigate('/communication/internal/announcements');
  const handleNavigateToCrm = () => navigate('/communication/external/crm');

  const mainFeatures = [
    {
      title: "Messagerie Instantanée",
      description: "Communication en temps réel avec les étudiants et le personnel",
      icon: MessageSquare,
      iconColor: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-950/20",
      stats: {
        primary: "342",
        primaryLabel: "Utilisateurs connectés",
        secondary: "1,567",
        secondaryLabel: "Messages aujourd'hui"
      },
      status: "active",
      alerts: 5,
      action: handleNavigateToMessages
    },
    {
      title: "Notifications & Alertes",
      description: "Centre de notification intelligent et personnalisé",
      icon: Bell,
      iconColor: "text-orange-600",
      bgColor: "bg-orange-50 dark:bg-orange-950/20",
      stats: {
        primary: "23",
        primaryLabel: "Alertes actives",
        secondary: "98%",
        secondaryLabel: "Taux de livraison"
      },
      status: "active",
      alerts: 3,
      action: handleNavigateToNotifications
    },
    {
      title: "Communication Interne",
      description: "Annonces, emails automatiques et diffusion d'informations",
      icon: Users,
      iconColor: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-950/20",
      stats: {
        primary: "12",
        primaryLabel: "Annonces actives",
        secondary: "890",
        secondaryLabel: "Emails envoyés"
      },
      status: "active",
      alerts: 0,
      action: handleNavigateToAnnouncements
    },
    {
      title: "Relations Externes",
      description: "Gestion des partenaires, stages et relations extérieures",
      icon: Globe,
      iconColor: "text-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-950/20",
      stats: {
        primary: "89",
        primaryLabel: "Partenaires actifs",
        secondary: "156",
        secondaryLabel: "Contacts CRM"
      },
      status: "active",
      alerts: 2,
      action: handleNavigateToCrm
    }
  ];

  const quickStats = [
    { label: "Messages non lus", value: "23", color: "text-blue-600", bgColor: "bg-blue-50 dark:bg-blue-950/20" },
    { label: "Notifications en attente", value: "8", color: "text-orange-600", bgColor: "bg-orange-50 dark:bg-orange-950/20" },
    { label: "Utilisateurs en ligne", value: "342", color: "text-green-600", bgColor: "bg-green-50 dark:bg-green-950/20" },
    { label: "Taux d'engagement", value: "94%", color: "text-purple-600", bgColor: "bg-purple-50 dark:bg-purple-950/20" }
  ];

  const recentActivities = [
    { 
      time: "15:30", 
      action: "Nouveau partenaire ajouté", 
      user: "Relations externes", 
      status: "success",
      icon: Plus
    },
    { 
      time: "15:15", 
      action: "Annonce diffusée", 
      user: "Direction", 
      status: "info",
      icon: Mail
    },
    { 
      time: "14:45", 
      action: "Email automatique envoyé", 
      user: "Système", 
      status: "success",
      icon: CheckCircle
    },
    { 
      time: "14:30", 
      action: "Alerte d'absentéisme", 
      user: "Vie scolaire", 
      status: "warning",
      icon: AlertCircle
    }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white rounded-2xl p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20">
              <MessageSquare className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Communication & Relations</h1>
              <p className="text-white/80 text-lg">Centre de communication unifiée</p>
            </div>
          </div>
          {hasRole(['admin', 'hr']) && (
            <Button 
              variant="secondary" 
              onClick={() => navigate('/communication/settings')}
              className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
            >
              <Settings className="w-4 h-4 mr-2" />
              Configuration
            </Button>
          )}
        </div>
        
        <div className="grid grid-cols-4 gap-6">
          {quickStats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl font-bold mb-1">{stat.value}</div>
              <div className="text-white/80 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Features Grid */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">Services Principaux</h2>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Activity className="w-4 h-4" />
              Tous les services sont opérationnels
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mainFeatures.map((feature, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-200 cursor-pointer border-0 bg-card/60 backdrop-blur-sm" onClick={feature.action}>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-xl ${feature.bgColor} transition-transform group-hover:scale-110`}>
                        <feature.icon className={`w-6 h-6 ${feature.iconColor}`} />
                      </div>
                      <div>
                        <h3 className="text-base font-semibold text-foreground">{feature.title}</h3>
                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {feature.alerts > 0 && (
                        <Badge variant="destructive" className="text-xs">
                          {feature.alerts}
                        </Badge>
                      )}
                      <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-foreground">{feature.stats.primary}</div>
                      <div className="text-xs text-muted-foreground">{feature.stats.primaryLabel}</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-foreground">{feature.stats.secondary}</div>
                      <div className="text-xs text-muted-foreground">{feature.stats.secondaryLabel}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-4">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-green-500 font-medium">Service actif</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Sidebar Content */}
        <div className="space-y-6">
          
          {/* Recent Activities */}
          <Card className="bg-card/60 backdrop-blur-sm border-0">
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Activités Récentes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start gap-3 group">
                  <div className="text-xs text-muted-foreground mt-1 w-12 font-mono">
                    {activity.time}
                  </div>
                  <div className={`p-2 rounded-lg mt-0.5 ${
                    activity.status === 'success' ? 'bg-green-50 dark:bg-green-950/20 text-green-600' :
                    activity.status === 'warning' ? 'bg-orange-50 dark:bg-orange-950/20 text-orange-600' :
                    'bg-blue-50 dark:bg-blue-950/20 text-blue-600'
                  }`}>
                    <activity.icon className="w-3 h-3" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                      {activity.action}
                    </p>
                    <p className="text-xs text-muted-foreground">{activity.user}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* System Status */}
          <Card className="bg-card/60 backdrop-blur-sm border-0">
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                État du Système
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Serveur de messages</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-sm font-medium text-green-600">Opérationnel</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Service de notifications</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-sm font-medium text-green-600">Opérationnel</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Base de données</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-sm font-medium text-green-600">Opérationnel</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Serveur email</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                  <span className="text-sm font-medium text-orange-600">Maintenance</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
        </div>
      </div>
    </div>
  );
}