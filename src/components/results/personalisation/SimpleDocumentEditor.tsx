import React, { useState, useEffect, useMemo, useCallback } from 'react';
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
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
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
  Home,
  Image,
  Table,
  FileSignature,
  QrCode,
  Calendar,
  Variable,
  Trash2
} from 'lucide-react';
import { ElementMenuButton } from './ElementMenuButton';
import { VariableSelector } from './VariableSelector';

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
    marginTop?: number;
    marginBottom?: number;
    paddingTop?: number;
    paddingBottom?: number;
  };
  // For specific element types
  src?: string; // for images
  width?: number;
  height?: number;
  borderStyle?: string;
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
  const { templates, variables, loading, updateTemplate } = useDocumentTemplates();
  const navigate = useNavigate();
  
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [elements, setElements] = useState<DocumentElement[]>([]);
  const [activeTab, setActiveTab] = useState('edit');
  const [hasChanges, setHasChanges] = useState(false);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [isLoadingTemplate, setIsLoadingTemplate] = useState(false);
  const [showElementMenu, setShowElementMenu] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Mock student data for preview
  const mockStudentData = {
    full_name: "Jean Dupont",
    student_number: "ETU2024001",
    email: "jean.dupont@email.com",
    program_name: "Informatique",
    academic_year: "2024-2025"
  };

  // Phase 2: Auto-save functionality
  useEffect(() => {
    if (hasChanges && selectedTemplate) {
      const autoSaveTimer = setTimeout(() => {
        saveTemplate().then(() => {
          setLastSaved(new Date());
          toast({
            title: "Auto-sauvegarde",
            description: "Template sauvegardé automatiquement.",
          });
        }).catch(() => {
          // Silent fail for auto-save
        });
      }, 30000); // Auto-save after 30 seconds of inactivity

      return () => clearTimeout(autoSaveTimer);
    }
  }, [hasChanges, selectedTemplate]);

  // Close element menu when clicking outside - FIXED
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      const menuElement = document.querySelector('[data-element-menu]');
      const menuButton = document.querySelector('[data-element-menu-button]');
      
      if (showElementMenu && 
          menuElement && 
          !menuElement.contains(target) && 
          menuButton &&
          !menuButton.contains(target)) {
        setShowElementMenu(false);
      }
    };

    if (showElementMenu) {
      // Delay to prevent immediate closing
      setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside);
      }, 100);
      
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showElementMenu]);

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
  const { duplicateTemplate: duplicateTemplateHook } = useDocumentTemplates();
  
  const duplicateTemplate = async () => {
    if (!selectedTemplate) return;
    
    const currentTemplate = templates.find(t => t.id === selectedTemplate);
    if (!currentTemplate) return;

    try {
      // Use the hook function for real duplication
      const newTemplate = await duplicateTemplateHook(selectedTemplate);
      if (newTemplate) {
        setSelectedTemplate(newTemplate.id);
        toast({
          title: "Template dupliqué",
          description: `Le template "${newTemplate.name}" a été créé avec succès.`,
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de dupliquer le template.",
        variant: "destructive",
      });
    }
  };

  // Phase 5: Improved export functions using editor content
  const generateDocumentHTML = () => {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px; background: white;">
        ${elements.map(element => {
          const content = replaceVariables(element.content);
          return `
            <div style="
              font-size: ${element.style.fontSize || 14}px;
              font-weight: ${element.style.fontWeight || 'normal'};
              color: ${element.style.color || '#374151'};
              text-align: ${element.style.textAlign || 'left'};
              margin-top: ${element.style.marginTop || 0}px;
              margin-bottom: ${element.style.marginBottom || 16}px;
              padding-top: ${element.style.paddingTop || 0}px;
              padding-bottom: ${element.style.paddingBottom || 0}px;
              white-space: pre-wrap;
            ">
              ${element.type === 'html' ? content : content.replace(/\n/g, '<br>')}
            </div>
          `;
        }).join('')}
      </div>
    `;
  };

  const exportToPDF = async () => {
    if (!elements.length) {
      toast({
        title: "Erreur",
        description: "Aucun élément à exporter.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const htmlContent = generateDocumentHTML();
      
      // Create temporary element for PDF generation
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = htmlContent;
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      tempDiv.style.width = '800px';
      tempDiv.style.backgroundColor = 'white';
      document.body.appendChild(tempDiv);

      // Wait for rendering
      await new Promise(resolve => setTimeout(resolve, 100));

      const canvas = await html2canvas(tempDiv, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        width: 800,
        height: tempDiv.scrollHeight
      });
      
      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let position = 0;
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);

      // Clean up temporary element
      document.body.removeChild(tempDiv);

      const currentTemplate = templates.find(t => t.id === selectedTemplate);
      const fileName = `${currentTemplate?.name || 'document'}-${Date.now()}.pdf`;
      
      pdf.save(fileName);
      
      toast({
        title: "PDF généré",
        description: "Le document PDF a été téléchargé avec succès.",
      });
    } catch (error) {
      console.error('PDF generation error:', error);
      toast({
        title: "Erreur",
        description: "Impossible de générer le PDF.",
        variant: "destructive",
      });
    }
  };

  const printDocument = () => {
    if (!elements.length) {
      toast({
        title: "Erreur",
        description: "Aucun élément à imprimer.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const htmlContent = generateDocumentHTML();
      
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Document</title>
              <style>
                body { margin: 0; padding: 20px; }
                @media print {
                  body { margin: 0; }
                }
              </style>
            </head>
            <body>
              ${htmlContent}
            </body>
          </html>
        `);
        printWindow.document.close();
        
        // Wait then print
        setTimeout(() => {
          printWindow.print();
        }, 1000);
      }
      
      toast({
        title: "Impression lancée",
        description: "Le document est en cours d'impression.",
      });
    } catch (error) {
      console.error('Print error:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'imprimer le document.",
        variant: "destructive",
      });
    }
  };

  // Enhanced element creation with comprehensive types - IMPROVED
  const addNewElement = useCallback((type: string = 'text') => {
    console.log('Adding element:', type); // Debug log
    const elementTypes = {
      text: {
        label: 'Texte libre',
        content: 'Nouveau texte',
        style: { fontSize: 14, fontWeight: 'normal', color: '#374151', textAlign: 'left' },
        description: 'Texte libre éditable'
      },
      header: {
        label: 'En-tête institutionnel',
        content: 'MINISTÈRE DE L\'ÉDUCATION NATIONALE\nÉTABLISSEMENT SCOLAIRE',
        style: { fontSize: 18, fontWeight: 'bold', color: '#1f2937', textAlign: 'center' },
        description: 'En-tête officiel du document'
      },
      title: {
        label: 'Titre principal',
        content: 'ATTESTATION DE SCOLARITÉ',
        style: { fontSize: 24, fontWeight: 'bold', color: '#1f2937', textAlign: 'center' },
        description: 'Titre principal du document'
      },
      subtitle: {
        label: 'Sous-titre',
        content: 'Année académique {{academic_year}}',
        style: { fontSize: 16, fontWeight: 'normal', color: '#6b7280', textAlign: 'center' },
        description: 'Sous-titre ou information secondaire'
      },
      variable: {
        label: 'Variable étudiant',
        content: '{{student.full_name}}',
        style: { fontSize: 16, fontWeight: 'normal', color: '#374151', textAlign: 'left' },
        description: 'Données dynamiques de l\'étudiant'
      },
      institution_info: {
        label: 'Informations établissement',
        content: 'Adresse : {{institution.address}}\nTéléphone : {{institution.phone}}\nEmail : {{institution.email}}',
        style: { fontSize: 12, fontWeight: 'normal', color: '#6b7280', textAlign: 'left' },
        description: 'Coordonnées de l\'établissement'
      },
      academic_info: {
        label: 'Informations académiques',
        content: 'Programme : {{student.program_name}}\nNiveau : {{student.level}}\nStatut : {{student.status}}',
        style: { fontSize: 14, fontWeight: 'normal', color: '#374151', textAlign: 'left' },
        description: 'Détails du parcours académique'
      },
      grades_section: {
        label: 'Section notes',
        content: 'Moyenne générale : {{student.gpa}}\nMention : {{student.mention}}\nRang : {{student.rank}}',
        style: { fontSize: 14, fontWeight: 'normal', color: '#374151', textAlign: 'left' },
        description: 'Résultats et évaluations'
      },
      signature: {
        label: 'Bloc signature',
        content: 'Le Directeur\n\n\n_________________________\nNom et cachet officiel',
        style: { fontSize: 14, fontWeight: 'normal', color: '#374151', textAlign: 'right' },
        description: 'Zone de signature officielle'
      },
      date: {
        label: 'Date du document',
        content: 'Fait à {{institution.city}}, le {{current_date}}',
        style: { fontSize: 14, fontWeight: 'normal', color: '#6b7280', textAlign: 'right' },
        description: 'Date et lieu d\'établissement'
      },
      separator: {
        label: 'Ligne de séparation',
        content: '_______________________________________________',
        style: { fontSize: 14, fontWeight: 'normal', color: '#d1d5db', textAlign: 'center' },
        description: 'Séparateur visuel'
      },
      footer_note: {
        label: 'Note de bas de page',
        content: 'Ce document est établi conformément à la réglementation en vigueur.',
        style: { fontSize: 10, fontWeight: 'normal', color: '#9ca3af', textAlign: 'center' },
        description: 'Mention légale ou note'
      },
      qr_code: {
        label: 'Code QR de vérification',
        content: 'QR Code: {{document.verification_url}}',
        style: { fontSize: 12, fontWeight: 'normal', color: '#6b7280', textAlign: 'center' },
        description: 'Code QR pour vérification'
      },
      logo_placeholder: {
        label: 'Emplacement logo',
        content: '[LOGO DE L\'ÉTABLISSEMENT]',
        style: { fontSize: 12, fontWeight: 'normal', color: '#9ca3af', textAlign: 'center' },
        description: 'Zone réservée au logo'
      }
    };

    const elementConfig = elementTypes[type as keyof typeof elementTypes] || elementTypes.text;
    
    const newElement: DocumentElement = {
      id: `element_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: type,
      label: elementConfig.label,
      content: elementConfig.content,
      style: { ...elementConfig.style, marginTop: 8, marginBottom: 8 }
    };
    
    setElements(prev => [...prev, newElement]);
    setHasChanges(true);
    setShowElementMenu(false);
    
    toast({
      title: "Élément ajouté",
      description: `${elementConfig.label} a été ajouté au document.`,
    });
  }, [toast]);

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
        <div className="flex-1 p-6 pr-4">
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
                <div className="relative">
                  <Button 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setShowElementMenu(!showElementMenu);
                    }} 
                    variant="outline"
                    data-element-menu-button
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Ajouter un élément
                  </Button>
                  
                  {/* Enhanced comprehensive element menu - FIXED */}
                  {showElementMenu && (
                    <div 
                      className="absolute right-0 top-full mt-2 w-80 bg-card border border-border rounded-lg shadow-xl z-50 p-3 max-h-96 overflow-y-auto"
                      data-element-menu
                      onMouseDown={(e) => e.stopPropagation()}
                    >
                      <div className="space-y-3">
                        <h3 className="text-sm font-semibold px-2 py-1 text-foreground border-b">Éléments de document</h3>
                        
                        {/* En-têtes et titres */}
                        <div className="space-y-1">
                          <h4 className="text-xs font-medium text-muted-foreground px-2">Structure</h4>
                          <Button 
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              addNewElement('header');
                            }} 
                            variant="ghost" 
                            size="sm" 
                            className="w-full justify-start text-left p-2 h-auto hover:bg-accent transition-colors"
                          >
                            <div className="flex items-start gap-2 w-full">
                              <Type className="w-4 h-4 mt-0.5 flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <div className="font-medium">En-tête institutionnel</div>
                                <div className="text-xs text-muted-foreground">En-tête officiel du document</div>
                              </div>
                            </div>
                          </Button>
                          
                          <Button 
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              addNewElement('title');
                            }} 
                            variant="ghost" 
                            size="sm" 
                            className="w-full justify-start text-left p-2 h-auto hover:bg-accent transition-colors"
                          >
                            <div className="flex items-start gap-2 w-full">
                              <FileText className="w-4 h-4 mt-0.5 flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <div className="font-medium">Titre principal</div>
                                <div className="text-xs text-muted-foreground">Titre principal du document</div>
                              </div>
                            </div>
                          </Button>
                          
                          {/* Tous les boutons avec gestion d'événements corrigée */}
                          <ElementMenuButton 
                            icon={Type}
                            title="Sous-titre"
                            description="Information secondaire"
                            onClick={() => addNewElement('subtitle')}
                          />
                        </div>

                        {/* Contenu dynamique */}
                        <div className="space-y-1">
                          <h4 className="text-xs font-medium text-muted-foreground px-2">Données dynamiques</h4>
                          <ElementMenuButton 
                            icon={Variable}
                            title="Variable étudiant"
                            description="Données de l'étudiant"
                            onClick={() => addNewElement('variable')}
                          />
                          
                          <ElementMenuButton 
                            icon={FileText}
                            title="Infos académiques"
                            description="Programme et niveau"
                            onClick={() => addNewElement('academic_info')}
                          />
                          
                          <ElementMenuButton 
                            icon={FileText}
                            title="Section notes"
                            description="Résultats et moyennes"
                            onClick={() => addNewElement('grades_section')}
                          />
                        </div>

                        {/* Informations fixes */}
                        <div className="space-y-1">
                          <h4 className="text-xs font-medium text-muted-foreground px-2">Informations</h4>
                          <ElementMenuButton 
                            icon={Home}
                            title="Infos établissement"
                            description="Coordonnées officielles"
                            onClick={() => addNewElement('institution_info')}
                          />
                          
                          <ElementMenuButton 
                            icon={Type}
                            title="Texte libre"
                            description="Contenu personnalisé"
                            onClick={() => addNewElement('text')}
                          />
                        </div>

                        {/* Éléments de fin */}
                        <div className="space-y-1">
                          <h4 className="text-xs font-medium text-muted-foreground px-2">Finalisation</h4>
                          <ElementMenuButton 
                            icon={Calendar}
                            title="Date du document"
                            description="Date et lieu"
                            onClick={() => addNewElement('date')}
                          />
                          
                          <ElementMenuButton 
                            icon={FileSignature}
                            title="Bloc signature"
                            description="Signature officielle"
                            onClick={() => addNewElement('signature')}
                          />
                          
                          <ElementMenuButton 
                            icon={FileText}
                            title="Note de bas de page"
                            description="Mention légale"
                            onClick={() => addNewElement('footer_note')}
                          />
                        </div>

                        {/* Éléments spéciaux */}
                        <div className="space-y-1">
                          <h4 className="text-xs font-medium text-muted-foreground px-2">Spéciaux</h4>
                          <Button 
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              addNewElement('separator');
                            }} 
                            variant="ghost" 
                            size="sm" 
                            className="w-full justify-start text-left p-2 h-auto hover:bg-accent transition-colors"
                          >
                            <div className="flex items-start gap-2 w-full">
                              <span className="w-4 h-4 mt-0.5 flex-shrink-0 text-center">─</span>
                              <div className="flex-1 min-w-0">
                                <div className="font-medium">Ligne de séparation</div>
                                <div className="text-xs text-muted-foreground">Séparateur visuel</div>
                              </div>
                            </div>
                          </Button>
                          
                          <ElementMenuButton 
                            icon={QrCode}
                            title="Code QR"
                            description="Vérification numérique"
                            onClick={() => addNewElement('qr_code')}
                          />
                          
                          <ElementMenuButton 
                            icon={Image}
                            title="Emplacement logo"
                            description="Zone réservée au logo"
                            onClick={() => addNewElement('logo_placeholder')}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
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
         
         {/* Variables Sidebar */}
         <div className="w-80 border-l bg-card/30 p-4">
           <VariableSelector 
             onVariableSelect={(variable) => {
               // Add as new variable element
               const elementConfig = {
                 label: 'Variable personnalisée',
                 content: variable,
                 style: { fontSize: 14, fontWeight: 'normal', color: '#374151', textAlign: 'left' },
                 description: 'Variable sélectionnée'
               };
               
               const newElement: DocumentElement = {
                 id: `element_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                 type: 'variable',
                 label: elementConfig.label,
                 content: elementConfig.content,
                 style: { ...elementConfig.style, marginTop: 8, marginBottom: 8 }
               };
               
               setElements(prev => [...prev, newElement]);
               setHasChanges(true);
               
               toast({
                 title: "Variable ajoutée",
                 description: "La variable a été ajoutée au document.",
               });
             }}
           />
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