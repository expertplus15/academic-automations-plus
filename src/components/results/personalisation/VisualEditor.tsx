import React, { useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Layers } from 'lucide-react';
import { Template } from '@/services/TemplateService';
import { TemplateRenderer, getDefaultDataForTemplate } from '@/components/documents/templates/predefined/TemplateRenderer';
import { InteractiveTemplateEditor } from './InteractiveTemplateEditor';
import { EnhancedVisualEditor } from './editor/EnhancedVisualEditor';

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
  const templateData = useMemo(() => {
    if (!template) return {};
    return getDefaultDataForTemplate(template.type) || {};
  }, [template]);

  // Si pas de template sélectionné, afficher un placeholder
  if (!template) {
    return (
      <div className={cn("relative w-full h-full bg-gray-50 flex items-center justify-center", className)}>
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

  // Si en mode aperçu, afficher le template normal
  if (isPreviewMode) {
    return (
      <div className={cn("relative w-full h-full bg-gray-50", className)}>
        <div className="relative w-full h-full overflow-auto">
          <div 
            className="relative bg-white shadow-lg mx-auto my-8"
            style={{
              width: 595,
              height: 842,
              minHeight: 842,
              transform: `scale(${zoomLevel / 100})`,
              transformOrigin: 'top center'
            }}
          >
            <TemplateRenderer
              templateType={template.type}
              data={templateData}
              isEditable={false}
              onDataChange={onChange}
            />
          </div>
        </div>
        
        <div className="absolute top-4 left-4">
          <Badge variant="default">Aperçu</Badge>
        </div>
      </div>
    );
  }

  // Mode édition - utiliser l'éditeur visuel amélioré
  return (
    <EnhancedVisualEditor
      template={template}
      zoomLevel={zoomLevel}
      showGrid={showGrid}
      isPreviewMode={false}
      selectedElement={selectedElement}
      onElementSelect={onElementSelect}
      onChange={onChange}
      className={className}
    />
  );
}