import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import { useTemplateEditorContext } from '@/contexts/TemplateEditorContext';

export function EditorStatusBar() {
  const { state, currentTemplate } = useTemplateEditorContext();

  if (!currentTemplate) return null;

  return (
    <div className="flex items-center justify-between px-6 py-2 border-t bg-muted/20">
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <span>{currentTemplate.name} ({currentTemplate.type})</span>
        <span>•</span>
        <span>Version {currentTemplate.version}</span>
        {state.hasUnsavedChanges && (
          <>
            <span>•</span>
            <span className="text-orange-600">Modifications non sauvegardées</span>
          </>
        )}
      </div>
      
      <div className="flex items-center gap-2">
        <Badge variant={currentTemplate.is_active ? "default" : "secondary"}>
          {currentTemplate.is_active ? "Actif" : "Inactif"}
        </Badge>
        <Button variant="ghost" size="sm">
          <Sparkles className="w-4 h-4 mr-1" />
          IA Assistant
        </Button>
      </div>
    </div>
  );
}