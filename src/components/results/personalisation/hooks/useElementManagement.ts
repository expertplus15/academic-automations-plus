import { useCallback } from 'react';
import { Template, EditorState } from '../types';
import { elementFactory } from '../utils/elementFactory';

export function useElementManagement(
  currentTemplate: Template | undefined,
  setState: React.Dispatch<React.SetStateAction<EditorState>>
) {
  const addElement = useCallback((elementType: string, position = { x: 50, y: 50 }) => {
    if (!currentTemplate) return;
    
    const newElement = elementFactory.createElement(elementType, position);
    const updatedContent = {
      ...currentTemplate.content,
      elements: [...(currentTemplate.content.elements || []), newElement]
    };

    setState(prev => ({ ...prev, hasUnsavedChanges: true }));
    currentTemplate.content = updatedContent;
  }, [currentTemplate, setState]);

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