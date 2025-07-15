import React, { useState, useCallback } from 'react';
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
import { ColorPicker } from '@/components/ui/color-picker';
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
  Trash2
} from 'lucide-react';
import { Template } from '@/services/TemplateService';

interface PropertiesPanelProps {
  selectedElement: string | null;
  template?: Template;
  onChange: (content: any) => void;
}

export function PropertiesPanel({ selectedElement, template, onChange }: PropertiesPanelProps) {
  const [elementProperties, setElementProperties] = useState({
    // Enhanced element properties with better defaults
    id: selectedElement || '',
    type: selectedElement?.includes('text') ? 'text' : selectedElement?.includes('variable') ? 'variable' : selectedElement?.includes('image') ? 'image' : 'text',
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
      opacity: 100
    },
    position: { 
      x: selectedElement?.includes('title') ? 50 : selectedElement?.includes('logo') ? 450 : 50, 
      y: selectedElement?.includes('title') ? 50 : selectedElement?.includes('student') ? 130 : 50 
    },
    size: { 
      width: selectedElement?.includes('title') ? 400 : selectedElement?.includes('logo') ? 80 : 300, 
      height: selectedElement?.includes('title') ? 60 : selectedElement?.includes('logo') ? 80 : 30 
    },
    locked: false,
    hidden: false
  });

  // Available fonts
  const fonts = [
    'Arial',
    'Helvetica',
    'Times New Roman',
    'Georgia',
    'Verdana',
    'Tahoma',
    'Trebuchet MS',
    'Impact',
    'Courier New'
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

  const handlePropertyChange = useCallback((property: string, value: any) => {
    setElementProperties(prev => ({
      ...prev,
      [property]: typeof prev[property as keyof typeof prev] === 'object' && prev[property as keyof typeof prev] !== null
        ? { ...(prev[property as keyof typeof prev] as object), ...value }
        : value
    }));
    
    // Notify parent component of changes
    onChange({ [property]: value });
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
                Sélectionnez un élément pour modifier ses propriétés
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg">Propriétés</h3>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handlePropertyChange('hidden', !elementProperties.hidden)}
            >
              {elementProperties.hidden ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handlePropertyChange('locked', !elementProperties.locked)}
            >
              {elementProperties.locked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
            </Button>
          </div>
        </div>
        
        <div className="mt-2 text-sm text-muted-foreground">
          Élément: <span className="font-medium capitalize">{elementProperties.type}</span>
        </div>
      </div>

      {/* Content */}
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
              {/* Text Content */}
              {elementProperties.type === 'text' && (
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="text">Texte</Label>
                    <Textarea
                      id="text"
                      value={elementProperties.content.text || ''}
                      onChange={(e) => handleContentChange('text', e.target.value)}
                      placeholder="Entrez votre texte..."
                      className="mt-1"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="fontSize">Taille</Label>
                      <Input
                        id="fontSize"
                        type="number"
                        value={elementProperties.content.fontSize || 16}
                        onChange={(e) => handleContentChange('fontSize', parseInt(e.target.value))}
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="fontWeight">Poids</Label>
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
                </div>
              )}

              {/* Variable Content */}
              {elementProperties.type === 'variable' && (
                <div className="space-y-3">
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
                        <SelectItem value="student.fullName">Nom complet</SelectItem>
                        <SelectItem value="student.studentNumber">Numéro étudiant</SelectItem>
                        <SelectItem value="student.email">Email</SelectItem>
                        <SelectItem value="academic.currentYear">Année académique</SelectItem>
                        <SelectItem value="academic.semester">Semestre</SelectItem>
                        <SelectItem value="grades.average">Moyenne générale</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="label">Libellé</Label>
                    <Input
                      id="label"
                      value={elementProperties.content.label || ''}
                      onChange={(e) => handleContentChange('label', e.target.value)}
                      placeholder="Libellé d'affichage"
                      className="mt-1"
                    />
                  </div>
                </div>
              )}

              {/* Image Content */}
              {elementProperties.type === 'image' && (
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="imageSrc">Source</Label>
                    <Input
                      id="imageSrc"
                      value={elementProperties.content.src || ''}
                      onChange={(e) => handleContentChange('src', e.target.value)}
                      placeholder="URL de l'image ou chemin"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="imageAlt">Texte alternatif</Label>
                    <Input
                      id="imageAlt"
                      value={elementProperties.content.alt || ''}
                      onChange={(e) => handleContentChange('alt', e.target.value)}
                      placeholder="Description de l'image"
                      className="mt-1"
                    />
                  </div>

                  <Button variant="outline" className="w-full">
                    Parcourir les fichiers
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="style" className="space-y-4 mt-4">
              {/* Colors */}
              <div className="space-y-3">
                <div>
                  <Label>Couleur du texte</Label>
                  <div className="mt-1">
                    <ColorPicker
                      value={elementProperties.style.color || '#000000'}
                      onChange={(color) => handleStyleChange('color', color)}
                    />
                  </div>
                </div>

                <div>
                  <Label>Couleur de fond</Label>
                  <div className="mt-1">
                    <ColorPicker
                      value={elementProperties.style.backgroundColor || 'transparent'}
                      onChange={(color) => handleStyleChange('backgroundColor', color)}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Text Alignment */}
              <div>
                <Label>Alignement du texte</Label>
                <div className="flex gap-1 mt-2">
                  {textAlignments.map((alignment) => (
                    <Button
                      key={alignment.value}
                      variant={elementProperties.style.textAlign === alignment.value ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleStyleChange('textAlign', alignment.value)}
                    >
                      <alignment.icon className="w-4 h-4" />
                    </Button>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Borders */}
              <div className="space-y-3">
                <div>
                  <Label htmlFor="borderWidth">Épaisseur bordure</Label>
                  <Slider
                    value={[elementProperties.style.borderWidth || 0]}
                    onValueChange={(value) => handleStyleChange('borderWidth', value[0])}
                    max={10}
                    step={1}
                    className="mt-2"
                  />
                  <span className="text-xs text-muted-foreground">
                    {elementProperties.style.borderWidth || 0}px
                  </span>
                </div>

                <div>
                  <Label>Couleur bordure</Label>
                  <div className="mt-1">
                    <ColorPicker
                      value={elementProperties.style.borderColor || '#E5E7EB'}
                      onChange={(color) => handleStyleChange('borderColor', color)}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="borderRadius">Rayon bordure</Label>
                  <Slider
                    value={[elementProperties.style.borderRadius || 0]}
                    onValueChange={(value) => handleStyleChange('borderRadius', value[0])}
                    max={50}
                    step={1}
                    className="mt-2"
                  />
                  <span className="text-xs text-muted-foreground">
                    {elementProperties.style.borderRadius || 0}px
                  </span>
                </div>
              </div>

              <Separator />

              {/* Opacity */}
              <div>
                <Label htmlFor="opacity">Opacité</Label>
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
              {/* Position */}
              <div className="space-y-3">
                <h4 className="font-medium text-sm">Position</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="posX">X (px)</Label>
                    <Input
                      id="posX"
                      type="number"
                      value={elementProperties.position.x}
                      onChange={(e) => handlePropertyChange('position', { ...elementProperties.position, x: parseInt(e.target.value) })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="posY">Y (px)</Label>
                    <Input
                      id="posY"
                      type="number"
                      value={elementProperties.position.y}
                      onChange={(e) => handlePropertyChange('position', { ...elementProperties.position, y: parseInt(e.target.value) })}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Size */}
              <div className="space-y-3">
                <h4 className="font-medium text-sm">Taille</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="width">Largeur (px)</Label>
                    <Input
                      id="width"
                      type="number"
                      value={elementProperties.size.width}
                      onChange={(e) => handlePropertyChange('size', { ...elementProperties.size, width: parseInt(e.target.value) })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="height">Hauteur (px)</Label>
                    <Input
                      id="height"
                      type="number"
                      value={elementProperties.size.height}
                      onChange={(e) => handlePropertyChange('size', { ...elementProperties.size, height: parseInt(e.target.value) })}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Spacing */}
              <div className="space-y-3">
                <h4 className="font-medium text-sm">Espacement</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="padding">Padding (px)</Label>
                    <Input
                      id="padding"
                      type="number"
                      value={elementProperties.style.padding || 0}
                      onChange={(e) => handleStyleChange('padding', parseInt(e.target.value))}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="margin">Margin (px)</Label>
                    <Input
                      id="margin"
                      type="number"
                      value={elementProperties.style.margin || 0}
                      onChange={(e) => handleStyleChange('margin', parseInt(e.target.value))}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="advanced" className="space-y-4 mt-4">
              {/* Element State */}
              <div className="space-y-3">
                <h4 className="font-medium text-sm">État de l'élément</h4>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="visible">Visible</Label>
                  <Switch
                    id="visible"
                    checked={!elementProperties.hidden}
                    onCheckedChange={(checked) => handlePropertyChange('hidden', !checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="locked">Verrouillé</Label>
                  <Switch
                    id="locked"
                    checked={elementProperties.locked}
                    onCheckedChange={(checked) => handlePropertyChange('locked', checked)}
                  />
                </div>
              </div>

              <Separator />

              {/* Element Info */}
              <div className="space-y-3">
                <h4 className="font-medium text-sm">Informations</h4>
                <div className="text-sm space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">ID:</span>
                    <span className="font-mono text-xs">{elementProperties.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type:</span>
                    <span className="capitalize">{elementProperties.type}</span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Actions */}
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Actions</h4>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full">
                    <Copy className="w-4 h-4 mr-2" />
                    Dupliquer l'élément
                  </Button>
                  <Button variant="outline" size="sm" className="w-full text-red-600">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Supprimer l'élément
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </ScrollArea>
    </div>
  );
}