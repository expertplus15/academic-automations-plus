import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Save, Eye, RotateCcw, FileText, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useDocumentTemplates, DocumentVariable } from '@/hooks/useDocumentTemplates';


// Fonction pour grouper les variables par catégorie
const groupVariablesByCategory = (variables: DocumentVariable[]) => {
  if (!Array.isArray(variables)) return [];
  
  const grouped = variables.reduce((acc, variable) => {
    const category = variable.category || 'Autres';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(`{{${variable.name}}}`);
    return acc;
  }, {} as Record<string, string[]>);
  
  return Object.entries(grouped).map(([category, vars]) => ({
    category,
    variables: vars
  }));
};

interface SimpleTemplateEditorProps {
  className?: string;
}

export function SimpleTemplateEditor({ className }: SimpleTemplateEditorProps) {
  const { toast } = useToast();
  const { templates, variables, loading, updateTemplate } = useDocumentTemplates();
  
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');
  const [templateContent, setTemplateContent] = useState('');
  const [isPreview, setIsPreview] = useState(false);
  const [saving, setSaving] = useState(false);

  const selectedTemplate = (templates || []).find((t: any) => t.id === selectedTemplateId);

  useEffect(() => {
    if (selectedTemplate) {
      const content = selectedTemplate.template_content?.template || '';
      setTemplateContent(content);
    }
  }, [selectedTemplate]);

  const handleSave = async () => {
    if (!selectedTemplate) return;
    
    setSaving(true);
    try {
      const updatedTemplate = {
        ...selectedTemplate,
        template_content: {
          ...selectedTemplate.template_content,
          template: templateContent
        }
      };
      
      await updateTemplate(selectedTemplate.id, {
        template_content: {
          ...selectedTemplate.template_content,
          template: templateContent
        }
      });
      
      toast({
        title: "Template sauvegardé",
        description: "Les modifications ont été enregistrées avec succès.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder le template.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (selectedTemplate) {
      const originalContent = selectedTemplate.template_content?.template || '';
      setTemplateContent(originalContent);
      toast({
        title: "Template réinitialisé",
        description: "Le contenu original a été restauré.",
      });
    }
  };

  const insertVariable = (variable: string) => {
    const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newContent = templateContent.substring(0, start) + variable + templateContent.substring(end);
      setTemplateContent(newContent);
      
      // Restaurer la position du curseur
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + variable.length, start + variable.length);
      }, 0);
    }
  };

  const generatePreview = () => {
    let preview = templateContent;
    
    // Remplacer les variables par des exemples de données
    const sampleData: Record<string, string> = {
      'institution_name': 'Université de Paris',
      'student_name': 'Martin Dupont',
      'student_number': '20241234',
      'student_email': 'martin.dupont@univ-paris.fr',
      'student_program': 'Master Informatique',
      'student_level': 'M2',
      'academic_year': '2024-2025',
      'semester': '1',
      'program_name': 'Master en Informatique',
      'level_name': 'Master 2',
      'enrollment_date': '15/09/2024',
      'session_date': new Date().toLocaleDateString('fr-FR'),
      'overall_average': '14.5',
      'semester_average': '15.2',
      'total_credits': '120',
      'attendance_rate': '95',
      'ranking': '3',
      'grades_table': `Mathématiques: 16/20 - 6 ECTS
Algorithmique: 15/20 - 6 ECTS  
Base de données: 13/20 - 4 ECTS
Projet: 14/20 - 4 ECTS`
    };

    Object.entries(sampleData).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      preview = preview.replace(regex, value);
    });

    return preview;
  };

  // Grouper les variables par catégorie
  const availableVariables = groupVariablesByCategory(variables || []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement des templates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`h-full flex flex-col gap-4 p-4 ${className}`}>
      {/* Zone 1: Sélection du Template */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Sélection du Template
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedTemplateId} onValueChange={setSelectedTemplateId}>
            <SelectTrigger>
              <SelectValue placeholder="Choisir un template à personnaliser" />
            </SelectTrigger>
            <SelectContent>
              {(templates || []).map((template: any) => (
                <SelectItem key={template.id} value={template.id}>
                  {template.name} - {template.template_type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedTemplate && (
            <p className="text-sm text-muted-foreground mt-2">
              {selectedTemplate.description}
            </p>
          )}
        </CardContent>
      </Card>

      {selectedTemplate && (
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Zone 2: Éditeur Central */}
          <div className="lg:col-span-2">
            <Card className="h-full">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle>Éditeur de Contenu</CardTitle>
                  <div className="flex items-center gap-2">
                    <Button
                      variant={isPreview ? "default" : "outline"}
                      size="sm"
                      onClick={() => setIsPreview(!isPreview)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      {isPreview ? "Édition" : "Aperçu"}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                {isPreview ? (
                  <div className="border rounded-md p-4 h-full overflow-auto bg-background">
                    <div 
                      className="prose prose-sm max-w-none whitespace-pre-line"
                      style={{ fontFamily: 'Arial, sans-serif' }}
                    >
                      {generatePreview()}
                    </div>
                  </div>
                ) : (
                  <Textarea
                    value={templateContent}
                    onChange={(e) => setTemplateContent(e.target.value)}
                    placeholder="Contenu du template..."
                    className="h-full min-h-[400px] resize-none font-mono text-sm"
                  />
                )}
              </CardContent>
            </Card>
          </div>

          {/* Zone 3: Variables et Propriétés */}
          <div>
            <Card className="h-full">
              <CardHeader className="pb-3">
                <CardTitle>Variables Disponibles</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {availableVariables.map((category) => (
                  <div key={category.category}>
                    <Label className="text-sm font-medium">{category.category}</Label>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {category.variables.map((variable) => (
                        <Badge
                          key={variable}
                          variant="secondary"
                          className="cursor-pointer hover:bg-primary hover:text-primary-foreground text-xs"
                          onClick={() => insertVariable(variable)}
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          {variable}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
                {availableVariables.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    Aucune variable disponible
                  </p>
                )}
                <div className="pt-4 border-t">
                  <p className="text-xs text-muted-foreground">
                    Cliquez sur une variable pour l'insérer dans le template
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Zone 4: Actions */}
          <div>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  onClick={handleSave} 
                  disabled={saving}
                  className="w-full"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? "Sauvegarde..." : "Sauvegarder"}
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={handleReset}
                  className="w-full"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Réinitialiser
                </Button>

                {selectedTemplate && (
                  <div className="pt-3 border-t text-sm space-y-2">
                    <div>
                      <Label className="text-xs text-muted-foreground">Type</Label>
                      <p className="font-medium">{selectedTemplate.template_type}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Dernière modification</Label>
                      <p className="text-xs">
                        {new Date(selectedTemplate.updated_at).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}