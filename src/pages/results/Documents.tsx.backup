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
import { DatabaseDocumentGenerator } from "@/components/DatabaseDocumentGenerator";
import { DocumentCreationManager } from "@/components/documents/DocumentCreationManager";
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
      <Tabs defaultValue="generation" className="space-y-6">
        <div className="flex items-center justify-between mb-6">
          <TabsList className="grid grid-cols-2 w-full max-w-2xl">
            <TabsTrigger value="generation" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Génération de Documents
            </TabsTrigger>
            <TabsTrigger value="creation" className="flex items-center gap-2">
              <Layout className="w-4 h-4" />
              Création de Documents
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

          <TabsContent value="generation" className="space-y-6">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold">Génération de Documents</h2>
                <p className="text-muted-foreground">
                  Interface simplifiée pour générer rapidement vos documents
                </p>
              </div>
              <DatabaseDocumentGenerator />
            </div>
          </TabsContent>

          <TabsContent value="creation" className="space-y-6">
            <DocumentCreationManager
              templates={templates}
              loading={loading}
              getDocumentsByType={getDocumentsByType}
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
              onNewTemplate={(type) => {
                setSelectedTemplate(null);
                setShowTemplateEditor(true);
              }}
            />
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