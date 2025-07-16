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
  const { state, actions } = useTemplateEditorContext();

  // Mock element data - in real app, this would come from selected element
  const selectedElement = state.selectedElement ? {
    id: state.selectedElement,
    type: 'header',
    name: 'En-tête Principal',
    x: 50,
    y: 50,
    width: 694,
    height: 120,
    opacity: 100,
    rotation: 0,
    visible: true,
    locked: false,
    properties: {
      institution: "ÉTABLISSEMENT SCOLAIRE",
      style: 'modern',
      backgroundColor: '#ffffff',
      textColor: '#1f2937'
    }
  } : null;

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
            <Button variant="ghost" size="sm">
              <Copy className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            {selectedElement.type}
          </Badge>
          <span className="text-sm font-medium truncate">
            {selectedElement.name}
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
                    onChange={(e) => {
                      // Handle position change
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Y</Label>
                  <Input 
                    type="number" 
                    value={selectedElement.y} 
                    className="h-8 text-xs"
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
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Hauteur</Label>
                  <Input 
                    type="number" 
                    value={selectedElement.height} 
                    className="h-8 text-xs"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Rotation</Label>
                <div className="flex items-center gap-2">
                  <Slider
                    value={[selectedElement.rotation]}
                    onValueChange={() => {}}
                    min={-180}
                    max={180}
                    step={1}
                    className="flex-1"
                  />
                  <span className="text-xs font-mono w-10 text-center">
                    {selectedElement.rotation}°
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
                    value={[selectedElement.opacity]}
                    onValueChange={() => {}}
                    min={0}
                    max={100}
                    step={1}
                    className="flex-1"
                  />
                  <span className="text-xs font-mono w-10 text-center">
                    {selectedElement.opacity}%
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Style</Label>
                <Select value={selectedElement.properties.style}>
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
                      style={{ backgroundColor: selectedElement.properties.backgroundColor }}
                    />
                    <Input 
                      value={selectedElement.properties.backgroundColor}
                      className="h-8 text-xs flex-1"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Texte</Label>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-8 h-8 rounded border border-border"
                      style={{ backgroundColor: selectedElement.properties.textColor }}
                    />
                    <Input 
                      value={selectedElement.properties.textColor}
                      className="h-8 text-xs flex-1"
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
                    value={selectedElement.properties.institution}
                    className="h-8 text-xs"
                    placeholder="Nom de l'institution..."
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
                >
                  {selectedElement.visible ? (
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