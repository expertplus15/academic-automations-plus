import { useState } from "react";
import { ModuleLayout } from "@/components/layouts/ModuleLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { DocumentCreationManager } from "@/components/documents/DocumentCreationManager";
import { TemplateEditor } from "@/components/documents/TemplateEditor";
import { DocumentPreview } from "@/components/documents/DocumentPreview";
import { useDocuments } from "@/hooks/useDocuments";

export default function DocumentsCreation() {
  const navigate = useNavigate();
  const [showTemplateEditor, setShowTemplateEditor] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [previewData, setPreviewData] = useState<any>(null);

  const { 
    templates, 
    loading, 
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

  // Handle template save
  const handleTemplateSave = async (template: any) => {
    try {
      await saveTemplate(template);
      setShowTemplateEditor(false);
    } catch (error) {
      console.error('Save error:', error);
    }
  };

  if (showTemplateEditor) {
    return (
      <ModuleLayout 
        title="Éditeur de Templates" 
        subtitle="Créer et modifier les templates de documents"
        showHeader={true}
      >
        <div className="p-6">
          <div className="mb-6">
            <Button 
              variant="outline" 
              onClick={() => setShowTemplateEditor(false)}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour à la gestion
            </Button>
          </div>
          
          <TemplateEditor
            templateId={selectedTemplate || undefined}
            onSave={handleTemplateSave}
            onCancel={() => setShowTemplateEditor(false)}
          />
        </div>
      </ModuleLayout>
    );
  }

  return (
    <ModuleLayout 
      title="Création de Documents et Templates" 
      subtitle="Gérer les templates et créer de nouveaux documents"
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

        <DocumentCreationManager
          templates={templates}
          loading={loading}
          getDocumentsByType={getDocumentsByType}
          onPreview={handlePreview}
          onGenerate={(templateId, type) => {
            console.log('Generate document:', templateId, type);
          }}
          onEdit={(templateId) => {
            setSelectedTemplate(templateId);
            setShowTemplateEditor(true);
          }}
          onNewTemplate={() => {
            setSelectedTemplate(null);
            setShowTemplateEditor(true);
          }}
        />
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
            const link = document.createElement('a');
            link.href = previewData.pdf_url;
            link.download = `${previewData.title || 'document'}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          } else if (previewData?.html) {
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