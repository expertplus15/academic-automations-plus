import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Eye,
  EyeOff,
  Edit3,
  MonitorSpeaker,
  Smartphone,
  Tablet,
  Zap,
  RefreshCw,
  Settings2,
  Play,
  Pause
} from 'lucide-react';
import { useTemplateEditorContext } from '@/contexts/TemplateEditorContext';
import { cn } from '@/lib/utils';

interface PreviewModeToggleProps {
  onPreviewChange?: (isPreview: boolean) => void;
}

export function PreviewModeToggle({ onPreviewChange }: PreviewModeToggleProps) {
  const { state, actions } = useTemplateEditorContext();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [autoUpdate, setAutoUpdate] = useState(true);

  const handleTogglePreview = async () => {
    setIsTransitioning(true);
    
    // Add a small delay for smooth transition
    await new Promise(resolve => setTimeout(resolve, 150));
    
    actions.togglePreviewMode();
    onPreviewChange?.(!state.isPreviewMode);
    
    setIsTransitioning(false);
  };

  const toggleAutoUpdate = () => {
    setAutoUpdate(!autoUpdate);
  };

  return (
    <div className="flex items-center gap-3">
      {/* Mode Indicator */}
      <div className="flex items-center gap-2">
        <Badge 
          variant={state.isPreviewMode ? "default" : "secondary"} 
          className={cn(
            "text-xs transition-all duration-200",
            state.isPreviewMode && "bg-primary text-primary-foreground",
            !state.isPreviewMode && "bg-secondary text-secondary-foreground"
          )}
        >
          {state.isPreviewMode ? (
            <>
              <Eye className="w-3 h-3 mr-1" />
              Mode Aperçu
            </>
          ) : (
            <>
              <Edit3 className="w-3 h-3 mr-1" />
              Mode Édition
            </>
          )}
        </Badge>

        {state.isPreviewMode && autoUpdate && (
          <Badge variant="outline" className="text-xs">
            <Zap className="w-3 h-3 mr-1" />
            Live
          </Badge>
        )}
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* Preview Controls */}
      <div className="flex items-center gap-1">
        <Button
          variant={state.isPreviewMode ? "default" : "outline"}
          size="sm"
          onClick={handleTogglePreview}
          disabled={isTransitioning}
          className={cn(
            "gap-2 transition-all duration-200",
            isTransitioning && "opacity-50"
          )}
        >
          {isTransitioning ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : state.isPreviewMode ? (
            <>
              <EyeOff className="w-4 h-4" />
              Édition
            </>
          ) : (
            <>
              <Eye className="w-4 h-4" />
              Aperçu
            </>
          )}
        </Button>

        {state.isPreviewMode && (
          <>
            <Button
              variant={autoUpdate ? "default" : "ghost"}
              size="sm"
              onClick={toggleAutoUpdate}
              className="gap-2"
            >
              {autoUpdate ? (
                <>
                  <Pause className="w-4 h-4" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  Auto
                </>
              )}
            </Button>

            <Button variant="ghost" size="sm">
              <Settings2 className="w-4 h-4" />
            </Button>
          </>
        )}
      </div>

      {/* Device Preview Icons (when in preview mode) */}
      {state.isPreviewMode && (
        <>
          <Separator orientation="vertical" className="h-6" />
          
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
              <MonitorSpeaker className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
              <Tablet className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
              <Smartphone className="w-4 h-4" />
            </Button>
          </div>
        </>
      )}
    </div>
  );
}