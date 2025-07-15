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
  addElement: (elementType: string, position?: { x: number; y: number }) => void;
  updateElement: (elementId: string, updates: any) => void;
  deleteElement: (elementId: string) => void;
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
      // Update current template content
      if (currentTemplate) {
        currentTemplate.content = content;
      }
    }, [currentTemplate]),

    addElement: useCallback((elementType: string, position = { x: 50, y: 50 }) => {
      if (!currentTemplate) return;
      
      const newElement = {
        id: `${elementType}-${Date.now()}`,
        type: elementType,
        x: position.x,
        y: position.y,
        width: elementType === 'text' ? 200 : 100,
        height: elementType === 'text' ? 40 : 100,
        content: getDefaultContentForType(elementType),
        style: getDefaultStyleForType(elementType)
      };

      const updatedContent = {
        ...currentTemplate.content,
        elements: [...(currentTemplate.content.elements || []), newElement]
      };

      setState(prev => ({ ...prev, hasUnsavedChanges: true }));
      currentTemplate.content = updatedContent;
    }, [currentTemplate]),

    updateElement: useCallback((elementId: string, updates: any) => {
      if (!currentTemplate) return;

      const updatedContent = {
        ...currentTemplate.content,
        elements: (currentTemplate.content.elements || []).map((el: any) =>
          el.id === elementId ? { ...el, ...updates } : el
        )
      };

      setState(prev => ({ ...prev, hasUnsavedChanges: true }));
      currentTemplate.content = updatedContent;
    }, [currentTemplate]),

    deleteElement: useCallback((elementId: string) => {
      if (!currentTemplate) return;

      const updatedContent = {
        ...currentTemplate.content,
        elements: (currentTemplate.content.elements || []).filter((el: any) => el.id !== elementId)
      };

      setState(prev => ({ ...prev, hasUnsavedChanges: true, selectedElement: null }));
      currentTemplate.content = updatedContent;
    }, [currentTemplate]),
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

// Helper functions for default content and styles
function getDefaultContentForType(type: string) {
  switch (type) {
    case 'text':
      return { text: 'Nouveau texte', fontSize: 14, fontWeight: 'normal' };
    case 'heading':
      return { text: 'Nouveau titre', fontSize: 20, fontWeight: 'bold' };
    case 'image':
      return { src: '', alt: 'Image' };
    case 'variable':
      return { variable: 'student.name', label: 'Nom étudiant' };
    case 'table':
      return { rows: 3, columns: 3, headers: ['Col 1', 'Col 2', 'Col 3'] };
    case 'qrcode':
      return { data: 'student.id', size: 100 };
    case 'signature':
      return { signatory: 'Directeur', title: 'Signature' };
    case 'date':
      return { format: 'DD/MM/YYYY', type: 'current' };
    case 'logo':
      return { src: '', institutionName: 'École' };
    case 'header':
      return { title: 'En-tête officiel', subtitle: 'Établissement' };
    case 'footer':
      return { text: 'Pied de page officiel' };
    default:
      return { content: `Élément ${type}` };
  }
}

function getDefaultStyleForType(type: string) {
  switch (type) {
    case 'text':
      return { color: '#374151', textAlign: 'left', fontFamily: 'system-ui' };
    case 'heading':
      return { color: '#1F2937', textAlign: 'center', fontFamily: 'system-ui' };
    case 'image':
      return { borderRadius: 4, objectFit: 'contain' };
    case 'variable':
      return { color: '#6B7280', fontStyle: 'italic', backgroundColor: '#F3F4F6' };
    case 'logo':
      return { borderRadius: 8, filter: 'none' };
    case 'header':
      return { backgroundColor: '#F9FAFB', borderBottom: '2px solid #E5E7EB', padding: 16 };
    case 'footer':
      return { backgroundColor: '#F9FAFB', borderTop: '1px solid #E5E7EB', padding: 12 };
    default:
      return { border: '1px solid #E5E7EB', borderRadius: 4 };
  }
}