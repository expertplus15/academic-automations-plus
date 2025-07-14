import React, { useState, useCallback } from 'react';
import { Save, X, Edit3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import type { DocumentType } from '@/hooks/useDocumentTypes';
import type { DocumentTemplate } from '@/hooks/useDocumentTemplatesEnhanced';

interface TemplateBlock {
  id: string;
  name: string;
  content: string;
  variables: string[];
  editable: boolean;
}

interface SimpleTemplateCustomizerProps {
  documentType?: DocumentType | null;
  baseTemplate: DocumentTemplate;
  onSave: (template: DocumentTemplate) => void;
  onCancel: () => void;
}

export function SimpleTemplateCustomizer({ 
  documentType, 
  baseTemplate,
  onSave, 
  onCancel 
}: SimpleTemplateCustomizerProps) {
  const { toast } = useToast();
  
  const [templateName, setTemplateName] = useState(baseTemplate.name + ' (Personnalisé)');
  const [templateDescription, setTemplateDescription] = useState(baseTemplate.description || '');
  
  // Convertir les sections en blocs simples
  const [blocks, setBlocks] = useState<TemplateBlock[]>([
    {
      id: 'header',
      name: '🏫 En-tête Institution',
      content: baseTemplate.content?.sections?.[0]?.content || '',
      variables: ['institution_name', 'document_type', 'issue_date'],
      editable: true
    },
    {
      id: 'student_info',
      name: '👤 Informations Étudiant',
      content: baseTemplate.content?.sections?.[1]?.content || '',
      variables: ['student_name', 'student_number', 'program_name'],
      editable: true
    },
    {
      id: 'grades_table',
      name: '📊 Tableau des Notes',
      content: baseTemplate.content?.sections?.[2]?.content || '',
      variables: ['grades', 'overall_average', 'total_ects'],
      editable: true
    },
    {
      id: 'summary',
      name: '✅ Mentions & Totaux',
      content: baseTemplate.content?.sections?.[3]?.content || '',
      variables: ['overall_mention', 'validation_status'],
      editable: true
    },
    {
      id: 'signature',
      name: '✍️ Signatures',
      content: baseTemplate.content?.sections?.[4]?.content || '',
      variables: ['director_name', 'city', 'issue_date'],
      editable: true
    }
  ]);

  const [editingBlock, setEditingBlock] = useState<TemplateBlock | null>(null);
  const [previewHtml, setPreviewHtml] = useState('');

  // Générer l'aperçu en temps réel
  const generatePreview = useCallback(() => {
    let html = blocks.map(block => block.content).join('\n\n');
    
    // Mock data pour l'aperçu
    const mockData = {
      institution_name: 'UNIVERSITÉ DE TECHNOLOGIE',
      document_type: 'RELEVÉ DE NOTES OFFICIEL',
      issue_date: new Date().toLocaleDateString('fr-FR'),
      student_name: 'DUPONT Jean',
      student_number: '2024001',
      program_name: 'Master Informatique',
      overall_average: '16.17',
      total_ects: '30',
      overall_mention: 'Bien',
      validation_status: 'Validé',
      director_name: 'Dr. Marie MARTIN',
      city: 'Paris'
    };

    // Remplacer les variables
    Object.entries(mockData).forEach(([key, value]) => {
      html = html.replace(new RegExp(`{{${key}}}`, 'g'), value);
    });

    setPreviewHtml(`
      <div style="max-width: 800px; margin: 0 auto; font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; background: white;">
        ${html}
      </div>
    `);
  }, [blocks]);

  // Générer l'aperçu au chargement et à chaque modification
  React.useEffect(() => {
    generatePreview();
  }, [generatePreview]);

  const handleEditBlock = useCallback((block: TemplateBlock) => {
    setEditingBlock({ ...block });
  }, []);

  const handleSaveBlock = useCallback(() => {
    if (!editingBlock) return;
    
    setBlocks(prev => prev.map(block => 
      block.id === editingBlock.id ? editingBlock : block
    ));
    setEditingBlock(null);
    
    toast({
      title: "Bloc modifié",
      description: `Le bloc "${editingBlock.name}" a été mis à jour`
    });
  }, [editingBlock, toast]);

  const handleSave = useCallback(() => {
    if (!templateName) {
      toast({
        title: "Erreur",
        description: "Le nom du template est requis",
        variant: "destructive"
      });
      return;
    }

    // Convertir les blocs en format sections
    const sections = blocks.map((block, index) => ({
      id: block.id,
      type: index === 0 ? 'header' as const : 
            index === blocks.length - 1 ? 'footer' as const : 'content' as const,
      name: block.name,
      content: block.content,
      variables: block.variables,
      styles: {
        margin: '16px 0',
        padding: '16px'
      },
      order: index + 1,
      isActive: true
    }));

    const customizedTemplate: DocumentTemplate = {
      ...baseTemplate,
      id: crypto.randomUUID(),
      name: templateName,
      description: templateDescription,
      content: {
        sections,
        layout: 'sectioned',
        variables: [...new Set(blocks.flatMap(block => block.variables))]
      },
      is_default: false,
      version: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    onSave(customizedTemplate);
    
    toast({
      title: "Template personnalisé",
      description: `"${templateName}" a été créé avec succès`
    });
  }, [templateName, templateDescription, blocks, baseTemplate, onSave, toast]);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Edit3 className="h-5 w-5" />
            Personnaliser: {baseTemplate.name}
          </CardTitle>
          <CardDescription>
            Modifiez les blocs selon vos besoins. Les changements sont visibles en temps réel.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom de votre template</Label>
              <Input
                id="name"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                placeholder="Nom du template personnalisé"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description (optionnel)</Label>
              <Input
                id="description"
                value={templateDescription}
                onChange={(e) => setTemplateDescription(e.target.value)}
                placeholder="Description du template"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Interface principale */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Panel de personnalisation */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Personnalisation des blocs</h3>
          
          {blocks.map((block) => (
            <Card key={block.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{block.name}</CardTitle>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleEditBlock(block)}
                    disabled={!block.editable}
                  >
                    <Edit3 className="h-4 w-4 mr-1" />
                    Modifier
                  </Button>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>

        {/* Aperçu en temps réel */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Aperçu en temps réel</h3>
          <Card>
            <CardContent className="p-0">
              <div 
                className="min-h-[600px] overflow-auto border rounded-lg bg-white"
                dangerouslySetInnerHTML={{ __html: previewHtml }}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-6 border-t">
        <Button variant="outline" onClick={onCancel}>
          <X className="h-4 w-4 mr-2" />
          Annuler
        </Button>
        <Button onClick={handleSave}>
          <Save className="h-4 w-4 mr-2" />
          Sauvegarder le template
        </Button>
      </div>

      {/* Dialog d'édition de bloc */}
      <Dialog open={!!editingBlock} onOpenChange={() => setEditingBlock(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Modifier le bloc: {editingBlock?.name}</DialogTitle>
            <DialogDescription>
              Personnalisez le contenu de ce bloc. Vous pouvez utiliser du HTML et les variables disponibles.
            </DialogDescription>
          </DialogHeader>
          
          {editingBlock && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Variables disponibles</Label>
                <div className="flex flex-wrap gap-2">
                  {editingBlock.variables.map((variable) => (
                    <code 
                      key={variable}
                      className="px-2 py-1 bg-muted rounded text-sm cursor-pointer hover:bg-muted/80"
                      onClick={() => {
                        const textarea = document.getElementById('block-content') as HTMLTextAreaElement;
                        if (textarea) {
                          const start = textarea.selectionStart;
                          const end = textarea.selectionEnd;
                          const text = textarea.value;
                          const before = text.substring(0, start);
                          const after = text.substring(end);
                          const newText = before + `{{${variable}}}` + after;
                          setEditingBlock(prev => prev ? { ...prev, content: newText } : null);
                        }
                      }}
                    >
                      {`{{${variable}}}`}
                    </code>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="block-content">Contenu HTML</Label>
                <Textarea
                  id="block-content"
                  value={editingBlock.content}
                  onChange={(e) => setEditingBlock(prev => 
                    prev ? { ...prev, content: e.target.value } : null
                  )}
                  className="min-h-[300px] font-mono text-sm"
                  placeholder="Contenu HTML du bloc..."
                />
              </div>
              
              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => setEditingBlock(null)}>
                  Annuler
                </Button>
                <Button onClick={handleSaveBlock}>
                  Sauvegarder
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}