import { ModuleLayout } from "@/components/layouts/ModuleLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Users, Calculator, Shield, Save } from "lucide-react";

export default function Config() {
  return (
    <ModuleLayout 
      title="Configuration" 
      subtitle="Paramètres et configuration du module Évaluations & Résultats"
      showHeader={true}
    >
      <div className="p-6">
        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid grid-cols-4 w-full max-w-2xl">
            <TabsTrigger value="general" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Général
            </TabsTrigger>
            <TabsTrigger value="permissions" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Permissions
            </TabsTrigger>
            <TabsTrigger value="calculation" className="flex items-center gap-2">
              <Calculator className="w-4 h-4" />
              Calculs
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Utilisateurs
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Paramètres Généraux</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Barème par défaut</label>
                    <select className="w-full mt-1 p-2 border rounded-md">
                      <option value="20">Sur 20</option>
                      <option value="100">Sur 100</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Note minimale de passage</label>
                    <input type="number" className="w-full mt-1 p-2 border rounded-md" defaultValue="10" />
                  </div>
                </div>
                <Button>
                  <Save className="w-4 h-4 mr-2" />
                  Sauvegarder
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="permissions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Gestion des Permissions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <span className="font-medium">Saisie des notes</span>
                    <select className="p-1 border rounded">
                      <option value="teacher">Enseignants</option>
                      <option value="admin">Administrateurs</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <span className="font-medium">Validation des notes</span>
                    <select className="p-1 border rounded">
                      <option value="admin">Administrateurs</option>
                      <option value="coordinator">Coordinateurs</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <span className="font-medium">Génération des bulletins</span>
                    <select className="p-1 border rounded">
                      <option value="admin">Administrateurs</option>
                      <option value="teacher">Enseignants</option>
                    </select>
                  </div>
                </div>
                <Button>
                  <Save className="w-4 h-4 mr-2" />
                  Sauvegarder
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="calculation" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Règles de Calcul</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium">Méthode de calcul des moyennes</label>
                    <select className="w-full mt-1 p-2 border rounded-md">
                      <option value="weighted">Moyenne pondérée</option>
                      <option value="arithmetic">Moyenne arithmétique</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Compensation autorisée</label>
                    <select className="w-full mt-1 p-2 border rounded-md">
                      <option value="yes">Oui</option>
                      <option value="no">Non</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Seuil de compensation</label>
                    <input type="number" className="w-full mt-1 p-2 border rounded-md" defaultValue="8" />
                  </div>
                </div>
                <Button>
                  <Save className="w-4 h-4 mr-2" />
                  Sauvegarder
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Utilisateurs Autorisés</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <span className="font-medium">Dr. Martin Dubois</span>
                      <p className="text-sm text-muted-foreground">Professeur de Mathématiques</p>
                    </div>
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">Actif</span>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <span className="font-medium">Prof. Sarah Laurent</span>
                      <p className="text-sm text-muted-foreground">Professeur de Physique</p>
                    </div>
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">Actif</span>
                  </div>
                </div>
                <Button variant="outline">
                  <Users className="w-4 h-4 mr-2" />
                  Ajouter un utilisateur
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ModuleLayout>
  );
}