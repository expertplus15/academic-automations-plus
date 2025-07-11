import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bell, Settings, Mail, MessageSquare, CheckCircle, AlertCircle, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function DocumentNotifications() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [inAppNotifications, setInAppNotifications] = useState(true);
  const [validationNotifs, setValidationNotifs] = useState(true);
  const [generationNotifs, setGenerationNotifs] = useState(false);
  const { toast } = useToast();

  // Mock data - à remplacer par de vraies données
  const recentNotifications = [
    {
      id: '1',
      type: 'validation',
      title: 'Document validé',
      message: 'Le certificat de scolarité pour Jean Dupont a été validé',
      timestamp: '2024-01-15T10:30:00',
      read: false,
      icon: CheckCircle,
      color: 'text-green-500'
    },
    {
      id: '2',
      type: 'generation',
      title: 'Document généré',
      message: 'Le relevé de notes pour Marie Martin est prêt',
      timestamp: '2024-01-15T09:15:00',
      read: true,
      icon: MessageSquare,
      color: 'text-blue-500'
    },
    {
      id: '3',
      type: 'error',
      title: 'Erreur de génération',
      message: 'Échec de génération pour l\'attestation de Paul Durand',
      timestamp: '2024-01-14T16:45:00',
      read: false,
      icon: AlertCircle,
      color: 'text-red-500'
    }
  ];

  const handleSaveSettings = () => {
    toast({
      title: "Paramètres sauvegardés",
      description: "Vos préférences de notification ont été mises à jour.",
    });
  };

  const markAsRead = (notificationId: string) => {
    toast({
      title: "Notification marquée comme lue",
    });
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'validation':
        return 'Validation';
      case 'generation':
        return 'Génération';
      case 'error':
        return 'Erreur';
      default:
        return 'Autre';
    }
  };

  const getTypeBadgeVariant = (type: string) => {
    switch (type) {
      case 'validation':
        return 'default';
      case 'generation':
        return 'secondary';
      case 'error':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Bell className="w-6 h-6 text-primary" />
        <h1 className="text-2xl font-bold">Notifications</h1>
      </div>

      {/* Paramètres de notification */}
      <Card>
        <CardHeader>
          <CardTitle>Paramètres de notification</CardTitle>
          <CardDescription>
            Configurez vos préférences de notification pour les événements de gestion documentaire
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Notifications par email</Label>
                <p className="text-sm text-muted-foreground">
                  Recevoir les notifications importantes par email
                </p>
              </div>
              <Switch
                checked={emailNotifications}
                onCheckedChange={setEmailNotifications}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Notifications dans l'application</Label>
                <p className="text-sm text-muted-foreground">
                  Afficher les notifications dans l'interface utilisateur
                </p>
              </div>
              <Switch
                checked={inAppNotifications}
                onCheckedChange={setInAppNotifications}
              />
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-medium mb-4">Types de notifications</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Validation de documents</Label>
                  <p className="text-sm text-muted-foreground">
                    Notification lors de la validation ou du rejet de documents
                  </p>
                </div>
                <Switch
                  checked={validationNotifs}
                  onCheckedChange={setValidationNotifs}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Génération de documents</Label>
                  <p className="text-sm text-muted-foreground">
                    Notification lors de la génération réussie de documents
                  </p>
                </div>
                <Switch
                  checked={generationNotifs}
                  onCheckedChange={setGenerationNotifs}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Fréquence des notifications groupées</Label>
              <Select defaultValue="immediate">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="immediate">Immédiate</SelectItem>
                  <SelectItem value="hourly">Chaque heure</SelectItem>
                  <SelectItem value="daily">Quotidienne</SelectItem>
                  <SelectItem value="weekly">Hebdomadaire</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={handleSaveSettings}>
              <Settings className="w-4 h-4 mr-2" />
              Sauvegarder les paramètres
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Notifications récentes */}
      <Card>
        <CardHeader>
          <CardTitle>Notifications récentes</CardTitle>
          <CardDescription>
            Historique de vos dernières notifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentNotifications.map((notification) => {
              const IconComponent = notification.icon;
              return (
                <div 
                  key={notification.id} 
                  className={`p-4 border rounded-lg ${!notification.read ? 'bg-muted/50' : ''}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <IconComponent className={`w-5 h-5 mt-0.5 ${notification.color}`} />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className={`font-medium ${!notification.read ? 'font-semibold' : ''}`}>
                            {notification.title}
                          </h3>
                          <Badge variant={getTypeBadgeVariant(notification.type)} className="text-xs">
                            {getTypeLabel(notification.type)}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Clock className="w-3 h-3 mr-1" />
                          {new Date(notification.timestamp).toLocaleString('fr-FR')}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {!notification.read && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => markAsRead(notification.id)}
                        >
                          Marquer comme lu
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}