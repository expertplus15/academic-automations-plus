import { useState } from "react";
import { ModuleLayout } from "@/components/layouts/ModuleLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Award, Layout, Plus, BarChart3, Settings, FileDown, Eye, Download } from "lucide-react";
import { DocumentCard } from "@/components/documents/DocumentCard";
import { GenerationForm } from "@/components/documents/GenerationForm";
import { TemplateEditor } from "@/components/documents/TemplateEditor";
import { DocumentStats } from "@/components/documents/DocumentStats";

export default function Documents() {
  const [activeView, setActiveView] = useState<string>("dashboard");
  const [showGenerationForm, setShowGenerationForm] = useState(false);
  const [showTemplateEditor, setShowTemplateEditor] = useState(false);

  const renderMainContent = () => {
    if (activeView === "stats") {
      return <DocumentStats />;
    }
    
    if (showGenerationForm) {
      return (
        <GenerationForm
          type="bulletin"
          onGenerate={(config) => {
            console.log("Génération:", config);
            setShowGenerationForm(false);
          }}
          onCancel={() => setShowGenerationForm(false)}
        />
      );
    }
    
    if (showTemplateEditor) {
      return (
        <TemplateEditor
          onSave={(template) => {
            console.log("Template sauvé:", template);
            setShowTemplateEditor(false);
          }}
          onCancel={() => setShowTemplateEditor(false)}
        />
      );
    }

    return (
      <Tabs defaultValue="bulletins" className="space-y-6">
        <div className="flex items-center justify-between mb-6">
          <TabsList className="grid grid-cols-4 w-full max-w-2xl">
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
            <TabsTrigger value="generation" className="flex items-center gap-2">
              <FileDown className="w-4 h-4" />
              Génération
            </TabsTrigger>
          </TabsList>

          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => setActiveView(activeView === "stats" ? "dashboard" : "stats")}
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              {activeView === "stats" ? "Dashboard" : "Statistiques"}
            </Button>
            <Button onClick={() => setShowGenerationForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Nouveau Document
            </Button>
          </div>
        </div>

          <TabsContent value="bulletins" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Bulletins Personnalisables</h3>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Nouveau Bulletin
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <DocumentCard
                title="Bulletin Semestriel"
                description="Bulletin standard avec moyennes par matière"
                type="bulletin"
                status="ready"
                lastGenerated="12/12/2024"
                studentCount={156}
                onPreview={() => console.log("Aperçu bulletin semestriel")}
                onGenerate={() => setShowGenerationForm(true)}
                onEdit={() => setShowTemplateEditor(true)}
              />
              
              <DocumentCard
                title="Bulletin Complet"
                description="Bulletin détaillé avec toutes les évaluations"
                type="bulletin"
                status="ready"
                lastGenerated="10/12/2024"
                studentCount={156}
                onPreview={() => console.log("Aperçu bulletin complet")}
                onGenerate={() => setShowGenerationForm(true)}
                onEdit={() => setShowTemplateEditor(true)}
              />

              <DocumentCard
                title="Bulletin Express"
                description="Bulletin rapide pour évaluations urgentes"
                type="bulletin"
                status="draft"
                studentCount={45}
                onPreview={() => console.log("Aperçu bulletin express")}
                onGenerate={() => setShowGenerationForm(true)}
                onEdit={() => setShowTemplateEditor(true)}
              />
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <DocumentCard
                title="Relevé Officiel"
                description="Document officiel pour les démarches administratives"
                type="transcript"
                status="ready"
                lastGenerated="15/12/2024"
                studentCount={89}
                onPreview={() => console.log("Aperçu relevé officiel")}
                onGenerate={() => setShowGenerationForm(true)}
                onEdit={() => setShowTemplateEditor(true)}
              />
              
              <DocumentCard
                title="Relevé Provisoire"
                description="Document provisoire pour suivi pédagogique"
                type="transcript"
                status="ready"
                lastGenerated="18/12/2024"
                studentCount={234}
                onPreview={() => console.log("Aperçu relevé provisoire")}
                onGenerate={() => setShowGenerationForm(true)}
                onEdit={() => setShowTemplateEditor(true)}
              />

              <DocumentCard
                title="Relevé Européen"
                description="Relevé au format ECTS européen"
                type="transcript"
                status="draft"
                studentCount={67}
                onPreview={() => console.log("Aperçu relevé européen")}
                onGenerate={() => setShowGenerationForm(true)}
                onEdit={() => setShowTemplateEditor(true)}
              />
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
              <DocumentCard
                title="Template Standard"
                description="Modèle par défaut pour les bulletins"
                type="template"
                status="ready"
                onPreview={() => console.log("Aperçu template standard")}
                onGenerate={() => console.log("Utiliser template standard")}
                onEdit={() => setShowTemplateEditor(true)}
              />
              
              <DocumentCard
                title="Template Personnalisé"
                description="Modèle avec logo et mise en page custom"
                type="template"
                status="ready"
                onPreview={() => console.log("Aperçu template personnalisé")}
                onGenerate={() => console.log("Utiliser template personnalisé")}
                onEdit={() => setShowTemplateEditor(true)}
              />

              <DocumentCard
                title="Template Moderne"
                description="Design moderne avec graphiques intégrés"
                type="template"
                status="draft"
                onPreview={() => console.log("Aperçu template moderne")}
                onGenerate={() => console.log("Utiliser template moderne")}
                onEdit={() => setShowTemplateEditor(true)}
              />
            </div>
          </TabsContent>

          <TabsContent value="generation" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Génération de Documents</h3>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Génération Rapide</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground text-sm">
                    Générer rapidement des documents avec les paramètres par défaut
                  </p>
                  <div className="space-y-3">
                    <Button 
                      className="w-full" 
                      onClick={() => setShowGenerationForm(true)}
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Bulletin Standard
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => setShowGenerationForm(true)}
                    >
                      <Award className="w-4 h-4 mr-2" />
                      Relevé de Notes
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Génération Personnalisée</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground text-sm">
                    Configurer précisément les paramètres de génération
                  </p>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => setShowGenerationForm(true)}
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Configuration Avancée
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
    );
  };

  return (
    <ModuleLayout 
      title="Documents & Bulletins" 
      subtitle="Génération et gestion des bulletins, relevés et templates"
      showHeader={true}
    >
      <div className="p-6">
        {renderMainContent()}
      </div>
    </ModuleLayout>
  );
}