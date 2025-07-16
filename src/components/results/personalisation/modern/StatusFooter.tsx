import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Info,
  AlertCircle,
  CheckCircle,
  Clock,
  Users,
  FileText,
  Save
} from 'lucide-react';
import { useTemplateEditorContext } from '@/contexts/TemplateEditorContext';

export function StatusFooter() {
  const { state } = useTemplateEditorContext();

  return (
    <div className="h-8 border-t bg-muted/50 flex items-center px-4 text-xs">
      <div className="flex items-center gap-4">
        {/* Document Status */}
        <div className="flex items-center gap-2">
          <CheckCircle className="w-3 h-3 text-green-500" />
          <span className="text-muted-foreground">Document prêt</span>
        </div>

        <Separator orientation="vertical" className="h-4" />

        {/* Element Count */}
        <div className="flex items-center gap-2">
          <FileText className="w-3 h-3 text-muted-foreground" />
          <span className="text-muted-foreground">4 éléments</span>
        </div>

        <Separator orientation="vertical" className="h-4" />

        {/* Auto-save Status */}
        <div className="flex items-center gap-2">
          <Save className="w-3 h-3 text-blue-500" />
          <span className="text-muted-foreground">Sauvegardé automatiquement</span>
          <Clock className="w-3 h-3 text-muted-foreground" />
          <span className="text-muted-foreground">il y a 2 min</span>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-4 ml-auto">
        {/* Current Mode */}
        <Badge variant={state.isPreviewMode ? "default" : "secondary"} className="text-xs">
          {state.isPreviewMode ? 'Aperçu' : 'Édition'}
        </Badge>

        {/* Help */}
        <Button variant="ghost" size="sm" className="h-6 text-xs text-muted-foreground">
          <Info className="w-3 h-3 mr-1" />
          Aide
        </Button>
      </div>
    </div>
  );
}