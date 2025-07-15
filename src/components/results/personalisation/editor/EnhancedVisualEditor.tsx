import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Template } from '@/services/TemplateService';
import { useTemplateEditorContext } from '@/contexts/TemplateEditorContext';
import { 
  MousePointer2, 
  Move, 
  RotateCcw, 
  Square,
  Circle,
  Type,
  Image as ImageIcon,
  Grid3X3,
  Crosshair,
  Table,
  Calendar,
  Hash,
  FileText,
  Star,
  Crown
} from 'lucide-react';

interface EnhancedVisualEditorProps {
  template?: Template;
  zoomLevel: number;
  showGrid: boolean;
  isPreviewMode: boolean;
  selectedElement: string | null;
  onElementSelect: (elementId: string | null) => void;
  onChange: (content: any) => void;
  className?: string;
}

interface ElementData {
  id: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  content: any;
  style: any;
}

export function EnhancedVisualEditor({
  template,
  zoomLevel,
  showGrid,
  isPreviewMode,
  selectedElement,
  onElementSelect,
  onChange,
  className
}: EnhancedVisualEditorProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const { actions } = useTemplateEditorContext();
  
  const [dragState, setDragState] = useState({
    isDragging: false,
    dragOffset: { x: 0, y: 0 },
    dragElement: null as string | null
  });
  
  // Get elements from template or use defaults
  const elements = template?.content?.elements || [
    {
      id: 'title-1',
      type: 'text',
      x: 50,
      y: 50,
      width: 400,
      height: 60,
      content: { text: 'BULLETIN DE NOTES', fontSize: 24, fontWeight: 'bold' },
      style: { color: '#1F2937', textAlign: 'center' }
    },
    {
      id: 'student-name',
      type: 'variable',
      x: 50,
      y: 130,
      width: 300,
      height: 30,
      content: { variable: 'student.fullName', label: 'Nom de l\'étudiant' },
      style: { color: '#374151', fontSize: 16 }
    },
    {
      id: 'logo-1',
      type: 'image',
      x: 450,
      y: 50,
      width: 80,
      height: 80,
      content: { src: '', alt: 'Logo de l\'établissement' },
      style: { borderRadius: 4 }
    }
  ];

  const [canvasSize] = useState({ width: 794, height: 1123 }); // A4 format

  // Enhanced grid pattern
  const GridPattern = () => (
    <defs>
      <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
        <path 
          d="M 20 0 L 0 0 0 20" 
          fill="none" 
          stroke="hsl(var(--muted-foreground))" 
          strokeWidth="0.5"
          opacity="0.3"
        />
      </pattern>
      <pattern id="grid-major" width="100" height="100" patternUnits="userSpaceOnUse">
        <path 
          d="M 100 0 L 0 0 0 100" 
          fill="none" 
          stroke="hsl(var(--muted-foreground))" 
          strokeWidth="1"
          opacity="0.5"
        />
      </pattern>
    </defs>
  );

  // Snap to grid function
  const snapToGrid = useCallback((x: number, y: number) => {
    const gridSize = 10;
    return {
      x: Math.round(x / gridSize) * gridSize,
      y: Math.round(y / gridSize) * gridSize
    };
  }, []);

  // Handle element drag start
  const handleElementMouseDown = useCallback((e: React.MouseEvent, elementId: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    const element = elements.find(el => el.id === elementId);
    if (!element || isPreviewMode) return;

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const offsetX = e.clientX - rect.left - element.x * (zoomLevel / 100);
    const offsetY = e.clientY - rect.top - element.y * (zoomLevel / 100);

    setDragState({
      isDragging: true,
      dragOffset: { x: offsetX, y: offsetY },
      dragElement: elementId
    });

    onElementSelect(elementId);
  }, [elements, isPreviewMode, zoomLevel, onElementSelect]);

  // Handle mouse move for dragging
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragState.isDragging || !dragState.dragElement) return;

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    let newX = (mouseX - dragState.dragOffset.x) / (zoomLevel / 100);
    let newY = (mouseY - dragState.dragOffset.y) / (zoomLevel / 100);

    // Snap to grid if enabled
    if (showGrid) {
      const snapped = snapToGrid(newX, newY);
      newX = snapped.x;
      newY = snapped.y;
    }

    // Keep element within canvas bounds
    newX = Math.max(0, Math.min(newX, canvasSize.width - 50));
    newY = Math.max(0, Math.min(newY, canvasSize.height - 50));

    // Update element position using context actions
    if (dragState.dragElement) {
      actions.updateElement(dragState.dragElement, { x: newX, y: newY });
    }
  }, [dragState, zoomLevel, showGrid, snapToGrid, canvasSize]);

  // Handle mouse up to end dragging
  const handleMouseUp = useCallback(() => {
    if (dragState.isDragging) {
      setDragState({
        isDragging: false,
        dragOffset: { x: 0, y: 0 },
        dragElement: null
      });
      // Changes are already saved via actions.updateElement
    }
  }, [dragState.isDragging]);

  // Add event listeners for mouse events
  useEffect(() => {
    if (dragState.isDragging) {
      document.addEventListener('mousemove', handleMouseMove as any);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove as any);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [dragState.isDragging, handleMouseMove, handleMouseUp]);

  // Handle drop from toolbox
  const handleCanvasDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const elementType = e.dataTransfer.getData('text/plain');
    if (!elementType || isPreviewMode) return;

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = (e.clientX - rect.left) / (zoomLevel / 100);
    const y = (e.clientY - rect.top) / (zoomLevel / 100);

    actions.addElement(elementType, { x, y });
  }, [actions, isPreviewMode, zoomLevel]);

  const handleCanvasDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  // Render element based on type
  const renderElement = (element: ElementData) => {
    const baseStyle = {
      position: 'absolute' as const,
      left: element.x,
      top: element.y,
      width: element.width,
      height: element.height,
      cursor: isPreviewMode ? 'default' : 'move',
      border: selectedElement === element.id ? '2px solid hsl(var(--primary))' : '1px solid transparent',
      borderRadius: '2px',
      ...element.style
    };

    switch (element.type) {
      case 'text':
        return (
          <div
            key={element.id}
            style={baseStyle}
            className={cn(
              "flex items-center justify-center p-2 hover:shadow-md transition-shadow",
              selectedElement === element.id && "shadow-lg"
            )}
            onMouseDown={(e) => handleElementMouseDown(e, element.id)}
          >
            <span 
              style={{ 
                fontSize: element.content.fontSize,
                fontWeight: element.content.fontWeight,
                color: element.style.color,
                textAlign: element.style.textAlign
              }}
            >
              {element.content.text}
            </span>
          </div>
        );

      case 'variable':
        return (
          <div
            key={element.id}
            style={baseStyle}
            className={cn(
              "flex items-center p-2 bg-accent/20 border-dashed hover:shadow-md transition-shadow",
              selectedElement === element.id && "shadow-lg"
            )}
            onMouseDown={(e) => handleElementMouseDown(e, element.id)}
          >
            <span className="text-sm text-muted-foreground">
              {element.content.label || element.content.variable}
            </span>
          </div>
        );

      case 'table':
        return (
          <div
            key={element.id}
            style={baseStyle}
            className={cn(
              "flex items-center justify-center bg-muted/30 border hover:shadow-md transition-shadow",
              selectedElement === element.id && "shadow-lg"
            )}
            onMouseDown={(e) => handleElementMouseDown(e, element.id)}
          >
            <Table className="w-6 h-6 text-muted-foreground" />
          </div>
        );

      case 'qrcode':
        return (
          <div
            key={element.id}
            style={baseStyle}
            className={cn(
              "flex items-center justify-center bg-muted/30 border hover:shadow-md transition-shadow",
              selectedElement === element.id && "shadow-lg"
            )}
            onMouseDown={(e) => handleElementMouseDown(e, element.id)}
          >
            <Hash className="w-6 h-6 text-muted-foreground" />
          </div>
        );

      case 'date':
        return (
          <div
            key={element.id}
            style={baseStyle}
            className={cn(
              "flex items-center justify-center bg-muted/30 border hover:shadow-md transition-shadow",
              selectedElement === element.id && "shadow-lg"
            )}
            onMouseDown={(e) => handleElementMouseDown(e, element.id)}
          >
            <Calendar className="w-6 h-6 text-muted-foreground" />
          </div>
        );

      case 'signature':
        return (
          <div
            key={element.id}
            style={baseStyle}
            className={cn(
              "flex items-center justify-center bg-muted/30 border hover:shadow-md transition-shadow",
              selectedElement === element.id && "shadow-lg"
            )}
            onMouseDown={(e) => handleElementMouseDown(e, element.id)}
          >
            <FileText className="w-6 h-6 text-muted-foreground" />
          </div>
        );

      case 'logo':
        return (
          <div
            key={element.id}
            style={baseStyle}
            className={cn(
              "flex items-center justify-center bg-muted/30 border hover:shadow-md transition-shadow",
              selectedElement === element.id && "shadow-lg"
            )}
            onMouseDown={(e) => handleElementMouseDown(e, element.id)}
          >
            <Star className="w-6 h-6 text-muted-foreground" />
          </div>
        );

      case 'header':
        return (
          <div
            key={element.id}
            style={baseStyle}
            className={cn(
              "flex items-center justify-center bg-accent/10 border hover:shadow-md transition-shadow",
              selectedElement === element.id && "shadow-lg"
            )}
            onMouseDown={(e) => handleElementMouseDown(e, element.id)}
          >
            <Crown className="w-6 h-6 text-primary" />
          </div>
        );

      case 'image':
        return (
          <div
            key={element.id}
            style={baseStyle}
            className={cn(
              "flex items-center justify-center bg-muted/50 border-dashed hover:shadow-md transition-shadow",
              selectedElement === element.id && "shadow-lg"
            )}
            onMouseDown={(e) => handleElementMouseDown(e, element.id)}
          >
            {element.content.src ? (
              <img 
                src={element.content.src} 
                alt={element.content.alt}
                className="w-full h-full object-contain"
              />
            ) : (
              <ImageIcon className="w-8 h-8 text-muted-foreground" />
            )}
          </div>
        );

      default:
        return (
          <div
            key={element.id}
            style={baseStyle}
            className={cn(
              "flex items-center justify-center bg-muted/30 border-dashed hover:shadow-md transition-shadow",
              selectedElement === element.id && "shadow-lg"
            )}
            onMouseDown={(e) => handleElementMouseDown(e, element.id)}
          >
            <span className="text-xs text-muted-foreground">{element.type}</span>
          </div>
        );
    }
  };

  return (
    <div className={cn("flex-1 flex flex-col bg-muted/20", className)}>
      {/* Canvas Header */}
      <div className="p-4 border-b bg-background/50 backdrop-blur">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium">Format A4</span>
            <span className="text-muted-foreground">•</span>
            <span className="text-muted-foreground">{canvasSize.width} × {canvasSize.height} px</span>
            <span className="text-muted-foreground">•</span>
            <span className="text-muted-foreground">Zoom: {zoomLevel}%</span>
          </div>
          
          <div className="flex items-center gap-2">
            {showGrid && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Grid3X3 className="w-3 h-3" />
                Grille activée
              </div>
            )}
            {selectedElement && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Crosshair className="w-3 h-3" />
                Élément sélectionné
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Canvas Container */}
      <div className="flex-1 overflow-auto p-8">
        <div className="flex justify-center">
          <Card 
            className="relative bg-white shadow-2xl"
            style={{
              width: canvasSize.width * (zoomLevel / 100),
              height: canvasSize.height * (zoomLevel / 100),
              transform: `scale(${zoomLevel / 100})`,
              transformOrigin: 'top center'
            }}
          >
            {/* Canvas */}
            <div
              ref={canvasRef}
              className="relative w-full h-full overflow-hidden"
              onClick={() => onElementSelect(null)}
              onDrop={handleCanvasDrop}
              onDragOver={handleCanvasDragOver}
              style={{ cursor: isPreviewMode ? 'default' : 'crosshair' }}
            >
              {/* Grid Background */}
              {showGrid && (
                <svg 
                  className="absolute inset-0 w-full h-full pointer-events-none" 
                  style={{ zIndex: 0 }}
                >
                  <GridPattern />
                  <rect width="100%" height="100%" fill="url(#grid)" />
                  <rect width="100%" height="100%" fill="url(#grid-major)" />
                </svg>
              )}

              {/* Elements */}
              <div className="relative w-full h-full" style={{ zIndex: 1 }}>
                {elements.map(renderElement)}
              </div>

              {/* Drag Guide Lines */}
              {dragState.isDragging && (
                <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 2 }}>
                  {/* Vertical guide line */}
                  <div 
                    className="absolute top-0 bottom-0 w-px bg-primary/50"
                    style={{ 
                      left: elements.find(el => el.id === dragState.dragElement)?.x || 0 
                    }}
                  />
                  {/* Horizontal guide line */}
                  <div 
                    className="absolute left-0 right-0 h-px bg-primary/50"
                    style={{ 
                      top: elements.find(el => el.id === dragState.dragElement)?.y || 0 
                    }}
                  />
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Status Bar */}
      <div className="p-3 border-t bg-background/50 backdrop-blur">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-4">
            <span>
              Éléments: <span className="font-medium">{elements.length}</span>
            </span>
            {selectedElement && (
              <span>
                Sélectionné: <span className="font-medium">{selectedElement}</span>
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-4">
            <span>Modification: {new Date().toLocaleTimeString()}</span>
            <div className={cn(
              "w-2 h-2 rounded-full",
              dragState.isDragging ? "bg-orange-500" : "bg-green-500"
            )} />
          </div>
        </div>
      </div>
    </div>
  );
}
