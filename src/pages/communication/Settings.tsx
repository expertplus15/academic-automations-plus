import { CommunicationModuleLayout } from "@/components/layouts/CommunicationModuleLayout";
import { CommunicationPageHeader } from "@/components/CommunicationPageHeader";
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Settings,
  Mail,
  MessageSquare,
  Bell,
  Shield,
  Database,
  Palette,
  Globe,
  Key,
  Server,
  Smartphone,
  Wifi
} from "lucide-react";
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export default function CommunicationSettings() {
  const { hasRole } = useAuth();
  const { toast } = useToast();

  const canManageSettings = hasRole(['admin']);

  const handleSaveSettings = (section: string) => {
    if (canManageSettings) {
      toast({
        title: "Paramètres sauvegardés",
        description: `Les paramètres ${section} ont été mis à jour`,
      });
    } else {
      toast({
        title: "Accès refusé",
        description: "Vous n'avez pas les permissions pour modifier les paramètres",
        variant: "destructive"
      });
    }
  };

  const handleTestConnection = (service: string) => {
    toast({
      title: `Test ${service}`,
      description: `Test de connexion ${service} en cours...`,
    });
  };

  return (
    <ProtectedRoute allowedRoles={['admin', 'hr', 'teacher', 'student']}>
      <CommunicationModuleLayout>
        <CommunicationPageHeader 
          title="Paramètres Communication" 
          subtitle="Configuration des services de communication et notifications" 
        />
        <div className="p-6">
          <div className="max-w-7xl mx-auto">
            <Tabs defaultValue="general" className="space-y-6">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="general">Général</TabsTrigger>
                <TabsTrigger value="email">Email</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
                <TabsTrigger value="security">Sécurité</TabsTrigger>
                <TabsTrigger value="integrations">Intégrations</TabsTrigger>
                <TabsTrigger value="advanced">Avancé</TabsTrigger>
              </TabsList>

              {/* General Settings */}
              <TabsContent value="general">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Settings className="h-5 w-5" />
                        Paramètres Généraux
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label>Nom de l'organisation</Label>
                        <Input defaultValue="École Supérieure" />
                      </div>
                      <div className="space-y-2">
                        <Label>Email de contact principal</Label>
                        <Input defaultValue="contact@etablissement.edu" />
                      </div>
                      <div className="space-y-2">
                        <Label>Fuseau horaire</Label>
                        <Select defaultValue="europe/paris">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="europe/paris">Europe/Paris</SelectItem>
                            <SelectItem value="utc">UTC</SelectItem>
                            <SelectItem value="america/new_york">America/New_York</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Langue par défaut</Label>
                        <Select defaultValue="fr">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="fr">Français</SelectItem>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="es">Español</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button onClick={() => handleSaveSettings("généraux")} disabled={!canManageSettings}>
                        Sauvegarder
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Palette className="h-5 w-5" />
                        Apparence & Interface
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label>Mode sombre</Label>
                        <Switch />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>Animations</Label>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>Sons de notification</Label>
                        <Switch defaultChecked />
                      </div>
                      <div className="space-y-2">
                        <Label>Couleur principale</Label>
                        <div className="flex gap-2">
                          <div className="w-8 h-8 bg-blue-500 rounded cursor-pointer border-2 border-blue-700"></div>
                          <div className="w-8 h-8 bg-green-500 rounded cursor-pointer"></div>
                          <div className="w-8 h-8 bg-purple-500 rounded cursor-pointer"></div>
                          <div className="w-8 h-8 bg-orange-500 rounded cursor-pointer"></div>
                        </div>
                      </div>
                      <Button onClick={() => handleSaveSettings("d'apparence")} disabled={!canManageSettings}>
                        Sauvegarder
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Email Settings */}
              <TabsContent value="email">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Mail className="h-5 w-5" />
                        Configuration SMTP
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label>Serveur SMTP</Label>
                        <Input defaultValue="smtp.etablissement.edu" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Port</Label>
                          <Input defaultValue="587" />
                        </div>
                        <div className="space-y-2">
                          <Label>Sécurité</Label>
                          <Select defaultValue="tls">
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">Aucune</SelectItem>
                              <SelectItem value="tls">TLS</SelectItem>
                              <SelectItem value="ssl">SSL</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Nom d'utilisateur</Label>
                        <Input defaultValue="noreply@etablissement.edu" />
                      </div>
                      <div className="space-y-2">
                        <Label>Mot de passe</Label>
                        <Input type="password" placeholder="••••••••" />
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={() => handleTestConnection("SMTP")} variant="outline">
                          Tester
                        </Button>
                        <Button onClick={() => handleSaveSettings("SMTP")} disabled={!canManageSettings}>
                          Sauvegarder
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Templates Email</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label>Signature par défaut</Label>
                        <Textarea 
                          defaultValue="Cordialement,
L'équipe de l'École Supérieure
contact@etablissement.edu
+33 1 23 45 67 89"
                          rows={6}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>Inclure logo dans emails</Label>
                        <Switch defaultChecked />
                      </div>
                      <div className="space-y-2">
                        <Label>URL logo</Label>
                        <Input defaultValue="https://etablissement.edu/logo.png" />
                      </div>
                      <Button onClick={() => handleSaveSettings("de templates")} disabled={!canManageSettings}>
                        Sauvegarder
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Notifications Settings */}
              <TabsContent value="notifications">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Bell className="h-5 w-5" />
                        Notifications Push
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label>Notifications activées</Label>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>Messages instantanés</Label>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>Appels manqués</Label>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>Nouvelles annonces</Label>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>Événements programmés</Label>
                        <Switch />
                      </div>
                      <div className="space-y-2">
                        <Label>Heures de silence</Label>
                        <div className="grid grid-cols-2 gap-2">
                          <Input placeholder="22:00" />
                          <Input placeholder="08:00" />
                        </div>
                      </div>
                      <Button onClick={() => handleSaveSettings("de notifications")} disabled={!canManageSettings}>
                        Sauvegarder
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Smartphone className="h-5 w-5" />
                        Applications Mobiles
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label>Clé API Firebase</Label>
                        <Input placeholder="Clé API pour notifications push" />
                      </div>
                      <div className="space-y-2">
                        <Label>ID Projet Firebase</Label>
                        <Input placeholder="ID du projet Firebase" />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>Notifications iOS</Label>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>Notifications Android</Label>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={() => handleTestConnection("Firebase")} variant="outline">
                          Tester
                        </Button>
                        <Button onClick={() => handleSaveSettings("mobiles")} disabled={!canManageSettings}>
                          Sauvegarder
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Security Settings */}
              <TabsContent value="security">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5" />
                        Sécurité & Authentification
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label>Authentification à 2 facteurs obligatoire</Label>
                        <Switch />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>Chiffrement des messages</Label>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>Historique des connexions</Label>
                        <Switch defaultChecked />
                      </div>
                      <div className="space-y-2">
                        <Label>Durée de session (minutes)</Label>
                        <Input defaultValue="480" type="number" />
                      </div>
                      <div className="space-y-2">
                        <Label>Tentatives de connexion max</Label>
                        <Input defaultValue="5" type="number" />
                      </div>
                      <Button onClick={() => handleSaveSettings("de sécurité")} disabled={!canManageSettings}>
                        Sauvegarder
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Key className="h-5 w-5" />
                        Clés & Certificats
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label>Certificat SSL</Label>
                        <div className="flex gap-2">
                          <Input placeholder="Chemin vers le certificat" />
                          <Button variant="outline">Parcourir</Button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Clé privée SSL</Label>
                        <div className="flex gap-2">
                          <Input placeholder="Chemin vers la clé privée" />
                          <Button variant="outline">Parcourir</Button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Clé de chiffrement</Label>
                        <div className="flex gap-2">
                          <Input placeholder="Clé de chiffrement des données" type="password" />
                          <Button variant="outline">Générer</Button>
                        </div>
                      </div>
                      <div className="p-3 bg-muted rounded">
                        <p className="text-sm text-muted-foreground">
                          ⚠️ Les modifications de sécurité nécessitent un redémarrage du service
                        </p>
                      </div>
                      <Button onClick={() => handleSaveSettings("de sécurité")} disabled={!canManageSettings}>
                        Sauvegarder
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Integrations Settings */}
              <TabsContent value="integrations">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Globe className="h-5 w-5" />
                        Services Externes
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label>API Microsoft Teams</Label>
                        <Input placeholder="Clé API Microsoft Teams" />
                        <div className="flex gap-2">
                          <Button onClick={() => handleTestConnection("Teams")} variant="outline" size="sm">
                            Tester
                          </Button>
                          <Switch />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>API Google Workspace</Label>
                        <Input placeholder="Clé API Google Workspace" />
                        <div className="flex gap-2">
                          <Button onClick={() => handleTestConnection("Google")} variant="outline" size="sm">
                            Tester
                          </Button>
                          <Switch />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Webhook Slack</Label>
                        <Input placeholder="URL webhook Slack" />
                        <div className="flex gap-2">
                          <Button onClick={() => handleTestConnection("Slack")} variant="outline" size="sm">
                            Tester
                          </Button>
                          <Switch />
                        </div>
                      </div>
                      <Button onClick={() => handleSaveSettings("d'intégrations")} disabled={!canManageSettings}>
                        Sauvegarder
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Database className="h-5 w-5" />
                        Synchronisation
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label>Synchronisation annuaire LDAP</Label>
                        <Switch />
                      </div>
                      <div className="space-y-2">
                        <Label>Serveur LDAP</Label>
                        <Input placeholder="ldap://ldap.etablissement.edu" />
                      </div>
                      <div className="space-y-2">
                        <Label>Base DN</Label>
                        <Input placeholder="dc=etablissement,dc=edu" />
                      </div>
                      <div className="space-y-2">
                        <Label>Fréquence de synchronisation</Label>
                        <Select defaultValue="daily">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="hourly">Chaque heure</SelectItem>
                            <SelectItem value="daily">Quotidienne</SelectItem>
                            <SelectItem value="weekly">Hebdomadaire</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button onClick={() => handleSaveSettings("de synchronisation")} disabled={!canManageSettings}>
                        Sauvegarder
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Advanced Settings */}
              <TabsContent value="advanced">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Server className="h-5 w-5" />
                        Configuration Serveur
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label>Port serveur WebSocket</Label>
                        <Input defaultValue="8080" />
                      </div>
                      <div className="space-y-2">
                        <Label>Limite connexions simultanées</Label>
                        <Input defaultValue="1000" type="number" />
                      </div>
                      <div className="space-y-2">
                        <Label>Timeout connexion (secondes)</Label>
                        <Input defaultValue="30" type="number" />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>Mode debug</Label>
                        <Switch />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>Logs détaillés</Label>
                        <Switch />
                      </div>
                      <Button onClick={() => handleSaveSettings("serveur")} disabled={!canManageSettings}>
                        Sauvegarder
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Wifi className="h-5 w-5" />
                        Performance & Cache
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label>Durée cache (minutes)</Label>
                        <Input defaultValue="60" type="number" />
                      </div>
                      <div className="space-y-2">
                        <Label>Taille max fichier upload (MB)</Label>
                        <Input defaultValue="10" type="number" />
                      </div>
                      <div className="space-y-2">
                        <Label>Compression messages</Label>
                        <Select defaultValue="gzip">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">Aucune</SelectItem>
                            <SelectItem value="gzip">GZIP</SelectItem>
                            <SelectItem value="deflate">Deflate</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>Optimisation images</Label>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline">Vider le cache</Button>
                        <Button onClick={() => handleSaveSettings("de performance")} disabled={!canManageSettings}>
                          Sauvegarder
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </CommunicationModuleLayout>
    </ProtectedRoute>
  );
}