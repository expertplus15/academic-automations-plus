import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit, FileText, Award, GraduationCap, School } from 'lucide-react';

interface PredefinedTemplateSelectorProps {
  onBack: () => void;
  onSelectTemplate: (template: any) => void;
}

// Templates prédéfinis simplifiés - Les plus essentiels
const PREDEFINED_TEMPLATES = [
  {
    id: 'releve-notes-emd',
    name: 'Relevé de Notes EMD',
    description: 'Modèle officiel École de Management de Djibouti',
    icon: School,
    template_type: 'emd_releve'
  },
  {
    id: 'relevé-notes',
    name: 'Relevé de Notes Universitaire',
    description: 'Template standard pour relevés de notes universitaires',
    icon: GraduationCap,
  },
  {
    id: 'bulletin-semestriel',
    name: 'Bulletin Semestriel',
    description: 'Bulletin détaillé avec notes par matière',
    icon: FileText,
  },
  {
    id: 'attestation-scolarite',
    name: 'Attestation de Scolarité',
    description: 'Document officiel d\'inscription étudiant',
    icon: Award,
  },
  {
    id: 'certificat-diplome',
    name: 'Certificat de Diplôme',
    description: 'Template pour certificats et diplômes',
    icon: Award,
  }
];

export function PredefinedTemplateSelector({ onBack, onSelectTemplate }: PredefinedTemplateSelectorProps) {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Choisir un Modèle</h1>
          <p className="text-muted-foreground">
            Sélectionnez un template à personnaliser
          </p>
        </div>
      </div>

      {/* Templates grid - 2 columns layout for better visibility */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {PREDEFINED_TEMPLATES.map(template => {
          const IconComponent = template.icon;
          return (
            <Card key={template.id} className="hover:shadow-lg transition-all duration-200 group">
              <CardHeader className="pb-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-2">
                      {template.name}
                    </CardTitle>
                    <CardDescription className="text-base">
                      {template.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                {/* Preview placeholder with larger size */}
                <div className="h-40 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-200 mb-6">
                  <div className="text-center text-gray-500">
                    <FileText className="h-12 w-12 mx-auto mb-3" />
                    <span className="text-sm font-medium">Aperçu du document</span>
                  </div>
                </div>

                {/* Single action button */}
                <Button
                  onClick={() => onSelectTemplate(template)}
                  className="w-full h-12 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-base font-medium"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Utiliser ce modèle
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}