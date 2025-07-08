import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Settings, Bell, Calendar, FileText, Lock, Database, Mail, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ResourceSettings {
  // Général
  auto_asset_numbering: boolean;
  asset_number_prefix: string;
  depreciation_method: 'linear' | 'declining' | 'units';
  default_depreciation_rate: number;
  
  // Notifications
  maintenance_alerts: boolean;
  expiry_alerts: boolean;
  low_stock_alerts: boolean;
  alert_advance_days: number;
  
  // Réservations
  booking_approval_required: boolean;
  max_booking_duration: number;
  advance_booking_limit: number;
  auto_cancel_unconfirmed: boolean;
  
  // Rapports
  auto_report_generation: boolean;
  report_schedule: 'daily' | 'weekly' | 'monthly';
  report_recipients: string[];
  
  // Workflow
  procurement_approval_limit: number;
  multi_level_approval: boolean;
  budget_integration: boolean;
  
  // Sécurité
  asset_location_tracking: boolean;
  qr_code_required: boolean;
  audit_trail_enabled: boolean;
}

const defaultSettings: ResourceSettings = {
  auto_asset_numbering: true,
  asset_number_prefix: 'AST',
  depreciation_method: 'linear',
  default_depreciation_rate: 10,
  
  maintenance_alerts: true,
  expiry_alerts: true,
  low_stock_alerts: true,
  alert_advance_days: 30,
  
  booking_approval_required: false,
  max_booking_duration: 8,
  advance_booking_limit: 90,
  auto_cancel_unconfirmed: true,
  
  auto_report_generation: false,
  report_schedule: 'monthly',
  report_recipients: [],
  
  procurement_approval_limit: 5000,
  multi_level_approval: true,
  budget_integration: false,
  
  asset_location_tracking: true,
  qr_code_required: false,
  audit_trail_enabled: true
};

export function SettingsDashboard() {
  const [settings, setSettings] = useState<ResourceSettings>(defaultSettings);
  const [emailInput, setEmailInput] = useState('');
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "Paramètres sauvegardés",
      description: "La configuration a été mise à jour avec succès",
    });
  };

  const addRecipient = () => {
    if (emailInput && !settings.report_recipients.includes(emailInput)) {
      setSettings(prev => ({
        ...prev,
        report_recipients: [...prev.report_recipients, emailInput]
      }));
      setEmailInput('');
    }
  };

  const removeRecipient = (email: string) => {
    setSettings(prev => ({
      ...prev,
      report_recipients: prev.report_recipients.filter(r => r !== email)
    }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Configuration du Module Ressources
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="general">Général</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="bookings">Réservations</TabsTrigger>
              <TabsTrigger value="reports">Rapports</TabsTrigger>
              <TabsTrigger value="security">Sécurité</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Paramètres Généraux</h3>
                
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Numérotation automatique des actifs</Label>
                        <p className="text-sm text-muted-foreground">
                          Génère automatiquement les numéros d'actifs
                        </p>
                      </div>
                      <Switch
                        checked={settings.auto_asset_numbering}
                        onCheckedChange={(checked) =>
                          setSettings(prev => ({ ...prev, auto_asset_numbering: checked }))
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Préfixe des numéros d'actifs</Label>
                      <Input
                        value={settings.asset_number_prefix}
                        onChange={(e) =>
                          setSettings(prev => ({ ...prev, asset_number_prefix: e.target.value }))
                        }
                        placeholder="AST"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Méthode de dépréciation par défaut</Label>
                      <Select
                        value={settings.depreciation_method}
                        onValueChange={(value: any) =>
                          setSettings(prev => ({ ...prev, depreciation_method: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="linear">Linéaire</SelectItem>
                          <SelectItem value="declining">Dégressive</SelectItem>
                          <SelectItem value="units">Unités de production</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Taux de dépréciation par défaut (%)</Label>
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        value={settings.default_depreciation_rate}
                        onChange={(e) =>
                          setSettings(prev => ({ 
                            ...prev, 
                            default_depreciation_rate: parseFloat(e.target.value) || 0 
                          }))
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Limite d'approbation pour achats (€)</Label>
                      <Input
                        type="number"
                        min="0"
                        value={settings.procurement_approval_limit}
                        onChange={(e) =>
                          setSettings(prev => ({ 
                            ...prev, 
                            procurement_approval_limit: parseFloat(e.target.value) || 0 
                          }))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Approbation multi-niveaux</Label>
                        <p className="text-sm text-muted-foreground">
                          Workflow d'approbation en cascade
                        </p>
                      </div>
                      <Switch
                        checked={settings.multi_level_approval}
                        onCheckedChange={(checked) =>
                          setSettings(prev => ({ ...prev, multi_level_approval: checked }))
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Notifications et Alertes
                </h3>
                
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Alertes de maintenance</Label>
                        <p className="text-sm text-muted-foreground">
                          Notifications pour la maintenance préventive
                        </p>
                      </div>
                      <Switch
                        checked={settings.maintenance_alerts}
                        onCheckedChange={(checked) =>
                          setSettings(prev => ({ ...prev, maintenance_alerts: checked }))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Alertes d'expiration</Label>
                        <p className="text-sm text-muted-foreground">
                          Notifications pour garanties et assurances
                        </p>
                      </div>
                      <Switch
                        checked={settings.expiry_alerts}
                        onCheckedChange={(checked) =>
                          setSettings(prev => ({ ...prev, expiry_alerts: checked }))
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Anticipation des alertes (jours)</Label>
                      <Input
                        type="number"
                        min="1"
                        max="365"
                        value={settings.alert_advance_days}
                        onChange={(e) =>
                          setSettings(prev => ({ 
                            ...prev, 
                            alert_advance_days: parseInt(e.target.value) || 30 
                          }))
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="bookings" className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Gestion des Réservations
                </h3>
                
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Approbation requise</Label>
                        <p className="text-sm text-muted-foreground">
                          Les réservations nécessitent une validation
                        </p>
                      </div>
                      <Switch
                        checked={settings.booking_approval_required}
                        onCheckedChange={(checked) =>
                          setSettings(prev => ({ ...prev, booking_approval_required: checked }))
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Durée maximale de réservation (heures)</Label>
                      <Input
                        type="number"
                        min="1"
                        max="24"
                        value={settings.max_booking_duration}
                        onChange={(e) =>
                          setSettings(prev => ({ 
                            ...prev, 
                            max_booking_duration: parseInt(e.target.value) || 8 
                          }))
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Limite de réservation anticipée (jours)</Label>
                      <Input
                        type="number"
                        min="1"
                        max="365"
                        value={settings.advance_booking_limit}
                        onChange={(e) =>
                          setSettings(prev => ({ 
                            ...prev, 
                            advance_booking_limit: parseInt(e.target.value) || 90 
                          }))
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="reports" className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Rapports Automatiques
                </h3>
                
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Génération automatique</Label>
                        <p className="text-sm text-muted-foreground">
                          Génère automatiquement les rapports
                        </p>
                      </div>
                      <Switch
                        checked={settings.auto_report_generation}
                        onCheckedChange={(checked) =>
                          setSettings(prev => ({ ...prev, auto_report_generation: checked }))
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Fréquence de génération</Label>
                      <Select
                        value={settings.report_schedule}
                        onValueChange={(value: any) =>
                          setSettings(prev => ({ ...prev, report_schedule: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daily">Quotidien</SelectItem>
                          <SelectItem value="weekly">Hebdomadaire</SelectItem>
                          <SelectItem value="monthly">Mensuel</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Destinataires des rapports</Label>
                      <div className="flex gap-2">
                        <Input
                          type="email"
                          value={emailInput}
                          onChange={(e) => setEmailInput(e.target.value)}
                          placeholder="email@exemple.com"
                        />
                        <Button onClick={addRecipient} size="sm">
                          Ajouter
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {settings.report_recipients.map((email) => (
                          <Badge key={email} variant="secondary" className="flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {email}
                            <button
                              onClick={() => removeRecipient(email)}
                              className="ml-1 text-xs hover:text-red-600"
                            >
                              ×
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="security" className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Lock className="w-5 h-5" />
                  Sécurité et Audit
                </h3>
                
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Traçabilité des emplacements</Label>
                        <p className="text-sm text-muted-foreground">
                          Suit les mouvements d'actifs en temps réel
                        </p>
                      </div>
                      <Switch
                        checked={settings.asset_location_tracking}
                        onCheckedChange={(checked) =>
                          setSettings(prev => ({ ...prev, asset_location_tracking: checked }))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>QR Code obligatoire</Label>
                        <p className="text-sm text-muted-foreground">
                          Tous les actifs doivent avoir un QR code
                        </p>
                      </div>
                      <Switch
                        checked={settings.qr_code_required}
                        onCheckedChange={(checked) =>
                          setSettings(prev => ({ ...prev, qr_code_required: checked }))
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Journal d'audit</Label>
                        <p className="text-sm text-muted-foreground">
                          Enregistre toutes les actions sur les actifs
                        </p>
                      </div>
                      <Switch
                        checked={settings.audit_trail_enabled}
                        onCheckedChange={(checked) =>
                          setSettings(prev => ({ ...prev, audit_trail_enabled: checked }))
                        }
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-semibold">Informations Système</h4>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Database className="w-4 h-4 text-blue-600" />
                      <div>
                        <p className="font-medium">Version Base</p>
                        <p className="text-muted-foreground">PostgreSQL 15.3</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Settings className="w-4 h-4 text-green-600" />
                      <div>
                        <p className="font-medium">API Version</p>
                        <p className="text-muted-foreground">v2.1.0</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-purple-600" />
                      <div>
                        <p className="font-medium">Utilisateurs Actifs</p>
                        <p className="text-muted-foreground">147 connectés</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <Separator className="my-6" />

          <div className="flex justify-end gap-3">
            <Button variant="outline">Réinitialiser</Button>
            <Button onClick={handleSave}>Sauvegarder la Configuration</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}