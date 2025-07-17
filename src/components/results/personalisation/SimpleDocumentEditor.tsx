import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { useDocumentTemplates } from '@/hooks/useDocumentTemplates';
import { useNavigate } from 'react-router-dom';
import { SimpleDocumentGenerator } from '@/services/SimpleDocumentGenerator';
import { 
  Save,
  Eye,
  Download,
  FileText,
  Type,
  Settings,
  ArrowLeft,
  Plus,
  Copy,
  Printer,
  ChevronRight,
  Home
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
  const navigate = useNavigate();
  
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [elements, setElements] = useState<DocumentElement[]>([]);
  const [activeTab, setActiveTab] = useState('edit');
  const [hasChanges, setHasChanges] = useState(false);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [isLoadingTemplate, setIsLoadingTemplate] = useState(false);

  // Mock student data for preview
  const mockStudentData = {
    full_name: "Jean Dupont",
    student_number: "ETU2024001",
    email: "jean.dupont@email.com",
    program_name: "Informatique",
    academic_year: "2024-2025"
  };

  // Phase 1: Improved template loading with proper waiting
  useEffect(() => {
    if (templates.length > 0 && !selectedTemplate) {
      setSelectedTemplate(templates[0].id);
    }
  }, [templates, selectedTemplate]);

  // Phase 1: Enhanced template content loading - CORRECTED
  useEffect(() => {
    if (selectedTemplate && templates.length > 0) {
      setIsLoadingTemplate(true);
      const template = templates.find(t => t.id === selectedTemplate);
      
      if (template) {
        // Check if template has stored content
        if (template.template_content?.elements && Array.isArray(template.template_content.elements)) {
          const templateElements = template.template_content.elements.map((el: any) => ({
            id: el.id || `element_${Date.now()}`,
            type: el.type || 'text',
            label: el.content?.label || el.label || 'Élément',
            content: el.content?.text || el.content || '',
            style: el.style || { fontSize: 14, fontWeight: 'normal', color: '#374151', textAlign: 'left' }
          }));
          setElements(templateElements);
        } else {
          // Try to match with SimpleDocumentGenerator templates
          const availableTemplates = SimpleDocumentGenerator.getAvailableTemplates();
          const matchingTemplate = availableTemplates.find(t => 
            template.name.toLowerCase().includes(t.name.toLowerCase()) ||
            t.name.toLowerCase().includes(template.name.toLowerCase())
          );
          
          if (matchingTemplate) {
            try {
              const generatedHtml = SimpleDocumentGenerator.generateHTML(matchingTemplate.id);
              setElements([
                {
                  id: 'generated_content',
                  type: 'html',
                  label: 'Contenu généré',
                  content: generatedHtml,
                  style: { fontSize: 14, fontWeight: 'normal', color: '#374151', textAlign: 'left' }
                }
              ]);
            } catch (error) {
              console.log('Erreur génération:', error);
              setElements(defaultElements);
            }
          } else {
            // Use default elements with template name
            setElements([
              ...defaultElements,
              {
                id: 'template_title',
                type: 'title',
                label: 'Titre du template',
                content: template.name,
                style: { fontSize: 18, fontWeight: 'bold', color: '#1f2937', textAlign: 'center' }
              }
            ]);
          }
        }
      }
      
      setHasChanges(false);
      setIsLoadingTemplate(false);
    }
  }, [selectedTemplate, templates]);

  // Phase 2: Dynamic variable replacement for preview
  const replaceVariables = (content: string) => {
    return content
      .replace(/{{student\.full_name}}/g, mockStudentData.full_name)
      .replace(/{{student\.student_number}}/g, mockStudentData.student_number)
      .replace(/{{student\.email}}/g, mockStudentData.email)
      .replace(/{{student\.program_name}}/g, mockStudentData.program_name)
      .replace(/{{academic_year}}/g, mockStudentData.academic_year)
      .replace(/{{current_date}}/g, new Date().toLocaleDateString('fr-FR'));
  };

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

  // Phase 4: Template management functions
  const duplicateTemplate = async () => {
    if (!selectedTemplate) return;
    
    const currentTemplate = templates.find(t => t.id === selectedTemplate);
    if (!currentTemplate) return;

    try {
      // This would need to be implemented in the useDocumentTemplates hook
      toast({
        title: "Fonctionnalité à venir",
        description: "La duplication de templates sera bientôt disponible.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de dupliquer le template.",
        variant: "destructive",
      });
    }
  };

  // Phase 5: Export functions
  const exportToPDF = async () => {
    if (!selectedTemplate) return;
    
    try {
      const blob = await SimpleDocumentGenerator.generatePDF(selectedTemplate, mockStudentData);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `document-${selectedTemplate}-${Date.now()}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "PDF généré",
        description: "Le document PDF a été téléchargé avec succès.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de générer le PDF.",
        variant: "destructive",
      });
    }
  };

  const printDocument = () => {
    if (!selectedTemplate) return;
    
    try {
      SimpleDocumentGenerator.printDocument(selectedTemplate, mockStudentData);
      toast({
        title: "Impression lancée",
        description: "Le document est en cours d'impression.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'imprimer le document.",
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

  // Phase 3: Smart navigation with unsaved changes check
  const handleNavigation = () => {
    if (hasChanges) {
      setShowExitDialog(true);
    } else {
      navigate('/results');
    }
  };

  const confirmExit = () => {
    setShowExitDialog(false);
    navigate('/results');
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
      {/* Phase 3: Improved header with breadcrumb */}
      <div className="border-b bg-card/50 p-4">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <Button variant="ghost" size="sm" onClick={handleNavigation} className="p-0 h-auto font-normal">
            <Home className="w-4 h-4 mr-1" />
            Résultats
          </Button>
          <ChevronRight className="w-4 h-4" />
          <span>Éditeur de Documents</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleNavigation}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour
            </Button>
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              <h1 className="text-xl font-semibold">Éditeur de Documents</h1>
            </div>
            
            <Select 
              value={selectedTemplate} 
              onValueChange={setSelectedTemplate}
              disabled={isLoadingTemplate}
            >
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
            {/* Phase 4: Template management buttons */}
            <Button onClick={duplicateTemplate} variant="outline" size="sm">
              <Copy className="w-4 h-4 mr-2" />
              Dupliquer
            </Button>
            
            {/* Phase 5: Export buttons */}
            <Button onClick={printDocument} variant="outline" size="sm">
              <Printer className="w-4 h-4 mr-2" />
              Imprimer
            </Button>
            
            <Button onClick={exportToPDF} variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              PDF
            </Button>

            <Separator orientation="vertical" className="h-6" />
            
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
                    <Badge variant="outline" className="ml-2">
                      Données de test
                    </Badge>
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Aperçu avec les données de test de Jean Dupont
                  </p>
                </CardHeader>
                <CardContent>
                  {/* Phase 2: Enhanced preview with variable replacement */}
                  <div className="bg-white border shadow-lg p-8 max-w-[21cm] mx-auto">
                    {isLoadingTemplate ? (
                      <div className="flex items-center justify-center py-8">
                        <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full"></div>
                        <span className="ml-2 text-muted-foreground">Chargement du template...</span>
                      </div>
                    ) : (
                      elements.map((element) => (
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
                          {element.type === 'html' ? (
                            <div dangerouslySetInnerHTML={{ __html: replaceVariables(element.content) }} />
                          ) : (
                            replaceVariables(element.content)
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Phase 3: Exit confirmation dialog */}
      <AlertDialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Modifications non sauvegardées</AlertDialogTitle>
            <AlertDialogDescription>
              Vous avez des modifications non sauvegardées. Voulez-vous vraiment quitter sans sauvegarder ?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={confirmExit} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Quitter sans sauvegarder
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}