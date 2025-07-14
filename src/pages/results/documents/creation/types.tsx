import React, { useState, useCallback } from 'react';
import { ArrowLeft, Plus, Edit, Trash2, FileText, Settings, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DocumentTypeManager } from '@/components/documents/types/DocumentTypeManager';
import { DocumentTypeEditor } from '@/components/documents/types/DocumentTypeEditor';

export type DocumentType = {
  id: string;
  name: string;
  code: string;
  description?: string;
  icon: string;
  color: string;
  category: string;
  variables: string[];
  validation_rules: Record<string, any>;
  is_active: boolean;
  created_at: string;
};

type ViewMode = 'list' | 'create' | 'edit';

export default function DocumentTypesCreation() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedType, setSelectedType] = useState<DocumentType | null>(null);

  const handleBack = useCallback(() => {
    navigate('/results/documents');
  }, [navigate]);

  const handleCreateType = useCallback(() => {
    setSelectedType(null);
    setViewMode('create');
  }, []);

  const handleEditType = useCallback((type: DocumentType) => {
    setSelectedType(type);
    setViewMode('edit');
  }, []);

  const handleViewReturn = useCallback(() => {
    setViewMode('list');
    setSelectedType(null);
  }, []);

  const handleSaveSuccess = useCallback(() => {
    setViewMode('list');
    setSelectedType(null);
  }, []);

  if (viewMode === 'create' || viewMode === 'edit') {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={handleViewReturn}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">
              {viewMode === 'create' ? 'Créer un Type de Document' : 'Modifier le Type de Document'}
            </h1>
            <p className="text-muted-foreground">
              {viewMode === 'create' 
                ? 'Définissez un nouveau type de document avec ses variables et règles'
                : `Modification du type: ${selectedType?.name}`
              }
            </p>
          </div>
        </div>

        <DocumentTypeEditor 
          documentType={selectedType}
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
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Types de Documents</h1>
            <p className="text-muted-foreground">
              Gérez les types de documents et leurs configurations
            </p>
          </div>
        </div>
        <Button onClick={handleCreateType}>
          <Plus className="h-4 w-4 mr-2" />
          Nouveau Type
        </Button>
      </div>

      {/* Description */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Étape 1: Configuration des Types
          </CardTitle>
          <CardDescription>
            Définissez les types de documents disponibles avant de créer les templates.
            Chaque type inclut ses variables, règles de validation et workflow d'approbation.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-blue-500" />
              <span>Métadonnées du document</span>
            </div>
            <div className="flex items-center gap-2">
              <Settings className="h-4 w-4 text-green-500" />
              <span>Variables dynamiques</span>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-purple-500" />
              <span>Règles de validation</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Document Types Manager */}
      <DocumentTypeManager 
        onEdit={handleEditType}
        onCreateNew={handleCreateType}
      />
    </div>
  );
}