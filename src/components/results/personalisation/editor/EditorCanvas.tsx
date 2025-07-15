import React from 'react';
import { VisualEditor } from '../VisualEditor';
import { useTemplateEditorContext } from '@/contexts/TemplateEditorContext';

export function EditorCanvas() {
  const { state, actions, currentTemplate } = useTemplateEditorContext();

  return (
    <VisualEditor
      template={currentTemplate}
      zoomLevel={state.zoomLevel}
      showGrid={state.showGrid}
      isPreviewMode={state.isPreviewMode}
      selectedElement={state.selectedElement}
      onElementSelect={actions.setSelectedElement}
      onChange={actions.handleTemplateChange}
      className="flex-1"
    />
  );
}