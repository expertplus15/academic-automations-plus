import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Send, Mail, Clock, Settings, Users, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function DocumentDistribution() {
  const [autoSendEnabled, setAutoSendEnabled] = useState(true);
  const [emailTemplate, setEmailTemplate] = useState('');
  const { toast } = useToast();

  // Mock data - à remplacer par de vraies données
  const scheduledSends = [
    {
      id: '1',
      recipient: 'jean.dupont@email.com',
      document: 'Certificat de Scolarité',
      scheduledDate: '2024-01-20',
      status: 'scheduled'
    },
    {
      id: '2',
      recipient: 'marie.martin@email.com',
      document: 'Relevé de Notes',
      scheduledDate: '2024-01-18',
      status: 'sent'
    }
  ];

  const handleSaveSettings = () => {
    toast({
      title: "Paramètres sauvegardés",
      description: "Les paramètres d'envoi automatique ont été mis à jour.",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent':
        return 'default';
      case 'scheduled':
        return 'secondary';
      case 'failed':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'sent':
        return 'Envoyé';
      case 'scheduled':
        return 'Programmé';
      case 'failed':
        return 'Échec';
      default:
        return 'Inconnu';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Send className="w-6 h-6 text-primary" />
        <h1 className="text-2xl font-bold">Envoi Automatique</h1>
      </div>

      {/* Configuration générale */}
      <Card>
        <CardHeader>
          <CardTitle>Configuration de l'envoi automatique</CardTitle>
          <CardDescription>
            Paramétrez l'envoi automatique des documents validés
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Envoi automatique activé</Label>
              <p className="text-sm text-muted-foreground">
                Les documents validés seront automatiquement envoyés
              </p>
            </div>
            <Switch
              checked={autoSendEnabled}
              onCheckedChange={setAutoSendEnabled}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Délai d'envoi (heures)</Label>
              <Select defaultValue="24">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 heure</SelectItem>
                  <SelectItem value="6">6 heures</SelectItem>
                  <SelectItem value="24">24 heures</SelectItem>
                  <SelectItem value="48">48 heures</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Format d'envoi</Label>
              <Select defaultValue="pdf">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF uniquement</SelectItem>
                  <SelectItem value="both">PDF + Original</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Modèle d'email par défaut</Label>
            <Textarea
              placeholder="Bonjour,&#10;&#10;Vous trouverez ci-joint votre document demandé.&#10;&#10;Cordialement,&#10;L'équipe administrative"
              value={emailTemplate}
              onChange={(e) => setEmailTemplate(e.target.value)}
              rows={6}
            />
          </div>

          <Button onClick={handleSaveSettings}>
            <Settings className="w-4 h-4 mr-2" />
            Sauvegarder les paramètres
          </Button>
        </CardContent>
      </Card>

      {/* Envois programmés */}
      <Card>
        <CardHeader>
          <CardTitle>Envois programmés et historique</CardTitle>
          <CardDescription>
            Suivez les envois automatiques planifiés et leur statut
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {scheduledSends.map((send) => (
              <div key={send.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <Mail className="w-8 h-8 text-primary" />
                  <div>
                    <h3 className="font-medium">{send.document}</h3>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Users className="w-4 h-4" />
                      <span>{send.recipient}</span>
                      <span>•</span>
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(send.scheduledDate).toLocaleDateString('fr-FR')}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={getStatusColor(send.status)}>
                    {getStatusText(send.status)}
                  </Badge>
                  {send.status === 'scheduled' && (
                    <Button variant="outline" size="sm">
                      Modifier
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Envoi manuel */}
      <Card>
        <CardHeader>
          <CardTitle>Envoi manuel</CardTitle>
          <CardDescription>
            Envoyez immédiatement un document à un destinataire
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Document à envoyer</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un document" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cert1">Certificat - Jean Dupont</SelectItem>
                  <SelectItem value="releve1">Relevé - Marie Martin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Email du destinataire</Label>
              <Input type="email" placeholder="destinataire@email.com" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Message personnalisé (optionnel)</Label>
            <Textarea placeholder="Message personnalisé pour cet envoi..." rows={3} />
          </div>
          <Button>
            <Send className="w-4 h-4 mr-2" />
            Envoyer maintenant
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}