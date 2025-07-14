import { useState } from "react";
import { ModuleLayout } from "@/components/layouts/ModuleLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Award, Layout, Plus, BarChart3, Settings, FileDown, Eye, Download, Shield } from "lucide-react";
import { DocumentCard } from "@/components/documents/DocumentCard";
import { GenerationForm } from "@/components/documents/GenerationForm";
import { TemplateEditor } from "@/components/documents/TemplateEditor";
import { DocumentStats } from "@/components/documents/DocumentStats";
import { DocumentPreview } from "@/components/documents/DocumentPreview";
import { AttestationTab } from "@/components/documents/AttestationTab";
import { SimpleDocumentGeneratorComponent } from "@/components/documents/SimpleDocumentGenerator";
import { useDocuments } from "@/hooks/useDocuments";

export default function Documents() {
  const [activeView, setActiveView] = useState<string>("dashboard");
  const [showGenerationForm, setShowGenerationForm] = useState(false);
  const [showTemplateEditor, setShowTemplateEditor] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState<any>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [generationType, setGenerationType] = useState<"bulletin" | "transcript" | "certificate" | "attestation" | "batch">("bulletin");
  
  const { 
    templates, 
    loading, 
    generateDocument, 
    previewDocument, 
    saveTemplate,
    getDocumentsByType
  } = useDocuments();

  // Handle preview
  const handlePreview = async (templateId: string, type: string) => {
    try {
      const preview = await previewDocument(templateId);
      setPreviewData({
        title: `Aperçu ${type}`,
        type,
        ...preview
      });
      setShowPreview(true);
    } catch (error) {
      console.error('Preview error:', error);
    }
  };

  // Handle generation
  const handleGenerate = async (config: any) => {
    try {
      // Si student_id est "none", on passe undefined pour une génération générique
      const studentId = config.student_id === "none" ? undefined : config.student_id;
      await generateDocument(config.template, studentId, config);
      setShowGenerationForm(false);
    } catch (error) {
      console.error('Generation error:', error);
    }
  };

  // Handle template save
  const handleTemplateSave = async (template: any) => {
    try {
      await saveTemplate(template);
      setShowTemplateEditor(false);
    } catch (error) {
      console.error('Save error:', error);
    }
  };

  const renderMainContent = () => {
    if (activeView === "stats") {
      return <DocumentStats />;
    }
    
    if (showGenerationForm) {
      return (
        <GenerationForm
          type={generationType}
          templateId={selectedTemplate || undefined}
          onGenerate={handleGenerate}
          onCancel={() => setShowGenerationForm(false)}
        />
      );
    }
    
    if (showTemplateEditor) {
      return (
        <TemplateEditor
          templateId={selectedTemplate || undefined}
          onSave={handleTemplateSave}
          onCancel={() => setShowTemplateEditor(false)}
        />
      );
    }

    return (
      <Tabs defaultValue="bulletins" className="space-y-6">
        <div className="flex items-center justify-between mb-6">
          <TabsList className="grid grid-cols-5 w-full max-w-3xl">
            <TabsTrigger value="bulletins" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Bulletins
            </TabsTrigger>
            <TabsTrigger value="transcripts" className="flex items-center gap-2">
              <Award className="w-4 h-4" />
              Relevés
            </TabsTrigger>
            <TabsTrigger value="attestations" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Attestations
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
            <Button onClick={() => {
              setGenerationType("bulletin");
              setSelectedTemplate(null);
              setShowGenerationForm(true);
            }}>
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
              {getDocumentsByType('bulletin').map((template) => (
                <DocumentCard
                  key={template.id}
                  title={template.name}
                  description={template.description || "Bulletin personnalisable"}
                  type="bulletin"
                  status="ready"
                  templateId={template.id}
                  onPreview={() => handlePreview(template.id, 'bulletin')}
                  onGenerate={() => {
                    setGenerationType("bulletin");
                    setSelectedTemplate(template.id);
                    setShowGenerationForm(true);
                  }}
                  onEdit={() => {
                    setSelectedTemplate(template.id);
                    setShowTemplateEditor(true);
                  }}
                />
              ))}
              
              {getDocumentsByType('bulletin').length === 0 && (
                <div className="col-span-full text-center py-8 text-muted-foreground">
                  Aucun template de bulletin disponible
                </div>
              )}
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
              {getDocumentsByType('transcript').map((template) => (
                <DocumentCard
                  key={template.id}
                  title={template.name}
                  description={template.description || "Relevé de notes personnalisable"}
                  type="transcript"
                  status="ready"
                  templateId={template.id}
                  onPreview={() => handlePreview(template.id, 'transcript')}
                  onGenerate={() => {
                    setGenerationType("transcript");
                    setSelectedTemplate(template.id);
                    setShowGenerationForm(true);
                  }}
                  onEdit={() => {
                    setSelectedTemplate(template.id);
                    setShowTemplateEditor(true);
                  }}
                />
              ))}
              
              {getDocumentsByType('transcript').length === 0 && (
                <div className="col-span-full text-center py-8 text-muted-foreground">
                  Aucun template de relevé disponible
                </div>
              )}
            </div>
          </TabsContent>

          <AttestationTab
            templates={templates}
            onPreview={handlePreview}
            onGenerate={(templateId, type) => {
              setGenerationType(type as any);
              setSelectedTemplate(templateId);
              setShowGenerationForm(true);
            }}
            onEdit={(templateId) => {
              setSelectedTemplate(templateId);
              setShowTemplateEditor(true);
            }}
          />

          <TabsContent value="templates" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Templates & Modèles</h3>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Nouveau Template
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map((template) => (
                <DocumentCard
                  key={template.id}
                  title={template.name}
                  description={template.description || "Template personnalisable"}
                  type="template"
                  status={template.is_active ? "ready" : "draft"}
                  templateId={template.id}
                  onPreview={() => handlePreview(template.id, 'template')}
                  onGenerate={() => {
                    setSelectedTemplate(template.id);
                    setShowGenerationForm(true);
                  }}
                  onEdit={() => {
                    setSelectedTemplate(template.id);
                    setShowTemplateEditor(true);
                  }}
                />
              ))}
              
              {templates.length === 0 && (
                <div className="col-span-full text-center py-8 text-muted-foreground">
                  Aucun template disponible
                </div>
              )}
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
                      onClick={() => {
                        setGenerationType("bulletin");
                        setShowGenerationForm(true);
                      }}
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Bulletin Standard
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => {
                        setGenerationType("transcript");
                        setShowGenerationForm(true);
                      }}
                    >
                      <Award className="w-4 h-4 mr-2" />
                      Relevé de Notes
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => {
                        setGenerationType("attestation");
                        setShowGenerationForm(true);
                      }}
                    >
                      <Shield className="w-4 h-4 mr-2" />
                      Attestation
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
                    onClick={() => {
                      setGenerationType("batch");
                      setShowGenerationForm(true);
                    }}
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
      subtitle="Génération et gestion des bulletins, relevés et attestations"
      showHeader={true}
    >
      <div className="p-6">
        {renderMainContent()}
      </div>
      
      <DocumentPreview
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        title={previewData?.title || "Aperçu"}
        type={previewData?.type}
        previewData={previewData}
        loading={loading}
        onDownload={() => {
          if (previewData?.pdf_url) {
            // Télécharger le PDF
            const link = document.createElement('a');
            link.href = previewData.pdf_url;
            link.download = `${previewData.title || 'document'}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          } else if (previewData?.html) {
            // Convertir le HTML en PDF et télécharger
            const printWindow = window.open('', '_blank');
            if (printWindow) {
              printWindow.document.write(`
                <html>
                  <head>
                    <title>${previewData.title || 'Document'}</title>
                    <style>
                      body { font-family: Arial, sans-serif; margin: 40px; }
                      .document-header { text-align: center; margin-bottom: 30px; }
                      .document-body { margin: 20px 0; }
                      .document-footer { margin-top: 30px; text-align: center; }
                    </style>
                  </head>
                  <body>
                    ${previewData.html}
                    <script>
                      window.onload = function() {
                        window.print();
                        window.close();
                      }
                    </script>
                  </body>
                </html>
              `);
              printWindow.document.close();
            }
          }
        }}
        onPrint={() => window.print()}
      />
    </ModuleLayout>
  );
}