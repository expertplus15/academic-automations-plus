import { CommunicationModuleLayout } from "@/components/layouts/CommunicationModuleLayout";
import { CommunicationPageHeader } from "@/components/CommunicationPageHeader";
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
  Globe, 
  Settings,
  Check,
  X,
  ExternalLink,
  Key,
  Database,
  Webhook,
  Code,
  Shield,
  AlertTriangle,
  RefreshCw,
  Plus
} from "lucide-react";
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export default function CommunicationIntegrations() {
  const { hasRole } = useAuth();
  const { toast } = useToast();

  const canManageIntegrations = hasRole(['admin']);

  const integrations = [
    {
      id: "teams",
      name: "Microsoft Teams",
      description: "Intégration avec Microsoft Teams pour appels et réunions",
      status: "connected",
      category: "Video Conferencing",
      apiKey: "••••••••••••••••",
      lastSync: "Il y a 5 min",
      endpoint: "https://graph.microsoft.com/",
      features: ["Appels vidéo", "Réunions", "Chat", "Calendrier"],
      logo: "🔷"
    },
    {
      id: "google",
      name: "Google Workspace",
      description: "Synchronisation avec Google Workspace (Gmail, Calendar, Meet)",
      status: "connected",
      category: "Productivity",
      apiKey: "••••••••••••••••",
      lastSync: "Il y a 12 min",
      endpoint: "https://www.googleapis.com/",
      features: ["Gmail", "Google Meet", "Calendar", "Drive"],
      logo: "🔵"
    },
    {
      id: "slack",
      name: "Slack",
      description: "Notifications et intégration avec Slack",
      status: "error",
      category: "Messaging",
      apiKey: "••••••••••••••••",
      lastSync: "Erreur",
      endpoint: "https://slack.com/api/",
      features: ["Messages", "Notifications", "Webhooks"],
      logo: "🟣"
    },
    {
      id: "zoom",
      name: "Zoom",
      description: "Intégration avec Zoom pour visioconférences",
      status: "disconnected",
      category: "Video Conferencing",
      apiKey: "Non configuré",
      lastSync: "Jamais",
      endpoint: "https://api.zoom.us/",
      features: ["Réunions", "Webinaires", "Enregistrements"],
      logo: "🔵"
    },
    {
      id: "moodle",
      name: "Moodle LMS",
      description: "Synchronisation avec la plateforme Moodle",
      status: "connected",
      category: "LMS",
      apiKey: "••••••••••••••••",
      lastSync: "Il y a 1h",
      endpoint: "https://moodle.etablissement.edu/",
      features: ["Cours", "Notes", "Messages", "Forums"],
      logo: "🟠"
    },
    {
      id: "webhook",
      name: "Webhooks personnalisés",
      description: "Webhooks pour intégrations personnalisées",
      status: "connected",
      category: "Custom",
      apiKey: "3 webhooks actifs",
      lastSync: "Il y a 30 min",
      endpoint: "https://webhook.etablissement.edu/",
      features: ["HTTP POST", "JSON", "Authentification"],
      logo: "⚡"
    }
  ];

  const availableIntegrations = [
    { name: "Discord", description: "Communication pour communautés étudiantes", logo: "🟦" },
    { name: "WhatsApp Business", description: "Messages professionnels", logo: "🟢" },
    { name: "Telegram", description: "Messagerie instantanée", logo: "🔵" },
    { name: "Jitsi Meet", description: "Visioconférence open source", logo: "🟤" },
    { name: "BigBlueButton", description: "Solution de classe virtuelle", logo: "🔴" },
  ];

  const handleConnect = (integrationId: string) => {
    if (canManageIntegrations) {
      toast({
        title: "Connexion en cours",
        description: `Connexion à l'intégration ${integrationId}...`,
      });
    } else {
      toast({
        title: "Accès refusé",
        description: "Vous n'avez pas les permissions pour gérer les intégrations",
        variant: "destructive"
      });
    }
  };

  const handleDisconnect = (integrationId: string) => {
    if (canManageIntegrations) {
      toast({
        title: "Déconnexion",
        description: `Intégration ${integrationId} déconnectée`,
      });
    } else {
      toast({
        title: "Accès refusé",
        description: "Vous n'avez pas les permissions pour gérer les intégrations",
        variant: "destructive"
      });
    }
  };

  const handleTestConnection = (integrationId: string) => {
    toast({
      title: "Test de connexion",
      description: `Test de connexion pour ${integrationId} en cours...`,
    });
  };

  const handleSync = (integrationId: string) => {
    toast({
      title: "Synchronisation",
      description: `Synchronisation manuelle lancée pour ${integrationId}`,
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'connected':
        return <Badge className="bg-green-100 text-green-700 border-green-200">
          <Check className="w-3 h-3 mr-1" />
          Connecté
        </Badge>;
      case 'error':
        return <Badge className="bg-red-100 text-red-700 border-red-200">
          <X className="w-3 h-3 mr-1" />
          Erreur
        </Badge>;
      case 'disconnected':
        return <Badge variant="outline">
          <X className="w-3 h-3 mr-1" />
          Déconnecté
        </Badge>;
      default:
        return null;
    }
  };

  return (
    <ProtectedRoute allowedRoles={['admin', 'hr', 'teacher', 'student']}>
      <CommunicationModuleLayout>
        <CommunicationPageHeader 
          title="Intégrations & APIs" 
          subtitle="Connexions avec services externes et APIs tierces" 
        />
        <div className="p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            
            {/* Header */}
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">Intégrations Externes</h2>
                <p className="text-muted-foreground">Gestion des connexions avec les services tiers</p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline">
                  <Settings className="w-4 h-4 mr-2" />
                  Configuration API
                </Button>
                {canManageIntegrations && (
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Nouvelle Intégration
                  </Button>
                )}
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Intégrations actives</p>
                      <p className="text-2xl font-bold">4</p>
                    </div>
                    <Globe className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Appels API/jour</p>
                      <p className="text-2xl font-bold">1,247</p>
                    </div>
                    <Code className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Webhooks actifs</p>
                      <p className="text-2xl font-bold">3</p>
                    </div>
                    <Webhook className="h-8 w-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Taux de succès</p>
                      <p className="text-2xl font-bold">99.8%</p>
                    </div>
                    <Check className="h-8 w-8 text-orange-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Integrations List */}
              <div className="lg:col-span-2 space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Intégrations Configurées</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {integrations.map((integration) => (
                        <div key={integration.id} className="p-4 border rounded-lg">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="text-2xl">{integration.logo}</div>
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="font-semibold">{integration.name}</h3>
                                  {getStatusBadge(integration.status)}
                                </div>
                                <p className="text-sm text-muted-foreground mb-2">
                                  {integration.description}
                                </p>
                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                  <span className="flex items-center gap-1">
                                    <Database className="h-3 w-3" />
                                    {integration.category}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <RefreshCw className="h-3 w-3" />
                                    {integration.lastSync}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Key className="h-3 w-3" />
                                    {integration.apiKey}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleTestConnection(integration.id)}
                              >
                                Test
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleSync(integration.id)}
                              >
                                <RefreshCw className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => {/* Open settings */}}
                              >
                                <Settings className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex flex-wrap gap-1">
                              {integration.features.slice(0, 3).map((feature, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {feature}
                                </Badge>
                              ))}
                              {integration.features.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{integration.features.length - 3}
                                </Badge>
                              )}
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <Switch 
                                checked={integration.status === 'connected'} 
                                disabled={!canManageIntegrations}
                              />
                              {integration.status === 'connected' ? (
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleDisconnect(integration.id)}
                                  disabled={!canManageIntegrations}
                                >
                                  Déconnecter
                                </Button>
                              ) : (
                                <Button 
                                  size="sm"
                                  onClick={() => handleConnect(integration.id)}
                                  disabled={!canManageIntegrations}
                                >
                                  Connecter
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Intégrations Disponibles</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {availableIntegrations.map((integration, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="text-xl">{integration.logo}</div>
                            <div>
                              <h4 className="font-medium text-sm">{integration.name}</h4>
                              <p className="text-xs text-muted-foreground">{integration.description}</p>
                            </div>
                          </div>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleConnect(integration.name)}
                            disabled={!canManageIntegrations}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Sécurité API
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Authentification requise</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Limite de taux</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Logs détaillés</span>
                      <Switch />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Clé API principale</label>
                      <div className="flex gap-2">
                        <Input 
                          value="••••••••••••••••••••••••••••••••" 
                          readOnly 
                          className="text-xs"
                        />
                        <Button variant="outline" size="sm">
                          <RefreshCw className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5" />
                      Alertes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="p-3 bg-yellow-50 border-yellow-200 border rounded-lg">
                        <p className="text-sm font-medium text-yellow-700">Slack: Erreur d'authentification</p>
                        <p className="text-xs text-yellow-600">Token expiré - Renouveler</p>
                      </div>
                      <div className="p-3 bg-green-50 border-green-200 border rounded-lg">
                        <p className="text-sm font-medium text-green-700">Toutes les autres intégrations OK</p>
                        <p className="text-xs text-green-600">Dernière vérification: Il y a 5 min</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </CommunicationModuleLayout>
    </ProtectedRoute>
  );
}