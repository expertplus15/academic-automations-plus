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
  ExternalLink,
  Undo2,
  Redo2,
  Copy,
  Clipboard,
  Trash2,
  RotateCcw,
  Move,
  MousePointer2
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

          {/* Edit Controls */}
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" title="Annuler (Ctrl+Z)">
              <Undo2 className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" title="Refaire (Ctrl+Y)">
              <Redo2 className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" title="Copier (Ctrl+C)">
              <Copy className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" title="Coller (Ctrl+V)">
              <Clipboard className="w-4 h-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              title="Supprimer (Suppr)"
              disabled={!state.selectedElement}
              onClick={() => {
                if (state.selectedElement) {
                  actions.deleteElement(state.selectedElement);
                }
              }}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>

          <Separator orientation="vertical" className="h-6" />

          {/* View Controls */}
          <div className="flex items-center gap-2">
            <Button
              variant={state.isPreviewMode ? "default" : "outline"}
              size="sm"
              onClick={actions.togglePreviewMode}
              title="Basculer en mode aperçu"
            >
              <Eye className="w-4 h-4 mr-2" />
              Aperçu
            </Button>
            
            <Button
              variant={state.showGrid ? "default" : "outline"}
              size="sm"
              onClick={actions.toggleGrid}
              title="Afficher/masquer la grille"
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
          <Button variant="outline" size="sm" title="Importer un modèle">
            <Upload className="w-4 h-4 mr-2" />
            Importer
          </Button>
          
          <Button variant="outline" size="sm" title="Exporter le modèle">
            <Download className="w-4 h-4 mr-2" />
            Exporter
          </Button>

          <Button
            onClick={actions.saveTemplate}
            disabled={state.isSaving || !state.hasUnsavedChanges}
            size="sm"
            title="Sauvegarder les modifications"
            className={state.hasUnsavedChanges ? "bg-primary hover:bg-primary/90" : ""}
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