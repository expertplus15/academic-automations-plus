import React from 'react';
import { cn } from '@/lib/utils';
import { TopMenuBar } from './TopMenuBar';
import { SidebarToolbox } from './SidebarToolbox';
import { CanvasWorkspace } from './CanvasWorkspace';
import { PropertiesInspector } from './PropertiesInspector';
import { StatusFooter } from './StatusFooter';
import { RealTimePreview } from './RealTimePreview';
import { PreviewModeToggle } from './PreviewModeToggle';
import { TemplateEditorProvider, useTemplateEditorContext } from '@/contexts/TemplateEditorContext';

function EditorContent() {
  const { state } = useTemplateEditorContext();

  return (
    <div className="h-screen w-full bg-background flex flex-col overflow-hidden">
      {/* Top Menu Bar */}
      <TopMenuBar />
      
      {/* Main Editor Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Toolbox (hidden in preview mode) */}
        {!state.isPreviewMode && <SidebarToolbox />}
        
        {/* Center Canvas Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {state.isPreviewMode ? <RealTimePreview /> : <CanvasWorkspace />}
        </div>
        
        {/* Right Sidebar - Properties (hidden in preview mode) */}
        {!state.isPreviewMode && <PropertiesInspector />}
      </div>
      
      {/* Bottom Status Bar */}
      <StatusFooter />
    </div>
  );
}

export function ModernEditorInterface() {
  return (
    <TemplateEditorProvider>
      <EditorContent />
    </TemplateEditorProvider>
  );
}