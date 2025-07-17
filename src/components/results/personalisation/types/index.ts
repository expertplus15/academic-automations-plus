export interface EditorState {
  selectedTemplate: string;
  selectedElement: string | null;
  isFullscreen: boolean;
  zoomLevel: number;
  showGrid: boolean;
  isPreviewMode: boolean;
  isSaving: boolean;
  hasUnsavedChanges: boolean;
}

export interface TemplateElement {
  id: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  content: any;
  style: any;
}

export interface TemplateContent {
  elements: TemplateElement[];
  layout: {
    type: 'A4' | 'A3' | 'Letter';
    orientation: 'portrait' | 'landscape';
  };
  styles: {
    colors: Record<string, string>;
    fonts: Record<string, string>;
  };
}

export interface Template {
  id: string;
  name: string;
  type: 'bulletin' | 'transcript' | 'report' | 'custom';
  description: string;
  content: TemplateContent;
  is_active: boolean;
  is_default: boolean;
  version: number;
  created_at: string;
  updated_at: string;
}

export interface TemplateEditorActions {
  // Template operations
  setSelectedTemplate: (id: string) => void;
  saveTemplate: () => Promise<void>;
  duplicateTemplate: (templateId?: string) => Promise<void>;
  handleTemplateChange: (content: any) => void;
  
  // Element operations
  setSelectedElement: (id: string | null) => void;
  addElement: (elementType: string, position?: { x: number; y: number }) => void;
  updateElement: (elementId: string, updates: any) => void;
  deleteElement: (elementId: string) => void;
  
  // UI operations
  toggleFullscreen: () => void;
  handleZoomIn: () => void;
  handleZoomOut: () => void;
  handleZoomReset: () => void;
  togglePreviewMode: () => void;
  toggleGrid: () => void;
}

export interface TemplateEditorContextType {
  state: EditorState;
  actions: TemplateEditorActions;
  templates: Template[];
  documentTemplates: any[];
  currentTemplate: Template | undefined;
  loading: boolean;
}

export interface BlockProps {
  id: string;
  data?: any;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
  onUpdate?: (id: string, data: any) => void;
  className?: string;
  isPreview?: boolean;
}

export type BlockType = 
  | 'header'
  | 'table' 
  | 'signature'
  | 'logo'
  | 'date'
  | 'variable'
  | 'qrcode'
  | 'footer'
  | 'seal';