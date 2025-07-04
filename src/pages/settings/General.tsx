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
  Calendar,
  Settings,
  Building,
  Globe,
  DollarSign,
  Clock,
  GraduationCap,
  Save,
  RefreshCw,
  AlertCircle,
  CheckCircle
} from "lucide-react";
import { useState } from "react";

export default function General() {
  const [currentYear, setCurrentYear] = useState("2024-2025");
  const [isClosingYear, setIsClosingYear] = useState(false);

  const academicYears = [
    { id: "1", name: "2023-2024", status: "closed", start: "2023-09-01", end: "2024-06-30" },
    { id: "2", name: "2024-2025", status: "current", start: "2024-09-01", end: "2025-06-30" },
    { id: "3", name: "2025-2026", status: "planned", start: "2025-09-01", end: "2026-06-30" }
  ];

  const handleCloseYear = () => {
    setIsClosingYear(true);
    // Simulate year closing process
    setTimeout(() => {
      setIsClosingYear(false);
    }, 3000);
  };

  return (
    <SettingsModuleLayout>
      <SettingsPageHeader 
        title="Configuration générale" 
        subtitle="Paramètres système et années académiques" 
      />
      <div className="p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <Tabs defaultValue="general" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="general">Paramètres généraux</TabsTrigger>
              <TabsTrigger value="academic">Années académiques</TabsTrigger>
              <TabsTrigger value="institution">Institution</TabsTrigger>
              <TabsTrigger value="advanced">Avancé</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Langue et Localisation */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="h-5 w-5" />
                      Langue et Localisation
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
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
                          <SelectItem value="ar">العربية</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Fuseau horaire</Label>
                      <Select defaultValue="europe/paris">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="europe/paris">Europe/Paris (UTC+1)</SelectItem>
                          <SelectItem value="africa/casablanca">Africa/Casablanca (UTC+1)</SelectItem>
                          <SelectItem value="america/new_york">America/New_York (UTC-5)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Format de date</Label>
                      <Select defaultValue="dd/mm/yyyy">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="dd/mm/yyyy">DD/MM/YYYY</SelectItem>
                          <SelectItem value="mm/dd/yyyy">MM/DD/YYYY</SelectItem>
                          <SelectItem value="yyyy-mm-dd">YYYY-MM-DD</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                {/* Devise et Finance */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5" />
                      Devise et Finance
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Devise principale</Label>
                      <Select defaultValue="eur">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="eur">EUR (Euro)</SelectItem>
                          <SelectItem value="mad">MAD (Dirham)</SelectItem>
                          <SelectItem value="usd">USD (Dollar)</SelectItem>
                          <SelectItem value="gbp">GBP (Livre)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Échelle de notation</Label>
                      <Input type="number" defaultValue="20" placeholder="20" />
                      <p className="text-sm text-muted-foreground">Note maximale (ex: 20, 100)</p>
                    </div>
                    <div className="space-y-2">
                      <Label>Note de passage</Label>
                      <Input type="number" defaultValue="10" placeholder="10" />
                      <p className="text-sm text-muted-foreground">Note minimale pour valider</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Règles Académiques
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Présence minimale requise (%)</Label>
                      <Input type="number" defaultValue="75" placeholder="75" />
                    </div>
                    <div className="space-y-2">
                      <Label>Nombre max d'absences non justifiées</Label>
                      <Input type="number" defaultValue="5" placeholder="5" />
                    </div>
                    <div className="space-y-2">
                      <Label>Durée de session d'examen (min)</Label>
                      <Input type="number" defaultValue="120" placeholder="120" />
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Initialisation automatique des années</p>
                      <p className="text-sm text-muted-foreground">Créer automatiquement la nouvelle année académique</p>
                    </div>
                    <Switch />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="academic" className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">Gestion des Années Académiques</h3>
                  <p className="text-muted-foreground">Gérez le cycle des années scolaires</p>
                </div>
                <Button>
                  <Calendar className="h-4 w-4 mr-2" />
                  Nouvelle Année
                </Button>
              </div>

              <div className="grid gap-4">
                {academicYears.map((year) => (
                  <Card key={year.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div>
                            <h4 className="font-semibold text-lg">{year.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              Du {year.start} au {year.end}
                            </p>
                          </div>
                          <Badge variant={
                            year.status === 'current' ? 'default' : 
                            year.status === 'closed' ? 'secondary' : 'outline'
                          }>
                            {year.status === 'current' ? 'En cours' : 
                             year.status === 'closed' ? 'Clôturée' : 'Planifiée'}
                          </Badge>
                        </div>
                        <div className="flex gap-2">
                          {year.status === 'current' && (
                            <Button 
                              variant="destructive"
                              onClick={handleCloseYear}
                              disabled={isClosingYear}
                            >
                              {isClosingYear ? (
                                <>
                                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                  Clôture...
                                </>
                              ) : (
                                'Clôturer l\'année'
                              )}
                            </Button>
                          )}
                          {year.status === 'planned' && (
                            <Button variant="outline">Activer</Button>
                          )}
                          <Button variant="ghost" size="sm">Modifier</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Processus de Clôture d'Année</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span>Vérification des notes et évaluations</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span>Finalisation des relevés de notes</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <AlertCircle className="h-5 w-5 text-yellow-500" />
                      <span>Archivage des données académiques</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-gray-400" />
                      <span>Préparation de la nouvelle année</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="institution" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="h-5 w-5" />
                    Informations de l'Établissement
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Nom de l'établissement</Label>
                      <Input defaultValue="Mon Établissement" />
                    </div>
                    <div className="space-y-2">
                      <Label>Type d'établissement</Label>
                      <Select defaultValue="university">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="university">Université</SelectItem>
                          <SelectItem value="school">École</SelectItem>
                          <SelectItem value="institute">Institut</SelectItem>
                          <SelectItem value="college">Collège</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Adresse complète</Label>
                    <Input placeholder="123 Rue de l'Université, 75001 Paris" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Email principal</Label>
                      <Input type="email" placeholder="contact@etablissement.fr" />
                    </div>
                    <div className="space-y-2">
                      <Label>Téléphone principal</Label>
                      <Input placeholder="+33 1 23 45 67 89" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Logo de l'établissement</Label>
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 border rounded-lg flex items-center justify-center bg-muted">
                        <Building className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <Button variant="outline">Télécharger logo</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="advanced" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Configuration Avancée</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Mode maintenance</p>
                        <p className="text-sm text-muted-foreground">Désactiver l'accès pour maintenance</p>
                      </div>
                      <Switch />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Inscriptions ouvertes</p>
                        <p className="text-sm text-muted-foreground">Autoriser les nouvelles inscriptions</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Notifications par email</p>
                        <p className="text-sm text-muted-foreground">Envoyer les notifications système</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Actions de Maintenance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button variant="outline">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Recalculer les moyennes
                    </Button>
                    <Button variant="outline">
                      <Save className="h-4 w-4 mr-2" />
                      Sauvegarder la configuration
                    </Button>
                    <Button variant="outline">
                      <GraduationCap className="h-4 w-4 mr-2" />
                      Réinitialiser les notes
                    </Button>
                    <Button variant="outline">
                      <Building className="h-4 w-4 mr-2" />
                      Exporter les données
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-3">
            <Button variant="outline">Annuler</Button>
            <Button>
              <Save className="h-4 w-4 mr-2" />
              Enregistrer les modifications
            </Button>
          </div>
        </div>
      </div>
    </SettingsModuleLayout>
  );
}