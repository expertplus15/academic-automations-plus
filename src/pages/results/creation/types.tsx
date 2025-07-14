import React, { useState, useCallback } from 'react';
import { ArrowLeft, Plus, Edit, Trash2, Eye, Settings, FileText, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { DocumentTypeEditor } from '@/components/documents/types/DocumentTypeEditor';
import { EnhancedDocumentTypeManager } from '@/components/documents/enhanced/EnhancedDocumentTypeManager';
import type { DocumentType } from '@/hooks/useDocumentTypes';

export type { DocumentType };

type ViewMode = 'list' | 'create' | 'edit' | 'details';

export default function DocumentTypesCreation() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedType, setSelectedType] = useState<DocumentType | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

  const handleCreateType = useCallback(() => {
    setSelectedType(null);
    setViewMode('create');
  }, []);

  const handleEditType = useCallback((type: DocumentType) => {
    setSelectedType(type);
    setViewMode('edit');
  }, []);

  const handleViewDetails = useCallback((type: DocumentType) => {
    setSelectedType(type);
    setShowDetailsDialog(true);
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
      <div className="space-y-6 animate-fade-in">
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
        <div>
          <h1 className="text-2xl font-bold">Types de Documents</h1>
          <p className="text-muted-foreground">
            Gérez les types de documents et leurs configurations
          </p>
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

      {/* Enhanced Document Types Manager */}
      <EnhancedDocumentTypeManager 
        onEdit={handleEditType}
        onCreateNew={handleCreateType}
        onViewDetails={handleViewDetails}
      />

      {/* Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {selectedType?.name}
            </DialogTitle>
            <DialogDescription>
              Détails du type de document
            </DialogDescription>
          </DialogHeader>
          {selectedType && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Code</label>
                  <p className="text-sm text-muted-foreground">{selectedType.code}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Catégorie</label>
                  <Badge variant="outline">{selectedType.category}</Badge>
                </div>
              </div>
              
              {selectedType.description && (
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <p className="text-sm text-muted-foreground">{selectedType.description}</p>
                </div>
              )}
              
              <div>
                <label className="text-sm font-medium">Variables disponibles</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {selectedType.variables.map((variable) => (
                    <Badge key={variable} variant="secondary" className="text-xs">
                      {variable}
                    </Badge>
                  ))}
                </div>
              </div>
              
              {Object.keys(selectedType.validation_rules).length > 0 && (
                <div>
                  <label className="text-sm font-medium">Règles de validation</label>
                  <pre className="text-xs bg-muted p-2 rounded mt-1 overflow-auto">
                    {JSON.stringify(selectedType.validation_rules, null, 2)}
                  </pre>
                </div>
              )}
              
              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button variant="outline" onClick={() => setShowDetailsDialog(false)}>
                  Fermer
                </Button>
                <Button onClick={() => {
                  setShowDetailsDialog(false);
                  handleEditType(selectedType);
                }}>
                  <Edit className="h-4 w-4 mr-2" />
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