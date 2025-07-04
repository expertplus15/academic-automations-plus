import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings, Save, RotateCcw, Bell, Shield, Database, Users, Clock } from 'lucide-react';

export function SettingsDashboard() {
  const [notifications, setNotifications] = useState({
    maintenance: true,
    inventory: false,
    bookings: true,
    alerts: true
  });

  const [preferences, setPreferences] = useState({
    language: 'fr',
    timezone: 'Europe/Paris',
    dateFormat: 'dd/MM/yyyy',
    currency: 'EUR'
  });

  const settingsCategories = [
    {
      title: "Notifications",
      icon: Bell,
      description: "Configuration des alertes et notifications",
      settings: [
        {
          id: 'maintenance',
          label: 'Alertes de maintenance',
          description: 'Notifications pour les maintenances dues',
          type: 'switch',
          value: notifications.maintenance
        },
        {
          id: 'inventory',
          label: 'Mouvements d\'inventaire',
          description: 'Alertes lors des ajouts/retraits d\'équipements',
          type: 'switch',
          value: notifications.inventory
        },
        {
          id: 'bookings',
          label: 'Réservations',
          description: 'Notifications de nouvelles réservations',
          type: 'switch',
          value: notifications.bookings
        },
        {
          id: 'alerts',
          label: 'Alertes système',
          description: 'Notifications d\'erreurs et conflits',
          type: 'switch',
          value: notifications.alerts
        }
      ]
    },
    {
      title: "Sécurité & Accès",
      icon: Shield,
      description: "Gestion des permissions et sécurité",
      settings: [
        {
          id: 'two_factor',
          label: 'Authentification à deux facteurs',
          description: 'Sécurité renforcée pour l\'accès au module',
          type: 'switch',
          value: false
        },
        {
          id: 'audit_logs',
          label: 'Logs d\'audit',
          description: 'Enregistrement de toutes les actions',
          type: 'switch',
          value: true
        },
        {
          id: 'backup_frequency',
          label: 'Fréquence des sauvegardes',
          description: 'Automatisation des sauvegardes',
          type: 'select',
          value: 'daily',
          options: [
            { value: 'hourly', label: 'Toutes les heures' },
            { value: 'daily', label: 'Quotidienne' },
            { value: 'weekly', label: 'Hebdomadaire' }
          ]
        }
      ]
    },
    {
      title: "Base de données",
      icon: Database,
      description: "Configuration de la base de données",
      settings: [
        {
          id: 'sync_interval',
          label: 'Intervalle de synchronisation',
          description: 'Fréquence de mise à jour des données',
          type: 'select',
          value: '5min',
          options: [
            { value: '1min', label: '1 minute' },
            { value: '5min', label: '5 minutes' },
            { value: '15min', label: '15 minutes' },
            { value: '30min', label: '30 minutes' }
          ]
        },
        {
          id: 'data_retention',
          label: 'Rétention des données',
          description: 'Durée de conservation des historiques',
          type: 'select',
          value: '2years',
          options: [
            { value: '1year', label: '1 an' },
            { value: '2years', label: '2 ans' },
            { value: '5years', label: '5 ans' },
            { value: 'unlimited', label: 'Illimitée' }
          ]
        }
      ]
    }
  ];

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveSettings = () => {
    // Logique de sauvegarde
    console.log('Settings saved:', { notifications, preferences });
  };

  const handleResetSettings = () => {
    // Logique de reset
    setNotifications({
      maintenance: true,
      inventory: false,
      bookings: true,
      alerts: true
    });
  };

  return (
    <div className="space-y-8">
      {/* Settings Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-white rounded-2xl shadow-sm border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Utilisateurs actifs</p>
                <p className="text-2xl font-bold text-foreground">24</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white rounded-2xl shadow-sm border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Dernière sauvegarde</p>
                <p className="text-2xl font-bold text-foreground">2h</p>
              </div>
              <div className="p-3 bg-green-100 rounded-xl">
                <Database className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white rounded-2xl shadow-sm border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Uptime système</p>
                <p className="text-2xl font-bold text-foreground">99.9%</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-xl">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white rounded-2xl shadow-sm border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Sécurité</p>
                <p className="text-2xl font-bold text-foreground">Élevée</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-xl">
                <Shield className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Settings Categories */}
      <div className="space-y-6">
        {settingsCategories.map((category, categoryIndex) => {
          const CategoryIcon = category.icon;
          return (
            <Card key={categoryIndex} className="bg-white rounded-2xl shadow-sm border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CategoryIcon className="w-5 h-5 text-primary" />
                  {category.title}
                </CardTitle>
                <p className="text-sm text-muted-foreground">{category.description}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {category.settings.map((setting, settingIndex) => (
                    <div key={settingIndex} className="flex items-center justify-between p-4 rounded-lg border border-border/50">
                      <div className="flex-1">
                        <h3 className="font-medium text-foreground">{setting.label}</h3>
                        <p className="text-sm text-muted-foreground">{setting.description}</p>
                      </div>
                      <div className="ml-4">
                        {setting.type === 'switch' && (
                          <Switch
                            checked={setting.value as boolean}
                            onCheckedChange={(value) => {
                              if (category.title === "Notifications") {
                                handleNotificationChange(setting.id, value);
                              }
                            }}
                          />
                        )}
                        {setting.type === 'select' && setting.options && (
                          <Select value={setting.value as string}>
                            <SelectTrigger className="w-48">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {setting.options.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Preferences */}
      <Card className="bg-white rounded-2xl shadow-sm border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-primary" />
            Préférences générales
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Langue</label>
              <Select value={preferences.language}>
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

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Fuseau horaire</label>
              <Select value={preferences.timezone}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Europe/Paris">Europe/Paris</SelectItem>
                  <SelectItem value="Europe/London">Europe/London</SelectItem>
                  <SelectItem value="America/New_York">America/New_York</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Format de date</label>
              <Select value={preferences.dateFormat}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dd/MM/yyyy">dd/MM/yyyy</SelectItem>
                  <SelectItem value="MM/dd/yyyy">MM/dd/yyyy</SelectItem>
                  <SelectItem value="yyyy-MM-dd">yyyy-MM-dd</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Devise</label>
              <Select value={preferences.currency}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EUR">EUR (€)</SelectItem>
                  <SelectItem value="USD">USD ($)</SelectItem>
                  <SelectItem value="GBP">GBP (£)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex items-center gap-4">
        <Button onClick={handleSaveSettings} className="bg-primary text-primary-foreground">
          <Save className="w-4 h-4 mr-2" />
          Sauvegarder
        </Button>
        <Button variant="outline" onClick={handleResetSettings}>
          <RotateCcw className="w-4 h-4 mr-2" />
          Réinitialiser
        </Button>
      </div>
    </div>
  );
}