import React from 'react';
import { FileText, GraduationCap, Award, Scroll } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { DocumentTemplate } from '@/hooks/useDocumentTemplatesEnhanced';
import { academicComponents } from './AcademicComponents';

export interface PredefinedTemplate {
  id: string;
  name: string;
  description: string;
  category: 'transcript' | 'certificate' | 'bulletin' | 'attestation';
  documentTypeCode: string;
  icon: React.ComponentType<any>;
  template: DocumentTemplate;
  previewImage?: string;
}

export const predefinedTemplates: PredefinedTemplate[] = [
  {
    id: 'transcript_complete',
    name: 'Relevé de Notes Complet',
    description: 'Template officiel complet avec en-tête institution, tableau des notes et signatures',
    category: 'transcript',
    documentTypeCode: 'RELEVE',
    icon: GraduationCap,
    template: {
      id: 'template_transcript_complete',
      name: 'Relevé de Notes Complet',
      document_type_id: '2',
      description: 'Template officiel complet pour relevé de notes avec toutes les sections requises',
      content: {
        sections: [
          {
            id: 'header-institution',
            type: 'header' as const,
            name: 'En-tête Institution',
            content: academicComponents.find(c => c.id === 'institution_header')?.template || '',
            variables: academicComponents.find(c => c.id === 'institution_header')?.variables || [],
            styles: { textAlign: 'left', margin: '0 0 20px 0', padding: '0' },
            order: 1,
            isActive: true
          },
          {
            id: 'academic-year',
            type: 'header' as const,
            name: 'Informations Année Académique',
            content: academicComponents.find(c => c.id === 'academic_year_info')?.template || '',
            variables: academicComponents.find(c => c.id === 'academic_year_info')?.variables || [],
            styles: { textAlign: 'center', margin: '20px 0', padding: '0' },
            order: 2,
            isActive: true
          },
          {
            id: 'student-info',
            type: 'content' as const,
            name: 'Informations Étudiant',
            content: academicComponents.find(c => c.id === 'student_info')?.template || '',
            variables: academicComponents.find(c => c.id === 'student_info')?.variables || [],
            styles: { margin: '20px 0', padding: '0' },
            order: 3,
            isActive: true
          },
          {
            id: 'grades-table',
            type: 'content' as const,
            name: 'Tableau des Notes',
            content: academicComponents.find(c => c.id === 'grades_table')?.template || '',
            variables: academicComponents.find(c => c.id === 'grades_table')?.variables || [],
            styles: { margin: '30px 0', padding: '0' },
            order: 4,
            isActive: true
          },
          {
            id: 'results-summary',
            type: 'content' as const,
            name: 'Synthèse des Résultats',
            content: academicComponents.find(c => c.id === 'results_summary')?.template || '',
            variables: academicComponents.find(c => c.id === 'results_summary')?.variables || [],
            styles: { margin: '30px 0', padding: '0' },
            order: 5,
            isActive: true
          },
          {
            id: 'signatures',
            type: 'footer' as const,
            name: 'Bloc Signatures',
            content: academicComponents.find(c => c.id === 'signature_block')?.template || '',
            variables: academicComponents.find(c => c.id === 'signature_block')?.variables || [],
            styles: { margin: '40px 0 0 0', padding: '20px 0 0 0' },
            order: 6,
            isActive: true
          }
        ],
        layout: 'sectioned',
        variables: [
          'institution_name', 'institution_subtitle', 'institution_logo', 'institution_address', 
          'institution_phone', 'institution_email', 'document_title', 'academic_year', 
          'period_name', 'period_start', 'period_end', 'student_name', 'student_number', 
          'birth_date', 'program_name', 'level_name', 'enrollment_date', 'semester_name', 
          'grades', 'overall_average', 'total_ects', 'overall_mention', 'rank', 
          'total_students', 'validation_status', 'director_name', 'secretary_name', 
          'issue_date', 'issue_time', 'document_reference'
        ]
      },
      variables: {},
      is_active: true,
      is_default: true,
      version: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  },
  {
    id: 'bulletin_semester',
    name: 'Bulletin Semestriel',
    description: 'Template simplifié pour bulletin de notes semestriel',
    category: 'bulletin',
    documentTypeCode: 'BULLETIN',
    icon: FileText,
    template: {
      id: 'template_bulletin_semester',
      name: 'Bulletin Semestriel',
      document_type_id: '1',
      description: 'Template simplifié pour bulletin de notes semestriel',
      content: {
        sections: [
          {
            id: 'header-simple',
            type: 'header' as const,
            name: 'En-tête Simple',
            content: `<div class="text-center border-b-2 border-gray-300 pb-4 mb-6">
              <h1 class="text-2xl font-bold">{{institution_name}}</h1>
              <h2 class="text-xl mt-2">BULLETIN DE NOTES</h2>
              <p class="text-lg mt-1">{{academic_year}} - {{semester_name}}</p>
            </div>`,
            variables: ['institution_name', 'academic_year', 'semester_name'],
            styles: { textAlign: 'center', margin: '0 0 20px 0' },
            order: 1,
            isActive: true
          },
          {
            id: 'student-basic-info',
            type: 'content' as const,
            name: 'Informations Étudiant Basiques',
            content: `<div class="mb-4">
              <p><strong>Nom:</strong> {{student_name}}</p>
              <p><strong>Numéro:</strong> {{student_number}}</p>
              <p><strong>Classe:</strong> {{class_name}}</p>
            </div>`,
            variables: ['student_name', 'student_number', 'class_name'],
            styles: { margin: '20px 0' },
            order: 2,
            isActive: true
          },
          {
            id: 'simple-grades',
            type: 'content' as const,
            name: 'Notes Simplifiées',
            content: academicComponents.find(c => c.id === 'grades_table')?.template || '',
            variables: ['semester_name', 'grades'],
            styles: { margin: '20px 0' },
            order: 3,
            isActive: true
          },
          {
            id: 'basic-summary',
            type: 'footer' as const,
            name: 'Résumé Basique',
            content: `<div class="mt-6 p-4 bg-gray-100 rounded">
              <div class="text-center">
                <p class="text-lg"><strong>Moyenne Générale: {{overall_average}}/20</strong></p>
                <p>Mention: {{overall_mention}}</p>
              </div>
            </div>`,
            variables: ['overall_average', 'overall_mention'],
            styles: { margin: '20px 0' },
            order: 4,
            isActive: true
          }
        ],
        layout: 'sectioned',
        variables: ['institution_name', 'academic_year', 'semester_name', 'student_name', 'student_number', 'class_name', 'grades', 'overall_average', 'overall_mention']
      },
      variables: {},
      is_active: true,
      is_default: false,
      version: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  },
  {
    id: 'certificate_completion',
    name: 'Certificat de Réussite',
    description: 'Template pour certificat de fin d\'études',
    category: 'certificate',
    documentTypeCode: 'CERTIFICAT',
    icon: Award,
    template: {
      id: 'template_certificate_completion',
      name: 'Certificat de Réussite',
      document_type_id: '3',
      description: 'Template élégant pour certificat de fin d\'études',
      content: {
        sections: [
          {
            id: 'certificate-header',
            type: 'header' as const,
            name: 'En-tête Certificat',
            content: `<div class="text-center mb-8">
              <div class="border-4 border-blue-600 p-8 mb-6">
                <h1 class="text-4xl font-bold text-blue-600 mb-2">CERTIFICAT</h1>
                <h2 class="text-2xl text-gray-700">DE RÉUSSITE</h2>
              </div>
              <p class="text-lg">{{institution_name}}</p>
            </div>`,
            variables: ['institution_name'],
            styles: { textAlign: 'center', margin: '0 0 30px 0' },
            order: 1,
            isActive: true
          },
          {
            id: 'certificate-content',
            type: 'content' as const,
            name: 'Contenu Certificat',
            content: `<div class="text-center mb-8">
              <p class="text-xl mb-6">Il est certifié que</p>
              <h3 class="text-3xl font-bold text-blue-600 mb-6">{{student_name}}</h3>
              <p class="text-lg mb-4">a satisfait avec succès aux exigences du programme</p>
              <h4 class="text-2xl font-semibold mb-4">{{program_name}}</h4>
              <p class="text-lg mb-4">avec une moyenne générale de <strong>{{overall_average}}/20</strong></p>
              <p class="text-lg">et obtient la mention <strong>{{overall_mention}}</strong></p>
            </div>`,
            variables: ['student_name', 'program_name', 'overall_average', 'overall_mention'],
            styles: { textAlign: 'center', margin: '30px 0' },
            order: 2,
            isActive: true
          },
          {
            id: 'certificate-footer',
            type: 'footer' as const,
            name: 'Pied Certificat',
            content: `<div class="text-center mt-12">
              <p class="mb-6">Fait à {{city}}, le {{issue_date}}</p>
              <div class="mt-8">
                <p class="mb-4">Le Directeur</p>
                <div class="border-b border-gray-400 w-48 mx-auto mb-2"></div>
                <p>{{director_name}}</p>
              </div>
            </div>`,
            variables: ['city', 'issue_date', 'director_name'],
            styles: { textAlign: 'center', margin: '40px 0 0 0' },
            order: 3,
            isActive: true
          }
        ],
        layout: 'sectioned',
        variables: ['institution_name', 'student_name', 'program_name', 'overall_average', 'overall_mention', 'city', 'issue_date', 'director_name']
      },
      variables: {},
      is_active: true,
      is_default: false,
      version: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  },
  {
    id: 'attestation_enrollment',
    name: 'Attestation de Scolarité',
    description: 'Template simple pour attestation de scolarité',
    category: 'attestation',
    documentTypeCode: 'ATTESTATION',
    icon: Scroll,
    template: {
      id: 'template_attestation_enrollment',
      name: 'Attestation de Scolarité',
      document_type_id: '4',
      description: 'Template officiel pour attestation de scolarité',
      content: {
        sections: [
          {
            id: 'attestation-header',
            type: 'header' as const,
            name: 'En-tête Attestation',
            content: academicComponents.find(c => c.id === 'institution_header')?.template || '',
            variables: academicComponents.find(c => c.id === 'institution_header')?.variables || [],
            styles: { margin: '0 0 20px 0' },
            order: 1,
            isActive: true
          },
          {
            id: 'attestation-title',
            type: 'content' as const,
            name: 'Titre',
            content: `<div class="text-center mb-8">
              <h2 class="text-2xl font-bold">ATTESTATION DE SCOLARITÉ</h2>
              <p class="text-lg mt-2">Année Académique {{academic_year}}</p>
            </div>`,
            variables: ['academic_year'],
            styles: { textAlign: 'center', margin: '30px 0' },
            order: 2,
            isActive: true
          },
          {
            id: 'attestation-content',
            type: 'content' as const,
            name: 'Contenu Attestation',
            content: `<div class="mb-8">
              <p class="mb-4">Je soussigné(e), {{director_title}} {{director_name}}, Directeur de {{institution_name}}, certifie que :</p>
              <div class="ml-8 mb-6">
                <p><strong>Nom et Prénom :</strong> {{student_name}}</p>
                <p><strong>Né(e) le :</strong> {{birth_date}} à {{birth_place}}</p>
                <p><strong>Numéro étudiant :</strong> {{student_number}}</p>
              </div>
              <p class="mb-4">est régulièrement inscrit(e) et suit assidûment les cours de :</p>
              <div class="ml-8 mb-6">
                <p><strong>Formation :</strong> {{program_name}}</p>
                <p><strong>Niveau :</strong> {{level_name}}</p>
                <p><strong>Spécialité :</strong> {{specialization_name}}</p>
              </div>
              <p>pour l'année universitaire {{academic_year}}.</p>
            </div>`,
            variables: ['director_title', 'director_name', 'institution_name', 'student_name', 'birth_date', 'birth_place', 'student_number', 'program_name', 'level_name', 'specialization_name', 'academic_year'],
            styles: { margin: '20px 0' },
            order: 3,
            isActive: true
          },
          {
            id: 'attestation-footer',
            type: 'footer' as const,
            name: 'Pied Attestation',
            content: `<div class="mt-12">
              <p class="mb-6">En foi de quoi, la présente attestation est délivrée pour servir et valoir ce que de droit.</p>
              <div class="flex justify-between mt-8">
                <div>
                  <p>Fait à {{city}}</p>
                  <p>Le {{issue_date}}</p>
                </div>
                <div class="text-center">
                  <p class="mb-4">Le Directeur</p>
                  <div class="border-b border-gray-400 w-48 mb-2"></div>
                  <p>{{director_name}}</p>
                  <p class="text-sm mt-2">Signature et cachet</p>
                </div>
              </div>
            </div>`,
            variables: ['city', 'issue_date', 'director_name'],
            styles: { margin: '30px 0 0 0' },
            order: 4,
            isActive: true
          }
        ],
        layout: 'sectioned',
        variables: ['institution_name', 'institution_subtitle', 'institution_logo', 'institution_address', 'institution_phone', 'institution_email', 'academic_year', 'director_title', 'director_name', 'student_name', 'birth_date', 'birth_place', 'student_number', 'program_name', 'level_name', 'specialization_name', 'city', 'issue_date']
      },
      variables: {},
      is_active: true,
      is_default: false,
      version: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  }
];

export interface PredefinedTemplatesProps {
  onSelectTemplate: (template: DocumentTemplate) => void;
}

export function PredefinedTemplatesLibrary({ onSelectTemplate }: PredefinedTemplatesProps) {
  const categories = ['transcript', 'bulletin', 'certificate', 'attestation'] as const;
  
  const getCategoryTitle = (category: string) => {
    switch (category) {
      case 'transcript': return 'Relevés de Notes';
      case 'bulletin': return 'Bulletins';
      case 'certificate': return 'Certificats';
      case 'attestation': return 'Attestations';
      default: return category;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'transcript': return 'bg-blue-100 text-blue-800';
      case 'bulletin': return 'bg-green-100 text-green-800';
      case 'certificate': return 'bg-purple-100 text-purple-800';
      case 'attestation': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Templates Prédéfinis</h2>
        <p className="text-muted-foreground">
          Sélectionnez un template professionnel pour commencer rapidement
        </p>
      </div>

      {categories.map(category => {
        const templates = predefinedTemplates.filter(t => t.category === category);
        
        return (
          <div key={category}>
            <div className="mb-4">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <Badge className={getCategoryColor(category)}>
                  {getCategoryTitle(category)}
                </Badge>
              </h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map(template => {
                const IconComponent = template.icon;
                
                return (
                  <Card key={template.id} className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className={`p-3 rounded-lg ${getCategoryColor(category)}`}>
                          <IconComponent className="h-6 w-6" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{template.name}</CardTitle>
                          <CardDescription>
                            {template.description}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex flex-wrap gap-1">
                          {template.template.content.variables?.slice(0, 4).map((variable: string) => (
                            <Badge key={variable} variant="outline" className="text-xs">
                              {variable.replace(/_/g, ' ')}
                            </Badge>
                          ))}
                          {template.template.content.variables && template.template.content.variables.length > 4 && (
                            <Badge variant="outline" className="text-xs">
                              +{template.template.content.variables.length - 4}
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-muted-foreground">
                            {template.template.content.sections?.length || 0} sections
                          </div>
                          <Button 
                            onClick={() => onSelectTemplate(template.template)}
                            className="w-full"
                          >
                            Utiliser ce template
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}