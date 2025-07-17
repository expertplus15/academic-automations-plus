import { useCallback } from 'react';
import { DocumentTemplate } from '@/hooks/useDocumentTemplates';
import { Template, TemplateElement, TemplateContent } from '../types';

/**
 * Hook pour convertir entre les interfaces DocumentTemplate et Template
 * Assure la compatibilité et l'unification des données
 */
export function useDocumentTemplateConverter() {
  
  const convertDocumentToTemplate = useCallback((docTemplate: DocumentTemplate): Template => {
    // Conversion de DocumentTemplate vers Template unifié
    const content: TemplateContent = {
      elements: [],
      layout: {
        type: 'A4',
        orientation: 'portrait'
      },
      styles: {
        colors: { primary: '#1f2937', secondary: '#6b7280' },
        fonts: { main: 'Arial', heading: 'Arial Bold' }
      }
    };

    // Conversion du contenu si disponible
    if (docTemplate.template_content) {
      if (docTemplate.template_content.elements && Array.isArray(docTemplate.template_content.elements)) {
        content.elements = docTemplate.template_content.elements.map((el: any, index: number): TemplateElement => ({
          id: el.id || `element_${index}_${Date.now()}`,
          type: el.type || 'text',
          x: el.x || 50,
          y: el.y || 50 + (index * 60),
          width: el.width || 300,
          height: el.height || 50,
          content: el.content || { text: 'Contenu' },
          style: el.style || { fontSize: 14, color: '#374151' }
        }));
      }

      // Préserver la mise en page si disponible
      if (docTemplate.template_content.layout) {
        content.layout = {
          type: docTemplate.template_content.layout.type || 'A4',
          orientation: docTemplate.template_content.layout.orientation || 'portrait'
        };
      }

      // Préserver les styles si disponibles
      if (docTemplate.template_content.styles) {
        content.styles = {
          colors: docTemplate.template_content.styles.colors || content.styles.colors,
          fonts: docTemplate.template_content.styles.fonts || content.styles.fonts
        };
      }
    }

    return {
      id: docTemplate.id,
      name: docTemplate.name,
      type: mapTemplateType(docTemplate.template_type),
      description: docTemplate.description || '',
      content,
      is_active: docTemplate.is_active,
      is_default: false,
      version: 1,
      created_at: docTemplate.created_at,
      updated_at: docTemplate.updated_at
    };
  }, []);

  const convertTemplateToDocument = useCallback((template: Template): Partial<DocumentTemplate> => {
    // Conversion de Template vers DocumentTemplate pour sauvegarde
    return {
      id: template.id,
      name: template.name,
      description: template.description,
      template_type: reverseMapTemplateType(template.type),
      template_content: {
        elements: template.content.elements,
        layout: template.content.layout,
        styles: template.content.styles
      },
      is_active: template.is_active,
      updated_at: new Date().toISOString()
    };
  }, []);

  const mapTemplateType = (type: string): 'bulletin' | 'transcript' | 'report' | 'custom' => {
    switch (type.toLowerCase()) {
      case 'bulletin':
      case 'grade_report':
        return 'bulletin';
      case 'transcript':
      case 'academic_transcript':
        return 'transcript';
      case 'certificate':
      case 'diploma':
      case 'report':
        return 'report';
      default:
        return 'custom';
    }
  };

  const reverseMapTemplateType = (type: 'bulletin' | 'transcript' | 'report' | 'custom'): string => {
    switch (type) {
      case 'bulletin':
        return 'bulletin';
      case 'transcript':
        return 'transcript';
      case 'report':
        return 'certificate';
      case 'custom':
      default:
        return 'custom';
    }
  };

  const convertBatch = useCallback((docTemplates: DocumentTemplate[]): Template[] => {
    return docTemplates.map(convertDocumentToTemplate);
  }, [convertDocumentToTemplate]);

  const createDefaultTemplate = useCallback((): Template => {
    return {
      id: `default_${Date.now()}`,
      name: 'Template par Défaut',
      type: 'custom',
      description: 'Template de base pour commencer',
      content: {
        elements: [
          {
            id: 'header_default',
            type: 'header',
            x: 50,
            y: 50,
            width: 700,
            height: 80,
            content: { 
              institution: 'NOM DE L\'ÉTABLISSEMENT',
              address: 'Adresse complète de l\'établissement'
            },
            style: { fontSize: 18, fontWeight: 'bold', textAlign: 'center' }
          },
          {
            id: 'title_default',
            type: 'heading',
            x: 50,
            y: 150,
            width: 700,
            height: 50,
            content: { text: 'TITRE DU DOCUMENT', level: 1 },
            style: { fontSize: 20, fontWeight: 'bold', textAlign: 'center' }
          },
          {
            id: 'content_default',
            type: 'text',
            x: 50,
            y: 220,
            width: 700,
            height: 200,
            content: { text: 'Contenu principal du document...' },
            style: { fontSize: 14, textAlign: 'left' }
          }
        ],
        layout: { type: 'A4', orientation: 'portrait' },
        styles: {
          colors: { primary: '#1f2937', secondary: '#6b7280' },
          fonts: { main: 'Arial', heading: 'Arial Bold' }
        }
      },
      is_active: true,
      is_default: true,
      version: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  }, []);

  return {
    convertDocumentToTemplate,
    convertTemplateToDocument,
    convertBatch,
    createDefaultTemplate
  };
}