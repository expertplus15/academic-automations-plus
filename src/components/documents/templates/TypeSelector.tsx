import React, { useState, useEffect } from 'react';
import { FileText, Search, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import type { DocumentType } from '@/pages/results/creation/types';

interface TypeSelectorProps {
  onTypeSelected: (type: DocumentType) => void;
  onCancel: () => void;
}

export function TypeSelector({ onTypeSelected, onCancel }: TypeSelectorProps) {
  const [types, setTypes] = useState<DocumentType[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data pour la démonstration
  useEffect(() => {
    const mockTypes: DocumentType[] = [
      {
        id: '1',
        name: 'Bulletin de Notes',
        code: 'BULLETIN',
        description: 'Bulletin de notes semestriel ou annuel pour les étudiants',
        icon: 'FileText',
        color: 'blue',
        category: 'academique',
        variables: ['student_name', 'grades', 'semester', 'academic_year', 'gpa'],
        validation_rules: { required_grades: true, min_subjects: 3 },
        is_active: true,
        created_at: '2024-01-15'
      },
      {
        id: '2',
        name: 'Attestation de Scolarité',
        code: 'ATTESTATION',
        description: 'Attestation confirmant l\'inscription d\'un étudiant dans l\'établissement',
        icon: 'Award',
        color: 'green',
        category: 'administrative',
        variables: ['student_name', 'program', 'enrollment_date', 'academic_year', 'student_number'],
        validation_rules: { active_enrollment: true },
        is_active: true,
        created_at: '2024-01-10'
      },
      {
        id: '3',
        name: 'Relevé de Notes',
        code: 'TRANSCRIPT',
        description: 'Relevé complet des notes et crédits obtenus par l\'étudiant',
        icon: 'GraduationCap',
        color: 'purple',
        category: 'academique',
        variables: ['student_name', 'all_grades', 'credits', 'gpa', 'completion_status', 'honors'],
        validation_rules: { complete_record: true, verified_grades: true },
        is_active: true,
        created_at: '2024-01-05'
      },
      {
        id: '4',
        name: 'Certificat de Réussite',
        code: 'CERTIFICATE',
        description: 'Certificat attestant de la réussite d\'un programme d\'études',
        icon: 'Award',
        color: 'yellow',
        category: 'academique',
        variables: ['student_name', 'program', 'completion_date', 'final_grade', 'honors'],
        validation_rules: { program_completed: true, minimum_grade: 10 },
        is_active: true,
        created_at: '2024-01-01'
      }
    ];
    setTypes(mockTypes);
  }, []);

  const filteredTypes = types.filter(type =>
    type.is_active && (
      type.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      type.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      type.category.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const getCategoryColor = (category: string) => {
    const colors = {
      'academique': 'bg-blue-100 text-blue-800',
      'administrative': 'bg-green-100 text-green-800',
      'financier': 'bg-yellow-100 text-yellow-800',
      'medical': 'bg-red-100 text-red-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Rechercher un type de document..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <span>{filteredTypes.length} type(s) disponible(s)</span>
        <Badge variant="secondary">{types.filter(t => t.is_active).length} actif(s)</Badge>
      </div>

      {/* Types Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredTypes.map((type) => (
          <Card 
            key={type.id} 
            className="cursor-pointer hover:shadow-md transition-all hover:border-primary/50"
            onClick={() => onTypeSelected(type)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-lg bg-${type.color}-100`}>
                    <FileText className={`h-6 w-6 text-${type.color}-600`} />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{type.name}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {type.code}
                      </Badge>
                      <Badge className={`text-xs ${getCategoryColor(type.category)}`}>
                        {type.category}
                      </Badge>
                    </div>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <CardDescription className="line-clamp-2">
                {type.description}
              </CardDescription>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium">{type.variables.length} variable(s) disponible(s):</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {type.variables.slice(0, 4).map((variable, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {variable}
                    </Badge>
                  ))}
                  {type.variables.length > 4 && (
                    <Badge variant="secondary" className="text-xs">
                      +{type.variables.length - 4} autres
                    </Badge>
                  )}
                </div>
              </div>

              <div className="pt-2 border-t">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    onTypeSelected(type);
                  }}
                >
                  Sélectionner ce type
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredTypes.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Aucun type de document trouvé</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery 
                ? 'Aucun résultat pour votre recherche.' 
                : 'Aucun type de document actif n\'est disponible.'
              }
            </p>
            <div className="flex gap-2 justify-center">
              <Button variant="outline" onClick={onCancel}>
                Retour
              </Button>
              <Button onClick={() => window.open('/results/documents/creation/types', '_blank')}>
                Créer un type de document
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Cancel Button */}
      {filteredTypes.length > 0 && (
        <div className="flex justify-center pt-4">
          <Button variant="outline" onClick={onCancel}>
            Annuler
          </Button>
        </div>
      )}
    </div>
  );
}