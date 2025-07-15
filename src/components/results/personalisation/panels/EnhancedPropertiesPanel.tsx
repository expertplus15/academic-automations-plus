import React, { useState, useCallback, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  Settings2,
  Type,
  Palette,
  Layout,
  Zap,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Bold,
  Italic,
  Underline,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Copy,
  Trash2,
  Move,
  RotateCcw,
  FlipHorizontal,
  FlipVertical
} from 'lucide-react';
import { Template } from '@/services/TemplateService';

interface EnhancedPropertiesPanelProps {
  selectedElement: string | null;
  template?: Template;
  onChange: (content: any) => void;
}

export function EnhancedPropertiesPanel({ selectedElement, template, onChange }: EnhancedPropertiesPanelProps) {
  const [elementProperties, setElementProperties] = useState({
    id: selectedElement || '',
    type: selectedElement?.includes('text') ? 'text' : 
          selectedElement?.includes('variable') ? 'variable' : 
          selectedElement?.includes('image') ? 'image' : 'text',
    content: {
      text: selectedElement?.includes('title') ? 'BULLETIN DE NOTES' : 'Nouveau texte',
      fontSize: selectedElement?.includes('title') ? 24 : 16,
      fontWeight: selectedElement?.includes('title') ? 'bold' : 'normal',
      fontFamily: 'Arial',
      variable: selectedElement?.includes('student') ? 'student.fullName' : '',
      label: selectedElement?.includes('student') ? 'Nom de l\'étudiant' : '',
      src: '',
      alt: selectedElement?.includes('logo') ? 'Logo de l\'établissement' : ''
    },
    style: {
      color: '#1F2937',
      backgroundColor: 'transparent',
      textAlign: selectedElement?.includes('title') ? 'center' : 'left',
      padding: 8,
      margin: 4,
      borderWidth: 0,
      borderColor: '#E5E7EB',
      borderRadius: 4,
      opacity: 100,
      fontStyle: 'normal',
      textDecoration: 'none'
    },
    position: { 
      x: selectedElement?.includes('title') ? 50 : selectedElement?.includes('logo') ? 450 : 50, 
      y: selectedElement?.includes('title') ? 50 : selectedElement?.includes('student') ? 130 : 50,
      rotation: 0
    },
    size: { 
      width: selectedElement?.includes('title') ? 400 : selectedElement?.includes('logo') ? 80 : 300, 
      height: selectedElement?.includes('title') ? 60 : selectedElement?.includes('logo') ? 80 : 30 
    },
    locked: false,
    hidden: false
  });

  // Update properties when selected element changes
  useEffect(() => {
    if (selectedElement) {
      setElementProperties(prev => ({
        ...prev,
        id: selectedElement,
        type: selectedElement.includes('text') ? 'text' : 
              selectedElement.includes('variable') ? 'variable' : 
              selectedElement.includes('image') ? 'image' : 'text'
      }));
    }
  }, [selectedElement]);

  // Available fonts
  const fonts = [
    'Arial', 'Helvetica', 'Times New Roman', 'Georgia', 'Verdana', 
    'Tahoma', 'Trebuchet MS', 'Impact', 'Courier New', 'Comic Sans MS'
  ];

  // Font weights
  const fontWeights = [
    { value: 'normal', label: 'Normal' },
    { value: 'bold', label: 'Gras' },
    { value: '100', label: 'Très fin' },
    { value: '300', label: 'Fin' },
    { value: '500', label: 'Moyen' },
    { value: '700', label: 'Gras' },
    { value: '900', label: 'Très gras' }
  ];

  // Text alignments
  const textAlignments = [
    { value: 'left', icon: AlignLeft, label: 'Gauche' },
    { value: 'center', icon: AlignCenter, label: 'Centre' },
    { value: 'right', icon: AlignRight, label: 'Droite' },
    { value: 'justify', icon: AlignJustify, label: 'Justifié' }
  ];

  // Color presets
  const colorPresets = [
    '#000000', '#374151', '#6B7280', '#FFFFFF',
    '#DC2626', '#EF4444', '#F87171', '#FEE2E2',
    '#D97706', '#F59E0B', '#FBBF24', '#FEF3C7',
    '#059669', '#10B981', '#34D399', '#D1FAE5',
    '#2563EB', '#3B82F6', '#60A5FA', '#DBEAFE',
    '#7C3AED', '#8B5CF6', '#A78BFA', '#EDE9FE'
  ];

  // Template variables
  const templateVariables = [
    { value: 'student.fullName', label: 'Nom complet' },
    { value: 'student.studentNumber', label: 'Numéro étudiant' },
    { value: 'student.email', label: 'Email' },
    { value: 'student.program', label: 'Programme d\'études' },
    { value: 'academic.currentYear', label: 'Année académique' },
    { value: 'academic.semester', label: 'Semestre' },
    { value: 'grades.average', label: 'Moyenne générale' },
    { value: 'institution.name', label: 'Nom de l\'établissement' },
    { value: 'institution.address', label: 'Adresse' },
    { value: 'document.date', label: 'Date du document' },
    { value: 'document.number', label: 'Numéro de document' }
  ];

  const handlePropertyChange = useCallback((property: string, value: any) => {
    setElementProperties(prev => {
      const updated = {
        ...prev,
        [property]: typeof prev[property as keyof typeof prev] === 'object' && prev[property as keyof typeof prev] !== null
          ? { ...(prev[property as keyof typeof prev] as object), ...value }
          : value
      };
      onChange(updated);
      return updated;
    });
  }, [onChange]);

  const handleStyleChange = useCallback((styleProp: string, value: any) => {
    handlePropertyChange('style', { [styleProp]: value });
  }, [handlePropertyChange]);

  const handleContentChange = useCallback((contentProp: string, value: any) => {
    handlePropertyChange('content', { [contentProp]: value });
  }, [handlePropertyChange]);

  if (!selectedElement) {
    return (
      <div className="h-full flex flex-col">
        <div className="p-4 border-b">
          <h3 className="font-semibold text-lg">Propriétés</h3>
        </div>
        
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center space-y-3">
            <Settings2 className="w-12 h-12 text-muted-foreground mx-auto" />
            <div>
              <h4 className="font-medium">Aucun élément sélectionné</h4>
              <p className="text-sm text-muted-foreground">
                Cliquez sur un élément du canvas pour modifier ses propriétés
              </p>
            </div>
            <div className="text-xs text-muted-foreground space-y-1">
              <div>• Faites glisser pour déplacer</div>
              <div>• Double-clic pour éditer</div>
              <div>• Ctrl+C/V pour copier/coller</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header Enhanced */}
      <div className="p-4 border-b bg-card/50">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg">Propriétés</h3>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handlePropertyChange('hidden', !elementProperties.hidden)}
              title={elementProperties.hidden ? "Afficher" : "Masquer"}
            >
              {elementProperties.hidden ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handlePropertyChange('locked', !elementProperties.locked)}
              title={elementProperties.locked ? "Déverrouiller" : "Verrouiller"}
            >
              {elementProperties.locked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
            </Button>
            <Button variant="ghost" size="sm" title="Dupliquer">
              <Copy className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" title="Supprimer">
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        <div className="mt-2 flex items-center gap-2">
          <Badge variant="outline" className="capitalize">
            {elementProperties.type}
          </Badge>
          <span className="text-sm text-muted-foreground">
            ID: {elementProperties.id}
          </span>
        </div>
      </div>

      {/* Content Enhanced */}
      <ScrollArea className="flex-1">
        <div className="p-4">
          <Tabs defaultValue="content" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="content">Contenu</TabsTrigger>
              <TabsTrigger value="style">Style</TabsTrigger>
              <TabsTrigger value="layout">Position</TabsTrigger>
              <TabsTrigger value="advanced">Avancé</TabsTrigger>
            </TabsList>

            <TabsContent value="content" className="space-y-4 mt-4">
              {/* Text Content Enhanced */}
              {elementProperties.type === 'text' && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="text">Texte</Label>
                    <Textarea
                      id="text"
                      value={elementProperties.content.text || ''}
                      onChange={(e) => handleContentChange('text', e.target.value)}
                      placeholder="Entrez votre texte..."
                      className="mt-1 min-h-[80px]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="fontSize">Taille (px)</Label>
                      <Input
                        id="fontSize"
                        type="number"
                        min="8"
                        max="72"
                        value={elementProperties.content.fontSize || 16}
                        onChange={(e) => handleContentChange('fontSize', parseInt(e.target.value))}
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="fontWeight">Graisse</Label>
                      <Select
                        value={elementProperties.content.fontWeight || 'normal'}
                        onValueChange={(value) => handleContentChange('fontWeight', value)}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {fontWeights.map((weight) => (
                            <SelectItem key={weight.value} value={weight.value}>
                              {weight.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="fontFamily">Police</Label>
                    <Select
                      value={elementProperties.content.fontFamily || 'Arial'}
                      onValueChange={(value) => handleContentChange('fontFamily', value)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {fonts.map((font) => (
                          <SelectItem key={font} value={font}>
                            <span style={{ fontFamily: font }}>{font}</span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Text Style Toggles */}
                  <div>
                    <Label>Style de texte</Label>
                    <div className="flex gap-1 mt-2">
                      <Button
                        variant={elementProperties.style.fontStyle === 'italic' ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleStyleChange('fontStyle', 
                          elementProperties.style.fontStyle === 'italic' ? 'normal' : 'italic')}
                      >
                        <Italic className="w-4 h-4" />
                      </Button>
                      <Button
                        variant={elementProperties.style.textDecoration === 'underline' ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleStyleChange('textDecoration', 
                          elementProperties.style.textDecoration === 'underline' ? 'none' : 'underline')}
                      >
                        <Underline className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Variable Content Enhanced */}
              {elementProperties.type === 'variable' && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="variable">Variable</Label>
                    <Select
                      value={elementProperties.content.variable || ''}
                      onValueChange={(value) => handleContentChange('variable', value)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Sélectionner une variable..." />
                      </SelectTrigger>
                      <SelectContent>
                        {templateVariables.map((variable) => (
                          <SelectItem key={variable.value} value={variable.value}>
                            {variable.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="label">Libellé d'affichage</Label>
                    <Input
                      id="label"
                      value={elementProperties.content.label || ''}
                      onChange={(e) => handleContentChange('label', e.target.value)}
                      placeholder="Libellé optionnel"
                      className="mt-1"
                    />
                  </div>

                  <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded">
                    <strong>Aperçu:</strong> {elementProperties.content.label || elementProperties.content.variable || 'Aucune variable sélectionnée'}
                  </div>
                </div>
              )}

              {/* Image Content Enhanced */}
              {elementProperties.type === 'image' && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="imageSrc">Source de l'image</Label>
                    <Input
                      id="imageSrc"
                      value={elementProperties.content.src || ''}
                      onChange={(e) => handleContentChange('src', e.target.value)}
                      placeholder="URL ou chemin de l'image"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="imageAlt">Texte alternatif</Label>
                    <Input
                      id="imageAlt"
                      value={elementProperties.content.alt || ''}
                      onChange={(e) => handleContentChange('alt', e.target.value)}
                      placeholder="Description pour l'accessibilité"
                      className="mt-1"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Actions</Label>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        Parcourir
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        URL
                      </Button>
                    </div>
                  </div>

                  {elementProperties.content.src && (
                    <div className="border rounded p-2">
                      <img 
                        src={elementProperties.content.src} 
                        alt={elementProperties.content.alt}
                        className="max-w-full h-20 object-contain mx-auto"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>
              )}
            </TabsContent>

            <TabsContent value="style" className="space-y-4 mt-4">
              {/* Colors Enhanced */}
              <div className="space-y-4">
                <div>
                  <Label>Couleur du texte</Label>
                  <div className="mt-2">
                    <div className="grid grid-cols-8 gap-1 mb-2">
                      {colorPresets.map((color) => (
                        <button
                          key={color}
                          className="w-6 h-6 rounded border-2 border-background hover:scale-110 transition-transform"
                          style={{ backgroundColor: color }}
                          onClick={() => handleStyleChange('color', color)}
                          title={color}
                        />
                      ))}
                    </div>
                    <Input
                      type="color"
                      value={elementProperties.style.color || '#000000'}
                      onChange={(e) => handleStyleChange('color', e.target.value)}
                      className="w-full h-10"
                    />
                  </div>
                </div>

                <div>
                  <Label>Couleur de fond</Label>
                  <div className="mt-2">
                    <div className="grid grid-cols-8 gap-1 mb-2">
                      {colorPresets.map((color) => (
                        <button
                          key={color}
                          className="w-6 h-6 rounded border-2 border-background hover:scale-110 transition-transform"
                          style={{ backgroundColor: color }}
                          onClick={() => handleStyleChange('backgroundColor', color)}
                          title={color}
                        />
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={elementProperties.style.backgroundColor === 'transparent' ? '#ffffff' : elementProperties.style.backgroundColor || '#ffffff'}
                        onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                        className="flex-1 h-10"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStyleChange('backgroundColor', 'transparent')}
                      >
                        Transparent
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Text Alignment Enhanced */}
              <div>
                <Label>Alignement du texte</Label>
                <div className="flex gap-1 mt-2">
                  {textAlignments.map((alignment) => (
                    <Button
                      key={alignment.value}
                      variant={elementProperties.style.textAlign === alignment.value ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleStyleChange('textAlign', alignment.value)}
                      title={alignment.label}
                    >
                      <alignment.icon className="w-4 h-4" />
                    </Button>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Enhanced Border Controls */}
              <div className="space-y-4">
                <div>
                  <Label>Bordure</Label>
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    <div>
                      <Label className="text-xs">Épaisseur</Label>
                      <Slider
                        value={[elementProperties.style.borderWidth || 0]}
                        onValueChange={(value) => handleStyleChange('borderWidth', value[0])}
                        max={10}
                        step={1}
                        className="mt-1"
                      />
                      <span className="text-xs text-muted-foreground">
                        {elementProperties.style.borderWidth || 0}px
                      </span>
                    </div>

                    <div>
                      <Label className="text-xs">Rayon</Label>
                      <Slider
                        value={[elementProperties.style.borderRadius || 0]}
                        onValueChange={(value) => handleStyleChange('borderRadius', value[0])}
                        max={50}
                        step={1}
                        className="mt-1"
                      />
                      <span className="text-xs text-muted-foreground">
                        {elementProperties.style.borderRadius || 0}px
                      </span>
                    </div>
                  </div>

                  <Input
                    type="color"
                    value={elementProperties.style.borderColor || '#E5E7EB'}
                    onChange={(e) => handleStyleChange('borderColor', e.target.value)}
                    className="w-full h-8 mt-2"
                  />
                </div>
              </div>

              <Separator />

              {/* Opacity Enhanced */}
              <div>
                <Label>Opacité</Label>
                <Slider
                  value={[elementProperties.style.opacity || 100]}
                  onValueChange={(value) => handleStyleChange('opacity', value[0])}
                  max={100}
                  min={0}
                  step={5}
                  className="mt-2"
                />
                <span className="text-xs text-muted-foreground">
                  {elementProperties.style.opacity || 100}%
                </span>
              </div>
            </TabsContent>

            <TabsContent value="layout" className="space-y-4 mt-4">
              {/* Position Enhanced */}
              <div className="space-y-3">
                <h4 className="font-medium text-sm flex items-center gap-2">
                  <Move className="w-4 h-4" />
                  Position
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="posX">X (px)</Label>
                    <Input
                      id="posX"
                      type="number"
                      value={elementProperties.position.x}
                      onChange={(e) => handlePropertyChange('position', { ...elementProperties.position, x: parseInt(e.target.value) || 0 })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="posY">Y (px)</Label>
                    <Input
                      id="posY"
                      type="number"
                      value={elementProperties.position.y}
                      onChange={(e) => handlePropertyChange('position', { ...elementProperties.position, y: parseInt(e.target.value) || 0 })}
                      className="mt-1"
                    />
                  </div>
                </div>

                {/* Quick Position Buttons */}
                <div>
                  <Label className="text-xs">Alignement rapide</Label>
                  <div className="grid grid-cols-3 gap-1 mt-1">
                    <Button variant="outline" size="sm" onClick={() => handlePropertyChange('position', { ...elementProperties.position, x: 0 })}>
                      Gauche
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handlePropertyChange('position', { ...elementProperties.position, x: 200 })}>
                      Centre
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handlePropertyChange('position', { ...elementProperties.position, x: 400 })}>
                      Droite
                    </Button>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Size Enhanced */}
              <div className="space-y-3">
                <h4 className="font-medium text-sm">Dimensions</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="width">Largeur (px)</Label>
                    <Input
                      id="width"
                      type="number"
                      min="10"
                      value={elementProperties.size.width}
                      onChange={(e) => handlePropertyChange('size', { ...elementProperties.size, width: parseInt(e.target.value) || 10 })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="height">Hauteur (px)</Label>
                    <Input
                      id="height"
                      type="number"
                      min="10"
                      value={elementProperties.size.height}
                      onChange={(e) => handlePropertyChange('size', { ...elementProperties.size, height: parseInt(e.target.value) || 10 })}
                      className="mt-1"
                    />
                  </div>
                </div>

                {/* Aspect Ratio Lock */}
                <div className="flex items-center space-x-2">
                  <Switch id="aspectRatio" />
                  <Label htmlFor="aspectRatio" className="text-sm">Conserver les proportions</Label>
                </div>
              </div>

              <Separator />

              {/* Rotation Enhanced */}
              <div className="space-y-3">
                <h4 className="font-medium text-sm flex items-center gap-2">
                  <RotateCcw className="w-4 h-4" />
                  Rotation
                </h4>
                <div>
                  <Slider
                    value={[elementProperties.position.rotation || 0]}
                    onValueChange={(value) => handlePropertyChange('position', { ...elementProperties.position, rotation: value[0] })}
                    min={-180}
                    max={180}
                    step={1}
                    className="mt-2"
                  />
                  <span className="text-xs text-muted-foreground">
                    {elementProperties.position.rotation || 0}°
                  </span>
                </div>

                <div className="flex gap-1">
                  <Button variant="outline" size="sm" onClick={() => handlePropertyChange('position', { ...elementProperties.position, rotation: 0 })}>
                    0°
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handlePropertyChange('position', { ...elementProperties.position, rotation: 90 })}>
                    90°
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handlePropertyChange('position', { ...elementProperties.position, rotation: 180 })}>
                    180°
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handlePropertyChange('position', { ...elementProperties.position, rotation: 270 })}>
                    270°
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="advanced" className="space-y-4 mt-4">
              {/* Layer Management */}
              <div className="space-y-3">
                <h4 className="font-medium text-sm">Calques</h4>
                <div className="flex gap-1">
                  <Button variant="outline" size="sm" className="flex-1">
                    Premier plan
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    Arrière plan
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Animation */}
              <div className="space-y-3">
                <h4 className="font-medium text-sm">Animation</h4>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir une animation..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Aucune</SelectItem>
                    <SelectItem value="fadeIn">Apparition en fondu</SelectItem>
                    <SelectItem value="slideIn">Glissement</SelectItem>
                    <SelectItem value="bounce">Rebond</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              {/* Conditional Display */}
              <div className="space-y-3">
                <h4 className="font-medium text-sm">Affichage conditionnel</h4>
                <div className="space-y-2">
                  <Label className="text-xs">Afficher si:</Label>
                  <Input placeholder="Variable ou condition..." />
                </div>
              </div>

              <Separator />

              {/* Export Settings */}
              <div className="space-y-3">
                <h4 className="font-medium text-sm">Export</h4>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center space-x-2">
                    <Switch id="printable" />
                    <Label htmlFor="printable" className="text-xs">Imprimable</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="selectable" />
                    <Label htmlFor="selectable" className="text-xs">Sélectionnable</Label>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </ScrollArea>
    </div>
  );
}