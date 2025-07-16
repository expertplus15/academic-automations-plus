import React from 'react';
import { cn } from '@/lib/utils';
import { TopMenuBar } from './TopMenuBar';
import { SidebarToolbox } from './SidebarToolbox';
import { CanvasWorkspace } from './CanvasWorkspace';
import { PropertiesInspector } from './PropertiesInspector';
import { StatusFooter } from './StatusFooter';
import { TemplateEditorProvider } from '@/contexts/TemplateEditorContext';

export function ModernEditorInterface() {
  return (
    <TemplateEditorProvider>
      <div className="h-screen w-full bg-background flex flex-col overflow-hidden">
        {/* Top Menu Bar */}
        <TopMenuBar />
        
        {/* Main Editor Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar - Toolbox */}
          <SidebarToolbox />
          
          {/* Center Canvas Area */}
          <div className="flex-1 flex flex-col min-w-0">
            <CanvasWorkspace />
          </div>
          
          {/* Right Sidebar - Properties */}
          <PropertiesInspector />
        </div>
        
        {/* Bottom Status Bar */}
        <StatusFooter />
      </div>
    </TemplateEditorProvider>
  );
}