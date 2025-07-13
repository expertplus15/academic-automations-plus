import { ModuleLayout } from "@/components/layouts/ModuleLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Award, Layout, Download, Eye, Plus } from "lucide-react";

export default function Documents() {
  return (
    <ModuleLayout 
      title="Documents & Bulletins" 
      subtitle="Génération et gestion des bulletins, relevés et templates"
      showHeader={true}
    >
      <div className="p-6">
        <Tabs defaultValue="bulletins" className="space-y-6">
          <TabsList className="grid grid-cols-3 w-full max-w-lg">
            <TabsTrigger value="bulletins" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Bulletins
            </TabsTrigger>
            <TabsTrigger value="transcripts" className="flex items-center gap-2">
              <Award className="w-4 h-4" />
              Relevés
            </TabsTrigger>
            <TabsTrigger value="templates" className="flex items-center gap-2">
              <Layout className="w-4 h-4" />
              Templates
            </TabsTrigger>
          </TabsList>

          <TabsContent value="bulletins" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Bulletins Personnalisables</h3>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Nouveau Bulletin
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Bulletin Semestriel</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground text-sm">
                    Bulletin standard avec moyennes par matière
                  </p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Eye className="w-4 h-4 mr-1" />
                      Aperçu
                    </Button>
                    <Button size="sm">
                      <Download className="w-4 h-4 mr-1" />
                      Générer
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Bulletin Complet</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground text-sm">
                    Bulletin détaillé avec toutes les évaluations
                  </p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Eye className="w-4 h-4 mr-1" />
                      Aperçu
                    </Button>
                    <Button size="sm">
                      <Download className="w-4 h-4 mr-1" />
                      Générer
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="transcripts" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Relevés de Notes</h3>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Nouveau Relevé
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Relevé Officiel</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground text-sm">
                    Document officiel pour les démarches administratives
                  </p>
                  <Button className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Générer
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Relevé Provisoire</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground text-sm">
                    Document provisoire pour suivi pédagogique
                  </p>
                  <Button className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Générer
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="templates" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Templates & Modèles</h3>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Nouveau Template
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Template Standard</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground text-sm">
                    Modèle par défaut pour les bulletins
                  </p>
                  <Button size="sm" variant="outline" className="w-full">
                    Modifier
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Template Personnalisé</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground text-sm">
                    Modèle avec logo et mise en page custom
                  </p>
                  <Button size="sm" variant="outline" className="w-full">
                    Modifier
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </ModuleLayout>
  );
}