import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Save, 
  RefreshCw, 
  Eye, 
  EyeOff, 
  Code,
  Settings,
  Palette
} from 'lucide-react';
import { DocumentTemplate } from '@/hooks/useDocumentTemplates';
import { UniversalTemplatePreview } from './UniversalTemplatePreview';
import { MockDataService } from '@/services/MockDataService';

interface InteractiveTemplateEditorProps {
  template: DocumentTemplate;
  onSave?: (updatedTemplate: DocumentTemplate) => void;
  onCancel?: () => void;
}

export function InteractiveTemplateEditor({ 
  template, 
  onSave, 
  onCancel 
}: InteractiveTemplateEditorProps) {
  const [editedTemplate, setEditedTemplate] = useState<DocumentTemplate>(template);
  const [previewMode, setPreviewMode] = useState<'split' | 'preview' | 'editor'>('split');
  const [hasChanges, setHasChanges] = useState(false);
  const [previewData, setPreviewData] = useState<any>({});

  useEffect(() => {
    // Charger les données de prévisualisation
    const mockData = MockDataService.getTemplatePreviewData(template.template_type);
    setPreviewData(mockData);
  }, [template.template_type]);

  useEffect(() => {
    // Détecter les changements
    const hasChanged = JSON.stringify(editedTemplate) !== JSON.stringify(template);
    setHasChanges(hasChanged);
  }, [editedTemplate, template]);

  const handleFieldChange = (field: keyof DocumentTemplate, value: any) => {
    setEditedTemplate(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    onSave?.(editedTemplate);
  };

  const handleReset = () => {
    setEditedTemplate(template);
  };

  const renderEditor = () => (
    <div className="space-y-6">
      {/* Informations de base */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Informations générales
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom du template *</Label>
              <Input
                id="name"
                value={editedTemplate.name}
                onChange={(e) => handleFieldChange('name', e.target.value)}
                placeholder="Nom du template"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="code">Code *</Label>
              <Input
                id="code"
                value={editedTemplate.code}
                onChange={(e) => handleFieldChange('code', e.target.value)}
                placeholder="CODE_TEMPLATE"
                className="font-mono"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={editedTemplate.description || ''}
              onChange={(e) => handleFieldChange('description', e.target.value)}
              placeholder="Description du template..."
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="template_type">Type de template</Label>
            <Select 
              value={editedTemplate.template_type} 
              onValueChange={(value) => handleFieldChange('template_type', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="emd_releve">Relevé de Notes EMD</SelectItem>
                <SelectItem value="bulletin">Bulletin</SelectItem>
                <SelectItem value="attestation">Attestation</SelectItem>
                <SelectItem value="diplome">Diplôme</SelectItem>
                <SelectItem value="certificat">Certificat</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5" />
            Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={editedTemplate.is_active}
                onChange={(e) => handleFieldChange('is_active', e.target.checked)}
                className="rounded"
              />
              <span className="text-sm">Template actif</span>
            </label>
            
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={editedTemplate.requires_approval}
                onChange={(e) => handleFieldChange('requires_approval', e.target.checked)}
                className="rounded"
              />
              <span className="text-sm">Nécessite une approbation</span>
            </label>
            
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={editedTemplate.auto_generate}
                onChange={(e) => handleFieldChange('auto_generate', e.target.checked)}
                className="rounded"
              />
              <span className="text-sm">Génération automatique</span>
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Contenu du template */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="w-5 h-5" />
            Contenu et Variables
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Contenu du template (JSON)</Label>
            <Textarea
              value={JSON.stringify(editedTemplate.template_content, null, 2)}
              onChange={(e) => {
                try {
                  const parsed = JSON.parse(e.target.value);
                  handleFieldChange('template_content', parsed);
                } catch (error) {
                  // Erreur de parsing, on garde l'ancien contenu
                }
              }}
              placeholder="Contenu JSON du template..."
              rows={8}
              className="font-mono text-sm"
            />
          </div>
          
          <div className="space-y-2">
            <Label>Variables (JSON)</Label>
            <Textarea
              value={JSON.stringify(editedTemplate.variables, null, 2)}
              onChange={(e) => {
                try {
                  const parsed = JSON.parse(e.target.value);
                  handleFieldChange('variables', parsed);
                } catch (error) {
                  // Erreur de parsing, on garde l'ancien contenu
                }
              }}
              placeholder="Variables du template..."
              rows={6}
              className="font-mono text-sm"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderPreview = () => (
    <UniversalTemplatePreview
      template={editedTemplate}
      studentData={previewData}
      onDataChange={setPreviewData}
    />
  );

  return (
    <div className="space-y-4">
      {/* Barre d'outils */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold">Édition du Template</h2>
              {hasChanges && (
                <Badge variant="secondary">Modifications non sauvegardées</Badge>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              {/* Sélecteur de mode d'affichage */}
              <div className="flex border rounded-md">
                <Button
                  variant={previewMode === 'editor' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setPreviewMode('editor')}
                  className="rounded-r-none"
                >
                  <Code className="w-4 h-4" />
                </Button>
                <Button
                  variant={previewMode === 'split' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setPreviewMode('split')}
                  className="rounded-none"
                >
                  <Settings className="w-4 h-4" />
                </Button>
                <Button
                  variant={previewMode === 'preview' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setPreviewMode('preview')}
                  className="rounded-l-none"
                >
                  <Eye className="w-4 h-4" />
                </Button>
              </div>
              
              <Separator orientation="vertical" className="h-6" />
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                disabled={!hasChanges}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Réinitialiser
              </Button>
              
              <Button variant="outline" size="sm" onClick={onCancel}>
                Annuler
              </Button>
              
              <Button 
                size="sm" 
                onClick={handleSave}
                disabled={!hasChanges}
              >
                <Save className="w-4 h-4 mr-2" />
                Sauvegarder
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contenu principal */}
      <div className="min-h-[600px]">
        {previewMode === 'editor' && renderEditor()}
        {previewMode === 'preview' && renderPreview()}
        {previewMode === 'split' && (
          <div className="grid grid-cols-2 gap-4 h-full">
            <div className="overflow-y-auto">
              {renderEditor()}
            </div>
            <div className="overflow-y-auto">
              {renderPreview()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}