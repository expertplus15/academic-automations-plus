import React, { useState } from 'react';
import { TemplateEditorProvider } from './providers/TemplateEditorProvider';
import ModernEditorInterface from './core/ModernEditorInterface';
import { SidebarToolbox } from './components/SidebarToolbox';
import { TemplateToolbox } from './TemplateToolbox';
import { useToast } from '@/hooks/use-toast';
import { useDocumentTemplates } from '@/hooks/useDocumentTemplates';
import { useNavigate } from 'react-router-dom';
import { SimpleDocumentGenerator } from '@/services/SimpleDocumentGenerator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { ArrowLeft, Copy, Download, Printer, Save, Home, ChevronRight, FileText } from 'lucide-react';

// Interface unifiée avec TemplateElement
import { TemplateElement, Template, TemplateContent } from './types';

// Templates par défaut riches pour éviter l'état vide
const createDefaultTemplates = (): Template[] => [
  {
    id: 'bulletin_default',
    name: 'Bulletin de Notes Complet',
    type: 'bulletin',
    description: 'Template standard pour bulletin de notes avec toutes les sections',
    content: {
      elements: [
        {
          id: 'header_institution',
          type: 'header',
          x: 50,
          y: 20,
          width: 700,
          height: 80,
          content: { 
            institution: 'ÉTABLISSEMENT SCOLAIRE D\'EXCELLENCE',
            address: '123 Rue de l\'Éducation, 75001 Paris',
            phone: '01.23.45.67.89'
          },
          style: { fontSize: 24, fontWeight: 'bold', color: '#1f2937', textAlign: 'center' }
        },
        {
          id: 'document_title',
          type: 'heading',
          x: 50,
          y: 120,
          width: 700,
          height: 60,
          content: { text: 'BULLETIN DE NOTES', level: 1 },
          style: { fontSize: 20, fontWeight: 'bold', color: '#1f2937', textAlign: 'center' }
        },
        {
          id: 'student_info',
          type: 'variable',
          x: 50,
          y: 200,
          width: 350,
          height: 120,
          content: { 
            name: 'student_info',
            template: 'Nom: {{student.full_name}}\nNuméro étudiant: {{student.student_number}}\nClasse: {{student.class_name}}\nAnnée: {{academic_year}}'
          },
          style: { fontSize: 14, fontWeight: 'normal', color: '#374151', textAlign: 'left' }
        },
        {
          id: 'current_date',
          type: 'date',
          x: 450,
          y: 200,
          width: 300,
          height: 30,
          content: { format: 'DD/MM/YYYY' },
          style: { fontSize: 14, fontWeight: 'normal', color: '#6b7280', textAlign: 'right' }
        },
        {
          id: 'grades_table',
          type: 'table',
          x: 50,
          y: 350,
          width: 700,
          height: 300,
          content: {
            headers: ['Matière', 'Note', 'Coefficient', 'Moyenne Classe', 'Observation'],
            rows: [
              ['Mathématiques', '{{grades.math}}', '4', '12.5', 'Bon travail'],
              ['Français', '{{grades.french}}', '4', '13.2', 'Peut mieux faire'],
              ['Histoire-Géo', '{{grades.history}}', '3', '11.8', 'Satisfaisant']
            ]
          },
          style: { fontSize: 12, borderColor: '#374151' }
        },
        {
          id: 'signature_section',
          type: 'signature',
          x: 450,
          y: 700,
          width: 300,
          height: 100,
          content: { 
            name: 'Le Directeur', 
            title: 'Directeur de l\'Établissement',
            date: '{{current_date}}'
          },
          style: { fontSize: 12, textAlign: 'center' }
        }
      ],
      layout: { type: 'A4', orientation: 'portrait' },
      styles: {
        colors: { primary: '#1f2937', secondary: '#6b7280' },
        fonts: { main: 'Arial', heading: 'Arial Bold' }
      }
    },
    is_active: true,
    is_default: true,
    version: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'certificate_default',
    name: 'Certificat de Scolarité',
    type: 'report',
    description: 'Template pour certificat de scolarité officiel',
    content: {
      elements: [
        {
          id: 'logo_institution',
          type: 'logo',
          x: 50,
          y: 50,
          width: 100,
          height: 100,
          content: { url: '/logo-placeholder.png', alt: 'Logo établissement' },
          style: {}
        },
        {
          id: 'header_official',
          type: 'header',
          x: 200,
          y: 50,
          width: 500,
          height: 100,
          content: { 
            institution: 'RÉPUBLIQUE FRANÇAISE',
            subheading: 'Académie de Paris - Établissement d\'Enseignement Supérieur'
          },
          style: { fontSize: 16, fontWeight: 'bold', textAlign: 'center' }
        },
        {
          id: 'certificate_title',
          type: 'heading',
          x: 50,
          y: 200,
          width: 700,
          height: 60,
          content: { text: 'CERTIFICAT DE SCOLARITÉ', level: 1 },
          style: { fontSize: 24, fontWeight: 'bold', textAlign: 'center' }
        },
        {
          id: 'certificate_text',
          type: 'text',
          x: 50,
          y: 300,
          width: 700,
          height: 200,
          content: { 
            text: 'Je soussigné(e), {{director.name}}, {{director.title}} de l\'établissement {{institution.name}}, certifie que :\n\n{{student.title}} {{student.full_name}}\nNé(e) le {{student.birth_date}} à {{student.birth_place}}\n\nEst régulièrement inscrit(e) dans notre établissement pour l\'année universitaire {{academic_year}} en {{program.name}} ({{program.level}}).\n\nCe certificat est délivré à l\'intéressé(e) pour servir et valoir ce que de droit.'
          },
          style: { fontSize: 14, lineHeight: 1.6, textAlign: 'justify' }
        },
        {
          id: 'issue_location',
          type: 'text',
          x: 450,
          y: 550,
          width: 300,
          height: 30,
          content: { text: 'Fait à {{institution.city}}, le {{current_date}}' },
          style: { fontSize: 12, textAlign: 'right' }
        },
        {
          id: 'official_signature',
          type: 'signature',
          x: 450,
          y: 600,
          width: 300,
          height: 120,
          content: { 
            name: '{{director.name}}',
            title: '{{director.title}}',
            stamp: true
          },
          style: { fontSize: 12, textAlign: 'center' }
        },
        {
          id: 'official_seal',
          type: 'seal',
          x: 500,
          y: 650,
          width: 80,
          height: 80,
          content: { type: 'official', text: 'SCEAU OFFICIEL' },
          style: {}
        }
      ],
      layout: { type: 'A4', orientation: 'portrait' },
      styles: {
        colors: { primary: '#000000', secondary: '#333333' },
        fonts: { main: 'Times New Roman', heading: 'Times New Roman Bold' }
      }
    },
    is_active: true,
    is_default: false,
    version: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

// Interface moderne utilisant le système de provider unifié
function ModernDocumentEditor() {
  const { toast } = useToast();
  const { templates, loading, updateTemplate, duplicateTemplate } = useDocumentTemplates();
  const navigate = useNavigate();
  
  const [showExitDialog, setShowExitDialog] = useState(false);

  // Templates par défaut si aucun template n'existe
  const enrichedTemplates = templates.length === 0 ? createDefaultTemplates() : templates;

  // Mock student data for preview
  const mockStudentData = {
    full_name: "Jean Dupont",
    student_number: "ETU2024001",
    email: "jean.dupont@email.com",
    program_name: "Informatique",
    academic_year: "2024-2025"
  };

  const handleDuplicateTemplate = async (templateId: string) => {
    try {
      await duplicateTemplate(templateId);
      toast({
        title: "Template dupliqué",
        description: "Le template a été copié avec succès.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de dupliquer le template.",
        variant: "destructive",
      });
    }
  };

  const handleExportToPDF = async (templateId: string) => {
    try {
      const blob = await SimpleDocumentGenerator.generatePDF(templateId, mockStudentData);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `document-${templateId}-${Date.now()}.pdf`;
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

  const handlePrintDocument = (templateId: string) => {
    try {
      SimpleDocumentGenerator.printDocument(templateId, mockStudentData);
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

  const handleNavigation = () => {
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
    <TemplateEditorProvider>
      <div className="h-screen w-full bg-background flex flex-col overflow-hidden">
        {/* Header amélioré avec breadcrumb */}
        <div className="border-b bg-card/50 p-4">
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
                <h1 className="text-xl font-semibold">Éditeur de Documents Avancé</h1>
              </div>
            </div>
          </div>
        </div>

        {/* Interface moderne avec toolbox intégrée */}
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar avec TemplateToolbox */}
          <div className="w-80 border-r bg-card/30 flex flex-col">
            <div className="p-4 border-b">
              <h2 className="font-semibold text-lg mb-3">Outils & Éléments</h2>
            </div>
            <div className="flex-1 overflow-hidden">
              <TemplateToolbox 
                onElementSelect={(elementType) => {
                  // Connexion avec le système d'ajout d'éléments
                  console.log('Élément sélectionné:', elementType);
                }}
                selectedElement={null}
              />
            </div>
          </div>

          {/* Interface principale */}
          <div className="flex-1 min-w-0">
            <ModernEditorInterface />
          </div>
        </div>

        {/* Dialog de confirmation de sortie */}
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
              <AlertDialogAction onClick={() => navigate('/results')}>
                Quitter sans sauvegarder
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </TemplateEditorProvider>
  );
}

export function SimpleDocumentEditor() {
  return <ModernDocumentEditor />;
}