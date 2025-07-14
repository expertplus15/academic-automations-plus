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
            {/* En-tête avec statistiques rapides */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
                <CardContent className="p-4 text-center">
                  <FileText className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <div className="text-2xl font-bold text-primary">6</div>
                  <div className="text-sm text-muted-foreground">Types de documents</div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-r from-accent/10 to-accent/5 border-accent/20">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-accent">256</div>
                  <div className="text-sm text-muted-foreground">Documents générés</div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-r from-secondary/10 to-secondary/5 border-secondary/20">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-secondary">{templates.length}</div>
                  <div className="text-sm text-muted-foreground">Templates disponibles</div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-r from-destructive/10 to-destructive/5 border-destructive/20">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-destructive">24h</div>
                  <div className="text-sm text-muted-foreground">Dernière génération</div>
                </CardContent>
              </Card>
            </div>

            {/* Types de documents disponibles avec design amélioré */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card 
                className="group hover-scale cursor-pointer transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 border-2 hover:border-primary/30 bg-gradient-to-br from-primary/5 to-transparent"
                onClick={() => handleDocumentTypeClick('bulletins')}
              >
                <CardContent className="p-6 text-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative z-10">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <FileText className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2 text-lg group-hover:text-primary transition-colors">Bulletins de Notes</h3>
                    <p className="text-sm text-muted-foreground">Générer les bulletins de notes semestriels avec moyennes et appréciations</p>
                    <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                      <span className="px-2 py-1 bg-primary/10 rounded-full">PDF</span>
                      <span className="px-2 py-1 bg-accent/10 rounded-full">Personnalisable</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card 
                className="group hover-scale cursor-pointer transition-all duration-300 hover:shadow-xl hover:shadow-accent/10 border-2 hover:border-accent/30 bg-gradient-to-br from-accent/5 to-transparent"
                onClick={() => handleDocumentTypeClick('releves')}
              >
                <CardContent className="p-6 text-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative z-10">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                      <FileText className="w-8 h-8 text-accent" />
                    </div>
                    <h3 className="font-semibold mb-2 text-lg group-hover:text-accent transition-colors">Relevés de Notes</h3>
                    <p className="text-sm text-muted-foreground">Créer des relevés détaillés avec historique complet des notes</p>
                    <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                      <span className="px-2 py-1 bg-accent/10 rounded-full">PDF</span>
                      <span className="px-2 py-1 bg-secondary/10 rounded-full">Officiel</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card 
                className="group hover-scale cursor-pointer transition-all duration-300 hover:shadow-xl hover:shadow-secondary/10 border-2 hover:border-secondary/30 bg-gradient-to-br from-secondary/5 to-transparent"
                onClick={() => handleDocumentTypeClick('attestations')}
              >
                <CardContent className="p-6 text-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative z-10">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-secondary/10 flex items-center justify-center group-hover:bg-secondary/20 transition-colors">
                      <FileText className="w-8 h-8 text-secondary" />
                    </div>
                    <h3 className="font-semibold mb-2 text-lg group-hover:text-secondary transition-colors">Attestations</h3>
                    <p className="text-sm text-muted-foreground">Attestations diverses pour démarches administratives</p>
                    <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                      <span className="px-2 py-1 bg-secondary/10 rounded-full">PDF</span>
                      <span className="px-2 py-1 bg-primary/10 rounded-full">Rapide</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card 
                className="group hover-scale cursor-pointer transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/10 border-2 hover:border-emerald-500/30 bg-gradient-to-br from-emerald-50 to-transparent"
                onClick={() => handleDocumentTypeClick('certificats')}
              >
                <CardContent className="p-6 text-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative z-10">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-100 flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
                      <FileText className="w-8 h-8 text-emerald-600" />
                    </div>
                    <h3 className="font-semibold mb-2 text-lg group-hover:text-emerald-600 transition-colors">Certificats de Scolarité</h3>
                    <p className="text-sm text-muted-foreground">Certificats officiels de scolarité avec cachet établissement</p>
                    <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                      <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full">PDF</span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full">Officiel</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card 
                className="group hover-scale cursor-pointer transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10 border-2 hover:border-purple-500/30 bg-gradient-to-br from-purple-50 to-transparent"
                onClick={() => handleDocumentTypeClick('reussite')}
              >
                <CardContent className="p-6 text-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative z-10">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-100 flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                      <FileText className="w-8 h-8 text-purple-600" />
                    </div>
                    <h3 className="font-semibold mb-2 text-lg group-hover:text-purple-600 transition-colors">Attestations de Réussite</h3>
                    <p className="text-sm text-muted-foreground">Attestations de réussite aux examens et certifications</p>
                    <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full">PDF</span>
                      <span className="px-2 py-1 bg-gold-100 text-gold-700 rounded-full">Diplôme</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card 
                className="group hover-scale cursor-pointer border-dashed border-2 transition-all duration-300 hover:shadow-xl hover:shadow-muted/20 hover:border-muted-foreground/50 bg-gradient-to-br from-muted/5 to-transparent"
                onClick={() => handleDocumentTypeClick('autre')}
              >
                <CardContent className="p-6 text-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-muted/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative z-10">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted/10 flex items-center justify-center group-hover:bg-muted/20 transition-colors border-2 border-dashed border-muted-foreground/30">
                      <Plus className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="font-semibold mb-2 text-lg group-hover:text-muted-foreground transition-colors">Autre Document</h3>
                    <p className="text-sm text-muted-foreground">Créer un nouveau type de document personnalisé</p>
                    <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                      <span className="px-2 py-1 bg-muted/10 rounded-full">Personnalisé</span>
                      <span className="px-2 py-1 bg-muted/10 rounded-full">Flexible</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Actions rapides */}
            <Card className="mt-8 bg-gradient-to-r from-primary/5 via-transparent to-accent/5">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Actions Rapides
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button 
                    variant="outline" 
                    className="h-auto p-4 justify-start"
                    onClick={() => handleDocumentTypeClick('bulletins')}
                  >
                    <div className="text-left">
                      <div className="font-medium">Bulletins en lot</div>
                      <div className="text-sm text-muted-foreground">Générer pour une classe entière</div>
                    </div>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-auto p-4 justify-start"
                    onClick={() => setDocumentState(prev => ({ ...prev, showStudentSelector: true, selectedDocumentType: 'express' }))}
                  >
                    <div className="text-left">
                      <div className="font-medium">Mode Express</div>
                      <div className="text-sm text-muted-foreground">Génération rapide sans configuration</div>
                    </div>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-auto p-4 justify-start"
                    onClick={() => handleModeChange('preview', { selectedTemplate: templates[0]?.id })}
                  >
                    <div className="text-left">
                      <div className="font-medium">Aperçu Template</div>
                      <div className="text-sm text-muted-foreground">Prévisualiser un template existant</div>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>
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