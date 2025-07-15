import React, { useState, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { 
  Eye, 
  Save,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Grid,
  Download,
  Upload,
  Sparkles,
  Layers,
  Settings2,
  Maximize,
  Minimize
} from 'lucide-react';
import { TemplateToolbox } from './TemplateToolbox';
import { VisualEditor } from './VisualEditor';
import { PropertiesPanel } from './PropertiesPanel';
import { TemplateService, Template } from '@/services/TemplateService';
import { useToast } from '@/hooks/use-toast';

interface AdvancedTemplateStudioProps {
  className?: string;
}

export function AdvancedTemplateStudio({ className }: AdvancedTemplateStudioProps) {
  const { toast } = useToast();
  const [selectedTemplate, setSelectedTemplate] = useState<string>("1");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [showGrid, setShowGrid] = useState(true);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Mock templates data - in real app would come from TemplateService
  const templates: Template[] = [
    {
      id: '1',
      name: 'Bulletin Moderne',
      type: 'bulletin',
      description: 'Design épuré avec mise en page moderne',
      content: {
        elements: [],
        layout: { type: 'A4', orientation: 'portrait' },
        styles: { colors: {}, fonts: {} }
      },
      is_active: true,
      is_default: false,
      version: 1,
      created_at: '2024-01-15T10:30:00Z',
      updated_at: '2024-01-15T10:30:00Z'
    },
    {
      id: '2',
      name: 'Relevé Classique',
      type: 'transcript',
      description: 'Format traditionnel pour documents officiels',
      content: {
        elements: [],
        layout: { type: 'A4', orientation: 'portrait' },
        styles: { colors: {}, fonts: {} }
      },
      is_active: true,
      is_default: true,
      version: 1,
      created_at: '2024-01-14T15:45:00Z',
      updated_at: '2024-01-14T15:45:00Z'
    }
  ];

  const currentTemplate = templates.find(t => t.id === selectedTemplate);

  const handleSaveTemplate = useCallback(async () => {
    if (!currentTemplate) return;
    
    setIsSaving(true);
    try {
      await TemplateService.updateTemplate(
        currentTemplate.id, 
        currentTemplate.content,
        'Manual save from studio'
      );
      setHasUnsavedChanges(false);
      toast({
        title: "Template sauvegardé",
        description: "Vos modifications ont été enregistrées avec succès.",
      });
    } catch (error) {
      toast({
        title: "Erreur de sauvegarde",
        description: "Impossible de sauvegarder le template.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  }, [currentTemplate, toast]);

  const handleZoomIn = useCallback(() => {
    setZoomLevel(prev => Math.min(prev + 25, 200));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoomLevel(prev => Math.max(prev - 25, 25));
  }, []);

  const handleZoomReset = useCallback(() => {
    setZoomLevel(100);
  }, []);

  const handleElementSelect = useCallback((elementId: string | null) => {
    setSelectedElement(elementId);
  }, []);

  const handleTemplateChange = useCallback((content: any) => {
    setHasUnsavedChanges(true);
    // Update template content
  }, []);

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(prev => !prev);
  }, []);

  return (
    <div className={`flex flex-col h-full min-h-screen bg-background ${className}`}>
      {/* Top Toolbar */}
      <div className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-4">
            {/* Template Selector */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground">Template:</span>
              <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {templates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      <div className="flex items-center gap-2">
                        <span>{template.name}</span>
                        {template.is_default && (
                          <Badge variant="secondary" className="text-xs">Défaut</Badge>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Separator orientation="vertical" className="h-6" />

            {/* View Controls */}
            <div className="flex items-center gap-2">
              <Button
                variant={isPreviewMode ? "default" : "outline"}
                size="sm"
                onClick={() => setIsPreviewMode(!isPreviewMode)}
              >
                <Eye className="w-4 h-4 mr-2" />
                Aperçu
              </Button>
              
              <Button
                variant={showGrid ? "default" : "outline"}
                size="sm"
                onClick={() => setShowGrid(!showGrid)}
              >
                <Grid className="w-4 h-4 mr-2" />
                Grille
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Zoom Controls */}
            <div className="flex items-center gap-1 bg-muted/50 rounded-md p-1">
              <Button variant="ghost" size="sm" onClick={handleZoomOut}>
                <ZoomOut className="w-4 h-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleZoomReset}
                className="min-w-[60px] text-xs"
              >
                {zoomLevel}%
              </Button>
              <Button variant="ghost" size="sm" onClick={handleZoomIn}>
                <ZoomIn className="w-4 h-4" />
              </Button>
            </div>

            <Separator orientation="vertical" className="h-6" />

            {/* Action Buttons */}
            <Button variant="outline" size="sm">
              <Upload className="w-4 h-4 mr-2" />
              Importer
            </Button>
            
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Exporter
            </Button>

            <Button
              onClick={handleSaveTemplate}
              disabled={isSaving || !hasUnsavedChanges}
              size="sm"
            >
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={toggleFullscreen}
            >
              {isFullscreen ? (
                <Minimize className="w-4 h-4" />
              ) : (
                <Maximize className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Status Bar */}
        {currentTemplate && (
          <div className="flex items-center justify-between px-6 py-2 border-t bg-muted/20">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>{currentTemplate.name} ({currentTemplate.type})</span>
              <span>•</span>
              <span>Version {currentTemplate.version}</span>
              {hasUnsavedChanges && (
                <>
                  <span>•</span>
                  <span className="text-orange-600">Modifications non sauvegardées</span>
                </>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <Badge variant={currentTemplate.is_active ? "default" : "secondary"}>
                {currentTemplate.is_active ? "Actif" : "Inactif"}
              </Badge>
              <Button variant="ghost" size="sm">
                <Sparkles className="w-4 h-4 mr-1" />
                IA Assistant
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Main Editor Area */}
      <div className={`flex flex-1 ${isFullscreen ? 'fixed inset-0 z-50 bg-background' : ''}`}>
        {/* Left Toolbox */}
        {!isFullscreen && (
          <div className="w-64 border-r bg-card/30 backdrop-blur supports-[backdrop-filter]:bg-card/30">
            <TemplateToolbox
              onElementSelect={handleElementSelect}
              selectedElement={selectedElement}
            />
          </div>
        )}

        {/* Central Editor */}
        <div className="flex-1 flex flex-col">
          <VisualEditor
            template={currentTemplate}
            zoomLevel={zoomLevel}
            showGrid={showGrid}
            isPreviewMode={isPreviewMode}
            selectedElement={selectedElement}
            onElementSelect={handleElementSelect}
            onChange={handleTemplateChange}
            className="flex-1"
          />
        </div>

        {/* Right Properties Panel */}
        {!isFullscreen && (
          <div className="w-80 border-l bg-card/30 backdrop-blur supports-[backdrop-filter]:bg-card/30">
            <PropertiesPanel
              selectedElement={selectedElement}
              template={currentTemplate}
              onChange={handleTemplateChange}
            />
          </div>
        )}
      </div>

      {/* Fullscreen Toggle in Editor */}
      {isFullscreen && (
        <div className="absolute top-4 right-4 z-10">
          <Button variant="outline" size="sm" onClick={toggleFullscreen}>
            <Minimize className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
}