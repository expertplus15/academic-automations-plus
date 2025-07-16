import React from 'react';
import { TemplateEditorProvider, useTemplateEditorContext } from '../providers/TemplateEditorProvider';
import { TopMenuBar } from '../components/TopMenuBar';
import { SidebarToolbox } from '../components/SidebarToolbox';
import { CanvasWorkspace } from '../components/CanvasWorkspace';
import { PropertiesInspector } from '../components/PropertiesInspector';
import { StatusFooter } from '../components/StatusFooter';
import { RealTimePreview } from '../components/RealTimePreview';

function EditorContent() {
  const { state } = useTemplateEditorContext();

  return (
    <div className="h-screen w-full bg-background flex flex-col overflow-hidden">
      <TopMenuBar />
      
      <div className="flex-1 flex overflow-hidden">
        {!state.isPreviewMode && <SidebarToolbox />}
        
        <div className="flex-1 flex flex-col min-w-0">
          {state.isPreviewMode ? <RealTimePreview /> : <CanvasWorkspace />}
        </div>
        
        {!state.isPreviewMode && <PropertiesInspector />}
      </div>
      
      <StatusFooter />
    </div>
  );
}

export default function ModernEditorInterface() {
  return (
    <TemplateEditorProvider>
      <EditorContent />
    </TemplateEditorProvider>
  );
}