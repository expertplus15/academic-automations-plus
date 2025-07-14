import React, { useState, useCallback } from 'react';
import { Save, X, Eye, Plus, GripVertical, Trash2, Settings, Library, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import type { DocumentType } from '@/hooks/useDocumentTypes';
import type { DocumentTemplate } from '@/hooks/useDocumentTemplatesEnhanced';
import { AcademicComponentsLibrary, type AcademicComponent } from '../specialized/AcademicComponents';
import { PredefinedTemplatesLibrary } from '../specialized/PredefinedTemplates';

interface TemplateSection {
  id: string;
  type: 'header' | 'content' | 'footer';
  name: string;
  content: string;
  variables: string[];
  styles: {
    fontSize?: string;
    fontWeight?: string;
    textAlign?: 'left' | 'center' | 'right';
    margin?: string;
    padding?: string;
    backgroundColor?: string;
    borderColor?: string;
  };
  order: number;
  isActive: boolean;
}

interface SectionBasedTemplateEditorProps {
  documentType?: DocumentType | null;
  template?: DocumentTemplate | null;
  onSave: (template: DocumentTemplate) => void;
  onCancel: () => void;
}

export function SectionBasedTemplateEditor({ 
  documentType, 
  template, 
  onSave, 
  onCancel 
}: SectionBasedTemplateEditorProps) {
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: template?.name || '',
    description: template?.description || '',
    is_active: template?.is_active ?? true,
    is_default: template?.is_default ?? false
  });

  const [showComponentsLibrary, setShowComponentsLibrary] = useState(false);
  const [showTemplatesLibrary, setShowTemplatesLibrary] = useState(false);

  const [sections, setSections] = useState<TemplateSection[]>(
    template?.content?.sections || [
      {
        id: 'header-1',
        type: 'header' as const,
        name: 'En-tête du document',
        content: '<h1 class="text-center font-bold text-2xl mb-4">{{document_type}}</h1>\n<div class="text-center mb-6">\n  <p>Institution: Mon École</p>\n  <p>Date: {{issue_date}}</p>\n</div>',
        variables: ['document_type', 'issue_date'],
        styles: {
          textAlign: 'center',
          margin: '0 0 24px 0',
          padding: '16px'
        },
        order: 1,
        isActive: true
      },
      {
        id: 'content-1',
        type: 'content' as const,
        name: 'Informations étudiant',
        content: '<div class="mb-6">\n  <h2 class="font-semibold text-lg mb-2">Informations de l\'étudiant</h2>\n  <p><strong>Nom:</strong> {{student_name}}</p>\n  <p><strong>Numéro étudiant:</strong> {{student_number}}</p>\n  <p><strong>Programme:</strong> {{program}}</p>\n</div>',
        variables: ['student_name', 'student_number', 'program'],
        styles: {
          margin: '16px 0',
          padding: '16px',
          backgroundColor: '#f8f9fa'
        },
        order: 2,
        isActive: true
      },
      {
        id: 'footer-1',
        type: 'footer' as const,
        name: 'Pied de page',
        content: '<div class="text-center mt-8 pt-4 border-t">\n  <p class="text-sm text-gray-600">Ce document est certifié conforme</p>\n  <p class="text-sm">Délivré le {{issue_date}}</p>\n  <div class="mt-4">\n    <p>Signature du directeur</p>\n    <div class="border-b border-gray-400 w-48 mx-auto mt-4"></div>\n  </div>\n</div>',
        variables: ['issue_date'],
        styles: {
          textAlign: 'center',
          margin: '32px 0 0 0',
          padding: '16px'
        },
        order: 3,
        isActive: true
      }
    ]
  );

  const [previewHtml, setPreviewHtml] = useState('');

  const handleInputChange = useCallback((field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleInsertComponent = useCallback((component: AcademicComponent) => {
    const newSection: TemplateSection = {
      id: `${component.type}-${Date.now()}`,
      type: component.type === 'student_info' ? 'content' : 
            component.type === 'signature_block' ? 'footer' : 'content',
      name: component.name,
      content: component.template,
      variables: component.variables,
      styles: {
        margin: '16px 0',
        padding: '16px'
      },
      order: sections.length + 1,
      isActive: true
    };
    setSections(prev => [...prev, newSection].sort((a, b) => a.order - b.order));
    setShowComponentsLibrary(false);
    toast({
      title: "Composant ajouté",
      description: `${component.name} a été ajouté au template`
    });
  }, [sections, toast]);

  const handleLoadPredefinedTemplate = useCallback((predefinedTemplate: DocumentTemplate) => {
    if (predefinedTemplate.content?.sections) {
      setSections(predefinedTemplate.content.sections);
      setFormData(prev => ({
        ...prev,
        name: predefinedTemplate.name,
        description: predefinedTemplate.description || ''
      }));
      setShowTemplatesLibrary(false);
      toast({
        title: "Template chargé",
        description: `Le template "${predefinedTemplate.name}" a été chargé avec succès`
      });
    }
  }, [toast]);

  const addSection = useCallback((type: 'header' | 'content' | 'footer') => {
    const newSection: TemplateSection = {
      id: `${type}-${Date.now()}`,
      type,
      name: `Nouvelle section ${type}`,
      content: `<div class="section-${type}">\n  <p>Contenu de la section...</p>\n</div>`,
      variables: [],
      styles: {
        margin: '16px 0',
        padding: '16px'
      },
      order: sections.length + 1,
      isActive: true
    };
    setSections(prev => [...prev, newSection].sort((a, b) => a.order - b.order));
  }, [sections]);

  const updateSection = useCallback((id: string, updates: Partial<TemplateSection>) => {
    setSections(prev => prev.map(section => 
      section.id === id ? { ...section, ...updates } : section
    ));
  }, []);

  const deleteSection = useCallback((id: string) => {
    setSections(prev => prev.filter(section => section.id !== id));
  }, []);

  const moveSection = useCallback((id: string, direction: 'up' | 'down') => {
    setSections(prev => {
      const index = prev.findIndex(s => s.id === id);
      if (index === -1) return prev;
      
      const newSections = [...prev];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      
      if (targetIndex >= 0 && targetIndex < newSections.length) {
        [newSections[index], newSections[targetIndex]] = [newSections[targetIndex], newSections[index]];
        // Update order
        newSections.forEach((section, idx) => {
          section.order = idx + 1;
        });
      }
      
      return newSections;
    });
  }, []);

  const handlePreview = useCallback(() => {
    let html = sections
      .filter(section => section.isActive)
      .sort((a, b) => a.order - b.order)
      .map(section => section.content)
      .join('\n\n');
    
    // Replace variables with enhanced mock data
    const mockData: Record<string, any> = {
      // Document info
      document_type: documentType?.name || 'Document',
      document_title: 'RELEVÉ DE NOTES OFFICIEL',
      document_reference: 'REL2024-001-DOC',
      
      // Institution
      institution_name: 'UNIVERSITÉ DE TECHNOLOGIE',
      institution_subtitle: 'École Supérieure d\'Ingénierie',
      institution_address: '123 Rue de l\'Innovation, 75001 Paris',
      institution_phone: '+33 1 23 45 67 89',
      institution_email: 'contact@universite-tech.fr',
      institution_logo: '/logo-institution.png',
      
      // Student info
      student_name: 'DUPONT Jean',
      student_number: '2024001',
      birth_date: '15/03/2001',
      birth_place: 'Paris',
      program_name: 'Master Informatique',
      level_name: 'M2',
      specialization_name: 'Intelligence Artificielle',
      class_name: 'M2-IA-2024',
      enrollment_date: '15/09/2023',
      
      // Academic period
      academic_year: '2023-2024',
      semester_name: 'Premier Semestre',
      period_name: 'Semestre 1',
      period_start: '15 septembre 2023',
      period_end: '15 janvier 2024',
      
      // Results
      overall_average: '16.17',
      total_ects: '30',
      overall_mention: 'Bien',
      rank: '3',
      total_students: '45',
      validation_status: 'Validé',
      
      // Administrative
      director_title: 'Professeur',
      director_name: 'Dr. Marie MARTIN',
      secretary_name: 'Jean BERNARD',
      city: 'Paris',
      issue_date: new Date().toLocaleDateString('fr-FR'),
      issue_time: '14:30',
      
      // Grades array for table rendering
      grades: JSON.stringify([
        { subject_name: 'Mathématiques Appliquées', subject_code: 'MAT101', ects_credits: 6, grade: '16.5', mention: 'Bien' },
        { subject_name: 'Algorithmique Avancée', subject_code: 'INF201', ects_credits: 4, grade: '14.0', mention: 'Assez Bien' },
        { subject_name: 'Bases de Données', subject_code: 'INF301', ects_credits: 5, grade: '18.0', mention: 'Très Bien' },
        { subject_name: 'Intelligence Artificielle', subject_code: 'IA401', ects_credits: 6, grade: '17.5', mention: 'Très Bien' },
        { subject_name: 'Projet Tutoré', subject_code: 'PROJ501', ects_credits: 9, grade: '15.0', mention: 'Bien' }
      ])
    };

    // Handle both simple variables and complex data like arrays
    Object.entries(mockData).forEach(([key, value]) => {
      if (typeof value === 'string') {
        html = html.replace(new RegExp(`{{${key}}}`, 'g'), value);
      }
    });

    // Handle special cases for grades table
    if (html.includes('{{#each grades}}')) {
      const gradesData = JSON.parse(mockData.grades);
      let tableRows = '';
      gradesData.forEach((grade: any) => {
        tableRows += `
          <tr>
            <td class="border border-gray-300 px-4 py-2">${grade.subject_name}</td>
            <td class="border border-gray-300 px-4 py-2 text-center">${grade.subject_code}</td>
            <td class="border border-gray-300 px-4 py-2 text-center">${grade.ects_credits}</td>
            <td class="border border-gray-300 px-4 py-2 text-center font-medium">${grade.grade}</td>
            <td class="border border-gray-300 px-4 py-2 text-center">${grade.mention}</td>
          </tr>
        `;
      });
      html = html.replace(/{{#each grades}}[\s\S]*?{{\/each}}/g, tableRows);
    }

    setPreviewHtml(`
      <div style="max-width: 800px; margin: 0 auto; font-family: Arial, sans-serif; line-height: 1.6;">
        ${html}
      </div>
    `);
  }, [sections, documentType?.name]);

  const handleSave = useCallback(() => {
    if (!formData.name) {
      toast({
        title: "Erreur de validation",
        description: "Le nom du template est requis",
        variant: "destructive"
      });
      return;
    }

    if (!documentType) {
      toast({
        title: "Erreur",
        description: "Type de document manquant",
        variant: "destructive"
      });
      return;
    }

    const allVariables = [...new Set(sections.flatMap(section => section.variables))];
    
    const newTemplate: DocumentTemplate = {
      id: template?.id || crypto.randomUUID(),
      name: formData.name,
      document_type_id: documentType.id,
      description: formData.description,
      content: {
        sections,
        layout: 'sectioned',
        variables: allVariables
      },
      variables: allVariables.reduce((acc, variable) => {
        acc[variable] = '';
        return acc;
      }, {} as Record<string, any>),
      is_active: formData.is_active,
      is_default: formData.is_default,
      version: (template?.version || 0) + 1,
      created_at: template?.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
      document_type: documentType
    };

    onSave(newTemplate);
    
    toast({
      title: "Template sauvegardé",
      description: `Le template "${formData.name}" a été sauvegardé avec succès`
    });
  }, [formData, documentType, template, sections, onSave, toast]);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Type Info */}
      {documentType && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className={`p-2 rounded-lg bg-${documentType.color}-100`}>
                <Settings className={`h-5 w-5 text-${documentType.color}-600`} />
              </div>
              Template par sections pour: {documentType.name}
            </CardTitle>
            <CardDescription>
              Éditeur avancé par sections avec glisser-déposer et personnalisation visuelle
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">{documentType.code}</Badge>
              <Badge>{documentType.category}</Badge>
              <Badge variant="secondary">{documentType.variables.length} variable(s) disponible(s)</Badge>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="structure" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="info">Informations</TabsTrigger>
          <TabsTrigger value="structure">Structure</TabsTrigger>
          <TabsTrigger value="design">Design</TabsTrigger>
          <TabsTrigger value="preview">Aperçu</TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setShowTemplatesLibrary(true)}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Library className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Templates Prédéfinis</CardTitle>
                    <CardDescription>
                      Choisir parmi les templates professionnels existants
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setShowComponentsLibrary(true)}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Palette className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Composants Académiques</CardTitle>
                    <CardDescription>
                      Ajouter des blocs spécialisés pour documents académiques
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </div>

          <Dialog open={showTemplatesLibrary} onOpenChange={setShowTemplatesLibrary}>
            <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Templates Prédéfinis</DialogTitle>
                <DialogDescription>
                  Sélectionnez un template professionnel pour commencer rapidement
                </DialogDescription>
              </DialogHeader>
              <PredefinedTemplatesLibrary onSelectTemplate={handleLoadPredefinedTemplate} />
            </DialogContent>
          </Dialog>

          <Dialog open={showComponentsLibrary} onOpenChange={setShowComponentsLibrary}>
            <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Bibliothèque de Composants Académiques</DialogTitle>
                <DialogDescription>
                  Ajoutez des composants spécialisés pour créer des documents académiques professionnels
                </DialogDescription>
              </DialogHeader>
              <AcademicComponentsLibrary onInsert={handleInsertComponent} />
            </DialogContent>
          </Dialog>
        </TabsContent>

        <TabsContent value="info" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informations du template</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom du template *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="ex: Bulletin Standard par Sections"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Description du template..."
                  rows={3}
                />
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => handleInputChange('is_active', checked)}
                  />
                  <Label htmlFor="is_active">Template actif</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_default"
                    checked={formData.is_default}
                    onCheckedChange={(checked) => handleInputChange('is_default', checked)}
                  />
                  <Label htmlFor="is_default">Template par défaut</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="structure" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Sections du template</h3>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowComponentsLibrary(true)}>
                <Library className="h-4 w-4 mr-2" />
                Composants
              </Button>
              <Button variant="outline" size="sm" onClick={() => addSection('header')}>
                <Plus className="h-4 w-4 mr-2" />
                En-tête
              </Button>
              <Button variant="outline" size="sm" onClick={() => addSection('content')}>
                <Plus className="h-4 w-4 mr-2" />
                Contenu
              </Button>
              <Button variant="outline" size="sm" onClick={() => addSection('footer')}>
                <Plus className="h-4 w-4 mr-2" />
                Pied de page
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            {sections.sort((a, b) => a.order - b.order).map((section, index) => (
              <Card key={section.id} className={!section.isActive ? 'opacity-50' : ''}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                      <Badge variant={
                        section.type === 'header' ? 'default' : 
                        section.type === 'content' ? 'secondary' : 'outline'
                      }>
                        {section.type}
                      </Badge>
                      <Input
                        value={section.name}
                        onChange={(e) => updateSection(section.id, { name: e.target.value })}
                        className="max-w-xs"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={section.isActive}
                        onCheckedChange={(checked) => updateSection(section.id, { isActive: checked })}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => moveSection(section.id, 'up')}
                        disabled={index === 0}
                      >
                        ↑
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => moveSection(section.id, 'down')}
                        disabled={index === sections.length - 1}
                      >
                        ↓
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteSection(section.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label>Contenu HTML</Label>
                      <Textarea
                        value={section.content}
                        onChange={(e) => updateSection(section.id, { content: e.target.value })}
                        className="font-mono text-sm min-h-[120px]"
                        placeholder="<div>Votre contenu HTML...</div>"
                      />
                    </div>
                    
                    {documentType?.variables && documentType.variables.length > 0 && (
                      <div>
                        <Label>Variables disponibles</Label>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {documentType.variables.map((variable) => (
                            <Badge
                              key={variable}
                              variant="outline"
                              className="cursor-pointer hover:bg-secondary"
                              onClick={() => {
                                const updatedContent = section.content + ` {{${variable}}}`;
                                updateSection(section.id, { 
                                  content: updatedContent,
                                  variables: [...new Set([...section.variables, variable])]
                                });
                              }}
                            >
                              {variable}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="design" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personnalisation du design</CardTitle>
              <CardDescription>
                Ajustez l'apparence de chaque section
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {sections.map((section) => (
                  <div key={section.id} className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-3">{section.name}</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <Label>Alignement</Label>
                        <Select
                          value={section.styles?.textAlign || 'left'}
                          onValueChange={(value) => updateSection(section.id, {
                            styles: { ...section.styles, textAlign: value as any }
                          })}
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
                      
                      <div>
                        <Label>Taille de police</Label>
                        <Select
                          value={section.styles?.fontSize || 'base'}
                          onValueChange={(value) => updateSection(section.id, {
                            styles: { ...section.styles, fontSize: value }
                          })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="sm">Petite</SelectItem>
                            <SelectItem value="base">Normale</SelectItem>
                            <SelectItem value="lg">Grande</SelectItem>
                            <SelectItem value="xl">Très grande</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label>Épaisseur</Label>
                        <Select
                          value={section.styles?.fontWeight || 'normal'}
                          onValueChange={(value) => updateSection(section.id, {
                            styles: { ...section.styles, fontWeight: value }
                          })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="normal">Normal</SelectItem>
                            <SelectItem value="semibold">Semi-gras</SelectItem>
                            <SelectItem value="bold">Gras</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label>Couleur de fond</Label>
                        <Input
                          type="color"
                          value={section.styles?.backgroundColor || '#ffffff'}
                          onChange={(e) => updateSection(section.id, {
                            styles: { ...section.styles, backgroundColor: e.target.value }
                          })}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Aperçu du template
              </CardTitle>
              <CardDescription>
                Visualisez le rendu final avec des données de démonstration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button onClick={handlePreview}>
                  <Eye className="h-4 w-4 mr-2" />
                  Générer l'aperçu
                </Button>
                
                {previewHtml && (
                  <div className="border rounded-lg p-6 bg-white min-h-[400px]">
                    <div dangerouslySetInnerHTML={{ __html: previewHtml }} />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-6 border-t">
        <Button variant="outline" onClick={onCancel}>
          <X className="h-4 w-4 mr-2" />
          Annuler
        </Button>
        <Button onClick={handleSave}>
          <Save className="h-4 w-4 mr-2" />
          Sauvegarder le template
        </Button>
      </div>
    </div>
  );
}