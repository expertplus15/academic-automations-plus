import React from 'react';
import { cn } from '@/lib/utils';
import { EditorToolbar } from './EditorToolbar';
import { EditorStatusBar } from './EditorStatusBar';
import { ToolboxPanel } from '../panels/ToolboxPanel';
import { PropertiesPanel } from '../panels/PropertiesPanel';
import { EditorCanvas } from '../editor/EditorCanvas';
import { FullscreenToggle } from '../components/FullscreenToggle';
import { useTemplateEditorContext } from '../providers/TemplateEditorProvider';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';

interface EditorLayoutProps {
  className?: string;
}

export function EditorLayout({ className }: EditorLayoutProps) {
  const { state } = useTemplateEditorContext();
  
  // Enable keyboard shortcuts
  useKeyboardShortcuts();

  return (
    <div className={cn("flex flex-col h-full min-h-screen bg-background", className)}>
      {/* Top Toolbar */}
      <EditorToolbar />

      {/* Status Bar */}
      <EditorStatusBar />

      {/* Main Editor Area */}
      <div className={cn(
        "flex flex-1",
        state.isFullscreen && "fixed inset-0 z-50 bg-background"
      )}>
        {/* Left Toolbox */}
        {!state.isFullscreen && (
          <div className="w-64 border-r bg-card/30 backdrop-blur supports-[backdrop-filter]:bg-card/30">
            <ToolboxPanel />
          </div>
        )}

        {/* Central Editor */}
        <div className="flex-1 flex flex-col">
          <EditorCanvas />
        </div>

        {/* Right Properties Panel */}
        {!state.isFullscreen && (
          <div className="w-80 border-l bg-card/30 backdrop-blur supports-[backdrop-filter]:bg-card/30">
            <PropertiesPanel />
          </div>
        )}
      </div>

      {/* Fullscreen Toggle */}
      <FullscreenToggle />
    </div>
  );
}