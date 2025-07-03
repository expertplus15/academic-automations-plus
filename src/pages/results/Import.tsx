import { ModuleLayout } from "@/components/layouts/ModuleLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileSpreadsheet, Database, Download } from "lucide-react";

export default function Import() {
  return (
    <ModuleLayout 
      title="Import de Données" 
      subtitle="Importation automatisée de notes et données étudiantes"
      showHeader={true}
    >
      <div className="p-6 space-y-6">
        {/* Import Methods */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-emerald-500" />
                Import Excel/CSV
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Importez vos notes depuis des fichiers Excel ou CSV avec validation automatique.
              </p>
              <Button className="w-full">
                <Upload className="w-4 h-4 mr-2" />
                Importer un fichier
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5 text-blue-500" />
                Connexion API
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Connectez-vous à d'autres systèmes académiques pour synchroniser les données.
              </p>
              <Button variant="outline" className="w-full">
                Configurer API
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="w-5 h-5 text-amber-500" />
                Templates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Téléchargez les modèles standardisés pour faciliter l'import.
              </p>
              <Button variant="outline" className="w-full">
                Télécharger modèles
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Import History */}
        <Card>
          <CardHeader>
            <CardTitle>Historique des Imports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <Upload className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">Aucun import récent</h3>
              <p className="text-muted-foreground">
                Commencez par importer vos premières données.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </ModuleLayout>
  );
}