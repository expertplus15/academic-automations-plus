import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useDocumentTemplates } from '@/hooks/useDocumentTemplates';
import { 
  Save,
  Eye,
  Download,
  FileText,
  Palette,
  Type,
  Image,
  Settings
} from 'lucide-react';

interface DocumentElement {
  id: string;
  type: string;
  label: string;
  content: string;
  style: {
    fontSize?: number;
    fontWeight?: string;
    color?: string;
    textAlign?: string;
  };
}

const defaultElements: DocumentElement[] = [
  {
    id: 'header',
    type: 'header',
    label: 'En-tête du document',
    content: 'ÉTABLISSEMENT SCOLAIRE',
    style: { fontSize: 24, fontWeight: 'bold', color: '#1f2937', textAlign: 'center' }
  },
  {
    id: 'student_name',
    type: 'variable',
    label: 'Nom de l\'étudiant',
    content: '{{student.full_name}}',
    style: { fontSize: 16, fontWeight: 'normal', color: '#374151', textAlign: 'left' }
  },
  {
    id: 'document_title',
    type: 'title',
    label: 'Titre du document',
    content: 'BULLETIN DE NOTES',
    style: { fontSize: 20, fontWeight: 'bold', color: '#1f2937', textAlign: 'center' }
  },
  {
    id: 'date',
    type: 'variable',
    label: 'Date',
    content: '{{current_date}}',
    style: { fontSize: 14, fontWeight: 'normal', color: '#6b7280', textAlign: 'right' }
  }
];

export function SimpleDocumentEditor() {
  const { toast } = useToast();
  const { templates, loading, updateTemplate } = useDocumentTemplates();
  
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [elements, setElements] = useState<DocumentElement[]>(defaultElements);
  const [activeTab, setActiveTab] = useState('edit');
  const [hasChanges, setHasChanges] = useState(false);

  // Auto-select first template
  useEffect(() => {
    if (templates.length > 0 && !selectedTemplate) {
      setSelectedTemplate(templates[0].id);
    }
  }, [templates, selectedTemplate]);

  const updateElement = (elementId: string, updates: Partial<DocumentElement>) => {
    setElements(prev => prev.map(el => 
      el.id === elementId ? { ...el, ...updates } : el
    ));
    setHasChanges(true);
  };

  const updateElementStyle = (elementId: string, styleUpdates: any) => {
    setElements(prev => prev.map(el => 
      el.id === elementId 
        ? { ...el, style: { ...el.style, ...styleUpdates } }
        : el
    ));
    setHasChanges(true);
  };

  const saveTemplate = async () => {
    if (!selectedTemplate) return;
    
    try {
      await updateTemplate(selectedTemplate, {
        template_content: {
          elements: elements.map(el => ({
            id: el.id,
            type: el.type,
            content: { text: el.content, label: el.label },
            style: el.style
          }))
        }
      });
      
      setHasChanges(false);
      toast({
        title: "Template sauvegardé",
        description: "Vos modifications ont été enregistrées avec succès.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder le template.",
        variant: "destructive",
      });
    }
  };

  const addNewElement = () => {
    const newElement: DocumentElement = {
      id: `element_${Date.now()}`,
      type: 'text',
      label: 'Nouvel élément',
      content: 'Contenu du nouvel élément',
      style: { fontSize: 14, fontWeight: 'normal', color: '#374151', textAlign: 'left' }
    };
    
    setElements(prev => [...prev, newElement]);
    setHasChanges(true);
  };

  const removeElement = (elementId: string) => {
    setElements(prev => prev.filter(el => el.id !== elementId));
    setHasChanges(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement des templates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="border-b bg-card/50 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              <h1 className="text-xl font-semibold">Éditeur de Documents</h1>
            </div>
            
            <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Sélectionner un template" />
              </SelectTrigger>
              <SelectContent>
                {templates.map(template => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            {hasChanges && (
              <Badge variant="outline" className="text-orange-600 border-orange-200">
                Non sauvegardé
              </Badge>
            )}
            <Button onClick={saveTemplate} disabled={!hasChanges}>
              <Save className="w-4 h-4 mr-2" />
              Sauvegarder
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex">
        {/* Editor Panel */}
        <div className="flex-1 p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="edit" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Édition
              </TabsTrigger>
              <TabsTrigger value="preview" className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                Aperçu
              </TabsTrigger>
            </TabsList>

            <TabsContent value="edit" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium">Éléments du document</h2>
                <Button onClick={addNewElement} variant="outline">
                  <Type className="w-4 h-4 mr-2" />
                  Ajouter un élément
                </Button>
              </div>

              <div className="grid gap-4">
                {elements.map((element) => (
                  <Card key={element.id}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">
                            {element.type}
                          </Badge>
                          {element.label}
                        </CardTitle>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeElement(element.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          Supprimer
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid gap-4">
                        <div className="space-y-2">
                          <Label>Libellé</Label>
                          <Input
                            value={element.label}
                            onChange={(e) => updateElement(element.id, { label: e.target.value })}
                            placeholder="Libellé de l'élément"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Contenu</Label>
                          <Textarea
                            value={element.content}
                            onChange={(e) => updateElement(element.id, { content: e.target.value })}
                            placeholder="Contenu de l'élément"
                            rows={2}
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Taille de police</Label>
                            <Input
                              type="number"
                              value={element.style.fontSize || 14}
                              onChange={(e) => updateElementStyle(element.id, { fontSize: parseInt(e.target.value) })}
                              min="8"
                              max="72"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label>Couleur</Label>
                            <Input
                              type="color"
                              value={element.style.color || '#374151'}
                              onChange={(e) => updateElementStyle(element.id, { color: e.target.value })}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Poids de police</Label>
                            <Select 
                              value={element.style.fontWeight || 'normal'}
                              onValueChange={(value) => updateElementStyle(element.id, { fontWeight: value })}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="normal">Normal</SelectItem>
                                <SelectItem value="bold">Gras</SelectItem>
                                <SelectItem value="lighter">Léger</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="space-y-2">
                            <Label>Alignement</Label>
                            <Select 
                              value={element.style.textAlign || 'left'}
                              onValueChange={(value) => updateElementStyle(element.id, { textAlign: value })}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="left">Gauche</SelectItem>
                                <SelectItem value="center">Centre</SelectItem>
                                <SelectItem value="right">Droite</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="preview">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="w-5 h-5" />
                    Aperçu du document
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-white border shadow-lg p-8 max-w-[21cm] mx-auto">
                    {elements.map((element) => (
                      <div
                        key={element.id}
                        style={{
                          fontSize: `${element.style.fontSize}px`,
                          fontWeight: element.style.fontWeight,
                          color: element.style.color,
                          textAlign: element.style.textAlign as any,
                          marginBottom: '1rem'
                        }}
                      >
                        {element.content}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}