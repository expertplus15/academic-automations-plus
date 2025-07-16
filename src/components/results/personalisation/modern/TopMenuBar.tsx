import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Menu,
  FileText,
  Save,
  Download,
  Upload,
  Eye,
  EyeOff,
  Undo,
  Redo,
  Copy,
  Clipboard,
  RotateCcw,
  Settings,
  HelpCircle,
  User,
  ChevronDown,
  Grid3X3,
  Ruler,
  Maximize2,
  Home
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useNavigate } from 'react-router-dom';
import { useTemplateEditorContext } from '@/contexts/TemplateEditorContext';

export function TopMenuBar() {
  const navigate = useNavigate();
  const { state, actions } = useTemplateEditorContext();
  const [activeTemplate, setActiveTemplate] = useState("Bulletin de Notes");

  return (
    <div className="h-14 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex items-center px-4 gap-4">
      {/* Left Section - Navigation & File */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/results")}
          className="gap-2"
        >
          <Home className="w-4 h-4" />
          Accueil
        </Button>
        
        <Separator orientation="vertical" className="h-6" />
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-2">
              <FileText className="w-4 h-4" />
              {activeTemplate}
              <ChevronDown className="w-3 h-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuItem>
              <FileText className="w-4 h-4 mr-2" />
              Nouveau Template
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Upload className="w-4 h-4 mr-2" />
              Importer
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Bulletin de Notes</DropdownMenuItem>
            <DropdownMenuItem>Certificat de Scolarité</DropdownMenuItem>
            <DropdownMenuItem>Diplôme</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm">
            <Save className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Download className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Center Section - Actions */}
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="sm" disabled>
          <Undo className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="sm" disabled>
          <Redo className="w-4 h-4" />
        </Button>
        
        <Separator orientation="vertical" className="h-6 mx-2" />
        
        <Button variant="ghost" size="sm">
          <Copy className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="sm" disabled>
          <Clipboard className="w-4 h-4" />
        </Button>
        
        <Separator orientation="vertical" className="h-6 mx-2" />
        
        <Button 
          variant={state.isPreviewMode ? "default" : "ghost"} 
          size="sm"
          onClick={() => actions.togglePreviewMode()}
          className="gap-2"
        >
          {state.isPreviewMode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          {state.isPreviewMode ? 'Édition' : 'Aperçu'}
        </Button>
      </div>

      {/* Right Section - View & User */}
      <div className="flex items-center gap-3 ml-auto">
        <div className="flex items-center gap-1">
          <Button 
            variant={state.showGrid ? "default" : "ghost"} 
            size="sm"
            onClick={() => actions.toggleGrid()}
          >
            <Grid3X3 className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Ruler className="w-4 h-4" />
          </Button>
          <Button 
            variant={state.isFullscreen ? "default" : "ghost"} 
            size="sm"
            onClick={() => actions.toggleFullscreen()}
          >
            <Maximize2 className="w-4 h-4" />
          </Button>
        </div>

        <Separator orientation="vertical" className="h-6" />

        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            Zoom {state.zoomLevel}%
          </Badge>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <User className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Settings className="w-4 h-4 mr-2" />
                Préférences
              </DropdownMenuItem>
              <DropdownMenuItem>
                <HelpCircle className="w-4 h-4 mr-2" />
                Aide
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}