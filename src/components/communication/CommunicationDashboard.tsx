import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  MessageSquare, 
  Handshake, 
  Users, 
  Mail,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Plus,
  Bell,
  Globe
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { RestrictedButton } from './RestrictedButton';
import { AsyncButton } from './AsyncButton';

export function CommunicationDashboard() {
  const { hasRole } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Check permissions for different actions
  const canManageServices = hasRole(['admin', 'hr']);
  const canSendMessages = hasRole(['admin', 'hr', 'teacher']);
  const canAccessReports = hasRole(['admin', 'hr']);

  // Navigation handlers for quick actions
  const handleNewMessage = async () => {
    navigate('/communication/internal/emails');
  };

  const handleViewStats = async () => {
    // Simulate async stats generation
    await new Promise(resolve => setTimeout(resolve, 1500));
    navigate('/communication/analytics');
  };

  const handleManageContacts = async () => {
    navigate('/communication/external/crm');
  };

  const communicationServices = [
    {
      title: "Messagerie Instantanée",
      description: "Chat en temps réel et notifications",
      icon: MessageSquare,
      color: "text-blue-500",
      bgColor: "bg-blue-500",
      stats: { active: "342 connectés", users: "1,567 messages/jour" },
      status: "active",
      alerts: 5
    },
    {
      title: "Relations Externes",
      description: "Gestion des partenaires et contacts",
      icon: Handshake,
      color: "text-purple-500",
      bgColor: "bg-purple-500",
      stats: { active: "89 partenaires", users: "156 contacts actifs" },
      status: "active",
      alerts: 2
    },
    {
      title: "Communication Interne",
      description: "Annonces, emails automatiques, répertoire",
      icon: Users,
      color: "text-green-500",
      bgColor: "bg-green-500",
      stats: { active: "23 annonces", users: "890 emails envoyés" },
      status: "active",
      alerts: 0
    },
    {
      title: "Notifications & Alertes",
      description: "Système centralisé de notifications",
      icon: Bell,
      color: "text-orange-500",
      bgColor: "bg-orange-500",
      stats: { active: "45 alertes", users: "98% délivrées" },
      status: "active",
      alerts: 1
    }
  ];

  const quickActions = [
    { 
      label: "Nouveau message", 
      icon: Plus, 
      action: handleNewMessage,
      allowedRoles: ['admin', 'hr', 'teacher'],
      restrictedMessage: "Vous devez être enseignant ou administrateur pour envoyer des messages"
    },
    { 
      label: "Voir statistiques", 
      icon: TrendingUp, 
      action: handleViewStats,
      allowedRoles: ['admin', 'hr'],
      restrictedMessage: "Seuls les administrateurs peuvent voir les statistiques"
    },
    { 
      label: "Gestion contacts", 
      icon: Users, 
      action: handleManageContacts,
      allowedRoles: ['admin', 'hr'],
      restrictedMessage: "Vous n'avez pas accès à la gestion des contacts"
    }
  ];

  const recentActivities = [
    { time: "15:30", action: "Nouveau partenaire ajouté", user: "Relations externes", status: "success" },
    { time: "15:15", action: "Annonce diffusée", user: "Direction", status: "info" },
    { time: "14:45", action: "Email automatique envoyé", user: "Système", status: "success" },
    { time: "14:30", action: "Nouvelle annonce publiée", user: "Communication", status: "warning" }
  ];

  return (
    <div className="flex-1 p-6 space-y-6">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-2xl p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
            <MessageSquare className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Communication & Relations</h1>
            <p className="text-white/80 text-lg">Messagerie, relations externes et communication interne</p>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold">342</div>
            <div className="text-white/80">Utilisateurs connectés</div>
          </div>
          <div>
            <div className="text-3xl font-bold">89</div>
            <div className="text-white/80">Partenaires actifs</div>
          </div>
          <div>
            <div className="text-3xl font-bold">1,567</div>
            <div className="text-white/80">Messages/jour</div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Services Grid - Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">Services de Communication</h2>
            <RestrictedButton
              allowedRoles={['admin']}
              action={() => toast({ title: "Configuration", description: "Module de configuration des services" })}
              restrictedMessage="Seuls les administrateurs peuvent configurer les services"
              icon={Plus}
            >
              Nouveau Service
            </RestrictedButton>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {communicationServices.map((service, index) => (
              <Card key={index} className="bg-card rounded-xl shadow-sm border-0 hover:shadow-lg transition-all duration-200">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${service.bgColor}`}>
                        <service.icon className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-base font-semibold text-foreground">{service.title}</h3>
                    </div>
                    {service.alerts > 0 && (
                      <Badge className="bg-red-500 text-white text-xs">
                        {service.alerts}
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm mb-4">{service.description}</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Statut:</span>
                      <span className="font-medium text-foreground">{service.stats.active}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Activité:</span>
                      <span className="font-medium text-foreground">{service.stats.users}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                      {service.status === 'active' && (
                        <>
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-sm text-green-500">Actif</span>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Sidebar Content */}
        <div className="space-y-6">
          
          {/* Quick Actions */}
          <Card className="bg-card">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Actions Rapides</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {quickActions.map((action, index) => (
                action.label === "Voir statistiques" ? (
                  <AsyncButton
                    key={index}
                    onAsyncClick={action.action}
                    successMessage="Statistiques générées avec succès"
                    variant="ghost"
                    className="w-full justify-start"
                    icon={action.icon}
                  >
                    {action.label}
                  </AsyncButton>
                ) : (
                  <RestrictedButton
                    key={index}
                    allowedRoles={action.allowedRoles}
                    action={action.action}
                    restrictedMessage={action.restrictedMessage}
                    variant="ghost"
                    className="w-full justify-start"
                    icon={action.icon}
                  >
                    {action.label}
                  </RestrictedButton>
                )
              ))}
            </CardContent>
          </Card>

          {/* Recent Activities */}
          <Card className="bg-card">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Activités Récentes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="text-xs text-muted-foreground mt-0.5 w-12">
                    {activity.time}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.user}</p>
                  </div>
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.status === 'success' ? 'bg-green-500' :
                    activity.status === 'warning' ? 'bg-orange-500' :
                    'bg-blue-500'
                  }`} />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Communication Overview */}
          <Card className="bg-card">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Vue d'ensemble</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Services actifs</span>
                <span className="font-medium">4/4</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Messages non lus</span>
                <span className="font-medium text-blue-500">23</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Annonces actives</span>
                <span className="font-medium text-green-500">12</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Notifications en attente</span>
                <span className="font-medium text-orange-500">8</span>
              </div>
            </CardContent>
          </Card>
          
        </div>
      </div>
    </div>
  );
}