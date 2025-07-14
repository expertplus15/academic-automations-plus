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
import { EnhancedTemplateManager } from '@/components/documents/templates/EnhancedTemplateManager';
import type { DocumentType } from './types';
import type { DocumentTemplate } from '@/hooks/useDocumentTemplatesEnhanced';

type ViewMode = 'list' | 'select-type' | 'create' | 'edit' | 'preview';

export default function DocumentTemplatesCreation() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedType, setSelectedType] = useState<DocumentType | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<DocumentTemplate | null>(null);
  const [showPreviewDialog, setShowPreviewDialog] = useState(false);

  const handleCreateTemplate = useCallback(() => {
    setSelectedTemplate(null);
    setViewMode('select-type');
  }, []);

  const handleTypeSelected = useCallback((type: DocumentType) => {
    setSelectedType(type);
    setViewMode('create');
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

  const handlePreviewTemplate = useCallback((template: DocumentTemplate) => {
    setSelectedTemplate(template);
    setShowPreviewDialog(true);
  }, []);

  const handleViewReturn = useCallback(() => {
    setViewMode('list');
    setSelectedType(null);
    setSelectedTemplate(null);
  }, []);

  const handleSaveSuccess = useCallback(() => {
    setViewMode('list');
    setSelectedType(null);
    setSelectedTemplate(null);
  }, []);

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Templates de Documents</h1>
          <p className="text-muted-foreground">
            Créez et gérez les templates pour chaque type de document
          </p>
        </div>
        <Button onClick={handleCreateTemplate}>
          <Plus className="h-4 w-4 mr-2" />
          Nouveau Template
        </Button>
      </div>

      {/* Description */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Étape 2: Création des Templates
          </CardTitle>
          <CardDescription>
            Créez des templates spécialisés basés sur les types de documents configurés.
            Utilisez les variables et règles définies dans l'étape précédente.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Settings className="h-4 w-4 text-blue-500" />
              <span>Variables contextuelles</span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-green-500" />
              <span>Éditeur spécialisé</span>
            </div>
            <div className="flex items-center gap-2">
              <Settings className="h-4 w-4 text-purple-500" />
              <span>Prévisualisation temps réel</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Templates Manager */}
      <EnhancedTemplateManager 
        onEdit={handleEditTemplate}
        onPreview={handlePreviewTemplate}
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
                  {Object.keys(selectedTemplate.variables).map((variable) => (
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
    </div>
  );
}