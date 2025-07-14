import React, { useState, useCallback } from 'react';
import { Save, X, Edit3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { TemplateRenderer, getDefaultDataForTemplate } from './predefined/TemplateRenderer';
import type { DocumentType } from '@/hooks/useDocumentTypes';
import type { DocumentTemplate } from '@/hooks/useDocumentTemplatesEnhanced';

interface TemplateBlock {
  id: string;
  name: string;
  content: string;
  variables: string[];
  editable: boolean;
}

// Mapping des templates vers leurs types de rendu
const TEMPLATE_TYPE_MAP: Record<string, string> = {
  'Template Relevé EMD': 'emd_releve',
  'Relevé Notes EMD': 'emd_releve',
  'EMD Template': 'emd_releve'
};

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
  
  // Détecter le type de template pour adapter les blocs
  const templateType = Object.keys(TEMPLATE_TYPE_MAP).find(key => 
    baseTemplate.name.includes(key)
  ) ? TEMPLATE_TYPE_MAP[Object.keys(TEMPLATE_TYPE_MAP).find(key => 
    baseTemplate.name.includes(key)
  )!] : 'generic';

  // Adapter les blocs selon le type de template
  const getBlocksForTemplate = (type: string) => {
    if (type === 'emd_releve') {
      return [
        {
          id: 'header',
          name: '🏫 En-tête Officiel EMD',
          content: 'République, Ministère, École',
          variables: ['republique', 'ministere', 'ecole'],
          editable: true
        },
        {
          id: 'document_info',
          name: '📄 Informations Document',
          content: 'Année académique, Session',
          variables: ['annee_academique', 'session'],
          editable: true
        },
        {
          id: 'student_info',
          name: '👤 Informations Étudiant',
          content: 'Nom, Niveau, Système d\'étude',
          variables: ['nom', 'niveau', 'systeme_etude'],
          editable: true
        },
        {
          id: 'grades_s1',
          name: '📊 Tableau Notes S1',
          content: 'Matières Semestre 1',
          variables: ['semestre1', 'moyenne_generale_s1'],
          editable: true
        },
        {
          id: 'grades_s2',
          name: '📊 Tableau Notes S2',
          content: 'Matières Semestre 2',
          variables: ['semestre2', 'moyenne_generale_s2'],
          editable: true
        },
        {
          id: 'summary',
          name: '✅ Moyennes & Décisions',
          content: 'Moyenne générale, Mention, Décision jury',
          variables: ['moyenne_generale', 'mention', 'decision'],
          editable: true
        },
        {
          id: 'signature',
          name: '✍️ Signatures Officielles',
          content: 'Date, Directeur Général',
          variables: ['date', 'directeur_general'],
          editable: true
        }
      ];
    }
    
    // Blocs génériques par défaut
    return [
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
    ];
  };

  const [blocks, setBlocks] = useState<TemplateBlock[]>(getBlocksForTemplate(templateType));
  const [editingBlock, setEditingBlock] = useState<TemplateBlock | null>(null);
  const [previewData, setPreviewData] = useState(() => getDefaultDataForTemplate(templateType));

  // Gérer les modifications des données pour l'aperçu temps réel
  const handleDataChange = useCallback((newData: any) => {
    setPreviewData(prev => ({ ...prev, ...newData }));
  }, []);

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
              <div className="min-h-[600px] overflow-auto border rounded-lg bg-white">
                <TemplateRenderer
                  templateType={templateType}
                  data={previewData}
                  isEditable={false}
                  onDataChange={handleDataChange}
                />
              </div>
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
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Variables disponibles pour {editingBlock.name}</Label>
                  <div className="flex flex-wrap gap-2">
                    {editingBlock.variables.map((variable) => (
                      <div key={variable} className="flex items-center gap-2">
                        <code className="px-2 py-1 bg-muted rounded text-sm">
                          {variable}
                        </code>
                         <span className="text-sm text-muted-foreground">
                           = {(() => {
                             const value = previewData[variable as keyof typeof previewData];
                             if (Array.isArray(value)) return `${value.length} éléments`;
                             return String(value || 'Non défini');
                           })()}
                         </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Modifier les valeurs de test</Label>
                  <div className="grid grid-cols-2 gap-4 max-h-40 overflow-y-auto">
                    {editingBlock.variables.map((variable) => (
                      <div key={variable} className="space-y-1">
                        <Label className="text-xs">{variable}</Label>
                         {(() => {
                           const value = previewData[variable as keyof typeof previewData];
                           if (Array.isArray(value)) {
                             return (
                               <div className="text-xs text-muted-foreground p-2 bg-muted rounded">
                                 {variable} (tableau avec {value.length} éléments)
                               </div>
                             );
                           }
                           return (
                             <Input
                               value={String(value || '')}
                               onChange={(e) => {
                                 setPreviewData(prev => ({
                                   ...prev,
                                   [variable]: e.target.value
                                 }));
                               }}
                               className="text-xs"
                               placeholder={`Valeur pour ${variable}`}
                             />
                           );
                         })()}
                      </div>
                    ))}
                  </div>
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