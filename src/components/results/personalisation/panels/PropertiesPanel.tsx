import React from 'react';
import { EnhancedPropertiesPanel } from './EnhancedPropertiesPanel';
import { useTemplateEditorContext } from '../providers/TemplateEditorProvider';

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