import React, { useState, useCallback } from 'react';
import { ArrowLeft, Plus, FileText, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TypeSelector } from '@/components/documents/templates/TypeSelector';
import { TemplateEditor } from '@/components/documents/templates/TemplateEditor';
import { TemplateManager } from '@/components/documents/templates/TemplateManager';
import type { DocumentType } from './types';

type ViewMode = 'list' | 'select-type' | 'create' | 'edit';

export interface DocumentTemplate {
  id: string;
  name: string;
  document_type_id: string;
  description?: string;
  content: any;
  variables: Record<string, any>;
  preview_url?: string;
  is_active: boolean;
  is_default: boolean;
  version: number;
  created_at: string;
  updated_at: string;
  document_type?: DocumentType;
}

export default function DocumentTemplatesCreation() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedType, setSelectedType] = useState<DocumentType | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<DocumentTemplate | null>(null);


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
    setSelectedType(template.document_type || null);
    setViewMode('edit');
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
      <div className="space-y-6">
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
      <div className="space-y-6">
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

        <TemplateEditor 
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

      {/* Templates Manager */}
      <TemplateManager 
        onEdit={handleEditTemplate}
        onCreateNew={handleCreateTemplate}
      />
    </div>
  );
}