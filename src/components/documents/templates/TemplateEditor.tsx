import React, { useState, useCallback } from 'react';
import { Save, X, Eye, Code, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import type { DocumentType } from '@/hooks/useDocumentTypes';
import type { DocumentTemplate } from '@/hooks/useDocumentTemplatesEnhanced';

interface TemplateEditorProps {
  documentType?: DocumentType | null;
  template?: DocumentTemplate | null;
  onSave: (template: DocumentTemplate) => void;
  onCancel: () => void;
}

export function TemplateEditor({ documentType, template, onSave, onCancel }: TemplateEditorProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: template?.name || '',
    description: template?.description || '',
    content: template?.content || '',
    variables: template?.variables || {},
    is_active: template?.is_active ?? true,
    is_default: template?.is_default ?? false
  });

  const [previewHtml, setPreviewHtml] = useState('');

  const handleInputChange = useCallback((field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handlePreview = useCallback(() => {
    // Remplacer les variables par des données de démonstration
    let html = formData.content;
    if (documentType?.variables) {
      documentType.variables.forEach(variable => {
        const mockValue = getMockValue(variable);
        html = html.replace(new RegExp(`{{${variable}}}`, 'g'), mockValue);
      });
    }
    setPreviewHtml(html);
  }, [formData.content, documentType?.variables]);

  const getMockValue = (variable: string): string => {
    const mockData: Record<string, string> = {
      student_name: 'Jean DUPONT',
      student_number: '2024001',
      program: 'Master Informatique',
      academic_year: '2023-2024',
      semester: 'Semestre 1',
      enrollment_date: '15/09/2023',
      gpa: '14.5',
      birth_date: '12/03/2000',
      address: '123 Rue de la Paix, 75001 Paris',
      phone: '01 23 45 67 89',
      email: 'jean.dupont@student.univ.fr',
      grades: 'Mathématiques: 16/20, Physique: 14/20, Informatique: 18/20',
      credits: '30 ECTS'
    };
    return mockData[variable] || `[${variable}]`;
  };

  const handleSave = useCallback(() => {
    if (!formData.name || !formData.content) {
      toast({
        title: "Erreur de validation",
        description: "Le nom et le contenu sont requis",
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

    const newTemplate: DocumentTemplate = {
      id: template?.id || crypto.randomUUID(),
      name: formData.name,
      document_type_id: documentType.id,
      description: formData.description,
      content: formData.content,
      variables: formData.variables,
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
  }, [formData, documentType, template, onSave, toast]);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Type Info */}
      {documentType && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className={`p-2 rounded-lg bg-${documentType.color}-100`}>
                <Settings className={`h-5 w-5 text-${documentType.color}-600`} />
              </div>
              Template pour: {documentType.name}
            </CardTitle>
            <CardDescription>
              {documentType.description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">{documentType.code}</Badge>
              <Badge>{documentType.category}</Badge>
              <Badge variant="secondary">{documentType.variables.length} variable(s)</Badge>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="edit" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="edit">Édition</TabsTrigger>
          <TabsTrigger value="variables">Variables</TabsTrigger>
          <TabsTrigger value="preview">Aperçu</TabsTrigger>
        </TabsList>

        <TabsContent value="edit" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Form */}
            <div className="lg:col-span-2">
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
                      placeholder="ex: Bulletin Standard"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Description du template..."
                      rows={2}
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
            </div>

            {/* Variables Help */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Variables disponibles</CardTitle>
                  <CardDescription className="text-sm">
                    Utilisez ces variables dans votre template avec la syntaxe {`{{variable}}`}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {documentType?.variables.map((variable) => (
                      <div
                        key={variable}
                        className="flex items-center justify-between p-2 rounded-md bg-secondary cursor-pointer hover:bg-secondary/80"
                        onClick={() => {
                          const textarea = document.getElementById('content') as HTMLTextAreaElement;
                          if (textarea) {
                            const cursorPos = textarea.selectionStart;
                            const textBefore = formData.content.substring(0, cursorPos);
                            const textAfter = formData.content.substring(cursorPos);
                            const newContent = textBefore + `{{${variable}}}` + textAfter;
                            handleInputChange('content', newContent);
                          }
                        }}
                      >
                        <span className="text-sm font-mono">{variable}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Content Editor */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                Contenu du template
              </CardTitle>
              <CardDescription>
                Rédigez le contenu de votre template en HTML. Utilisez les variables avec la syntaxe {`{{variable}}`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => handleInputChange('content', e.target.value)}
                placeholder={`<h1>{{document_type}}</h1>
<p>Nom: {{student_name}}</p>
<p>Programme: {{program}}</p>
<p>Année académique: {{academic_year}}</p>

<div class="grades">
  <h2>Notes obtenues</h2>
  {{grades}}
</div>

<div class="footer">
  <p>Délivré le {{issue_date}}</p>
</div>`}
                className="min-h-[400px] font-mono"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="variables" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configuration des variables</CardTitle>
              <CardDescription>
                Personnalisez le comportement des variables pour ce template
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {documentType?.variables.map((variable) => (
                  <div key={variable} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <span className="font-medium">{variable}</span>
                      <p className="text-sm text-muted-foreground">Variable du type de document</p>
                    </div>
                    <Badge variant="outline">Obligatoire</Badge>
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
                Visualisez le rendu de votre template avec des données de démonstration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button onClick={handlePreview}>
                  <Eye className="h-4 w-4 mr-2" />
                  Générer l'aperçu
                </Button>
                
                {previewHtml && (
                  <div className="border rounded-lg p-6 bg-white">
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