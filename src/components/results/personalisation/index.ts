// Main module exports
export { TemplateEditorProvider, useTemplateEditorContext } from './providers/TemplateEditorProvider';
export { default as ModernEditorInterface } from './core/ModernEditorInterface';

// Core components
export { TopMenuBar } from './components/TopMenuBar';
export { SidebarToolbox } from './components/SidebarToolbox';
export { CanvasWorkspace } from './components/CanvasWorkspace';
export { PropertiesInspector } from './components/PropertiesInspector';
export { StatusFooter } from './components/StatusFooter';
export { RealTimePreview } from './components/RealTimePreview';

// Blocks - explicit exports to avoid naming conflicts
export { 
  HeaderBlock, 
  TableBlock, 
  SignatureBlock, 
  LogoBlock, 
  DateBlock, 
  VariableBlock, 
  QRCodeBlock, 
  FooterBlock, 
  SealBlock
} from './blocks';

export { BlockLibrary } from './blocks/BlockLibrary';

// Hooks
export { useTemplateEditor } from './hooks/useTemplateEditor';
export { useCanvasOperations } from './hooks/useCanvasOperations';
export { useElementManagement } from './hooks/useElementManagement';

// Types
export * from './types';