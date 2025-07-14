import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Eye, Edit, FileText, Award, Users, GraduationCap } from 'lucide-react';
import type { DocumentTemplate } from '@/hooks/useDocumentTemplatesEnhanced';

interface PredefinedTemplateSelectorProps {
  onBack: () => void;
  onSelectTemplate: (template: any) => void;
  onPreviewTemplate: (template: any) => void;
}

// Templates prédéfinis simulés pour la démo
const PREDEFINED_TEMPLATES = [
  {
    id: 'relevé-notes',
    name: 'Relevé de Notes Universitaire',
    description: 'Template standard pour les relevés de notes avec moyennes et mentions',
    category: 'Académique',
    icon: GraduationCap,
    preview_image: '/api/placeholder/300/200',
    sections: ['En-tête établissement', 'Informations étudiant', 'Tableau des matières', 'Moyennes et mentions', 'Signatures'],
    variables: ['nom_etudiant', 'numero_etudiant', 'programme', 'annee_academique', 'semestre'],
    is_popular: true,
    difficulty: 'Facile'
  },
  {
    id: 'bulletin-semestriel',
    name: 'Bulletin Semestriel',
    description: 'Bulletin détaillé avec notes par matière et appréciations',
    category: 'Académique',
    icon: FileText,
    preview_image: '/api/placeholder/300/200',
    sections: ['En-tête', 'Identité étudiant', 'Notes par matière', 'Appréciations', 'Décision du conseil'],
    variables: ['nom_etudiant', 'classe', 'periode', 'moyenne_generale', 'rang'],
    is_popular: true,
    difficulty: 'Facile'
  },
  {
    id: 'attestation-scolarite',
    name: 'Attestation de Scolarité',
    description: 'Document officiel certifiant l\'inscription d\'un étudiant',
    category: 'Administratif',
    icon: Award,
    preview_image: '/api/placeholder/300/200',
    sections: ['En-tête officiel', 'Corps de l\'attestation', 'Informations étudiant', 'Signature et cachets'],
    variables: ['nom_etudiant', 'programme', 'niveau', 'annee_en_cours'],
    is_popular: false,
    difficulty: 'Facile'
  },
  {
    id: 'certificat-diplome',
    name: 'Certificat de Diplôme',
    description: 'Template pour certificats et diplômes avec mentions d\'honneur',
    category: 'Certification',
    icon: Award,
    preview_image: '/api/placeholder/300/200',
    sections: ['Bannière décorative', 'Titre du diplôme', 'Texte de certification', 'Signatures multiples'],
    variables: ['nom_diplome', 'nom_etudiant', 'mention', 'date_obtention', 'directeur'],
    is_popular: false,
    difficulty: 'Moyen'
  },
  {
    id: 'liste-classe',
    name: 'Liste de Classe',
    description: 'Template pour listes d\'étudiants par classe ou groupe',
    category: 'Administratif',
    icon: Users,
    preview_image: '/api/placeholder/300/200',
    sections: ['En-tête classe', 'Tableau des étudiants', 'Statistiques', 'Notes de bas de page'],
    variables: ['nom_classe', 'annee_scolaire', 'enseignant_principal', 'effectif'],
    is_popular: false,
    difficulty: 'Facile'
  },
  {
    id: 'rapport-stage',
    name: 'Rapport de Stage - Page de garde',
    description: 'Page de garde standardisée pour rapports de stage',
    category: 'Académique',
    icon: FileText,
    preview_image: '/api/placeholder/300/200',
    sections: ['Logo établissement', 'Informations stage', 'Informations étudiant', 'Dates et signatures'],
    variables: ['titre_stage', 'entreprise', 'maitre_stage', 'duree_stage', 'tuteur_ecole'],
    is_popular: true,
    difficulty: 'Moyen'
  }
];

export function PredefinedTemplateSelector({ onBack, onSelectTemplate, onPreviewTemplate }: PredefinedTemplateSelectorProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', ...Array.from(new Set(PREDEFINED_TEMPLATES.map(t => t.category)))];
  
  const filteredTemplates = selectedCategory === 'all' 
    ? PREDEFINED_TEMPLATES 
    : PREDEFINED_TEMPLATES.filter(t => t.category === selectedCategory);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Facile': return 'bg-green-100 text-green-800';
      case 'Moyen': return 'bg-yellow-100 text-yellow-800';
      case 'Difficile': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Personnaliser un Modèle</h1>
          <p className="text-muted-foreground">
            Choisissez un template prédéfini à personnaliser selon vos besoins
          </p>
        </div>
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-2">
        {categories.map(category => (
          <Button
            key={category}
            variant={selectedCategory === category ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory(category)}
          >
            {category === 'all' ? 'Tous' : category}
          </Button>
        ))}
      </div>

      {/* Popular templates banner */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border">
        <h3 className="font-semibold text-blue-900 mb-2">🔥 Templates Populaires</h3>
        <div className="flex flex-wrap gap-2">
          {PREDEFINED_TEMPLATES.filter(t => t.is_popular).map(template => (
            <Badge key={template.id} variant="secondary" className="bg-blue-100 text-blue-800">
              {template.name}
            </Badge>
          ))}
        </div>
      </div>

      {/* Templates grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map(template => {
          const IconComponent = template.icon;
          return (
            <Card key={template.id} className="hover:shadow-lg transition-all duration-200 hover-scale group">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <IconComponent className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg leading-tight">
                        {template.name}
                        {template.is_popular && (
                          <Badge variant="secondary" className="ml-2 text-xs bg-orange-100 text-orange-800">
                            Populaire
                          </Badge>
                        )}
                      </CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {template.category}
                        </Badge>
                        <Badge className={`text-xs ${getDifficultyColor(template.difficulty)}`}>
                          {template.difficulty}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
                <CardDescription className="mt-2">
                  {template.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Preview image placeholder */}
                <div className="h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                  <div className="text-center text-gray-500">
                    <FileText className="h-8 w-8 mx-auto mb-2" />
                    <span className="text-sm">Aperçu du template</span>
                  </div>
                </div>

                {/* Template details */}
                <div className="text-sm text-muted-foreground">
                  <div className="mb-2">
                    <span className="font-medium">Sections:</span> {template.sections.length}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {template.sections.slice(0, 3).map((section, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {section}
                      </Badge>
                    ))}
                    {template.sections.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{template.sections.length - 3}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex gap-2 pt-2">
                  <Button
                    onClick={() => onSelectTemplate(template)}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                    size="sm"
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Personnaliser
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPreviewTemplate(template)}
                  >
                    <Eye className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Aucun template trouvé</h3>
          <p className="text-muted-foreground">
            Aucun template ne correspond à la catégorie sélectionnée
          </p>
        </div>
      )}
    </div>
  );
}