import { useState, useCallback, useMemo } from "react";
import { ModuleLayout } from "@/components/layouts/ModuleLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, Search, FileText, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DocumentCreationManager } from "@/components/documents/DocumentCreationManager";
import { TemplateEditor } from "@/components/documents/TemplateEditor";
import { DocumentPreview } from "@/components/documents/DocumentPreview";
import { StudentSelector } from "@/components/documents/StudentSelector";
import { DocumentConfiguration } from "@/components/documents/DocumentConfiguration";
import { useDocuments } from "@/hooks/useDocuments";
import { cn } from "@/lib/utils";

// Types pour améliorer la type safety
type WorkflowMode = 'list' | 'editor' | 'preview';

interface AppState {
  mode: WorkflowMode;
  selectedTemplate: string | null;
  searchQuery: string;
  previewData: any;
}

interface DocumentCreationState {
  showStudentSelector: boolean;
  showDocumentConfig: boolean;
  selectedDocumentType: string;
  selectedStudentIds: string[];
  selectedStudents: any[];
}

export default function DocumentsCreation() {
  const navigate = useNavigate();
  
  // État unifié pour simplifier la gestion
  const [state, setState] = useState<AppState>({
    mode: 'list',
    selectedTemplate: null,
    searchQuery: '',
    previewData: null
  });

  // État pour la création de documents
  const [documentState, setDocumentState] = useState<DocumentCreationState>({
    showStudentSelector: false,
    showDocumentConfig: false,
    selectedDocumentType: '',
    selectedStudentIds: [],
    selectedStudents: []
  });

  const { 
    templates, 
    loading, 
    previewDocument, 
    saveTemplate,
    getDocumentsByType
  } = useDocuments();

  // Optimisation : mémoriser les templates filtrés
  const filteredTemplates = useMemo(() => {
    if (!state.searchQuery) return templates;
    return templates.filter(template => 
      template.name.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
      template.description?.toLowerCase().includes(state.searchQuery.toLowerCase())
    );
  }, [templates, state.searchQuery]);

  // Callbacks optimisés avec useCallback
  const handleModeChange = useCallback((mode: WorkflowMode, data?: any) => {
    setState(prev => ({ 
      ...prev, 
      mode, 
      ...(data && { ...data })
    }));
  }, []);

  const handlePreview = useCallback(async (templateId: string, type: string) => {
    try {
      const preview = await previewDocument(templateId);
      setState(prev => ({
        ...prev,
        mode: 'preview',
        previewData: {
          title: `Aperçu ${type}`,
          type,
          ...preview
        }
      }));
    } catch (error) {
      console.error('Preview error:', error);
    }
  }, [previewDocument]);

  const handleTemplateSave = useCallback(async (template: any) => {
    try {
      await saveTemplate(template);
      handleModeChange('list');
    } catch (error) {
      console.error('Save error:', error);
    }
  }, [saveTemplate, handleModeChange]);

  const handleEdit = useCallback((templateId: string) => {
    handleModeChange('editor', { selectedTemplate: templateId });
  }, [handleModeChange]);

  const handleNewTemplate = useCallback(() => {
    handleModeChange('editor', { selectedTemplate: null });
  }, [handleModeChange]);

  const handleBackToList = useCallback(() => {
    handleModeChange('list');
  }, [handleModeChange]);

  // Handlers pour la création de documents
  const handleDocumentTypeClick = useCallback((documentType: string) => {
    setDocumentState(prev => ({
      ...prev,
      selectedDocumentType: documentType,
      showStudentSelector: true
    }));
  }, []);

  const handleStudentSelection = useCallback((studentIds: string[], students: any[]) => {
    setDocumentState(prev => ({
      ...prev,
      selectedStudentIds: studentIds,
      selectedStudents: students,
      showStudentSelector: false,
      showDocumentConfig: true
    }));
  }, []);

  const handleCloseDocumentCreation = useCallback(() => {
    setDocumentState({
      showStudentSelector: false,
      showDocumentConfig: false,
      selectedDocumentType: '',
      selectedStudentIds: [],
      selectedStudents: []
    });
  }, []);

  // Optimisation : fonction de téléchargement externalisée
  const handleDownload = useCallback(() => {
    const { previewData } = state;
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
  }, [state.previewData]);

  // Rendu conditionnel optimisé pour l'éditeur
  if (state.mode === 'editor') {
    return (
      <ModuleLayout 
        title="Éditeur de Templates" 
        subtitle="Créer et modifier les templates de documents"
        showHeader={true}
      >
        <div className="p-6 animate-fade-in">
          <div className="mb-6">
            <Button 
              variant="outline" 
              onClick={handleBackToList}
              className="mb-4 hover-scale"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour à la gestion
            </Button>
          </div>
          
          <TemplateEditor
            templateId={state.selectedTemplate || undefined}
            onSave={handleTemplateSave}
            onCancel={handleBackToList}
          />
        </div>
      </ModuleLayout>
    );
  }

  // Interface principale optimisée
  return (
    <ModuleLayout 
      title="Création" 
      subtitle="Créer des documents et gérer les templates"
      showHeader={true}
    >
      <div className="p-6 animate-fade-in">
        {/* Header avec navigation */}
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="outline" 
            onClick={() => navigate("/results")}
            className="w-fit hover-scale"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour aux modules
          </Button>
        </div>

        <Tabs defaultValue="documents" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="documents" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Création de Documents
            </TabsTrigger>
            <TabsTrigger value="templates" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Gestion des Templates
            </TabsTrigger>
          </TabsList>

          <TabsContent value="documents" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Types de documents disponibles */}
              <Card 
                className="hover-scale cursor-pointer transition-all hover:shadow-lg"
                onClick={() => handleDocumentTypeClick('bulletins')}
              >
                <CardContent className="p-6 text-center">
                  <FileText className="w-12 h-12 mx-auto mb-4 text-primary" />
                  <h3 className="font-semibold mb-2">Bulletins de Notes</h3>
                  <p className="text-sm text-muted-foreground">Générer les bulletins de notes semestriels</p>
                </CardContent>
              </Card>

              <Card 
                className="hover-scale cursor-pointer transition-all hover:shadow-lg"
                onClick={() => handleDocumentTypeClick('releves')}
              >
                <CardContent className="p-6 text-center">
                  <FileText className="w-12 h-12 mx-auto mb-4 text-primary" />
                  <h3 className="font-semibold mb-2">Relevés de Notes</h3>
                  <p className="text-sm text-muted-foreground">Créer des relevés détaillés</p>
                </CardContent>
              </Card>

              <Card 
                className="hover-scale cursor-pointer transition-all hover:shadow-lg"
                onClick={() => handleDocumentTypeClick('attestations')}
              >
                <CardContent className="p-6 text-center">
                  <FileText className="w-12 h-12 mx-auto mb-4 text-primary" />
                  <h3 className="font-semibold mb-2">Attestations</h3>
                  <p className="text-sm text-muted-foreground">Attestations diverses</p>
                </CardContent>
              </Card>

              <Card 
                className="hover-scale cursor-pointer transition-all hover:shadow-lg"
                onClick={() => handleDocumentTypeClick('certificats')}
              >
                <CardContent className="p-6 text-center">
                  <FileText className="w-12 h-12 mx-auto mb-4 text-primary" />
                  <h3 className="font-semibold mb-2">Certificats de Scolarité</h3>
                  <p className="text-sm text-muted-foreground">Certificats officiels de scolarité</p>
                </CardContent>
              </Card>

              <Card 
                className="hover-scale cursor-pointer transition-all hover:shadow-lg"
                onClick={() => handleDocumentTypeClick('reussite')}
              >
                <CardContent className="p-6 text-center">
                  <FileText className="w-12 h-12 mx-auto mb-4 text-primary" />
                  <h3 className="font-semibold mb-2">Attestations de Réussite</h3>
                  <p className="text-sm text-muted-foreground">Attestations de réussite aux examens</p>
                </CardContent>
              </Card>

              <Card 
                className="hover-scale cursor-pointer border-dashed border-2 transition-all hover:shadow-lg"
                onClick={() => handleDocumentTypeClick('autre')}
              >
                <CardContent className="p-6 text-center">
                  <Plus className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="font-semibold mb-2">Autre Document</h3>
                  <p className="text-sm text-muted-foreground">Créer un nouveau type de document</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="templates" className="space-y-6">
            {/* Header avec recherche et actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Rechercher un template..."
                    value={state.searchQuery}
                    onChange={(e) => setState(prev => ({ ...prev, searchQuery: e.target.value }))}
                    className="pl-10"
                  />
                </div>
              </div>

              <Button 
                onClick={handleNewTemplate}
                className="w-fit hover-scale"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nouveau Template
              </Button>
            </div>

            {/* Statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="hover-scale">
                <CardContent className="p-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{templates.length}</div>
                    <div className="text-sm text-muted-foreground">Templates disponibles</div>
                  </div>
                </CardContent>
              </Card>
              <Card className="hover-scale">
                <CardContent className="p-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-accent">{templates.filter(t => t.is_active).length}</div>
                    <div className="text-sm text-muted-foreground">Templates actifs</div>
                  </div>
                </CardContent>
              </Card>
              <Card className="hover-scale">
                <CardContent className="p-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-secondary">{filteredTemplates.length}</div>
                    <div className="text-sm text-muted-foreground">Résultats de recherche</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Gestionnaire de templates */}
            <DocumentCreationManager
              templates={filteredTemplates}
              loading={loading}
              getDocumentsByType={getDocumentsByType}
              onPreview={handlePreview}
              onGenerate={(templateId, type) => {
                console.log('Generate document:', templateId, type);
              }}
              onEdit={handleEdit}
              onNewTemplate={handleNewTemplate}
            />
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Aperçu optimisé */}
      <DocumentPreview
        isOpen={state.mode === 'preview'}
        onClose={handleBackToList}
        title={state.previewData?.title || "Aperçu"}
        type={state.previewData?.type}
        previewData={state.previewData}
        loading={loading}
        onDownload={handleDownload}
        onPrint={() => window.print()}
      />

      {/* Student Selector Dialog */}
      <StudentSelector
        isOpen={documentState.showStudentSelector}
        onClose={handleCloseDocumentCreation}
        onStudentSelect={handleStudentSelection}
        documentType={documentState.selectedDocumentType}
        allowMultiple={true}
      />

      {/* Document Configuration Dialog */}
      <DocumentConfiguration
        isOpen={documentState.showDocumentConfig}
        onClose={handleCloseDocumentCreation}
        documentType={documentState.selectedDocumentType}
        studentIds={documentState.selectedStudentIds}
        students={documentState.selectedStudents}
      />
    </ModuleLayout>
  );
}