import { useState, useCallback, useEffect } from 'react';
import { useDocumentTemplates, DocumentTemplate } from '@/hooks/useDocumentTemplates';
import { useToast } from '@/hooks/use-toast';
import { Template, TemplateService } from '@/services/TemplateService';

interface EditorState {
  selectedTemplate: string;
  selectedElement: string | null;
  isFullscreen: boolean;
  zoomLevel: number;
  showGrid: boolean;
  isPreviewMode: boolean;
  isSaving: boolean;
  hasUnsavedChanges: boolean;
}

interface TemplateEditorActions {
  setSelectedTemplate: (id: string) => void;
  setSelectedElement: (id: string | null) => void;
  toggleFullscreen: () => void;
  handleZoomIn: () => void;
  handleZoomOut: () => void;
  handleZoomReset: () => void;
  togglePreviewMode: () => void;
  toggleGrid: () => void;
  saveTemplate: () => Promise<void>;
  handleTemplateChange: (content: any) => void;
}

const initialState: EditorState = {
  selectedTemplate: '',
  selectedElement: null,
  isFullscreen: false,
  zoomLevel: 100,
  showGrid: true,
  isPreviewMode: false,
  isSaving: false,
  hasUnsavedChanges: false,
};

export function useTemplateEditor() {
  const { toast } = useToast();
  const { 
    templates: documentTemplates, 
    loading, 
    updateTemplate: updateDocumentTemplate 
  } = useDocumentTemplates();

  const [state, setState] = useState<EditorState>(initialState);

  // Convert DocumentTemplate to Template format for compatibility
  const templates: Template[] = documentTemplates.map(dt => ({
    id: dt.id,
    name: dt.name,
    type: dt.template_type as 'bulletin' | 'transcript' | 'report' | 'custom',
    description: dt.description || '',
    content: dt.template_content || {
      elements: [],
      layout: { type: 'A4', orientation: 'portrait' },
      styles: { colors: {}, fonts: {} }
    },
    is_active: dt.is_active,
    is_default: false,
    version: 1,
    created_at: dt.created_at,
    updated_at: dt.updated_at
  }));

  const currentTemplate = templates.find(t => t.id === state.selectedTemplate);

  // Auto-select first template when templates load
  useEffect(() => {
    if (templates.length > 0 && !state.selectedTemplate) {
      setState(prev => ({ ...prev, selectedTemplate: templates[0].id }));
    }
  }, [templates, state.selectedTemplate]);

  const actions: TemplateEditorActions = {
    setSelectedTemplate: useCallback((id: string) => {
      setState(prev => ({ ...prev, selectedTemplate: id, selectedElement: null }));
    }, []),

    setSelectedElement: useCallback((id: string | null) => {
      setState(prev => ({ ...prev, selectedElement: id }));
    }, []),

    toggleFullscreen: useCallback(() => {
      setState(prev => ({ ...prev, isFullscreen: !prev.isFullscreen }));
    }, []),

    handleZoomIn: useCallback(() => {
      setState(prev => ({ ...prev, zoomLevel: Math.min(prev.zoomLevel + 25, 200) }));
    }, []),

    handleZoomOut: useCallback(() => {
      setState(prev => ({ ...prev, zoomLevel: Math.max(prev.zoomLevel - 25, 25) }));
    }, []),

    handleZoomReset: useCallback(() => {
      setState(prev => ({ ...prev, zoomLevel: 100 }));
    }, []),

    togglePreviewMode: useCallback(() => {
      setState(prev => ({ ...prev, isPreviewMode: !prev.isPreviewMode }));
    }, []),

    toggleGrid: useCallback(() => {
      setState(prev => ({ ...prev, showGrid: !prev.showGrid }));
    }, []),

    saveTemplate: useCallback(async () => {
      if (!currentTemplate) return;
      
      setState(prev => ({ ...prev, isSaving: true }));
      try {
        await updateDocumentTemplate(currentTemplate.id, {
          template_content: currentTemplate.content
        });
        setState(prev => ({ ...prev, hasUnsavedChanges: false }));
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
        setState(prev => ({ ...prev, isSaving: false }));
      }
    }, [currentTemplate, updateDocumentTemplate, toast]),

    handleTemplateChange: useCallback((content: any) => {
      setState(prev => ({ ...prev, hasUnsavedChanges: true }));
      // Update template content logic here
    }, []),
  };

  return {
    state,
    actions,
    templates,
    documentTemplates,
    currentTemplate,
    loading,
  };
}