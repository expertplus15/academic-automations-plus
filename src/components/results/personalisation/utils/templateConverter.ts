import { DocumentTemplate } from '@/hooks/useDocumentTemplates';
import { Template } from '../types';

export const templateConverter = {
  fromDocumentTemplate: (dt: DocumentTemplate): Template => ({
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
  }),

  toDocumentTemplate: (template: Template): Partial<DocumentTemplate> => ({
    id: template.id,
    name: template.name,
    template_type: template.type,
    description: template.description,
    template_content: template.content,
    is_active: template.is_active,
    updated_at: template.updated_at
  })
};