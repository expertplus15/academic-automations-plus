import { useState, useCallback, useEffect } from 'react';
import { useDocumentTemplates } from '@/hooks/useDocumentTemplates';
import { useToast } from '@/hooks/use-toast';
import { EditorState, Template, TemplateEditorActions } from '../types';
import { useElementManagement } from './useElementManagement';
import { templateConverter } from '../utils/templateConverter';
import { TemplateDataService } from '@/services/TemplateDataService';

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

  // Convert DocumentTemplate to Template format
  const templates: Template[] = documentTemplates.map(templateConverter.fromDocumentTemplate);
  const currentTemplate = templates.find(t => t.id === state.selectedTemplate);

  // Element management hook
  const elementManagement = useElementManagement(currentTemplate, setState);

  // Auto-select first template when templates load
  useEffect(() => {
    if (templates.length > 0 && !state.selectedTemplate) {
      setState(prev => ({ ...prev, selectedTemplate: templates[0].id }));
    }
  }, [templates, state.selectedTemplate]);

  // Initialize template with sample elements if empty
  useEffect(() => {
    if (currentTemplate && (!currentTemplate.content.elements || currentTemplate.content.elements.length === 0)) {
      const sampleElements = [
        {
          id: 'header-1',
          type: 'header',
          x: 50,
          y: 50,
          width: 495,
          height: 80,
          content: {
            name: 'En-tête Principal',
            institution: 'ÉTABLISSEMENT SCOLAIRE',
            style: 'modern'
          },
          style: {
            backgroundColor: '#ffffff',
            textColor: '#1f2937',
            opacity: 100,
            rotation: 0,
            visible: true
          }
        },
        {
          id: 'logo-1',
          type: 'logo',
          x: 450,
          y: 60,
          width: 60,
          height: 60,
          content: {
            name: 'Logo',
            url: '',
            alt: 'Logo de l\'établissement'
          },
          style: {
            opacity: 100,
            rotation: 0,
            visible: true
          }
        }
      ];
      
      currentTemplate.content = {
        ...currentTemplate.content,
        elements: sampleElements
      };
      setState(prev => ({ ...prev, hasUnsavedChanges: true }));
    }
  }, [currentTemplate]);

  const actions: TemplateEditorActions = {
    // Template operations
    setSelectedTemplate: useCallback((id: string) => {
      setState(prev => ({ ...prev, selectedTemplate: id, selectedElement: null }));
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
      if (currentTemplate) {
        currentTemplate.content = content;
      }
    }, [currentTemplate]),

    // Element operations
    setSelectedElement: useCallback((id: string | null) => {
      setState(prev => ({ ...prev, selectedElement: id }));
    }, []),

    ...elementManagement,

    // UI operations
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