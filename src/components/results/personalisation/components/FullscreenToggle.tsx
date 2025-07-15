import React from 'react';
import { Button } from '@/components/ui/button';
import { Minimize } from 'lucide-react';
import { useTemplateEditorContext } from '@/contexts/TemplateEditorContext';

export function FullscreenToggle() {
  const { state, actions } = useTemplateEditorContext();

  if (!state.isFullscreen) return null;

  return (
    <div className="absolute top-4 right-4 z-10">
      <Button variant="outline" size="sm" onClick={actions.toggleFullscreen}>
        <Minimize className="w-4 h-4" />
      </Button>
    </div>
  );
}