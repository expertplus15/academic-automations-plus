import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Layers } from 'lucide-react';
import { useTemplateEditorContext } from '../providers/TemplateEditorProvider';

export function CanvasWorkspace() {
  const { state, actions, currentTemplate } = useTemplateEditorContext();

  const handleElementClick = (elementId: string) => {
    actions.setSelectedElement(elementId);
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      actions.setSelectedElement(null);
    }
  };

  if (!currentTemplate) {
    return (
      <div className="flex-1 bg-muted/20 relative overflow-hidden flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center mx-auto mb-4">
            <Layers className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Aucun template sélectionné</h3>
          <p className="text-muted-foreground">
            Sélectionnez un template dans la liste déroulante pour commencer
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-muted/20 relative overflow-hidden">
      <div className="relative w-full h-full overflow-auto" onClick={handleCanvasClick}>
        <div 
          className="relative bg-white shadow-lg mx-auto my-8"
          style={{
            width: 595,
            height: 842,
            minHeight: 842,
            transform: `scale(${state.zoomLevel / 100})`,
            transformOrigin: 'top center'
          }}
        >
          {/* Grid overlay */}
          {state.showGrid && (
            <div 
              className="absolute inset-0 pointer-events-none opacity-20"
              style={{
                backgroundImage: `
                  linear-gradient(to right, #cbd5e1 1px, transparent 1px),
                  linear-gradient(to bottom, #cbd5e1 1px, transparent 1px)
                `,
                backgroundSize: '20px 20px'
              }}
            />
          )}

          {/* Render template elements */}
          {currentTemplate.content.elements?.map((element) => (
            <div
              key={element.id}
              className={cn(
                "absolute border-2 cursor-pointer transition-all duration-200",
                state.selectedElement === element.id 
                  ? "border-primary bg-primary/5" 
                  : "border-transparent hover:border-muted-foreground/30"
              )}
              style={{
                left: element.x,
                top: element.y,
                width: element.width,
                height: element.height,
                transform: element.style?.rotation ? `rotate(${element.style.rotation}deg)` : undefined,
                opacity: (element.style?.opacity || 100) / 100,
                backgroundColor: element.style?.backgroundColor || 'transparent',
                color: element.style?.textColor || '#000000',
                display: element.style?.visible === false ? 'none' : 'block'
              }}
              onClick={(e) => {
                e.stopPropagation();
                handleElementClick(element.id);
              }}
            >
              {/* Element content based on type */}
              {element.type === 'header' && (
                <div className="w-full h-full flex items-center justify-center text-center p-4">
                  <div>
                    <h1 className="text-xl font-bold">
                      {element.content?.institution || 'ÉTABLISSEMENT SCOLAIRE'}
                    </h1>
                    <p className="text-sm opacity-75">En-tête du document</p>
                  </div>
                </div>
              )}
              
              {element.type === 'logo' && (
                <div className="w-full h-full border-2 border-dashed border-muted-foreground/30 flex items-center justify-center">
                  <span className="text-xs text-muted-foreground">LOGO</span>
                </div>
              )}

              {/* Selection indicator */}
              {state.selectedElement === element.id && (
                <div className="absolute -top-6 left-0">
                  <Badge variant="default" className="text-xs">
                    {element.content?.name || element.type}
                  </Badge>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {state.isPreviewMode && (
        <div className="absolute top-4 left-4">
          <Badge variant="default">Aperçu</Badge>
        </div>
      )}
    </div>
  );
}