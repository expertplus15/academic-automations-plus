import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import {
  Search,
  ChevronRight,
  Type,
  Image,
  Square,
  Circle,
  Table,
  Calendar,
  Hash,
  FileText,
  Star,
  Crown,
  Palette,
  Layout,
  Layers,
  Grid,
  AlignLeft,
  Plus,
  ChevronDown
} from 'lucide-react';
import { useTemplateEditorContext } from '@/contexts/TemplateEditorContext';
import { blockMetadata } from '../blocks/BlockLibrary';

interface ToolCategory {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  items: ToolItem[];
}

interface ToolItem {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  description: string;
  category: string;
}

export function SidebarToolbox() {
  const { actions } = useTemplateEditorContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['basic', 'institutional']);

  const categories: ToolCategory[] = [
    {
      id: 'basic',
      name: 'Éléments de Base',
      icon: Type,
      items: [
        { id: 'text', name: 'Texte', icon: Type, description: 'Bloc de texte simple', category: 'basic' },
        { id: 'heading', name: 'Titre', icon: Type, description: 'Titre de section', category: 'basic' },
        { id: 'image', name: 'Image', icon: Image, description: 'Image ou logo', category: 'basic' },
        { id: 'rectangle', name: 'Rectangle', icon: Square, description: 'Forme rectangulaire', category: 'basic' },
        { id: 'circle', name: 'Cercle', icon: Circle, description: 'Forme circulaire', category: 'basic' },
      ]
    },
    {
      id: 'institutional',
      name: 'Éléments Institutionnels',
      icon: Crown,
      items: [
        { id: 'header', name: 'En-tête Officiel', icon: Crown, description: 'En-tête institutionnel', category: 'institutional' },
        { id: 'footer', name: 'Pied de Page', icon: AlignLeft, description: 'Pied de page officiel', category: 'institutional' },
        { id: 'logo', name: 'Logo Institution', icon: Star, description: 'Logo de l\'établissement', category: 'institutional' },
        { id: 'seal', name: 'Sceau Officiel', icon: Circle, description: 'Sceau ou cachet officiel', category: 'institutional' },
        { id: 'signature', name: 'Signature', icon: FileText, description: 'Zone de signature', category: 'institutional' },
      ]
    },
    {
      id: 'specialized',
      name: 'Éléments Spécialisés',
      icon: Table,
      items: [
        { id: 'table', name: 'Tableau', icon: Table, description: 'Tableau de données', category: 'specialized' },
        { id: 'qrcode', name: 'QR Code', icon: Hash, description: 'Code QR dynamique', category: 'specialized' },
        { id: 'date', name: 'Date', icon: Calendar, description: 'Date dynamique', category: 'specialized' },
        { id: 'variable', name: 'Variable', icon: FileText, description: 'Variable dynamique', category: 'specialized' },
      ]
    },
    {
      id: 'layout',
      name: 'Mise en Page',
      icon: Layout,
      items: [
        { id: 'container', name: 'Conteneur', icon: Square, description: 'Conteneur flexible', category: 'layout' },
        { id: 'grid', name: 'Grille', icon: Grid, description: 'Grille de mise en page', category: 'layout' },
        { id: 'spacer', name: 'Espacement', icon: AlignLeft, description: 'Espace vide', category: 'layout' },
      ]
    }
  ];

  const allItems = categories.flatMap(cat => cat.items);
  const filteredItems = searchQuery 
    ? allItems.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleDragStart = (e: React.DragEvent, item: ToolItem) => {
    e.dataTransfer.setData('text/plain', item.id);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleItemClick = (item: ToolItem) => {
    actions.addElement(item.id, { x: 100, y: 100 });
  };

  return (
    <div className="w-72 border-r bg-card/50 backdrop-blur flex flex-col">
      {/* Header */}
      <div className="p-4 border-b">
        <h2 className="font-semibold text-lg mb-3">Boîte à Outils</h2>
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
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="elements">Éléments</TabsTrigger>
              <TabsTrigger value="assets">Ressources</TabsTrigger>
            </TabsList>

            <TabsContent value="elements" className="space-y-1 mt-4">
              {searchQuery ? (
                /* Search Results */
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Résultats ({filteredItems.length})
                  </h4>
                  <div className="space-y-1">
                    {filteredItems.map((item) => (
                      <Button
                        key={item.id}
                        variant="ghost"
                        className="w-full justify-start h-auto p-3 text-left"
                        onClick={() => handleItemClick(item)}
                        onDragStart={(e) => handleDragStart(e, item)}
                        draggable
                      >
                        <item.icon className="w-4 h-4 mr-3 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate">{item.name}</div>
                          <div className="text-xs text-muted-foreground truncate">{item.description}</div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>
              ) : (
                /* Categorized Elements */
                <div className="space-y-1">
                  {categories.map((category) => (
                    <Collapsible
                      key={category.id}
                      open={expandedCategories.includes(category.id)}
                      onOpenChange={() => toggleCategory(category.id)}
                    >
                      <CollapsibleTrigger asChild>
                        <Button
                          variant="ghost"
                          className="w-full justify-between p-3 h-auto"
                        >
                          <div className="flex items-center gap-2">
                            <category.icon className="w-4 h-4" />
                            <span className="font-medium">{category.name}</span>
                          </div>
                          <ChevronDown className={cn(
                            "w-4 h-4 transition-transform",
                            expandedCategories.includes(category.id) && "rotate-180"
                          )} />
                        </Button>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="space-y-1 ml-6">
                        {category.items.map((item) => (
                          <Button
                            key={item.id}
                            variant="ghost"
                            className="w-full justify-start h-auto p-2 text-left hover:bg-accent/50"
                            onClick={() => handleItemClick(item)}
                            onDragStart={(e) => handleDragStart(e, item)}
                            draggable
                          >
                            <item.icon className="w-4 h-4 mr-3 flex-shrink-0 text-muted-foreground" />
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium truncate">{item.name}</div>
                              <div className="text-xs text-muted-foreground truncate">{item.description}</div>
                            </div>
                          </Button>
                        ))}
                      </CollapsibleContent>
                    </Collapsible>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="assets" className="space-y-4 mt-4">
              {/* Quick Actions */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">Actions Rapides</h4>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm" className="h-auto p-3 flex flex-col gap-1">
                    <Plus className="w-4 h-4" />
                    <span className="text-xs">Upload</span>
                  </Button>
                  <Button variant="outline" size="sm" className="h-auto p-3 flex flex-col gap-1">
                    <Palette className="w-4 h-4" />
                    <span className="text-xs">Couleurs</span>
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Media Library Placeholder */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Bibliothèque</h4>
                <div className="grid grid-cols-3 gap-2">
                  {[1, 2, 3, 4, 5, 6].map((item) => (
                    <div key={item} className="aspect-square bg-muted/50 rounded-md border-2 border-dashed border-muted-foreground/25 flex items-center justify-center cursor-pointer hover:border-muted-foreground/50 transition-colors">
                      <Image className="w-4 h-4 text-muted-foreground" />
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </ScrollArea>
    </div>
  );
}