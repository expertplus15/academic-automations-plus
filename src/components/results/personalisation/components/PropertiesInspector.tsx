import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Settings,
  Palette,
  Type,
  Layout,
  Move,
  RotateCcw,
  Trash2,
  Copy,
  Eye,
  EyeOff
} from 'lucide-react';
import { useTemplateEditorContext } from '../providers/TemplateEditorProvider';

export function PropertiesInspector() {
  const { state, actions, currentTemplate } = useTemplateEditorContext();

  // Get the actual selected element from the template
  const selectedElement = currentTemplate && state.selectedElement 
    ? currentTemplate.content.elements?.find(el => el.id === state.selectedElement)
    : null;

  const handleElementUpdate = (updates: any) => {
    if (selectedElement) {
      actions.updateElement(selectedElement.id, updates);
    }
  };

  if (!selectedElement) {
    return (
      <div className="w-80 border-l bg-card/50 backdrop-blur flex flex-col">
        <div className="p-4 border-b">
          <h2 className="font-semibold text-lg">Propriétés</h2>
        </div>
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center text-muted-foreground">
            <Settings className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-sm">Sélectionnez un élément pour voir ses propriétés</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 border-l bg-card/50 backdrop-blur flex flex-col">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-semibold text-lg">Propriétés</h2>
          <div className="flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => {
                // TODO: Implement copy functionality
              }}
            >
              <Copy className="w-4 h-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => {
                if (selectedElement) {
                  actions.deleteElement(selectedElement.id);
                }
              }}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            {selectedElement.type}
          </Badge>
          <span className="text-sm font-medium truncate">
            {selectedElement.content?.name || selectedElement.type}
          </span>
        </div>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {/* Transform Properties */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Move className="w-4 h-4" />
                Position & Taille
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">X</Label>
                  <Input 
                    type="number" 
                    value={selectedElement.x} 
                    className="h-8 text-xs"
                    onChange={(e) => handleElementUpdate({ x: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Y</Label>
                  <Input 
                    type="number" 
                    value={selectedElement.y} 
                    className="h-8 text-xs"
                    onChange={(e) => handleElementUpdate({ y: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Largeur</Label>
                  <Input 
                    type="number" 
                    value={selectedElement.width} 
                    className="h-8 text-xs"
                    onChange={(e) => handleElementUpdate({ width: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Hauteur</Label>
                  <Input 
                    type="number" 
                    value={selectedElement.height} 
                    className="h-8 text-xs"
                    onChange={(e) => handleElementUpdate({ height: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Rotation</Label>
                <div className="flex items-center gap-2">
                  <Slider
                    value={[selectedElement.style?.rotation || 0]}
                    onValueChange={(value) => handleElementUpdate({ 
                      style: { ...selectedElement.style, rotation: value[0] }
                    })}
                    min={-180}
                    max={180}
                    step={1}
                    className="flex-1"
                  />
                  <span className="text-xs font-mono w-10 text-center">
                    {selectedElement.style?.rotation || 0}°
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Appearance Properties */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Palette className="w-4 h-4" />
                Apparence
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Opacité</Label>
                <div className="flex items-center gap-2">
                  <Slider
                    value={[selectedElement.style?.opacity || 100]}
                    onValueChange={(value) => handleElementUpdate({ 
                      style: { ...selectedElement.style, opacity: value[0] }
                    })}
                    min={0}
                    max={100}
                    step={1}
                    className="flex-1"
                  />
                  <span className="text-xs font-mono w-10 text-center">
                    {selectedElement.style?.opacity || 100}%
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Style</Label>
                <Select 
                  value={selectedElement.content?.style || 'modern'}
                  onValueChange={(value) => handleElementUpdate({
                    content: { ...selectedElement.content, style: value }
                  })}
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="modern">Moderne</SelectItem>
                    <SelectItem value="classic">Classique</SelectItem>
                    <SelectItem value="formal">Formel</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Arrière-plan</Label>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-8 h-8 rounded border border-border"
                      style={{ backgroundColor: selectedElement.style?.backgroundColor || '#ffffff' }}
                    />
                    <Input 
                      value={selectedElement.style?.backgroundColor || '#ffffff'}
                      className="h-8 text-xs flex-1"
                      onChange={(e) => handleElementUpdate({
                        style: { ...selectedElement.style, backgroundColor: e.target.value }
                      })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Texte</Label>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-8 h-8 rounded border border-border"
                      style={{ backgroundColor: selectedElement.style?.textColor || '#1f2937' }}
                    />
                    <Input 
                      value={selectedElement.style?.textColor || '#1f2937'}
                      className="h-8 text-xs flex-1"
                      onChange={(e) => handleElementUpdate({
                        style: { ...selectedElement.style, textColor: e.target.value }
                      })}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Element Specific Properties */}
          {selectedElement.type === 'header' && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Type className="w-4 h-4" />
                  Contenu
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Institution</Label>
                  <Input 
                    value={selectedElement.content?.institution || ''}
                    className="h-8 text-xs"
                    placeholder="Nom de l'institution..."
                    onChange={(e) => handleElementUpdate({
                      content: { ...selectedElement.content, institution: e.target.value }
                    })}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Layer Properties */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Layout className="w-4 h-4" />
                Calque
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-xs text-muted-foreground">Visible</Label>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => handleElementUpdate({
                    style: { ...selectedElement.style, visible: !(selectedElement.style?.visible !== false) }
                  })}
                >
                  {selectedElement.style?.visible !== false ? (
                    <Eye className="w-4 h-4" />
                  ) : (
                    <EyeOff className="w-4 h-4" />
                  )}
                </Button>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1 text-xs">
                  Avant
                </Button>
                <Button variant="outline" size="sm" className="flex-1 text-xs">
                  Arrière
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
}