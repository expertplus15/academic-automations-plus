import React, { useState, useCallback } from 'react';
import { ArrowLeft, Plus, FileText, Settings, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { TypeSelector } from '@/components/documents/templates/TypeSelector';
import { TemplateEditor } from '@/components/documents/templates/TemplateEditor';
import { SectionBasedTemplateEditor } from '@/components/documents/templates/SectionBasedTemplateEditor';
import { SimpleTemplateCustomizer } from '@/components/documents/templates/SimpleTemplateCustomizer';
import { EnhancedTemplateManager } from '@/components/documents/templates/EnhancedTemplateManager';
import { TemplateChoiceSelector } from '@/components/documents/templates/TemplateChoiceSelector';
import { PredefinedTemplateSelector } from '@/components/documents/templates/PredefinedTemplateSelector';
import type { DocumentType } from './types';
import type { DocumentTemplate } from '@/hooks/useDocumentTemplatesEnhanced';

type ViewMode = 'choice' | 'predefined-selector' | 'manage-existing' | 'select-type' | 'create' | 'edit' | 'customize' | 'preview';

export default function DocumentTemplatesCreation() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<ViewMode>('choice');
  const [selectedType, setSelectedType] = useState<DocumentType | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<DocumentTemplate | null>(null);
  const [baseTemplate, setBaseTemplate] = useState<DocumentTemplate | null>(null);
  const [showPreviewDialog, setShowPreviewDialog] = useState(false);

  // Nouveau: gestion des choix simplifiés
  const handlePersonalizeModel = useCallback(() => {
    setViewMode('predefined-selector');
  }, []);

  const handleCreateFromScratch = useCallback(() => {
    setSelectedTemplate(null);
    setViewMode('select-type');
  }, []);

  const handleManageExisting = useCallback(() => {
    setViewMode('manage-existing');
  }, []);

  const handleCreateTemplate = useCallback(() => {
    setSelectedTemplate(null);
    setViewMode('select-type');
  }, []);

  const handleTypeSelected = useCallback((type: DocumentType) => {
    setSelectedType(type);
    setViewMode('create');
  }, []);

  // Gestion template prédéfini sélectionné
  const handleSelectPredefinedTemplate = useCallback((template: any) => {
    // Convertir le template prédéfini en DocumentType et DocumentTemplate
    const mockType: DocumentType = {
      id: template.id,
      name: template.category,
      code: template.id.toUpperCase(),
      color: 'blue',
      category: template.category,
      description: template.description,
      icon: 'FileText',
      variables: template.variables || [],
      validation_rules: {},
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    setSelectedType(mockType);
    setBaseTemplate(template); // Template de base pour personnalisation
    setSelectedTemplate(null);
    setViewMode('customize'); // Mode personnalisation simplifié
  }, []);

  const handleEditTemplate = useCallback((template: DocumentTemplate) => {
    setSelectedTemplate(template);
    if (template.document_type) {
      const fullType: DocumentType = {
        ...template.document_type,
        icon: 'FileText',
        variables: [],
        validation_rules: {},
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setSelectedType(fullType);
    }
    setViewMode('edit');
  }, []);

  const handlePreviewTemplate = useCallback((template: DocumentTemplate | any) => {
    setSelectedTemplate(template);
    setShowPreviewDialog(true);
  }, []);

  const handleViewReturn = useCallback(() => {
    setViewMode('choice');
    setSelectedType(null);
    setSelectedTemplate(null);
    setBaseTemplate(null);
  }, []);

  const handleSaveSuccess = useCallback(() => {
    setViewMode('choice');
    setSelectedType(null);
    setSelectedTemplate(null);
    setBaseTemplate(null);
  }, []);

  // Vue principale: choix entre personnaliser ou créer de zéro
  if (viewMode === 'choice') {
    return (
      <TemplateChoiceSelector
        onPersonalizeModel={handlePersonalizeModel}
        onCreateFromScratch={handleCreateFromScratch}
        onManageExisting={handleManageExisting}
      />
    );
  }

  // Vue sélecteur de templates prédéfinis
  if (viewMode === 'predefined-selector') {
    return (
      <PredefinedTemplateSelector
        onBack={handleViewReturn}
        onSelectTemplate={handleSelectPredefinedTemplate}
      />
    );
  }

  if (viewMode === 'select-type') {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={handleViewReturn}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Sélectionner un Type de Document</h1>
            <p className="text-muted-foreground">
              Choisissez le type de document pour lequel créer un template
            </p>
          </div>
        </div>

        <TypeSelector 
          onTypeSelected={handleTypeSelected}
          onCancel={handleViewReturn}
        />
      </div>
    );
  }

  if (viewMode === 'create' || viewMode === 'edit') {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={handleViewReturn}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">
              {viewMode === 'create' ? 'Créer un Template' : 'Modifier le Template'}
            </h1>
            <p className="text-muted-foreground">
              {viewMode === 'create' 
                ? `Nouveau template pour: ${selectedType?.name}`
                : `Modification du template: ${selectedTemplate?.name}`
              }
            </p>
          </div>
        </div>

        <SectionBasedTemplateEditor 
          documentType={selectedType}
          template={selectedTemplate}
          onSave={handleSaveSuccess}
          onCancel={handleViewReturn}
        />
      </div>
    );
  }

  // Vue de personnalisation simplifiée
  if (viewMode === 'customize') {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={handleViewReturn}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Personnaliser le Template</h1>
            <p className="text-muted-foreground">
              Personnalisation de: {baseTemplate?.name}
            </p>
          </div>
        </div>

        {baseTemplate && (
          <SimpleTemplateCustomizer 
            documentType={selectedType}
            baseTemplate={baseTemplate}
            onSave={handleSaveSuccess}
            onCancel={handleViewReturn}
          />
        )}
      </div>
    );
  }

  // Vue de gestion des templates existants (ancien comportement)
  if (viewMode === 'manage-existing') {
    return (
      <div className="space-y-6">
        {/* Header with back button */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={handleViewReturn}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">Gestion des Templates Existants</h1>
            <p className="text-muted-foreground">
              Consultez, modifiez et gérez vos templates existants
            </p>
          </div>
          <Button onClick={handleCreateTemplate}>
            <Plus className="h-4 w-4 mr-2" />
            Nouveau Template
          </Button>
        </div>

        {/* Enhanced Templates Manager */}
        <EnhancedTemplateManager 
          onEdit={handleEditTemplate}
          onPreview={handlePreviewTemplate}
        />
      </div>
    );
  }

  // Vue par défaut: retour à la sélection avec Dialog
  return (
    <>
      <TemplateChoiceSelector
        onPersonalizeModel={handlePersonalizeModel}
        onCreateFromScratch={handleCreateFromScratch}
        onManageExisting={handleManageExisting}
      />

      {/* Preview Dialog */}
      <Dialog open={showPreviewDialog} onOpenChange={setShowPreviewDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Aperçu: {selectedTemplate?.name}
            </DialogTitle>
            <DialogDescription>
              Prévisualisation du template
            </DialogDescription>
          </DialogHeader>
          {selectedTemplate && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Template</label>
                  <p className="text-sm text-muted-foreground">{selectedTemplate.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Type de document</label>
                  <Badge variant="outline">{selectedTemplate.document_type?.name}</Badge>
                </div>
              </div>
              
              {selectedTemplate.description && (
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <p className="text-sm text-muted-foreground">{selectedTemplate.description}</p>
                </div>
              )}
              
              <div>
                <label className="text-sm font-medium">Variables du template</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {selectedTemplate.variables && Object.keys(selectedTemplate.variables).map((variable) => (
                    <Badge key={variable} variant="secondary" className="text-xs">
                      {variable}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium">Contenu du template</label>
                <div className="bg-muted p-4 rounded-lg mt-1">
                  <pre className="text-xs overflow-auto whitespace-pre-wrap">
                    {JSON.stringify(selectedTemplate.content, null, 2)}
                  </pre>
                </div>
              </div>
              
              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button variant="outline" onClick={() => setShowPreviewDialog(false)}>
                  Fermer
                </Button>
                <Button onClick={() => {
                  setShowPreviewDialog(false);
                  handleEditTemplate(selectedTemplate);
                }}>
                  Modifier
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}