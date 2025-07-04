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
import { 
  Building,
  Plus,
  Settings,
  Users,
  MapPin,
  Phone,
  Mail,
  Edit,
  Trash2,
  Eye,
  Globe,
  Shield
} from "lucide-react";

export default function Institutions() {
  const institutions = [
    {
      id: 1,
      name: "Campus Principal",
      code: "MAIN",
      type: "Université",
      city: "Paris",
      students: 2450,
      staff: 180,
      status: "active",
      isMain: true
    },
    {
      id: 2,
      name: "Antenne Lyon",
      code: "LYON",
      type: "Antenne",
      city: "Lyon",
      students: 850,
      staff: 45,
      status: "active",
      isMain: false
    },
    {
      id: 3,
      name: "Centre de Formation Continue",
      code: "CFC",
      type: "Centre de formation",
      city: "Marseille",
      students: 320,
      staff: 25,
      status: "active",
      isMain: false
    }
  ];

  return (
    <SettingsModuleLayout>
      <SettingsPageHeader 
        title="Multi-établissements" 
        subtitle="Gestion centralisée des établissements" 
      />
      <div className="p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <Tabs defaultValue="institutions" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="institutions">Établissements</TabsTrigger>
              <TabsTrigger value="synchronization">Synchronisation</TabsTrigger>
              <TabsTrigger value="permissions">Permissions</TabsTrigger>
            </TabsList>

            <TabsContent value="institutions" className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">Réseau d'établissements</h3>
                  <p className="text-muted-foreground">Gérez vos différents campus et antennes</p>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter un établissement
                </Button>
              </div>

              <div className="grid gap-4">
                {institutions.map((institution) => (
                  <Card key={institution.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                            <Building className="h-6 w-6 text-primary" />
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold">{institution.name}</h4>
                              {institution.isMain && (
                                <Badge variant="default">Principal</Badge>
                              )}
                              <Badge variant="outline">{institution.code}</Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Building className="h-3 w-3" />
                                {institution.type}
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {institution.city}
                              </span>
                              <span className="flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                {institution.students} étudiants
                              </span>
                              <span>{institution.staff} personnel</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={institution.status === 'active' ? 'default' : 'secondary'}>
                            {institution.status === 'active' ? 'Actif' : 'Inactif'}
                          </Badge>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          {!institution.isMain && (
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Formulaire d'ajout rapide */}
              <Card>
                <CardHeader>
                  <CardTitle>Ajouter un nouvel établissement</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Nom de l'établissement</Label>
                      <Input placeholder="Campus de..." />
                    </div>
                    <div className="space-y-2">
                      <Label>Code</Label>
                      <Input placeholder="CODE" className="uppercase" />
                    </div>
                    <div className="space-y-2">
                      <Label>Type</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="university">Université</SelectItem>
                          <SelectItem value="campus">Campus</SelectItem>
                          <SelectItem value="branch">Antenne</SelectItem>
                          <SelectItem value="center">Centre de formation</SelectItem>
                          <SelectItem value="institute">Institut</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Adresse</Label>
                      <Input placeholder="Adresse complète" />
                    </div>
                    <div className="space-y-2">
                      <Label>Ville</Label>
                      <Input placeholder="Ville" />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1">Annuler</Button>
                    <Button className="flex-1">Créer l'établissement</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="synchronization" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Configuration de la synchronisation
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Synchronisation automatique</p>
                        <p className="text-sm text-muted-foreground">Synchroniser les données entre établissements</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Fréquence de synchronisation</Label>
                      <Select defaultValue="hourly">
                        <SelectTrigger className="w-48">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="real-time">Temps réel</SelectItem>
                          <SelectItem value="hourly">Toutes les heures</SelectItem>
                          <SelectItem value="daily">Quotidienne</SelectItem>
                          <SelectItem value="weekly">Hebdomadaire</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-3">
                      <Label>Données à synchroniser</Label>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span>Profils étudiants</span>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Programmes académiques</span>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Calendrier académique</span>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Personnel enseignant</span>
                          <Switch />
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Données financières</span>
                          <Switch />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Historique de synchronisation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Synchronisation réussie</p>
                        <p className="text-sm text-muted-foreground">Campus Principal ↔ Antenne Lyon</p>
                      </div>
                      <div className="text-right">
                        <Badge variant="default">Terminé</Badge>
                        <p className="text-xs text-muted-foreground mt-1">Il y a 2h</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Synchronisation en cours</p>
                        <p className="text-sm text-muted-foreground">Campus Principal ↔ Centre Formation</p>
                      </div>
                      <div className="text-right">
                        <Badge variant="secondary">En cours</Badge>
                        <p className="text-xs text-muted-foreground mt-1">Démarré il y a 5min</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="permissions" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Gestion des permissions inter-établissements
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-3">Accès aux données</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span>Consultation des étudiants autres établissements</span>
                          <Switch />
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Modification des données partagées</span>
                          <Switch />
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Accès aux rapports consolidés</span>
                          <Switch defaultChecked />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-3">Gestion administrative</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span>Création de nouveaux établissements</span>
                          <Switch />
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Configuration de la synchronisation</span>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Gestion des utilisateurs inter-établissements</span>
                          <Switch />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-3">Rôles spéciaux</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 border rounded-lg">
                          <h5 className="font-medium">Administrateur Réseau</h5>
                          <p className="text-sm text-muted-foreground mb-2">Accès complet à tous les établissements</p>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            <span className="text-sm">3 utilisateurs</span>
                          </div>
                        </div>
                        <div className="p-4 border rounded-lg">
                          <h5 className="font-medium">Coordinateur Inter-Campus</h5>
                          <p className="text-sm text-muted-foreground mb-2">Coordination entre établissements</p>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            <span className="text-sm">7 utilisateurs</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-3">
            <Button variant="outline">Annuler</Button>
            <Button>
              <Settings className="h-4 w-4 mr-2" />
              Enregistrer la configuration
            </Button>
          </div>
        </div>
      </div>
    </SettingsModuleLayout>
  );
}