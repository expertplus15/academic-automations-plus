import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useDocumentTemplates } from '@/hooks/useDocumentTemplates';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { 
  Save,
  Eye,
  Download,
  FileText,
  Settings,
  ArrowLeft,
  Copy,
  Printer,
  ChevronRight,
  Home
} from 'lucide-react';
import { TemplateRenderer, getDefaultDataForTemplate } from '@/components/documents/templates/predefined/TemplateRenderer';
import { TemplateDataService } from '@/services/TemplateDataService';

// Types pour les templates standardisés
interface UnifiedTemplateData {
  templateType: string;
  data: any;
  isEditable: boolean;
}

export function UnifiedDocumentEditor() {
  const { toast } = useToast();
  const { templates, loading, updateTemplate } = useDocumentTemplates();
  const navigate = useNavigate();
  
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [templateData, setTemplateData] = useState<any>(null);
  const [templateType, setTemplateType] = useState<string>('');
  const [activeTab, setActiveTab] = useState('preview');
  const [hasChanges, setHasChanges] = useState(false);
  const [isLoadingTemplate, setIsLoadingTemplate] = useState(false);

  // Mapping des templates de la DB vers les types TemplateRenderer
  const getTemplateTypeFromName = (templateName: string): string => {
    const name = templateName.toLowerCase();
    
    if (name.includes('attestation') && name.includes('scolarite')) {
      return 'attestation_scolarite';
    } else if (name.includes('attestation')) {
      return 'attestation';
    } else if (name.includes('bulletin')) {
      return 'bulletin';
    } else if (name.includes('releve') || name.includes('emd')) {
      return 'emd_releve';
    } else if (name.includes('transcript')) {
      return 'transcript';
    } else if (name.includes('certificat')) {
      return 'certificat';
    } else if (name.includes('certificate')) {
      return 'certificate';
    } else if (name.includes('diplome')) {
      return 'diplome';
    } else if (name.includes('cert_scol')) {
      return 'cert_scol_v1';
    }
    
    // Par défaut, utiliser attestation
    return 'attestation';
  };

  // Charger le template sélectionné
  useEffect(() => {
    if (templates.length > 0 && !selectedTemplate) {
      setSelectedTemplate(templates[0].id);
    }
  }, [templates, selectedTemplate]);

  useEffect(() => {
    if (selectedTemplate && templates.length > 0) {
      setIsLoadingTemplate(true);
      const template = templates.find(t => t.id === selectedTemplate);
      
      if (template) {
        const type = getTemplateTypeFromName(template.name);
        setTemplateType(type);
        
        // Utiliser TemplateDataService pour obtenir les données cohérentes
        const defaultData = TemplateDataService.getDataForTemplate(type);
        setTemplateData(defaultData);
      }
      
      setHasChanges(false);
      setIsLoadingTemplate(false);
    }
  }, [selectedTemplate, templates]);

  // Sauvegarder les données du template
  const saveTemplate = async () => {
    if (!selectedTemplate || !templateData) return;
    
    try {
      await updateTemplate(selectedTemplate, {
        template_content: {
          templateType,
          data: templateData,
          lastModified: new Date().toISOString()
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

  // Dupliquer le template
  const { duplicateTemplate: duplicateTemplateHook } = useDocumentTemplates();
  
  const duplicateTemplate = async () => {
    if (!selectedTemplate) return;
    
    try {
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

  // Génération PDF utilisant le vrai template
  const exportToPDF = async () => {
    if (!templateData || !templateType) {
      toast({
        title: "Erreur",
        description: "Aucun template à exporter.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Créer un élément temporaire avec le template rendu
      const tempDiv = document.createElement('div');
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      tempDiv.style.width = '800px';
      tempDiv.style.backgroundColor = 'white';
      tempDiv.style.padding = '40px';
      document.body.appendChild(tempDiv);

      // Rendre le template React dans l'élément temporaire
      const { createRoot } = await import('react-dom/client');
      const root = createRoot(tempDiv);
      
      await new Promise<void>((resolve) => {
        root.render(
          React.createElement(TemplateRenderer, {
            templateType,
            data: templateData,
            isEditable: false,
            onDataChange: () => {}
          })
        );
        
        // Attendre le rendu
        setTimeout(resolve, 500);
      });

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
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

      // Nettoyer
      root.unmount();
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

  // Imprimer le document
  const printDocument = () => {
    if (!templateData || !templateType) {
      toast({
        title: "Erreur",
        description: "Aucun template à imprimer.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Document</title>
              <style>
                body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
                @media print { body { margin: 0; } }
              </style>
            </head>
            <body>
              <div id="template-container"></div>
              <script>
                // Le template sera injecté ici
              </script>
            </body>
          </html>
        `);
        printWindow.document.close();
        
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

  // Navigation avec vérification des changements
  const handleNavigation = () => {
    if (hasChanges) {
      if (confirm('Vous avez des modifications non sauvegardées. Voulez-vous vraiment quitter ?')) {
        navigate('/results');
      }
    } else {
      navigate('/results');
    }
  };

  // Gestion des changements de données
  const handleDataChange = (newData: any) => {
    setTemplateData(newData);
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
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <Button variant="ghost" size="sm" onClick={handleNavigation} className="p-0 h-auto font-normal">
            <Home className="w-4 h-4 mr-1" />
            Résultats
          </Button>
          <ChevronRight className="w-4 h-4" />
          <span>Éditeur de Documents Unifié</span>
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
              <h1 className="text-xl font-semibold">Éditeur Unifié</h1>
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
            <Button onClick={duplicateTemplate} variant="outline" size="sm">
              <Copy className="w-4 h-4 mr-2" />
              Dupliquer
            </Button>
            
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
      <div className="flex-1 p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="preview" className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Aperçu
            </TabsTrigger>
            <TabsTrigger value="edit" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Édition
            </TabsTrigger>
          </TabsList>

          <TabsContent value="preview">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Aperçu du document
                  <Badge variant="outline" className="ml-2">
                    {templateType}
                  </Badge>
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Aperçu utilisant le même système que le module documentation
                </p>
              </CardHeader>
              <CardContent>
                <div className="bg-white border shadow-lg p-8 max-w-[21cm] mx-auto">
                  {isLoadingTemplate ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full"></div>
                      <span className="ml-2 text-muted-foreground">Chargement du template...</span>
                    </div>
                  ) : templateData && templateType ? (
                    <TemplateRenderer
                      templateType={templateType}
                      data={templateData}
                      isEditable={false}
                      onDataChange={handleDataChange}
                    />
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      Aucun template sélectionné
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="edit">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Mode édition
                  <Badge variant="outline" className="ml-2">
                    {templateType}
                  </Badge>
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Éditez directement les données du template
                </p>
              </CardHeader>
              <CardContent>
                <div className="bg-white border shadow-lg p-8 max-w-[21cm] mx-auto">
                  {isLoadingTemplate ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full"></div>
                      <span className="ml-2 text-muted-foreground">Chargement du template...</span>
                    </div>
                  ) : templateData && templateType ? (
                    <TemplateRenderer
                      templateType={templateType}
                      data={templateData}
                      isEditable={true}
                      onDataChange={handleDataChange}
                    />
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      Aucun template sélectionné
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}