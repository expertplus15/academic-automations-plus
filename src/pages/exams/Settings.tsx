import { ExamsModuleLayout } from "@/components/layouts/ExamsModuleLayout";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Settings as SettingsIcon, 
  Bot, 
  Bell,
  Clock,
  Users,
  Building,
  Calendar,
  Shield,
  Database,
  Sliders
} from 'lucide-react';

export default function ExamsSettings() {
  const aiSettings = [
    {
      title: "Optimisation automatique",
      description: "Lancer l'optimisation IA automatiquement",
      enabled: true,
      category: "ai"
    },
    {
      title: "Détection de conflits temps réel",
      description: "Surveillance continue des conflits",
      enabled: true,
      category: "ai"
    },
    {
      title: "Attribution automatique des surveillants",
      description: "IA pour l'attribution des surveillants",
      enabled: false,
      category: "ai"
    },
    {
      title: "Prédiction de charge",
      description: "Prévision basée sur l'historique",
      enabled: true,
      category: "ai"
    }
  ];

  const notificationSettings = [
    {
      title: "Conflits détectés",
      description: "Notification immédiate des conflits",
      enabled: true,
      category: "notifications"
    },
    {
      title: "Optimisation terminée",
      description: "Confirmation de fin d'optimisation",
      enabled: true,
      category: "notifications"
    },
    {
      title: "Rappels d'examens",
      description: "24h avant chaque examen",
      enabled: false,
      category: "notifications"
    },
    {
      title: "Rapports hebdomadaires",
      description: "Envoi automatique des rapports",
      enabled: true,
      category: "notifications"
    }
  ];

  const generalSettings = [
    {
      title: "Vue par défaut",
      description: "Interface affichée au démarrage",
      value: "dashboard",
      type: "select",
      options: [
        { value: "dashboard", label: "Tableau de bord" },
        { value: "calendar", label: "Calendrier" },
        { value: "planning", label: "Planification" }
      ]
    },
    {
      title: "Durée par défaut des examens",
      description: "En minutes",
      value: "120",
      type: "input"
    },
    {
      title: "Délai minimum entre examens",
      description: "En minutes",
      value: "30",
      type: "input"
    },
    {
      title: "Nombre max d'étudiants par salle",
      description: "Limite de sécurité",
      value: "200",
      type: "input"
    }
  ];

  return (
    <ExamsModuleLayout 
      title="Configuration Examens"
      subtitle="Paramètres du système et préférences utilisateur"
    >
      <div className="p-8 space-y-8">
        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="general">Général</TabsTrigger>
            <TabsTrigger value="ai">IA & Optimisation</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="security">Sécurité</TabsTrigger>
            <TabsTrigger value="advanced">Avancé</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6">
            <Card className="bg-white rounded-2xl shadow-sm border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <SettingsIcon className="w-5 h-5 text-violet-500" />
                  Paramètres généraux
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {generalSettings.map((setting, index) => (
                  <div key={index} className="space-y-2">
                    <Label className="text-sm font-medium">{setting.title}</Label>
                    <p className="text-xs text-muted-foreground">{setting.description}</p>
                    {setting.type === 'select' ? (
                      <Select value={setting.value}>
                        <SelectTrigger className="w-64">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {setting.options?.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input 
                        type="number" 
                        value={setting.value} 
                        className="w-32"
                      />
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-white rounded-2xl shadow-sm border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-violet-500" />
                  Planification
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Horaires de travail</p>
                    <p className="text-sm text-muted-foreground">Créneaux disponibles pour les examens</p>
                  </div>
                  <div className="flex gap-2">
                    <Input type="time" value="08:00" className="w-32" />
                    <span className="self-center">à</span>
                    <Input type="time" value="18:00" className="w-32" />
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Jours de la semaine</p>
                    <p className="text-sm text-muted-foreground">Jours autorisés pour les examens</p>
                  </div>
                  <div className="flex gap-2">
                    {['L', 'M', 'M', 'J', 'V', 'S'].map((day, i) => (
                      <Button
                        key={i}
                        variant={i < 5 ? "default" : "outline"}
                        size="sm"
                        className="w-8 h-8 p-0"
                      >
                        {day}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ai" className="space-y-6">
            <Card className="bg-white rounded-2xl shadow-sm border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="w-5 h-5 text-violet-500" />
                  Intelligence Artificielle
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {aiSettings.map((setting, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-xl border border-border/50">
                    <div>
                      <p className="font-medium">{setting.title}</p>
                      <p className="text-sm text-muted-foreground">{setting.description}</p>
                    </div>
                    <Switch checked={setting.enabled} />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-white rounded-2xl shadow-sm border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-violet-500" />
                  Paramètres avancés IA
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Agressivité d'optimisation</Label>
                  <div className="flex items-center gap-4">
                    <span className="text-sm">Conservateur</span>
                    <div className="flex-1 h-2 bg-gray-200 rounded-full">
                      <div className="w-3/4 h-2 bg-violet-500 rounded-full"></div>
                    </div>
                    <span className="text-sm">Agressif</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Fréquence d'optimisation</Label>
                  <Select value="30">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">Toutes les 15 minutes</SelectItem>
                      <SelectItem value="30">Toutes les 30 minutes</SelectItem>
                      <SelectItem value="60">Toutes les heures</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card className="bg-white rounded-2xl shadow-sm border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-violet-500" />
                  Notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {notificationSettings.map((setting, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-xl border border-border/50">
                    <div>
                      <p className="font-medium">{setting.title}</p>
                      <p className="text-sm text-muted-foreground">{setting.description}</p>
                    </div>
                    <Switch checked={setting.enabled} />
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card className="bg-white rounded-2xl shadow-sm border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-violet-500" />
                  Sécurité et accès
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <Shield className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Paramètres de sécurité</p>
                    <p className="text-sm mt-1">Gestion des permissions et accès</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-6">
            <Card className="bg-white rounded-2xl shadow-sm border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5 text-violet-500" />
                  Configuration avancée
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <Database className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Paramètres techniques</p>
                    <p className="text-sm mt-1">Configuration base de données et API</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Actions de sauvegarde */}
        <div className="flex justify-end gap-3 pt-6 border-t">
          <Button variant="outline">
            Annuler
          </Button>
          <Button className="bg-violet-600 hover:bg-violet-700">
            Enregistrer les modifications
          </Button>
        </div>
      </div>
    </ExamsModuleLayout>
  );
}