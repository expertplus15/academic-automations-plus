import { useCallback } from 'react';
import { Template, EditorState } from '../types';
import { elementFactory } from '../utils/elementFactory';

export function useElementManagement(
  currentTemplate: Template | undefined,
  setState: React.Dispatch<React.SetStateAction<EditorState>>
) {
  const addElement = useCallback((elementType: string, position = { x: 50, y: 50 }) => {
    if (!currentTemplate) return;
    
    // Create a simple element based on type
    const newElement = {
      id: `${elementType}_${Date.now()}`,
      type: elementType,
      x: position.x,
      y: position.y,
      width: elementType === 'text' ? 200 : elementType === 'image' ? 150 : 300,
      height: elementType === 'text' ? 30 : elementType === 'image' ? 150 : 60,
      content: getDefaultContent(elementType),
      style: getDefaultStyle(elementType)
    };
    
    const updatedContent = {
      ...currentTemplate.content,
      elements: [...(currentTemplate.content.elements || []), newElement]
    };

    setState(prev => ({ ...prev, hasUnsavedChanges: true }));
    currentTemplate.content = updatedContent;
  }, [currentTemplate, setState]);

  const getDefaultContent = (elementType: string) => {
    switch (elementType) {
      case 'text':
        return { text: 'Nouveau texte' };
      case 'heading':
        return { text: 'Nouveau titre', level: 1 };
      case 'variable':
        return { name: 'nouvelle_variable', defaultValue: 'Valeur par défaut' };
      case 'date':
        return { format: 'DD/MM/YYYY' };
      case 'header':
        return { institution: 'ÉTABLISSEMENT', name: 'En-tête' };
      case 'footer':
        return { text: 'Pied de page' };
      case 'logo':
        return { url: '', alt: 'Logo' };
      case 'signature':
        return { name: 'Signature', title: 'Fonction' };
      case 'table':
        return { rows: 3, cols: 3, data: [] };
      case 'qrcode':
        return { text: 'https://exemple.com' };
      default:
        return { text: `Élément ${elementType}` };
    }
  };

  const getDefaultStyle = (elementType: string) => {
    return {
      fontSize: elementType === 'heading' ? 18 : 14,
      fontWeight: elementType === 'heading' ? 'bold' : 'normal',
      color: '#374151',
      textAlign: 'left',
      backgroundColor: 'transparent',
      opacity: 100,
      rotation: 0,
      visible: true
    };
  };

  const updateElement = useCallback((elementId: string, updates: any) => {
    if (!currentTemplate) return;

    const updatedContent = {
      ...currentTemplate.content,
      elements: (currentTemplate.content.elements || []).map((el: any) =>
        el.id === elementId ? { ...el, ...updates } : el
      )
    };

    setState(prev => ({ ...prev, hasUnsavedChanges: true }));
    currentTemplate.content = updatedContent;
  }, [currentTemplate, setState]);

  const deleteElement = useCallback((elementId: string) => {
    if (!currentTemplate) return;

    const updatedContent = {
      ...currentTemplate.content,
      elements: (currentTemplate.content.elements || []).filter((el: any) => el.id !== elementId)
    };

    setState(prev => ({ ...prev, hasUnsavedChanges: true, selectedElement: null }));
    currentTemplate.content = updatedContent;
  }, [currentTemplate, setState]);

  return {
    addElement,
    updateElement,
    deleteElement,
  };
}