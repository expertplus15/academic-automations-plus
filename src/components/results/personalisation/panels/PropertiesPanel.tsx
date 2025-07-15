import React from 'react';
import { EnhancedPropertiesPanel } from './EnhancedPropertiesPanel';
import { useTemplateEditorContext } from '@/contexts/TemplateEditorContext';

export function PropertiesPanel() {
  const { state, actions, currentTemplate } = useTemplateEditorContext();

  return (
    <EnhancedPropertiesPanel
      selectedElement={state.selectedElement}
      template={currentTemplate}
      onChange={actions.handleTemplateChange}
    />
  );
}