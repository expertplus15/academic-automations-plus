import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Settings, Save, Upload, Download, Shield, Palette } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function DocumentSettings() {
  const [autoArchive, setAutoArchive] = useState(true);
  const [watermarkEnabled, setWatermarkEnabled] = useState(false);
  const [digitalSignature, setDigitalSignature] = useState(true);
  const [institutionName, setInstitutionName] = useState('Mon Établissement');
  const [institutionAddress, setInstitutionAddress] = useState('');
  const [watermarkText, setWatermarkText] = useState('CONFIDENTIEL');
  const { toast } = useToast();

  const handleSaveSettings = () => {
    toast({
      title: "Paramètres sauvegardés",
      description: "La configuration du système documentaire a été mise à jour.",
    });
  };

  const handleExportSettings = () => {
    toast({
      title: "Export en cours",
      description: "Les paramètres sont en cours d'export...",
    });
  };

  const handleImportSettings = () => {
    toast({
      title: "Import réussi",
      description: "Les paramètres ont été importés avec succès.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Settings className="w-6 h-6 text-primary" />
        <h1 className="text-2xl font-bold">Paramètres & Configuration</h1>
      </div>

      {/* Configuration générale */}
      <Card>
        <CardHeader>
          <CardTitle>Configuration générale</CardTitle>
          <CardDescription>
            Paramètres généraux du système de gestion documentaire
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Nom de l'institution</Label>
              <Input
                value={institutionName}
                onChange={(e) => setInstitutionName(e.target.value)}
                placeholder="Nom de votre établissement"
              />
            </div>
            <div className="space-y-2">
              <Label>Format de numérotation</Label>
              <Select defaultValue="YYYY-XXX">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="YYYY-XXX">YYYY-XXX (2024-001)</SelectItem>
                  <SelectItem value="XXX-YYYY">XXX-YYYY (001-2024)</SelectItem>
                  <SelectItem value="YYYYMMDD-XXX">YYYYMMDD-XXX (20240115-001)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Adresse de l'institution</Label>
            <Textarea
              value={institutionAddress}
              onChange={(e) => setInstitutionAddress(e.target.value)}
              placeholder="Adresse complète de l'établissement"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Délai de conservation (jours)</Label>
              <Input type="number" defaultValue="2555" placeholder="Jours" />
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
          </div>
        </CardContent>
      </Card>

      {/* Sécurité et conformité */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Sécurité et conformité
          </CardTitle>
          <CardDescription>
            Paramètres de sécurité et conformité RGPD
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Archivage automatique</Label>
                <p className="text-sm text-muted-foreground">
                  Archiver automatiquement les documents après validation
                </p>
              </div>
              <Switch
                checked={autoArchive}
                onCheckedChange={setAutoArchive}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Signature numérique</Label>
                <p className="text-sm text-muted-foreground">
                  Appliquer une signature numérique à tous les documents
                </p>
              </div>
              <Switch
                checked={digitalSignature}
                onCheckedChange={setDigitalSignature}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Filigrane de sécurité</Label>
                <p className="text-sm text-muted-foreground">
                  Ajouter un filigrane sur les documents sensibles
                </p>
              </div>
              <Switch
                checked={watermarkEnabled}
                onCheckedChange={setWatermarkEnabled}
              />
            </div>
          </div>

          {watermarkEnabled && (
            <div className="space-y-2">
              <Label>Texte du filigrane</Label>
              <Input
                value={watermarkText}
                onChange={(e) => setWatermarkText(e.target.value)}
                placeholder="Texte à afficher en filigrane"
              />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Niveau de chiffrement</Label>
              <Select defaultValue="aes256">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="aes128">AES-128</SelectItem>
                  <SelectItem value="aes256">AES-256</SelectItem>
                  <SelectItem value="rsa2048">RSA-2048</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Audit des accès</Label>
              <Select defaultValue="all">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Désactivé</SelectItem>
                  <SelectItem value="critical">Actions critiques</SelectItem>
                  <SelectItem value="all">Toutes les actions</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personnalisation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5" />
            Personnalisation
          </CardTitle>
          <CardDescription>
            Personnalisez l'apparence des documents générés
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Logo de l'institution</Label>
              <div className="flex items-center space-x-2">
                <Input type="file" accept="image/*" className="flex-1" />
                <Button variant="outline" size="sm">
                  <Upload className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Couleur principale</Label>
              <Input type="color" defaultValue="#0066cc" className="w-20 h-10" />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Pied de page par défaut</Label>
            <Textarea
              placeholder="Texte du pied de page pour tous les documents"
              rows={3}
              defaultValue="Ce document est généré automatiquement par le système de gestion documentaire."
            />
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Actions</CardTitle>
          <CardDescription>
            Sauvegarde et gestion des paramètres
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button onClick={handleSaveSettings}>
              <Save className="w-4 h-4 mr-2" />
              Sauvegarder tous les paramètres
            </Button>
            <Button variant="outline" onClick={handleExportSettings}>
              <Download className="w-4 h-4 mr-2" />
              Exporter la configuration
            </Button>
            <Button variant="outline" onClick={handleImportSettings}>
              <Upload className="w-4 h-4 mr-2" />
              Importer une configuration
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}