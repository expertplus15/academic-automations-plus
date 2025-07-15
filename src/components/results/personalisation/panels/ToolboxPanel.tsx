import React from 'react';
import { TemplateToolbox } from '../TemplateToolbox';
import { useTemplateEditorContext } from '@/contexts/TemplateEditorContext';

export function ToolboxPanel() {
  const { state, actions } = useTemplateEditorContext();

  return (
    <TemplateToolbox
      onElementSelect={actions.setSelectedElement}
      selectedElement={state.selectedElement}
    />
  );
}