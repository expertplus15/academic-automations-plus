import { SettingsModuleLayout } from "@/components/layouts/SettingsModuleLayout";
import { SettingsPageHeader } from "@/components/SettingsPageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  Palette,
  Monitor,
  Smartphone,
  Sun,
  Moon,
  Type,
  Layout,
  Image,
  Save,
  Upload,
  Eye,
  Download
} from "lucide-react";
import { useState } from "react";

export default function Customization() {
  const [selectedTheme, setSelectedTheme] = useState("system");
  const [primaryColor, setPrimaryColor] = useState("#0ea5e9");

  const themes = [
    { id: "light", name: "Clair", icon: Sun, description: "Thème clair" },
    { id: "dark", name: "Sombre", icon: Moon, description: "Thème sombre" },
    { id: "system", name: "Système", icon: Monitor, description: "Suit le système" }
  ];

  const colorPresets = [
    { name: "Bleu", value: "#0ea5e9", class: "bg-sky-500" },
    { name: "Violet", value: "#8b5cf6", class: "bg-violet-500" },
    { name: "Vert", value: "#10b981", class: "bg-emerald-500" },
    { name: "Orange", value: "#f59e0b", class: "bg-amber-500" },
    { name: "Rose", value: "#ec4899", class: "bg-pink-500" },
    { name: "Rouge", value: "#ef4444", class: "bg-red-500" }
  ];

  return (
    <SettingsModuleLayout>
      <SettingsPageHeader 
        title="Personnalisation" 
        subtitle="Interface, thèmes et branding" 
      />
      <div className="p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <Tabs defaultValue="themes" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="themes">Thèmes & Couleurs</TabsTrigger>
              <TabsTrigger value="branding">Branding</TabsTrigger>
              <TabsTrigger value="layout">Mise en page</TabsTrigger>
              <TabsTrigger value="accessibility">Accessibilité</TabsTrigger>
            </TabsList>

            <TabsContent value="themes" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Sélection du thème */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Palette className="h-5 w-5" />
                      Thème principal
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 gap-3">
                      {themes.map((theme) => {
                        const ThemeIcon = theme.icon;
                        return (
                          <div
                            key={theme.id}
                            className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                              selectedTheme === theme.id ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                            }`}
                            onClick={() => setSelectedTheme(theme.id)}
                          >
                            <div className="flex items-center gap-3">
                              <ThemeIcon className="h-5 w-5" />
                              <div>
                                <p className="font-medium">{theme.name}</p>
                                <p className="text-sm text-muted-foreground">{theme.description}</p>
                              </div>
                              {selectedTheme === theme.id && (
                                <Badge variant="default" className="ml-auto">Actuel</Badge>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Couleurs */}
                <Card>
                  <CardHeader>
                    <CardTitle>Couleurs personnalisées</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Couleur principale</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="color"
                          value={primaryColor}
                          onChange={(e) => setPrimaryColor(e.target.value)}
                          className="w-12 h-8 p-1 border rounded cursor-pointer"
                        />
                        <Input
                          value={primaryColor}
                          onChange={(e) => setPrimaryColor(e.target.value)}
                          placeholder="#0ea5e9"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Couleurs prédéfinies</Label>
                      <div className="grid grid-cols-6 gap-2">
                        {colorPresets.map((color) => (
                          <div
                            key={color.value}
                            className={`w-8 h-8 rounded cursor-pointer border-2 ${color.class} ${
                              primaryColor === color.value ? 'border-foreground' : 'border-transparent'
                            }`}
                            onClick={() => setPrimaryColor(color.value)}
                            title={color.name}
                          />
                        ))}
                      </div>
                    </div>

                    <Button variant="outline" className="w-full">
                      <Eye className="h-4 w-4 mr-2" />
                      Prévisualiser les modifications
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Mode sombre automatique */}
              <Card>
                <CardHeader>
                  <CardTitle>Paramètres avancés</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Mode sombre automatique</p>
                      <p className="text-sm text-muted-foreground">Basculer automatiquement selon l'heure</p>
                    </div>
                    <Switch />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Animations réduites</p>
                      <p className="text-sm text-muted-foreground">Respecter les préférences d'accessibilité</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Thème par défaut pour nouveaux utilisateurs</p>
                      <p className="text-sm text-muted-foreground">Thème appliqué aux nouveaux comptes</p>
                    </div>
                    <Select defaultValue="system">
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Clair</SelectItem>
                        <SelectItem value="dark">Sombre</SelectItem>
                        <SelectItem value="system">Système</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="branding" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Logo et identité */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Image className="h-5 w-5" />
                      Logo et identité visuelle
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Logo principal</Label>
                      <div className="flex items-center gap-4">
                        <div className="w-20 h-20 border-2 border-dashed rounded-lg flex items-center justify-center bg-muted">
                          <Image className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <div className="space-y-2">
                          <Button variant="outline" size="sm">
                            <Upload className="h-4 w-4 mr-2" />
                            Télécharger
                          </Button>
                          <p className="text-xs text-muted-foreground">PNG, SVG max 2MB</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Logo secondaire (mode sombre)</Label>
                      <div className="flex items-center gap-4">
                        <div className="w-20 h-20 border-2 border-dashed rounded-lg flex items-center justify-center bg-slate-900">
                          <Image className="h-8 w-8 text-white" />
                        </div>
                        <div className="space-y-2">
                          <Button variant="outline" size="sm">
                            <Upload className="h-4 w-4 mr-2" />
                            Télécharger
                          </Button>
                          <p className="text-xs text-muted-foreground">Optionnel</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Favicon</Label>
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 border rounded flex items-center justify-center bg-muted">
                          <Image className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <Button variant="outline" size="sm">
                          <Upload className="h-4 w-4 mr-2" />
                          Télécharger
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Textes personnalisés */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Type className="h-5 w-5" />
                      Textes personnalisés
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Titre de l'application</Label>
                      <Input defaultValue="EduPlatform" placeholder="Nom de votre plateforme" />
                    </div>
                    <div className="space-y-2">
                      <Label>Slogan</Label>
                      <Input placeholder="Votre slogan" />
                    </div>
                    <div className="space-y-2">
                      <Label>Message de bienvenue</Label>
                      <Input placeholder="Bienvenue sur..." />
                    </div>
                    <div className="space-y-2">
                      <Label>Pied de page</Label>
                      <Input defaultValue="© 2024 Mon Établissement. Tous droits réservés." />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Prévisualisation */}
              <Card>
                <CardHeader>
                  <CardTitle>Prévisualisation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-lg p-6 bg-gradient-to-br from-background to-muted/30">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                        <Image className="h-6 w-6 text-primary-foreground" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">EduPlatform</h3>
                        <p className="text-muted-foreground">Votre plateforme éducative</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Aperçu de votre interface avec les paramètres actuels
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="layout" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Mise en page */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Layout className="h-5 w-5" />
                      Configuration de la mise en page
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Largeur maximale du contenu</Label>
                      <Select defaultValue="7xl">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="6xl">1152px (6xl)</SelectItem>
                          <SelectItem value="7xl">1280px (7xl)</SelectItem>
                          <SelectItem value="full">Pleine largeur</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Position de la barre latérale</Label>
                      <Select defaultValue="left">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="left">Gauche</SelectItem>
                          <SelectItem value="right">Droite</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Barre latérale rétractable</p>
                        <p className="text-sm text-muted-foreground">Permettre de masquer la barre latérale</p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Navigation sticky</p>
                        <p className="text-sm text-muted-foreground">Fixer la navigation en haut</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </CardContent>
                </Card>

                {/* Responsive */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Smartphone className="h-5 w-5" />
                      Responsive Design
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Mode mobile optimisé</p>
                        <p className="text-sm text-muted-foreground">Interface adaptée aux mobiles</p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Navigation mobile en bas</p>
                        <p className="text-sm text-muted-foreground">Tab bar en bas sur mobile</p>
                      </div>
                      <Switch />
                    </div>

                    <div className="space-y-2">
                      <Label>Breakpoint mobile</Label>
                      <Select defaultValue="768">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="640">640px (sm)</SelectItem>
                          <SelectItem value="768">768px (md)</SelectItem>
                          <SelectItem value="1024">1024px (lg)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="accessibility" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Accessibilité et inclusion</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Mode haut contraste</p>
                        <p className="text-sm text-muted-foreground">Améliorer la lisibilité</p>
                      </div>
                      <Switch />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Taille de police augmentée</p>
                        <p className="text-sm text-muted-foreground">Police plus grande par défaut</p>
                      </div>
                      <Switch />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Focus visible renforcé</p>
                        <p className="text-sm text-muted-foreground">Meilleure indication du focus clavier</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Description des images</p>
                        <p className="text-sm text-muted-foreground">Alt text obligatoire</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <Separator />
                    <div className="space-y-2">
                      <Label>Langue par défaut</Label>
                      <Select defaultValue="fr">
                        <SelectTrigger className="w-48">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="fr">Français</SelectItem>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="es">Español</SelectItem>
                          <SelectItem value="ar">العربية</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Exporter le thème
              </Button>
              <Button variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                Importer un thème
              </Button>
            </div>
            <div className="flex gap-3">
              <Button variant="outline">Réinitialiser</Button>
              <Button>
                <Save className="h-4 w-4 mr-2" />
                Enregistrer les modifications
              </Button>
            </div>
          </div>
        </div>
      </div>
    </SettingsModuleLayout>
  );
}