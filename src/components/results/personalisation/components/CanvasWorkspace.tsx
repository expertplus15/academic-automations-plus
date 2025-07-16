import React, { useRef, useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Grid3X3,
  Crosshair,
  Move,
  Maximize2,
  MousePointer2
} from 'lucide-react';
import { useTemplateEditorContext } from '../providers/TemplateEditorProvider';
import { BlockLibrary } from '../blocks/BlockLibrary';

export function CanvasWorkspace() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const { state, actions, currentTemplate } = useTemplateEditorContext();
  
  const [dragState, setDragState] = useState({
    isDragging: false,
    dragOffset: { x: 0, y: 0 },
    dragElement: null as string | null
  });

  const canvasSize = { width: 794, height: 1123 }; // A4 format in pixels

  // Sample elements - in real app, these would come from the template
  const elements = currentTemplate?.content?.elements || [
    {
      id: 'header-1',
      type: 'header' as const,
      x: 50,
      y: 50,
      width: 694,
      height: 120,
      data: {
        institution: "ÉTABLISSEMENT SCOLAIRE MODERNE",
        address: "123 Avenue de l'Excellence, 75001 Paris",
        phone: "01 23 45 67 89",
        email: "contact@ecole-moderne.fr",
        style: 'modern'
      }
    },
    {
      id: 'table-1', 
      type: 'table' as const,
      x: 50,
      y: 250,
      width: 694,
      height: 300,
      data: {
        title: "Relevé de Notes - Semestre 1",
        columns: ["Matière", "Note /20", "Coefficient", "Points"],
        rows: [
          ["Mathématiques", 16.5, 4, 66],
          ["Français", 14.0, 3, 42],
          ["Histoire-Géographie", 15.5, 2, 31],
          ["Sciences Physiques", 17.0, 3, 51],
          ["Anglais", 15.0, 2, 30]
        ],
        style: 'academic',
        showHeader: true
      }
    },
    {
      id: 'signature-1',
      type: 'signature' as const, 
      x: 450,
      y: 800,
      width: 294,
      height: 150,
      data: {
        title: "Le Directeur des Études",
        position: "Directeur Académique",
        style: 'formal',
        includeDate: true,
        includeLocation: true
      }
    },
    {
      id: 'logo-1',
      type: 'logo' as const,
      x: 50,
      y: 800,
      width: 100,
      height: 100,
      data: {
        alt: "Logo de l'établissement",
        size: 'large',
        position: 'left',
        style: 'default'
      }
    }
  ];

  // Handle canvas drop
  const handleCanvasDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const elementType = e.dataTransfer.getData('text/plain');
    if (!elementType || state.isPreviewMode) return;

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = (e.clientX - rect.left - 50) / (state.zoomLevel / 100);
    const y = (e.clientY - rect.top - 50) / (state.zoomLevel / 100);

    actions.addElement(elementType, { x: Math.max(0, x), y: Math.max(0, y) });
  }, [actions, state.isPreviewMode, state.zoomLevel]);

  const handleCanvasDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  // Handle element selection
  const handleElementSelect = useCallback((elementId: string) => {
    actions.setSelectedElement(elementId);
  }, [actions]);

  // Handle zoom controls
  const handleZoomIn = () => {
    const newZoom = Math.min(200, state.zoomLevel + 25);
    // Zoom functionality to be implemented
  };

  const handleZoomOut = () => {
    const newZoom = Math.max(25, state.zoomLevel - 25);
    // Zoom functionality to be implemented
  };

  const handleZoomFit = () => {
    // Zoom functionality to be implemented
  };

  const handleZoomChange = (value: number[]) => {
    // Zoom functionality to be implemented
  };

  // Grid pattern component
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

  return (
    <div className="flex-1 flex flex-col bg-muted/30">
      {/* Canvas Controls */}
      <div className="h-14 border-b bg-background/80 backdrop-blur flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              Format A4
            </Badge>
            <span className="text-xs text-muted-foreground">
              {canvasSize.width} × {canvasSize.height} px
            </span>
          </div>
          
          {state.selectedElement && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Crosshair className="w-3 h-3" />
              Élément sélectionné
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          {/* Zoom Controls */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={handleZoomOut}>
              <ZoomOut className="w-4 h-4" />
            </Button>
            
            <div className="flex items-center gap-2 min-w-[120px]">
              <Slider
                value={[state.zoomLevel]}
                onValueChange={handleZoomChange}
                min={25}
                max={200}
                step={25}
                className="flex-1"
              />
              <span className="text-xs font-mono w-10 text-center">
                {state.zoomLevel}%
              </span>
            </div>
            
            <Button variant="ghost" size="sm" onClick={handleZoomIn}>
              <ZoomIn className="w-4 h-4" />
            </Button>
            
            <Button variant="ghost" size="sm" onClick={handleZoomFit}>
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>

          {/* View Controls */}
          <div className="flex items-center gap-1">
            <Button 
              variant={state.showGrid ? "default" : "ghost"} 
              size="sm"
              onClick={() => actions.toggleGrid()}
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            
            <Button 
              variant={state.isFullscreen ? "default" : "ghost"} 
              size="sm"
              onClick={() => actions.toggleFullscreen()}
            >
              <Maximize2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 overflow-auto bg-muted/20 p-8">
        <div className="flex justify-center">
          <div 
            className="relative bg-white shadow-2xl"
            style={{
              width: canvasSize.width * (state.zoomLevel / 100),
              height: canvasSize.height * (state.zoomLevel / 100),
              transform: `scale(1)`,
              transformOrigin: 'top left'
            }}
          >
            {/* Canvas Container */}
            <div
              ref={canvasRef}
              className="relative w-full h-full overflow-hidden"
              onDrop={handleCanvasDrop}
              onDragOver={handleCanvasDragOver}
              style={{ cursor: state.isPreviewMode ? 'default' : 'crosshair' }}
            >
              {/* Grid Background */}
              {state.showGrid && (
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  <GridPattern />
                  <rect 
                    width="100%" 
                    height="100%" 
                    fill="url(#grid)" 
                  />
                  <rect 
                    width="100%" 
                    height="100%" 
                    fill="url(#grid-major)" 
                  />
                </svg>
              )}

              {/* Canvas Content */}
              <div 
                className="relative w-full h-full"
                style={{
                  transform: `scale(${state.zoomLevel / 100})`,
                  transformOrigin: 'top left',
                  width: `${100 / (state.zoomLevel / 100)}%`,
                  height: `${100 / (state.zoomLevel / 100)}%`
                }}
              >
                {/* Render Elements */}
                {elements.map((element) => (
                  <div
                    key={element.id}
                    className={cn(
                      "absolute transition-all duration-200",
                      !state.isPreviewMode && "hover:shadow-lg cursor-move",
                      state.selectedElement === element.id && "z-10"
                    )}
                    style={{
                      left: element.x,
                      top: element.y,
                      width: element.width,
                      height: element.height,
                    }}
                    onClick={() => !state.isPreviewMode && handleElementSelect(element.id)}
                  >
                    <BlockLibrary
                      type={element.type}
                      id={element.id}
                      data={element.data}
                      isSelected={state.selectedElement === element.id}
                      onSelect={handleElementSelect}
                      className="w-full h-full"
                    />
                  </div>
                ))}

                {/* Drop Zone Indicator */}
                {!state.isPreviewMode && (
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="w-full h-full border-2 border-dashed border-transparent hover:border-primary/30 transition-colors" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}