import React from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Eye, 
  Save,
  ZoomIn,
  ZoomOut,
  Grid,
  Download,
  Upload,
  Maximize,
  Minimize,
  ExternalLink
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTemplateEditorContext } from '@/contexts/TemplateEditorContext';
import { TemplateSelector } from '../components/TemplateSelector';
import { ZoomControls } from '../components/ZoomControls';

export function EditorToolbar() {
  const navigate = useNavigate();
  const { state, actions } = useTemplateEditorContext();

  return (
    <div className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
      <div className="flex items-center justify-between px-6 py-3">
        <div className="flex items-center gap-4">
          {/* Template Selector */}
          <TemplateSelector />

          <Separator orientation="vertical" className="h-6" />

          {/* View Controls */}
          <div className="flex items-center gap-2">
            <Button
              variant={state.isPreviewMode ? "default" : "outline"}
              size="sm"
              onClick={actions.togglePreviewMode}
            >
              <Eye className="w-4 h-4 mr-2" />
              Aperçu
            </Button>
            
            <Button
              variant={state.showGrid ? "default" : "outline"}
              size="sm"
              onClick={actions.toggleGrid}
            >
              <Grid className="w-4 h-4 mr-2" />
              Grille
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Zoom Controls */}
          <ZoomControls />

          <Separator orientation="vertical" className="h-6" />

          {/* Action Buttons */}
          <Button variant="outline" size="sm">
            <Upload className="w-4 h-4 mr-2" />
            Importer
          </Button>
          
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Exporter
          </Button>

          <Button
            onClick={actions.saveTemplate}
            disabled={state.isSaving || !state.hasUnsavedChanges}
            size="sm"
          >
            <Save className="w-4 h-4 mr-2" />
            {state.isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/results/documentation')}
            title="Gérer les types de documents"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Documentation
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={actions.toggleFullscreen}
          >
            {state.isFullscreen ? (
              <Minimize className="w-4 h-4" />
            ) : (
              <Maximize className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}