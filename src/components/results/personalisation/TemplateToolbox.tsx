import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Type,
  Image,
  Square,
  Circle,
  BarChart3,
  Table,
  Calendar,
  Hash,
  FileText,
  Palette,
  Layers,
  Grid,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Underline,
  Search,
  Plus,
  Star,
  Crown,
  Zap
} from 'lucide-react';

interface TemplateToolboxProps {
  onElementSelect: (elementId: string | null) => void;
  selectedElement: string | null;
}

export function TemplateToolbox({ onElementSelect, selectedElement }: TemplateToolboxProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // Basic Elements
  const basicElements = [
    { id: 'text', name: 'Texte', icon: Type, category: 'basic', description: 'Bloc de texte simple' },
    { id: 'heading', name: 'Titre', icon: Type, category: 'basic', description: 'Titre de section' },
    { id: 'image', name: 'Image', icon: Image, category: 'basic', description: 'Image ou logo' },
    { id: 'rectangle', name: 'Rectangle', icon: Square, category: 'basic', description: 'Forme rectangulaire' },
    { id: 'circle', name: 'Cercle', icon: Circle, category: 'basic', description: 'Forme circulaire' },
    { id: 'line', name: 'Ligne', icon: AlignLeft, category: 'basic', description: 'Ligne de séparation' }
  ];

  // Specialized Elements
  const specializedElements = [
    { id: 'table', name: 'Tableau', icon: Table, category: 'specialized', description: 'Tableau de données' },
    { id: 'chart', name: 'Graphique', icon: BarChart3, category: 'specialized', description: 'Graphique ou diagramme' },
    { id: 'qrcode', name: 'QR Code', icon: Hash, category: 'specialized', description: 'Code QR dynamique' },
    { id: 'signature', name: 'Signature', icon: FileText, category: 'specialized', description: 'Zone de signature' },
    { id: 'date', name: 'Date', icon: Calendar, category: 'specialized', description: 'Date dynamique' },
    { id: 'variable', name: 'Variable', icon: Zap, category: 'specialized', description: 'Variable dynamique' }
  ];

  // Institutional Elements
  const institutionalElements = [
    { id: 'header', name: 'En-tête Officiel', icon: Crown, category: 'institutional', description: 'En-tête institutionnel' },
    { id: 'footer', name: 'Pied de Page', icon: AlignLeft, category: 'institutional', description: 'Pied de page officiel' },
    { id: 'logo', name: 'Logo Institution', icon: Star, category: 'institutional', description: 'Logo de l\'établissement' },
    { id: 'seal', name: 'Sceau Officiel', icon: Circle, category: 'institutional', description: 'Sceau ou cachet officiel' }
  ];

  // Layout Tools
  const layoutTools = [
    { id: 'container', name: 'Conteneur', icon: Square, category: 'layout', description: 'Conteneur flexible' },
    { id: 'grid', name: 'Grille', icon: Grid, category: 'layout', description: 'Grille de mise en page' },
    { id: 'spacer', name: 'Espacement', icon: AlignCenter, category: 'layout', description: 'Espace vide' },
    { id: 'divider', name: 'Séparateur', icon: AlignLeft, category: 'layout', description: 'Ligne de séparation' }
  ];

  // Style Presets
  const stylePresets = [
    { id: 'modern', name: 'Moderne', colors: ['#3B82F6', '#1E40AF', '#F8FAFC'] },
    { id: 'classic', name: 'Classique', colors: ['#1F2937', '#6B7280', '#FFFFFF'] },
    { id: 'elegant', name: 'Élégant', colors: ['#7C3AED', '#A855F7', '#F3F4F6'] },
    { id: 'academic', name: 'Académique', colors: ['#059669', '#047857', '#ECFDF5'] }
  ];

  const allElements = [
    ...basicElements,
    ...specializedElements,
    ...institutionalElements,
    ...layoutTools
  ];

  const filteredElements = allElements.filter(element =>
    element.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    element.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleElementDragStart = (element: any) => {
    // This would be used for drag & drop functionality
    console.log('Dragging element:', element);
  };

  const handleElementClick = (elementId: string) => {
    onElementSelect(elementId);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b">
        <h3 className="font-semibold text-lg mb-3">Boîte à Outils</h3>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un élément..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="p-4">
          <Tabs defaultValue="elements" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="elements">Éléments</TabsTrigger>
              <TabsTrigger value="styles">Styles</TabsTrigger>
              <TabsTrigger value="assets">Ressources</TabsTrigger>
            </TabsList>

            <TabsContent value="elements" className="space-y-4 mt-4">
              {searchQuery ? (
                /* Search Results */
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Résultats ({filteredElements.length})
                  </h4>
                  <div className="space-y-1">
                    {filteredElements.map((element) => (
                      <Button
                        key={element.id}
                        variant={selectedElement === element.id ? "default" : "ghost"}
                        className="w-full justify-start h-auto p-3"
                        onClick={() => handleElementClick(element.id)}
                        onMouseDown={() => handleElementDragStart(element)}
                        draggable
                      >
                        <element.icon className="w-4 h-4 mr-3 flex-shrink-0" />
                        <div className="text-left flex-1">
                          <div className="font-medium">{element.name}</div>
                          <div className="text-xs text-muted-foreground">{element.description}</div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>
              ) : (
                /* Categorized Elements */
                <>
                  {/* Basic Elements */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium flex items-center gap-2">
                      <Type className="w-4 h-4" />
                      Éléments de Base
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {basicElements.map((element) => (
                        <Button
                          key={element.id}
                          variant={selectedElement === element.id ? "default" : "outline"}
                          className="h-16 flex flex-col gap-1"
                          onClick={() => handleElementClick(element.id)}
                          onMouseDown={() => handleElementDragStart(element)}
                          draggable
                        >
                          <element.icon className="w-5 h-5" />
                          <span className="text-xs">{element.name}</span>
                        </Button>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Specialized Elements */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium flex items-center gap-2">
                      <BarChart3 className="w-4 h-4" />
                      Éléments Spécialisés
                    </h4>
                    <div className="space-y-1">
                      {specializedElements.map((element) => (
                        <Button
                          key={element.id}
                          variant={selectedElement === element.id ? "default" : "ghost"}
                          className="w-full justify-start"
                          onClick={() => handleElementClick(element.id)}
                          onMouseDown={() => handleElementDragStart(element)}
                          draggable
                        >
                          <element.icon className="w-4 h-4 mr-3" />
                          {element.name}
                          <Badge variant="secondary" className="ml-auto text-xs">Pro</Badge>
                        </Button>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Institutional Elements */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium flex items-center gap-2">
                      <Crown className="w-4 h-4" />
                      Éléments Institutionnels
                    </h4>
                    <div className="space-y-1">
                      {institutionalElements.map((element) => (
                        <Button
                          key={element.id}
                          variant={selectedElement === element.id ? "default" : "ghost"}
                          className="w-full justify-start"
                          onClick={() => handleElementClick(element.id)}
                          onMouseDown={() => handleElementDragStart(element)}
                          draggable
                        >
                          <element.icon className="w-4 h-4 mr-3" />
                          {element.name}
                          <Badge variant="outline" className="ml-auto text-xs">Officiel</Badge>
                        </Button>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Layout Tools */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium flex items-center gap-2">
                      <Layers className="w-4 h-4" />
                      Outils de Mise en Page
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {layoutTools.map((element) => (
                        <Button
                          key={element.id}
                          variant={selectedElement === element.id ? "default" : "outline"}
                          className="h-12 flex flex-col gap-1"
                          onClick={() => handleElementClick(element.id)}
                          onMouseDown={() => handleElementDragStart(element)}
                          draggable
                        >
                          <element.icon className="w-4 h-4" />
                          <span className="text-xs">{element.name}</span>
                        </Button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </TabsContent>

            <TabsContent value="styles" className="space-y-4 mt-4">
              {/* Style Presets */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium flex items-center gap-2">
                  <Palette className="w-4 h-4" />
                  Thèmes Prédéfinis
                </h4>
                <div className="space-y-2">
                  {stylePresets.map((preset) => (
                    <Button
                      key={preset.id}
                      variant="outline"
                      className="w-full justify-start h-auto p-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex gap-1">
                          {preset.colors.map((color, index) => (
                            <div
                              key={index}
                              className="w-4 h-4 rounded-full border-2 border-background"
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                        <span className="font-medium">{preset.name}</span>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Typography */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Typographie</h4>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Bold className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Italic className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Underline className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Alignment */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Alignement</h4>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <AlignLeft className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <AlignCenter className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <AlignRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="assets" className="space-y-4 mt-4">
              {/* Media Library */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">Bibliothèque Media</h4>
                  <Button size="sm" variant="outline">
                    <Plus className="w-4 h-4 mr-1" />
                    Ajouter
                  </Button>
                </div>
                
                <div className="grid grid-cols-3 gap-2">
                  {[1, 2, 3, 4, 5, 6].map((item) => (
                    <div key={item} className="aspect-square bg-muted rounded-md border-2 border-dashed border-muted-foreground/25 flex items-center justify-center cursor-pointer hover:border-muted-foreground/50 transition-colors">
                      <Image className="w-6 h-6 text-muted-foreground" />
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Recent Assets */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Utilisés Récemment</h4>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 p-2 rounded-md hover:bg-muted/50 cursor-pointer">
                    <div className="w-8 h-8 bg-primary/10 rounded-md flex items-center justify-center">
                      <FileText className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1 text-sm">
                      <div className="font-medium">Logo_Ecole.png</div>
                      <div className="text-xs text-muted-foreground">2.3 MB</div>
                    </div>
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