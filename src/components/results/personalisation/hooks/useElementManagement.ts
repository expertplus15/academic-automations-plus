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
        return { 
          name: 'nouvelle_variable', 
          defaultValue: 'Valeur par défaut',
          template: '{{nouvelle_variable}}'
        };
      case 'date':
        return { format: 'DD/MM/YYYY', locale: 'fr-FR' };
      case 'header':
        return { 
          institution: 'NOM DE L\'ÉTABLISSEMENT', 
          address: 'Adresse complète',
          phone: 'Téléphone',
          email: 'contact@etablissement.fr'
        };
      case 'footer':
        return { 
          text: 'Document généré automatiquement le {{current_date}}',
          includePageNumber: true
        };
      case 'logo':
        return { 
          url: '/logo-placeholder.png', 
          alt: 'Logo de l\'établissement',
          showBorder: false
        };
      case 'signature':
        return { 
          name: 'Nom du signataire', 
          title: 'Fonction du signataire',
          includeDate: true,
          includeStamp: false
        };
      case 'table':
        return { 
          headers: ['Colonne 1', 'Colonne 2', 'Colonne 3'],
          rows: [
            ['Ligne 1 Col 1', 'Ligne 1 Col 2', 'Ligne 1 Col 3'],
            ['Ligne 2 Col 1', 'Ligne 2 Col 2', 'Ligne 2 Col 3']
          ],
          showBorders: true,
          alternateRows: true
        };
      case 'qrcode':
        return { 
          text: 'https://exemple.com',
          size: 'medium',
          errorCorrection: 'M'
        };
      case 'seal':
        return {
          type: 'official',
          text: 'SCEAU OFFICIEL',
          shape: 'circle'
        };
      case 'rectangle':
        return {
          fillColor: '#f3f4f6',
          borderColor: '#d1d5db',
          borderWidth: 1
        };
      case 'circle':
        return {
          fillColor: '#f3f4f6',
          borderColor: '#d1d5db',
          borderWidth: 1
        };
      case 'line':
        return {
          color: '#374151',
          thickness: 1,
          style: 'solid'
        };
      default:
        return { text: `Nouvel élément ${elementType}` };
    }
  };

  const getDefaultStyle = (elementType: string) => {
    const baseStyle = {
      fontSize: 14,
      fontWeight: 'normal',
      color: '#374151',
      textAlign: 'left' as const,
      backgroundColor: 'transparent',
      opacity: 100,
      rotation: 0,
      visible: true,
      borderColor: '#d1d5db',
      borderWidth: 0,
      padding: 8,
      margin: 0
    };

    switch (elementType) {
      case 'heading':
        return {
          ...baseStyle,
          fontSize: 20,
          fontWeight: 'bold',
          textAlign: 'center' as const
        };
      case 'header':
        return {
          ...baseStyle,
          fontSize: 18,
          fontWeight: 'bold',
          textAlign: 'center' as const,
          borderWidth: 1,
          borderColor: '#374151',
          padding: 16
        };
      case 'footer':
        return {
          ...baseStyle,
          fontSize: 12,
          textAlign: 'center' as const,
          color: '#6b7280'
        };
      case 'table':
        return {
          ...baseStyle,
          borderWidth: 1,
          fontSize: 12,
          padding: 4
        };
      case 'signature':
        return {
          ...baseStyle,
          textAlign: 'center' as const,
          fontSize: 12
        };
      case 'variable':
        return {
          ...baseStyle,
          fontWeight: 'bold',
          backgroundColor: '#fef3c7',
          padding: 4
        };
      case 'rectangle':
      case 'circle':
        return {
          ...baseStyle,
          borderWidth: 1,
          backgroundColor: '#f9fafb'
        };
      case 'line':
        return {
          ...baseStyle,
          borderWidth: 1,
          borderColor: '#374151'
        };
      default:
        return baseStyle;
    }
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