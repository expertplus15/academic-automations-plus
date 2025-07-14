import React from 'react';
import { Plus, Settings, Table, User, Calculator, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export interface AcademicComponentProps {
  onInsert: (component: AcademicComponent) => void;
}

export interface AcademicComponent {
  id: string;
  type: 'student_info' | 'grades_table' | 'results_summary' | 'academic_year_info' | 'signature_block' | 'institution_header';
  name: string;
  description: string;
  template: string;
  variables: string[];
  icon: React.ComponentType<any>;
  category: 'info' | 'academic' | 'administrative';
  previewData?: Record<string, any>;
}

export const academicComponents: AcademicComponent[] = [
  {
    id: 'student_info',
    type: 'student_info',
    name: 'Informations Étudiant',
    description: 'Bloc avec les informations personnelles de l\'étudiant',
    template: `<div class="student-info bg-gray-50 p-4 rounded-lg mb-6">
  <h3 class="font-semibold text-lg mb-3 text-gray-800">Informations de l'étudiant</h3>
  <div class="grid grid-cols-2 gap-4">
    <div>
      <p><span class="font-medium">Nom complet:</span> {{student_name}}</p>
      <p><span class="font-medium">Numéro étudiant:</span> {{student_number}}</p>
      <p><span class="font-medium">Date de naissance:</span> {{birth_date}}</p>
    </div>
    <div>
      <p><span class="font-medium">Programme:</span> {{program_name}}</p>
      <p><span class="font-medium">Niveau:</span> {{level_name}}</p>
      <p><span class="font-medium">Date d'inscription:</span> {{enrollment_date}}</p>
    </div>
  </div>
</div>`,
    variables: ['student_name', 'student_number', 'birth_date', 'program_name', 'level_name', 'enrollment_date'],
    icon: User,
    category: 'info',
    previewData: {
      student_name: 'DUPONT Jean',
      student_number: '2024001',
      birth_date: '15/03/2001',
      program_name: 'Master Informatique',
      level_name: 'M2',
      enrollment_date: '15/09/2023'
    }
  },
  {
    id: 'grades_table',
    type: 'grades_table',
    name: 'Tableau de Notes',
    description: 'Tableau détaillé des notes par matière',
    template: `<div class="grades-table mb-6">
  <h3 class="font-semibold text-lg mb-3 text-gray-800">Résultats Académiques - {{semester_name}}</h3>
  <table class="w-full border-collapse border border-gray-300">
    <thead>
      <tr class="bg-gray-100">
        <th class="border border-gray-300 px-4 py-2 text-left">Matière</th>
        <th class="border border-gray-300 px-4 py-2 text-center">Code</th>
        <th class="border border-gray-300 px-4 py-2 text-center">Crédits ECTS</th>
        <th class="border border-gray-300 px-4 py-2 text-center">Note /20</th>
        <th class="border border-gray-300 px-4 py-2 text-center">Mention</th>
      </tr>
    </thead>
    <tbody>
      {{#each grades}}
      <tr>
        <td class="border border-gray-300 px-4 py-2">{{subject_name}}</td>
        <td class="border border-gray-300 px-4 py-2 text-center">{{subject_code}}</td>
        <td class="border border-gray-300 px-4 py-2 text-center">{{ects_credits}}</td>
        <td class="border border-gray-300 px-4 py-2 text-center font-medium">{{grade}}</td>
        <td class="border border-gray-300 px-4 py-2 text-center">{{mention}}</td>
      </tr>
      {{/each}}
    </tbody>
  </table>
</div>`,
    variables: ['semester_name', 'grades'],
    icon: Table,
    category: 'academic',
    previewData: {
      semester_name: 'Semestre 1 - 2023/2024',
      grades: [
        { subject_name: 'Mathématiques Appliquées', subject_code: 'MAT101', ects_credits: 6, grade: '16.5', mention: 'Bien' },
        { subject_name: 'Algorithmique Avancée', subject_code: 'INF201', ects_credits: 4, grade: '14.0', mention: 'Assez Bien' },
        { subject_name: 'Bases de Données', subject_code: 'INF301', ects_credits: 5, grade: '18.0', mention: 'Très Bien' }
      ]
    }
  },
  {
    id: 'results_summary',
    type: 'results_summary',
    name: 'Synthèse des Résultats',
    description: 'Bloc récapitulatif avec moyennes et mentions',
    template: `<div class="results-summary bg-blue-50 p-4 rounded-lg mb-6">
  <h3 class="font-semibold text-lg mb-4 text-blue-800">Synthèse des Résultats</h3>
  <div class="grid grid-cols-3 gap-6">
    <div class="text-center">
      <p class="text-2xl font-bold text-blue-600">{{overall_average}}/20</p>
      <p class="text-sm text-gray-600">Moyenne Générale</p>
    </div>
    <div class="text-center">
      <p class="text-2xl font-bold text-green-600">{{total_ects}}</p>
      <p class="text-sm text-gray-600">Crédits ECTS obtenus</p>
    </div>
    <div class="text-center">
      <p class="text-xl font-bold text-orange-600">{{overall_mention}}</p>
      <p class="text-sm text-gray-600">Mention</p>
    </div>
  </div>
  <div class="mt-4 pt-4 border-t border-blue-200">
    <p class="text-sm"><span class="font-medium">Rang:</span> {{rank}}/{{total_students}} étudiants</p>
    <p class="text-sm"><span class="font-medium">Statut:</span> {{validation_status}}</p>
  </div>
</div>`,
    variables: ['overall_average', 'total_ects', 'overall_mention', 'rank', 'total_students', 'validation_status'],
    icon: Calculator,
    category: 'academic',
    previewData: {
      overall_average: '16.17',
      total_ects: '15',
      overall_mention: 'Bien',
      rank: '3',
      total_students: '45',
      validation_status: 'Validé'
    }
  },
  {
    id: 'academic_year_info',
    type: 'academic_year_info',
    name: 'Informations Année Académique',
    description: 'Informations sur l\'année et période académique',
    template: `<div class="academic-year-info text-center mb-6">
  <h2 class="text-xl font-bold mb-2">{{document_title}}</h2>
  <p class="text-lg text-gray-700">Année Académique {{academic_year}}</p>
  <p class="text-base text-gray-600">{{period_name}}</p>
  <div class="mt-4 text-sm text-gray-500">
    <p>Du {{period_start}} au {{period_end}}</p>
  </div>
</div>`,
    variables: ['document_title', 'academic_year', 'period_name', 'period_start', 'period_end'],
    icon: Award,
    category: 'administrative',
    previewData: {
      document_title: 'RELEVÉ DE NOTES OFFICIEL',
      academic_year: '2023-2024',
      period_name: 'Premier Semestre',
      period_start: '15 septembre 2023',
      period_end: '15 janvier 2024'
    }
  },
  {
    id: 'institution_header',
    type: 'institution_header',
    name: 'En-tête Institution',
    description: 'En-tête officiel avec logo et informations de l\'établissement',
    template: `<div class="institution-header border-b-2 border-gray-300 pb-4 mb-6">
  <div class="flex items-center justify-between">
    <div class="flex items-center">
      {{#if institution_logo}}
      <img src="{{institution_logo}}" alt="Logo" class="h-16 w-16 mr-4">
      {{/if}}
      <div>
        <h1 class="text-2xl font-bold text-gray-800">{{institution_name}}</h1>
        <p class="text-sm text-gray-600">{{institution_subtitle}}</p>
      </div>
    </div>
    <div class="text-right text-sm text-gray-600">
      <p>{{institution_address}}</p>
      <p>Tél: {{institution_phone}}</p>
      <p>Email: {{institution_email}}</p>
    </div>
  </div>
</div>`,
    variables: ['institution_name', 'institution_subtitle', 'institution_logo', 'institution_address', 'institution_phone', 'institution_email'],
    icon: Settings,
    category: 'administrative',
    previewData: {
      institution_name: 'UNIVERSITÉ DE TECHNOLOGIE',
      institution_subtitle: 'École Supérieure d\'Ingénierie',
      institution_address: '123 Rue de l\'Innovation, 75001 Paris',
      institution_phone: '+33 1 23 45 67 89',
      institution_email: 'contact@universite-tech.fr'
    }
  },
  {
    id: 'signature_block',
    type: 'signature_block',
    name: 'Bloc Signatures',
    description: 'Zone pour les signatures officielles',
    template: `<div class="signature-block mt-8 pt-4">
  <div class="grid grid-cols-2 gap-8">
    <div class="text-center">
      <p class="font-medium mb-4">Le Directeur des Études</p>
      <div class="border-b border-gray-400 w-48 mx-auto mb-2"></div>
      <p class="text-sm text-gray-600">{{director_name}}</p>
      <p class="text-xs text-gray-500">Signature et cachet</p>
    </div>
    <div class="text-center">
      <p class="font-medium mb-4">Le Secrétaire Général</p>
      <div class="border-b border-gray-400 w-48 mx-auto mb-2"></div>
      <p class="text-sm text-gray-600">{{secretary_name}}</p>
      <p class="text-xs text-gray-500">Signature et cachet</p>
    </div>
  </div>
  <div class="text-center mt-6 text-xs text-gray-500">
    <p>Document émis le {{issue_date}} à {{issue_time}}</p>
    <p>Référence: {{document_reference}}</p>
  </div>
</div>`,
    variables: ['director_name', 'secretary_name', 'issue_date', 'issue_time', 'document_reference'],
    icon: Award,
    category: 'administrative',
    previewData: {
      director_name: 'Dr. Marie MARTIN',
      secretary_name: 'Jean BERNARD',
      issue_date: '15/01/2024',
      issue_time: '14:30',
      document_reference: 'REL2024-001-DOC'
    }
  }
];

export function AcademicComponentsLibrary({ onInsert }: AcademicComponentProps) {
  const categories = ['info', 'academic', 'administrative'] as const;
  
  const getCategoryTitle = (category: string) => {
    switch (category) {
      case 'info': return 'Informations';
      case 'academic': return 'Académique';
      case 'administrative': return 'Administratif';
      default: return category;
    }
  };

  const getCategoryDescription = (category: string) => {
    switch (category) {
      case 'info': return 'Informations sur l\'étudiant et le contexte';
      case 'academic': return 'Données académiques et résultats';
      case 'administrative': return 'Éléments officiels et signatures';
      default: return '';
    }
  };

  return (
    <div className="space-y-6">
      {categories.map(category => {
        const components = academicComponents.filter(comp => comp.category === category);
        
        return (
          <div key={category}>
            <div className="mb-4">
              <h3 className="text-lg font-semibold">{getCategoryTitle(category)}</h3>
              <p className="text-sm text-muted-foreground">{getCategoryDescription(category)}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {components.map(component => {
                const IconComponent = component.icon;
                
                return (
                  <Card key={component.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <IconComponent className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <CardTitle className="text-base">{component.name}</CardTitle>
                          <CardDescription className="text-sm">
                            {component.description}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-1">
                          {component.variables.slice(0, 3).map(variable => (
                            <Badge key={variable} variant="outline" className="text-xs">
                              {variable}
                            </Badge>
                          ))}
                          {component.variables.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{component.variables.length - 3}
                            </Badge>
                          )}
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => onInsert(component)}
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          Ajouter
                        </Button>
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