import { ModuleLayout } from "@/components/layouts/ModuleLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Layout, Edit, Copy, Trash2, Plus } from "lucide-react";

export default function Templates() {
  return (
    <ModuleLayout 
      title="Templates & Modèles" 
      subtitle="Gestionnaire de modèles personnalisables pour bulletins et relevés"
      showHeader={true}
    >
      <div className="p-6 space-y-6">
        {/* Header Actions */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Mes Modèles</h2>
            <p className="text-muted-foreground">Créez et gérez vos modèles de documents</p>
          </div>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Nouveau modèle
          </Button>
        </div>

        {/* Template Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layout className="w-5 h-5 text-blue-500" />
                Modèles de Bulletins
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Bulletin Standard EMD</p>
                    <p className="text-sm text-muted-foreground">Format officiel de l'école</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge>Actif</Badge>
                    <Button size="sm" variant="outline">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Bulletin Parents</p>
                    <p className="text-sm text-muted-foreground">Simplifié pour les familles</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">Brouillon</Badge>
                    <Button size="sm" variant="outline">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Bulletin Détaillé</p>
                    <p className="text-sm text-muted-foreground">Avec compétences détaillées</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">Test</Badge>
                    <Button size="sm" variant="outline">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layout className="w-5 h-5 text-emerald-500" />
                Modèles de Relevés
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Relevé Officiel LMD</p>
                    <p className="text-sm text-muted-foreground">Conforme aux standards européens</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge>Officiel</Badge>
                    <Button size="sm" variant="outline">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Attestation de Réussite</p>
                    <p className="text-sm text-muted-foreground">Certificat de validation</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge>Actif</Badge>
                    <Button size="sm" variant="outline">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Relevé Provisoire</p>
                    <p className="text-sm text-muted-foreground">Version temporaire</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">Brouillon</Badge>
                    <Button size="sm" variant="outline">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Template Editor Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Éditeur de Modèles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium">Éléments Disponibles</h4>
                <div className="space-y-2">
                  {[
                    "En-tête établissement",
                    "Informations étudiant",
                    "Tableau des notes",
                    "Moyennes et mentions",
                    "Signature et tampon",
                    "Graphiques de performance"
                  ].map((element, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded">
                      <span className="text-sm">{element}</span>
                      <Button size="sm" variant="outline">
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Actions</h4>
                <div className="space-y-2">
                  <Button className="w-full" variant="outline">
                    <Copy className="w-4 h-4 mr-2" />
                    Dupliquer un modèle
                  </Button>
                  <Button className="w-full" variant="outline">
                    <Layout className="w-4 h-4 mr-2" />
                    Prévisualiser
                  </Button>
                  <Button className="w-full" variant="outline">
                    <Edit className="w-4 h-4 mr-2" />
                    Éditeur avancé
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Template Statistics */}
        <Card>
          <CardHeader>
            <CardTitle>Statistiques d'Utilisation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">12</div>
                <p className="text-sm text-muted-foreground">Modèles actifs</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-600">3,247</div>
                <p className="text-sm text-muted-foreground">Documents générés</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-amber-600">2.3s</div>
                <p className="text-sm text-muted-foreground">Temps moyen</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-violet-600">98.5%</div>
                <p className="text-sm text-muted-foreground">Taux de succès</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ModuleLayout>
  );
}