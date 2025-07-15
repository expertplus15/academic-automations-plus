import React, { useState, useCallback, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { 
  MousePointer,
  Move,
  RotateCcw,
  Copy,
  Trash2,
  Layers,
  Eye,
  EyeOff
} from 'lucide-react';
import { Template } from '@/services/TemplateService';
import { MockDataService } from '@/services/MockDataService';

interface VisualEditorProps {
  template?: Template;
  zoomLevel: number;
  showGrid: boolean;
  isPreviewMode: boolean;
  selectedElement: string | null;
  onElementSelect: (elementId: string | null) => void;
  onChange: (content: any) => void;
  className?: string;
}

interface EditorElement {
  id: string;
  type: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  content: any;
  style: any;
  locked?: boolean;
  hidden?: boolean;
}

export function VisualEditor({
  template,
  zoomLevel,
  showGrid,
  isPreviewMode,
  selectedElement,
  onElementSelect,
  onChange,
  className
}: VisualEditorProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const [elements, setElements] = useState<EditorElement[]>([
    // Mock elements for demonstration
    {
      id: 'header-1',
      type: 'text',
      position: { x: 50, y: 50 },
      size: { width: 400, height: 60 },
      content: { text: 'BULLETIN DE NOTES', fontSize: 24, fontWeight: 'bold' },
      style: { color: '#1F2937', textAlign: 'center' }
    },
    {
      id: 'logo-1',
      type: 'image',
      position: { x: 50, y: 120 },
      size: { width: 80, height: 80 },
      content: { src: '/placeholder-logo.png', alt: 'Logo École' },
      style: {}
    },
    {
      id: 'student-info',
      type: 'variable',
      position: { x: 150, y: 140 },
      size: { width: 300, height: 40 },
      content: { variable: 'student.fullName', label: 'Nom de l\'étudiant' },
      style: { fontSize: 16, fontWeight: 'medium' }
    },
    {
      id: 'grades-table',
      type: 'table',
      position: { x: 50, y: 220 },
      size: { width: 500, height: 200 },
      content: { 
        columns: ['Matière', 'Note', 'Coefficient', 'Observation'],
        dataSource: 'grades'
      },
      style: { borderWidth: 1, borderColor: '#E5E7EB' }
    }
  ]);

  const studentData = useMemo(() => {
    return MockDataService.getStudentMockData();
  }, []);

  const scaleStyle = useMemo(() => ({
    transform: `scale(${zoomLevel / 100})`,
    transformOrigin: 'top left'
  }), [zoomLevel]);

  const handleElementClick = useCallback((elementId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    if (!isPreviewMode) {
      onElementSelect(elementId);
    }
  }, [isPreviewMode, onElementSelect]);

  const handleCanvasClick = useCallback(() => {
    if (!isPreviewMode) {
      onElementSelect(null);
    }
  }, [isPreviewMode, onElementSelect]);

  const handleElementMouseDown = useCallback((elementId: string, event: React.MouseEvent) => {
    if (isPreviewMode) return;
    
    event.preventDefault();
    event.stopPropagation();
    
    setIsDragging(true);
    setDragStart({ x: event.clientX, y: event.clientY });
    onElementSelect(elementId);
  }, [isPreviewMode, onElementSelect]);

  const handleMouseMove = useCallback((event: React.MouseEvent) => {
    if (!isDragging || !selectedElement || !dragStart || isPreviewMode) return;

    const deltaX = (event.clientX - dragStart.x) / (zoomLevel / 100);
    const deltaY = (event.clientY - dragStart.y) / (zoomLevel / 100);

    setElements(prev => prev.map(el => 
      el.id === selectedElement 
        ? {
            ...el,
            position: {
              x: Math.max(0, el.position.x + deltaX),
              y: Math.max(0, el.position.y + deltaY)
            }
          }
        : el
    ));

    setDragStart({ x: event.clientX, y: event.clientY });
  }, [isDragging, selectedElement, dragStart, zoomLevel, isPreviewMode]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setDragStart(null);
  }, []);

  const handleDuplicateElement = useCallback((elementId: string) => {
    const element = elements.find(el => el.id === elementId);
    if (!element) return;

    const newElement: EditorElement = {
      ...element,
      id: `${element.type}-${Date.now()}`,
      position: {
        x: element.position.x + 20,
        y: element.position.y + 20
      }
    };

    setElements(prev => [...prev, newElement]);
    onElementSelect(newElement.id);
  }, [elements, onElementSelect]);

  const handleDeleteElement = useCallback((elementId: string) => {
    setElements(prev => prev.filter(el => el.id !== elementId));
    if (selectedElement === elementId) {
      onElementSelect(null);
    }
  }, [selectedElement, onElementSelect]);

  const handleToggleVisibility = useCallback((elementId: string) => {
    setElements(prev => prev.map(el => 
      el.id === elementId 
        ? { ...el, hidden: !el.hidden }
        : el
    ));
  }, []);

  const renderElementContent = useCallback((element: EditorElement) => {
    switch (element.type) {
      case 'text':
        return (
          <div 
            style={{
              fontSize: element.content.fontSize || 16,
              fontWeight: element.content.fontWeight || 'normal',
              color: element.style.color || '#000000',
              textAlign: element.style.textAlign || 'left'
            }}
          >
            {element.content.text}
          </div>
        );

      case 'image':
        return (
          <div className="w-full h-full bg-muted border-2 border-dashed border-muted-foreground/25 flex items-center justify-center rounded-md">
            <span className="text-xs text-muted-foreground">
              {element.content.alt || 'Image'}
            </span>
          </div>
        );

      case 'variable':
        const value = element.content.variable?.split('.').reduce((obj: any, key: string) => obj?.[key], studentData) || element.content.label;
        return (
          <div 
            style={{
              fontSize: element.content.fontSize || 14,
              fontWeight: element.content.fontWeight || 'normal',
              color: element.style.color || '#059669'
            }}
            className="bg-emerald-50 border border-emerald-200 rounded px-2 py-1"
          >
            {isPreviewMode ? value : `{{${element.content.variable || element.content.label}}}`}
          </div>
        );

      case 'table':
        return (
          <div className="w-full h-full border border-gray-300 rounded-md overflow-hidden">
            <div className="bg-gray-50 border-b border-gray-300 p-2">
              <div className="grid grid-cols-4 gap-2 text-xs font-medium">
                {element.content.columns?.map((col: string, index: number) => (
                  <div key={index}>{col}</div>
                ))}
              </div>
            </div>
            <div className="p-2">
              <div className="text-xs text-muted-foreground">
                {isPreviewMode ? 'Données dynamiques' : `Table: ${element.content.dataSource}`}
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="w-full h-full bg-muted border-2 border-dashed border-muted-foreground/25 flex items-center justify-center rounded-md">
            <span className="text-xs text-muted-foreground capitalize">
              {element.type}
            </span>
          </div>
        );
    }
  }, [studentData, isPreviewMode]);

  return (
    <div className={cn("relative w-full h-full bg-gray-50", className)}>
      {/* Canvas */}
      <div 
        className="relative w-full h-full overflow-auto cursor-default"
        onClick={handleCanvasClick}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Grid */}
        {showGrid && !isPreviewMode && (
          <div 
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage: `
                linear-gradient(to right, #e5e7eb 1px, transparent 1px),
                linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)
              `,
              backgroundSize: `${20 * (zoomLevel / 100)}px ${20 * (zoomLevel / 100)}px`,
              ...scaleStyle
            }}
          />
        )}

        {/* Document Canvas */}
        <div 
          className="relative bg-white shadow-lg mx-auto my-8"
          style={{
            width: 595, // A4 width in pixels at 72 DPI
            height: 842, // A4 height in pixels at 72 DPI
            minHeight: 842,
            ...scaleStyle
          }}
        >
          {/* Elements */}
          {elements.map((element) => (
            <div
              key={element.id}
              className={cn(
                "absolute border-2 transition-all duration-200 cursor-move",
                selectedElement === element.id && !isPreviewMode
                  ? "border-blue-500 shadow-lg"
                  : "border-transparent hover:border-blue-300",
                element.hidden && "opacity-50",
                isPreviewMode && "cursor-default"
              )}
              style={{
                left: element.position.x,
                top: element.position.y,
                width: element.size.width,
                height: element.size.height,
                zIndex: selectedElement === element.id ? 10 : 1
              }}
              onClick={(e) => handleElementClick(element.id, e)}
              onMouseDown={(e) => handleElementMouseDown(element.id, e)}
            >
              {renderElementContent(element)}

              {/* Element Controls */}
              {selectedElement === element.id && !isPreviewMode && (
                <div className="absolute -top-8 left-0 flex items-center gap-1 bg-blue-500 text-white rounded px-2 py-1 text-xs">
                  <span className="capitalize">{element.type}</span>
                  
                  <div className="flex items-center gap-1 ml-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-5 w-5 p-0 text-white hover:bg-blue-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDuplicateElement(element.id);
                      }}
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-5 w-5 p-0 text-white hover:bg-blue-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleVisibility(element.id);
                      }}
                    >
                      {element.hidden ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-5 w-5 p-0 text-white hover:bg-red-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteElement(element.id);
                      }}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Resize Handles */}
              {selectedElement === element.id && !isPreviewMode && (
                <>
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-blue-500 border border-white rounded-sm cursor-se-resize" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 border border-white rounded-sm cursor-ne-resize" />
                  <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-blue-500 border border-white rounded-sm cursor-sw-resize" />
                  <div className="absolute -top-1 -left-1 w-3 h-3 bg-blue-500 border border-white rounded-sm cursor-nw-resize" />
                </>
              )}
            </div>
          ))}

          {/* Canvas Info */}
          {!isPreviewMode && (
            <div className="absolute bottom-4 right-4 bg-black/75 text-white text-xs px-2 py-1 rounded">
              A4 - 595 × 842 px
            </div>
          )}
        </div>
      </div>

      {/* Floating Toolbar */}
      {selectedElement && !isPreviewMode && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white border shadow-lg rounded-lg p-2 flex items-center gap-2">
          <Button variant="ghost" size="sm">
            <MousePointer className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Move className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <RotateCcw className="w-4 h-4" />
          </Button>
          <div className="w-px h-6 bg-border mx-1" />
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => selectedElement && handleDuplicateElement(selectedElement)}
          >
            <Copy className="w-4 h-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => selectedElement && handleDeleteElement(selectedElement)}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Mode Indicator */}
      <div className="absolute top-4 left-4">
        <Badge variant={isPreviewMode ? "default" : "secondary"}>
          {isPreviewMode ? "Aperçu" : "Édition"}
        </Badge>
      </div>
    </div>
  );
}