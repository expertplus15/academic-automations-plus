import React from 'react';
import { PropertiesPanel as OriginalPropertiesPanel } from '../PropertiesPanel';
import { useTemplateEditorContext } from '@/contexts/TemplateEditorContext';

export function PropertiesPanel() {
  const { state, actions, currentTemplate } = useTemplateEditorContext();

  return (
    <OriginalPropertiesPanel
      selectedElement={state.selectedElement}
      template={currentTemplate}
      onChange={actions.handleTemplateChange}
    />
  );
}