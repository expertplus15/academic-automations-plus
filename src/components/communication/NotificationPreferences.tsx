import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Bell, 
  Mail, 
  Smartphone, 
  Monitor, 
  Volume,
  Settings,
  Clock,
  Shield,
  MessageSquare,
  Calendar,
  AlertTriangle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface NotificationPreference {
  id: string;
  category: string;
  description: string;
  icon: React.ComponentType<any>;
  settings: {
    email: boolean;
    push: boolean;
    desktop: boolean;
    sound: boolean;
  };
  priority: 'high' | 'medium' | 'low';
}

export function NotificationPreferences() {
  const { toast } = useToast();
  
  const [preferences, setPreferences] = useState<NotificationPreference[]>([
    {
      id: 'messages',
      category: 'Messages',
      description: 'Nouveaux messages et conversations',
      icon: MessageSquare,
      settings: { email: true, push: true, desktop: true, sound: true },
      priority: 'high'
    },
    {
      id: 'events',
      category: 'Événements',
      description: 'Rappels et événements du calendrier',
      icon: Calendar,
      settings: { email: true, push: false, desktop: true, sound: false },
      priority: 'medium'
    },
    {
      id: 'system',
      category: 'Système',
      description: 'Alertes système et maintenance',
      icon: AlertTriangle,
      settings: { email: false, push: true, desktop: true, sound: true },
      priority: 'high'
    },
    {
      id: 'reminders',
      category: 'Rappels',
      description: 'Rappels personnels et tâches',
      icon: Clock,
      settings: { email: true, push: true, desktop: false, sound: false },
      priority: 'medium'
    }
  ]);

  const [globalSettings, setGlobalSettings] = useState({
    doNotDisturb: false,
    quietHours: { enabled: false, start: '22:00', end: '08:00' },
    emailDigest: { enabled: true, frequency: 'daily' },
    soundEnabled: true,
    vibrationEnabled: true
  });

  const handlePreferenceChange = (
    prefId: string, 
    setting: keyof NotificationPreference['settings'], 
    value: boolean
  ) => {
    setPreferences(prev => prev.map(pref => 
      pref.id === prefId 
        ? { ...pref, settings: { ...pref.settings, [setting]: value } }
        : pref
    ));
  };

  const handleSavePreferences = () => {
    // Save preferences to backend
    toast({
      title: "Préférences sauvegardées",
      description: "Vos préférences de notifications ont été mises à jour",
    });
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive" className="text-xs">Élevée</Badge>;
      case 'medium':
        return <Badge variant="secondary" className="text-xs">Moyenne</Badge>;
      case 'low':
        return <Badge variant="outline" className="text-xs">Faible</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Préférences de Notifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="categories" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="categories">Catégories</TabsTrigger>
              <TabsTrigger value="global">Global</TabsTrigger>
              <TabsTrigger value="advanced">Avancé</TabsTrigger>
            </TabsList>
            
            {/* Categories Tab */}
            <TabsContent value="categories" className="space-y-4">
              {preferences.map((pref) => {
                const IconComponent = pref.icon;
                return (
                  <Card key={pref.id} className="border-l-4 border-l-primary">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-muted">
                            <IconComponent className="h-5 w-5" />
                          </div>
                          <div>
                            <h3 className="font-medium">{pref.category}</h3>
                            <p className="text-sm text-muted-foreground">{pref.description}</p>
                          </div>
                        </div>
                        {getPriorityBadge(pref.priority)}
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">Email</span>
                          </div>
                          <Switch 
                            checked={pref.settings.email}
                            onCheckedChange={(value) => handlePreferenceChange(pref.id, 'email', value)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Smartphone className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">Push</span>
                          </div>
                          <Switch 
                            checked={pref.settings.push}
                            onCheckedChange={(value) => handlePreferenceChange(pref.id, 'push', value)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Monitor className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">Bureau</span>
                          </div>
                          <Switch 
                            checked={pref.settings.desktop}
                            onCheckedChange={(value) => handlePreferenceChange(pref.id, 'desktop', value)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Volume className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">Son</span>
                          </div>
                          <Switch 
                            checked={pref.settings.sound}
                            onCheckedChange={(value) => handlePreferenceChange(pref.id, 'sound', value)}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </TabsContent>
            
            {/* Global Tab */}
            <TabsContent value="global" className="space-y-4">
              <Card>
                <CardContent className="p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Shield className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Mode Ne Pas Déranger</p>
                        <p className="text-sm text-muted-foreground">Désactiver toutes les notifications</p>
                      </div>
                    </div>
                    <Switch 
                      checked={globalSettings.doNotDisturb}
                      onCheckedChange={(value) => 
                        setGlobalSettings(prev => ({ ...prev, doNotDisturb: value }))
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Heures Silencieuses</p>
                        <p className="text-sm text-muted-foreground">22h00 - 08h00</p>
                      </div>
                    </div>
                    <Switch 
                      checked={globalSettings.quietHours.enabled}
                      onCheckedChange={(value) => 
                        setGlobalSettings(prev => ({ 
                          ...prev, 
                          quietHours: { ...prev.quietHours, enabled: value }
                        }))
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Résumé Email</p>
                        <p className="text-sm text-muted-foreground">Résumé quotidien par email</p>
                      </div>
                    </div>
                    <Switch 
                      checked={globalSettings.emailDigest.enabled}
                      onCheckedChange={(value) => 
                        setGlobalSettings(prev => ({ 
                          ...prev, 
                          emailDigest: { ...prev.emailDigest, enabled: value }
                        }))
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Volume className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Sons Activés</p>
                        <p className="text-sm text-muted-foreground">Sons pour toutes les notifications</p>
                      </div>
                    </div>
                    <Switch 
                      checked={globalSettings.soundEnabled}
                      onCheckedChange={(value) => 
                        setGlobalSettings(prev => ({ ...prev, soundEnabled: value }))
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Advanced Tab */}
            <TabsContent value="advanced" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Paramètres Avancés</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Fréquence des notifications</h4>
                    <div className="grid grid-cols-3 gap-2">
                      <Button variant="outline" size="sm">Immédiat</Button>
                      <Button variant="outline" size="sm">Groupées</Button>
                      <Button variant="outline" size="sm">Horaire</Button>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Filtres intelligents</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Filtrer les notifications en double</span>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Priorité automatique</span>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Groupement par expéditeur</span>
                        <Switch />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Intégrations</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Calendrier externe</span>
                        <Switch />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Applications tierces</span>
                        <Switch />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-end mt-6">
            <Button onClick={handleSavePreferences}>
              Sauvegarder les préférences
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}