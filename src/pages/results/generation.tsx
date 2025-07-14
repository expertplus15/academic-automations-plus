import { useState } from "react";
import { ModuleLayout } from "@/components/layouts/ModuleLayout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, FileText, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { DatabaseDocumentGenerator } from "@/components/DatabaseDocumentGenerator";
import { GenerationForm } from "@/components/documents/GenerationForm";
import { DocumentStats } from "@/components/documents/DocumentStats";
import { useDocuments } from "@/hooks/useDocuments";

export default function DocumentsGeneration() {
  const navigate = useNavigate();
  const [showIndividualForm, setShowIndividualForm] = useState(false);
  const [generationType, setGenerationType] = useState<"bulletin" | "transcript" | "certificate" | "attestation" | "batch">("bulletin");
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const { generateDocument } = useDocuments();

  // Handle individual generation
  const handleIndividualGenerate = async (config: any) => {
    try {
      const studentId = config.student_id === "none" ? undefined : config.student_id;
      await generateDocument(config.template, studentId, config);
      setShowIndividualForm(false);
    } catch (error) {
      console.error('Generation error:', error);
    }
  };

  if (showIndividualForm) {
    return (
      <ModuleLayout 
        title="Génération Individuelle" 
        subtitle="Générer un document pour un étudiant spécifique"
        showHeader={true}
      >
        <div className="p-6">
          <div className="mb-6">
            <Button 
              variant="outline" 
              onClick={() => setShowIndividualForm(false)}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour à la génération
            </Button>
          </div>
          
          <GenerationForm
            type={generationType}
            templateId={selectedTemplate || undefined}
            onGenerate={handleIndividualGenerate}
            onCancel={() => setShowIndividualForm(false)}
          />
        </div>
      </ModuleLayout>
    );
  }

  return (
    <ModuleLayout 
      title="Génération de Documents" 
      subtitle="Générer des documents individuels ou en masse"
      showHeader={true}
    >
      <div className="p-6">
        <div className="mb-6">
          <Button 
            variant="outline" 
            onClick={() => navigate("/results/documents")}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour aux modules
          </Button>
        </div>

        <Tabs defaultValue="simplified" className="space-y-6">
          <TabsList className="grid grid-cols-3 w-full max-w-2xl">
            <TabsTrigger value="simplified" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Génération Simplifiée
            </TabsTrigger>
            <TabsTrigger value="individual" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Génération Individuelle
            </TabsTrigger>
            <TabsTrigger value="bulk" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Génération en Masse
            </TabsTrigger>
          </TabsList>

          <TabsContent value="simplified" className="space-y-6">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold">Génération Simplifiée</h2>
                <p className="text-muted-foreground">
                  Interface simplifiée pour générer rapidement vos documents
                </p>
              </div>
              <DatabaseDocumentGenerator />
            </div>
          </TabsContent>

          <TabsContent value="individual" className="space-y-6">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold">Génération Individuelle</h2>
                <p className="text-muted-foreground">
                  Générer un document spécifique pour un étudiant avec des options avancées
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Button 
                  onClick={() => {
                    setGenerationType("bulletin");
                    setSelectedTemplate(null);
                    setShowIndividualForm(true);
                  }}
                  size="lg"
                  className="h-auto p-6 flex flex-col items-center gap-2"
                >
                  <FileText className="h-8 w-8" />
                  <span>Bulletin</span>
                </Button>
                
                <Button 
                  onClick={() => {
                    setGenerationType("transcript");
                    setSelectedTemplate(null);
                    setShowIndividualForm(true);
                  }}
                  size="lg"
                  variant="outline"
                  className="h-auto p-6 flex flex-col items-center gap-2"
                >
                  <FileText className="h-8 w-8" />
                  <span>Relevé</span>
                </Button>
                
                <Button 
                  onClick={() => {
                    setGenerationType("certificate");
                    setSelectedTemplate(null);
                    setShowIndividualForm(true);
                  }}
                  size="lg"
                  variant="outline"
                  className="h-auto p-6 flex flex-col items-center gap-2"
                >
                  <FileText className="h-8 w-8" />
                  <span>Certificat</span>
                </Button>
                
                <Button 
                  onClick={() => {
                    setGenerationType("attestation");
                    setSelectedTemplate(null);
                    setShowIndividualForm(true);
                  }}
                  size="lg"
                  variant="outline"
                  className="h-auto p-6 flex flex-col items-center gap-2"
                >
                  <FileText className="h-8 w-8" />
                  <span>Attestation</span>
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="bulk" className="space-y-6">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold">Génération en Masse</h2>
                <p className="text-muted-foreground">
                  Générer des documents pour plusieurs étudiants simultanément
                </p>
              </div>
              
              <div className="bg-muted/50 rounded-lg p-8 text-center">
                <Users className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">Génération en Masse</h3>
                <p className="text-muted-foreground mb-4">
                  Cette fonctionnalité sera bientôt disponible pour traiter de gros volumes de documents
                </p>
                <Button variant="outline" disabled>
                  Bientôt disponible
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Statistics Section */}
        <div className="mt-8">
          <DocumentStats />
        </div>
      </div>
    </ModuleLayout>
  );
}