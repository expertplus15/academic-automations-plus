import React from 'react';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut } from 'lucide-react';
import { useTemplateEditorContext } from '../providers/TemplateEditorProvider';

export function ZoomControls() {
  const { state, actions } = useTemplateEditorContext();

  return (
    <div className="flex items-center gap-1 bg-muted/50 rounded-md p-1">
      <Button variant="ghost" size="sm" onClick={actions.handleZoomOut}>
        <ZoomOut className="w-4 h-4" />
      </Button>
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={actions.handleZoomReset}
        className="min-w-[60px] text-xs"
      >
        {state.zoomLevel}%
      </Button>
      <Button variant="ghost" size="sm" onClick={actions.handleZoomIn}>
        <ZoomIn className="w-4 h-4" />
      </Button>
    </div>
  );
}