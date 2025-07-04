import { SettingsModuleLayout } from "@/components/layouts/SettingsModuleLayout";
import { SettingsPageHeader } from "@/components/SettingsPageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  Plug,
  Plus,
  Settings,
  Zap,
  Globe,
  Key,
  Code,
  Activity,
  AlertCircle,
  CheckCircle,
  Eye,
  Edit,
  Trash2,
  Copy,
  RefreshCw
} from "lucide-react";

export default function Integrations() {
  const integrations = [
    {
      id: 1,
      name: "Google Workspace",
      type: "SSO",
      status: "active",
      description: "Authentification unique avec Google",
      lastSync: "Il y a 2h",
      icon: "🔐"
    },
    {
      id: 2,
      name: "Stripe",
      type: "Payment",
      status: "active",
      description: "Traitement des paiements",
      lastSync: "Il y a 30min",
      icon: "💳"
    },
    {
      id: 3,
      name: "Moodle",
      type: "LMS",
      status: "pending",
      description: "Système de gestion d'apprentissage",
      lastSync: "Non configuré",
      icon: "📚"
    },
    {
      id: 4,
      name: "Zoom",
      type: "Video",
      status: "error",
      description: "Vidéoconférence",
      lastSync: "Erreur",
      icon: "📹"
    }
  ];

  const webhooks = [
    {
      id: 1,
      name: "Notification Slack",
      url: "https://hooks.slack.com/services/...",
      events: ["student.enrolled", "payment.completed"],
      status: "active",
      lastTriggered: "Il y a 1h"
    },
    {
      id: 2,
      name: "CRM Update",
      url: "https://api.salesforce.com/webhook",
      events: ["student.graduated", "course.completed"],
      status: "active",
      lastTriggered: "Il y a 3h"
    }
  ];

  return (
    <SettingsModuleLayout>
      <SettingsPageHeader 
        title="Intégrations tierces" 
        subtitle="API, webhooks et services externes" 
      />
      <div className="p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <Tabs defaultValue="integrations" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="integrations">Intégrations</TabsTrigger>
              <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
              <TabsTrigger value="api">API</TabsTrigger>
              <TabsTrigger value="logs">Logs</TabsTrigger>
            </TabsList>

            <TabsContent value="integrations" className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">Services connectés</h3>
                  <p className="text-muted-foreground">Gérez vos intégrations avec les services tiers</p>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter une intégration
                </Button>
              </div>

              <div className="grid gap-4">
                {integrations.map((integration) => (
                  <Card key={integration.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center text-2xl">
                            {integration.icon}
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold">{integration.name}</h4>
                              <Badge variant="outline">{integration.type}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{integration.description}</p>
                            <p className="text-xs text-muted-foreground">Dernière sync: {integration.lastSync}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={
                            integration.status === 'active' ? 'default' : 
                            integration.status === 'pending' ? 'secondary' : 'destructive'
                          }>
                            {integration.status === 'active' ? (
                              <>
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Actif
                              </>
                            ) : integration.status === 'pending' ? (
                              <>
                                <AlertCircle className="h-3 w-3 mr-1" />
                                En attente
                              </>
                            ) : (
                              <>
                                <AlertCircle className="h-3 w-3 mr-1" />
                                Erreur
                              </>
                            )}
                          </Badge>
                          <Button variant="ghost" size="sm">
                            <Settings className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <RefreshCw className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Configuration rapide */}
              <Card>
                <CardHeader>
                  <CardTitle>Ajouter une nouvelle intégration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Service</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un service" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="google">Google Workspace</SelectItem>
                          <SelectItem value="microsoft">Microsoft 365</SelectItem>
                          <SelectItem value="stripe">Stripe</SelectItem>
                          <SelectItem value="paypal">PayPal</SelectItem>
                          <SelectItem value="zoom">Zoom</SelectItem>
                          <SelectItem value="teams">Microsoft Teams</SelectItem>
                          <SelectItem value="moodle">Moodle</SelectItem>
                          <SelectItem value="canvas">Canvas</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Type d'intégration</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sso">Authentification (SSO)</SelectItem>
                          <SelectItem value="payment">Paiement</SelectItem>
                          <SelectItem value="lms">Système d'apprentissage</SelectItem>
                          <SelectItem value="video">Vidéoconférence</SelectItem>
                          <SelectItem value="crm">CRM</SelectItem>
                          <SelectItem value="email">Email</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Clé API / Token</Label>
                    <Input type="password" placeholder="••••••••••••••••" />
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1">Tester la connexion</Button>
                    <Button className="flex-1">Configurer l'intégration</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="webhooks" className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">Webhooks configurés</h3>
                  <p className="text-muted-foreground">Notifications automatiques vers vos services</p>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Créer un webhook
                </Button>
              </div>

              <div className="grid gap-4">
                {webhooks.map((webhook) => (
                  <Card key={webhook.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold">{webhook.name}</h4>
                            <Badge variant={webhook.status === 'active' ? 'default' : 'secondary'}>
                              {webhook.status === 'active' ? 'Actif' : 'Inactif'}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground font-mono">{webhook.url}</p>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">Événements:</span>
                            {webhook.events.map((event, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {event}
                              </Badge>
                            ))}
                          </div>
                          <p className="text-xs text-muted-foreground">Dernier déclenchement: {webhook.lastTriggered}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Création de webhook */}
              <Card>
                <CardHeader>
                  <CardTitle>Créer un nouveau webhook</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Nom du webhook</Label>
                    <Input placeholder="Ex: Notification Slack" />
                  </div>
                  <div className="space-y-2">
                    <Label>URL de destination</Label>
                    <Input placeholder="https://hooks.slack.com/services/..." />
                  </div>
                  <div className="space-y-2">
                    <Label>Événements à écouter</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="student-enrolled" />
                        <label htmlFor="student-enrolled" className="text-sm">Inscription étudiant</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="payment-completed" />
                        <label htmlFor="payment-completed" className="text-sm">Paiement reçu</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="course-completed" />
                        <label htmlFor="course-completed" className="text-sm">Cours terminé</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="grade-published" />
                        <label htmlFor="grade-published" className="text-sm">Note publiée</label>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1">Tester le webhook</Button>
                    <Button className="flex-1">Créer le webhook</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="api" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Key className="h-5 w-5" />
                    Clés API
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">API Key Production</h4>
                        <p className="text-sm text-muted-foreground">Clé pour l'environnement de production</p>
                        <p className="text-sm font-mono text-muted-foreground">••••••••••••••••••••••••••••sk_live_1234</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">API Key Test</h4>
                        <p className="text-sm text-muted-foreground">Clé pour les tests et développement</p>
                        <p className="text-sm font-mono text-muted-foreground">••••••••••••••••••••••••••••sk_test_5678</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Générer une nouvelle clé
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="h-5 w-5" />
                    Documentation API
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Endpoints disponibles</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">GET</Badge>
                        <code>/api/v1/students</code>
                        <span className="text-muted-foreground">Liste des étudiants</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">POST</Badge>
                        <code>/api/v1/students</code>
                        <span className="text-muted-foreground">Créer un étudiant</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">GET</Badge>
                        <code>/api/v1/courses</code>
                        <span className="text-muted-foreground">Liste des cours</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">POST</Badge>
                        <code>/api/v1/payments</code>
                        <span className="text-muted-foreground">Enregistrer un paiement</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium">Limites de taux</h4>
                    <p className="text-sm text-muted-foreground">
                      1000 requêtes par heure par clé API
                    </p>
                  </div>
                  
                  <Button variant="outline">
                    <Globe className="h-4 w-4 mr-2" />
                    Voir la documentation complète
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="logs" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Logs d'intégration
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 border rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium">Webhook Slack déclenché</p>
                          <span className="text-xs text-muted-foreground">14:32</span>
                        </div>
                        <p className="text-sm text-muted-foreground">Notification envoyée pour inscription étudiant</p>
                        <code className="text-xs bg-muted px-2 py-1 rounded">200 OK</code>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 p-3 border rounded-lg">
                      <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium">Erreur API Zoom</p>
                          <span className="text-xs text-muted-foreground">14:15</span>
                        </div>
                        <p className="text-sm text-muted-foreground">Échec de création de la réunion</p>
                        <code className="text-xs bg-muted px-2 py-1 rounded">401 Unauthorized</code>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 p-3 border rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium">Synchronisation Google Workspace</p>
                          <span className="text-xs text-muted-foreground">14:00</span>
                        </div>
                        <p className="text-sm text-muted-foreground">125 utilisateurs synchronisés</p>
                        <code className="text-xs bg-muted px-2 py-1 rounded">200 OK</code>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-center mt-4">
                    <Button variant="outline">Voir tous les logs</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-3">
            <Button variant="outline">Exporter la configuration</Button>
            <Button>
              <Settings className="h-4 w-4 mr-2" />
              Enregistrer les modifications
            </Button>
          </div>
        </div>
      </div>
    </SettingsModuleLayout>
  );
}