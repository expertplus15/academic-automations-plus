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
import { Progress } from "@/components/ui/progress";
import { 
  Activity,
  Server,
  Database,
  AlertTriangle,
  CheckCircle,
  Clock,
  HardDrive,
  Cpu,
  MemoryStick,
  Globe,
  Users,
  Download,
  RefreshCw,
  Bell,
  FileText,
  Eye
} from "lucide-react";

export default function Monitoring() {
  const systemMetrics = {
    cpu: 45,
    memory: 67,
    disk: 34,
    network: 23
  };

  const alerts = [
    {
      id: 1,
      level: "warning",
      title: "Utilisation mémoire élevée",
      description: "Serveur de base de données à 85% de mémoire",
      timestamp: "Il y a 5min",
      resolved: false
    },
    {
      id: 2,
      level: "info",
      title: "Sauvegarde terminée",
      description: "Sauvegarde quotidienne complétée avec succès",
      timestamp: "Il y a 2h",
      resolved: true
    },
    {
      id: 3,
      level: "error",
      title: "Connexion API échec",
      description: "Service de paiement temporairement indisponible",
      timestamp: "Il y a 30min",
      resolved: false
    }
  ];

  const logs = [
    {
      timestamp: "2024-01-15 14:32:15",
      level: "INFO",
      service: "Auth",
      message: "Utilisateur connecté: john.doe@example.com",
      ip: "192.168.1.100"
    },
    {
      timestamp: "2024-01-15 14:31:45",
      level: "ERROR",
      service: "Payment",
      message: "Échec de traitement du paiement #12345",
      ip: "10.0.0.50"
    },
    {
      timestamp: "2024-01-15 14:30:22",
      level: "WARN",
      service: "Database",
      message: "Requête lente détectée (>5s)",
      ip: "localhost"
    },
    {
      timestamp: "2024-01-15 14:29:10",
      level: "INFO",
      service: "API",
      message: "Nouvelle inscription étudiant",
      ip: "192.168.1.102"
    }
  ];

  const getLevelBadge = (level: string) => {
    switch (level) {
      case "error":
        return <Badge variant="destructive">Erreur</Badge>;
      case "warning":
        return <Badge variant="secondary">Avertissement</Badge>;
      case "info":
        return <Badge variant="default">Info</Badge>;
      default:
        return <Badge variant="outline">{level}</Badge>;
    }
  };

  const getLogLevelColor = (level: string) => {
    switch (level) {
      case "ERROR":
        return "text-red-600";
      case "WARN":
        return "text-yellow-600";
      case "INFO":
        return "text-blue-600";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <SettingsModuleLayout>
      <SettingsPageHeader 
        title="Monitoring & logs" 
        subtitle="Surveillance système et gestion des logs" 
      />
      <div className="p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <Tabs defaultValue="dashboard" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="dashboard">Tableau de bord</TabsTrigger>
              <TabsTrigger value="alerts">Alertes</TabsTrigger>
              <TabsTrigger value="logs">Logs</TabsTrigger>
              <TabsTrigger value="settings">Configuration</TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard" className="space-y-6">
              {/* Métriques système */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Cpu className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">CPU</p>
                        <p className="text-2xl font-bold">{systemMetrics.cpu}%</p>
                        <Progress value={systemMetrics.cpu} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <MemoryStick className="h-6 w-6 text-green-600" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Mémoire</p>
                        <p className="text-2xl font-bold">{systemMetrics.memory}%</p>
                        <Progress value={systemMetrics.memory} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                        <HardDrive className="h-6 w-6 text-purple-600" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Disque</p>
                        <p className="text-2xl font-bold">{systemMetrics.disk}%</p>
                        <Progress value={systemMetrics.disk} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                        <Globe className="h-6 w-6 text-orange-600" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Réseau</p>
                        <p className="text-2xl font-bold">{systemMetrics.network}%</p>
                        <Progress value={systemMetrics.network} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Status des services */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Server className="h-5 w-5" />
                      État des services
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span>Serveur Web</span>
                      </div>
                      <Badge variant="default">En ligne</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span>Base de données</span>
                      </div>
                      <Badge variant="default">En ligne</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <AlertTriangle className="h-5 w-5 text-yellow-500" />
                        <span>Service de paiement</span>
                      </div>
                      <Badge variant="secondary">Dégradé</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span>Service email</span>
                      </div>
                      <Badge variant="default">En ligne</Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Activité utilisateurs
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Utilisateurs connectés</span>
                      <span className="font-semibold">247</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Sessions actives</span>
                      <span className="font-semibold">189</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Connexions aujourd'hui</span>
                      <span className="font-semibold">1,234</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Temps de réponse moyen</span>
                      <span className="font-semibold">245ms</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Alertes récentes */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Alertes récentes</CardTitle>
                    <Button variant="outline" size="sm">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Actualiser
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {alerts.slice(0, 3).map((alert) => (
                      <div key={alert.id} className="flex items-start gap-3 p-3 border rounded-lg">
                        <div className="mt-1">
                          {alert.level === "error" && <AlertTriangle className="h-4 w-4 text-red-500" />}
                          {alert.level === "warning" && <AlertTriangle className="h-4 w-4 text-yellow-500" />}
                          {alert.level === "info" && <CheckCircle className="h-4 w-4 text-blue-500" />}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">{alert.title}</h4>
                            <span className="text-xs text-muted-foreground">{alert.timestamp}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">{alert.description}</p>
                        </div>
                        {getLevelBadge(alert.level)}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="alerts" className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">Gestion des alertes</h3>
                  <p className="text-muted-foreground">Configurez et surveillez les alertes système</p>
                </div>
                <Button>
                  <Bell className="h-4 w-4 mr-2" />
                  Nouvelle règle d'alerte
                </Button>
              </div>

              <div className="grid gap-4">
                {alerts.map((alert) => (
                  <Card key={alert.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className="mt-1">
                            {alert.level === "error" && <AlertTriangle className="h-5 w-5 text-red-500" />}
                            {alert.level === "warning" && <AlertTriangle className="h-5 w-5 text-yellow-500" />}
                            {alert.level === "info" && <CheckCircle className="h-5 w-5 text-blue-500" />}
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold">{alert.title}</h4>
                              {getLevelBadge(alert.level)}
                              {alert.resolved && <Badge variant="outline">Résolu</Badge>}
                            </div>
                            <p className="text-sm text-muted-foreground">{alert.description}</p>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              {alert.timestamp}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {!alert.resolved && (
                            <Button variant="outline" size="sm">
                              Marquer comme résolu
                            </Button>
                          )}
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Configuration des alertes */}
              <Card>
                <CardHeader>
                  <CardTitle>Règles d'alerte</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">CPU &gt; 80%</p>
                        <p className="text-sm text-muted-foreground">Alerte si l'utilisation CPU dépasse 80%</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Mémoire &gt; 90%</p>
                        <p className="text-sm text-muted-foreground">Alerte si l'utilisation mémoire dépasse 90%</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Temps de réponse &gt; 5s</p>
                        <p className="text-sm text-muted-foreground">Alerte si le temps de réponse dépasse 5 secondes</p>
                      </div>
                      <Switch />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="logs" className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">Logs système</h3>
                  <p className="text-muted-foreground">Consultez l'historique des événements</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Exporter
                  </Button>
                  <Button variant="outline" size="sm">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Actualiser
                  </Button>
                </div>
              </div>

              {/* Filtres */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <div className="space-y-2">
                      <Label>Niveau</Label>
                      <Select defaultValue="all">
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Tous</SelectItem>
                          <SelectItem value="error">Erreurs</SelectItem>
                          <SelectItem value="warn">Avertissements</SelectItem>
                          <SelectItem value="info">Infos</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Service</Label>
                      <Select defaultValue="all">
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Tous</SelectItem>
                          <SelectItem value="auth">Auth</SelectItem>
                          <SelectItem value="payment">Payment</SelectItem>
                          <SelectItem value="database">Database</SelectItem>
                          <SelectItem value="api">API</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Recherche</Label>
                      <Input placeholder="Rechercher dans les logs..." className="w-64" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Liste des logs */}
              <Card>
                <CardContent className="p-0">
                  <div className="divide-y">
                    {logs.map((log, index) => (
                      <div key={index} className="p-4 hover:bg-muted/50">
                        <div className="flex items-start gap-4">
                          <div className="text-xs text-muted-foreground font-mono">
                            {log.timestamp}
                          </div>
                          <div className={`text-xs font-medium px-2 py-1 rounded ${getLogLevelColor(log.level)}`}>
                            {log.level}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {log.service}
                          </div>
                          <div className="flex-1 text-sm">
                            {log.message}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {log.ip}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Configuration du monitoring</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Monitoring en temps réel</p>
                        <p className="text-sm text-muted-foreground">Surveillance continue des métriques système</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Intervalle de collecte</Label>
                      <Select defaultValue="30">
                        <SelectTrigger className="w-48">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="10">10 secondes</SelectItem>
                          <SelectItem value="30">30 secondes</SelectItem>
                          <SelectItem value="60">1 minute</SelectItem>
                          <SelectItem value="300">5 minutes</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Rétention des logs</Label>
                      <Select defaultValue="30">
                        <SelectTrigger className="w-48">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="7">7 jours</SelectItem>
                          <SelectItem value="30">30 jours</SelectItem>
                          <SelectItem value="90">90 jours</SelectItem>
                          <SelectItem value="365">1 an</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Notifications email</p>
                        <p className="text-sm text-muted-foreground">Recevoir les alertes par email</p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="space-y-2">
                      <Label>Email des alertes</Label>
                      <Input placeholder="admin@example.com" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Sauvegardes et archivage</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Sauvegarde automatique des logs</p>
                      <p className="text-sm text-muted-foreground">Archiver automatiquement les anciens logs</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Fréquence de sauvegarde</Label>
                    <Select defaultValue="daily">
                      <SelectTrigger className="w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Quotidienne</SelectItem>
                        <SelectItem value="weekly">Hebdomadaire</SelectItem>
                        <SelectItem value="monthly">Mensuelle</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Créer une sauvegarde maintenant
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-3">
            <Button variant="outline">Réinitialiser</Button>
            <Button>
              <Activity className="h-4 w-4 mr-2" />
              Enregistrer la configuration
            </Button>
          </div>
        </div>
      </div>
    </SettingsModuleLayout>
  );
}