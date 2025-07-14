import React, { useState, useEffect } from 'react';
import { Edit, Trash2, Eye, Plus, FileText, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import type { DocumentType } from '@/pages/results/documents/creation/types';

interface DocumentTypeManagerProps {
  onEdit: (type: DocumentType) => void;
  onCreateNew: () => void;
}

export function DocumentTypeManager({ onEdit, onCreateNew }: DocumentTypeManagerProps) {
  const [types, setTypes] = useState<DocumentType[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Mock data pour la démonstration
  useEffect(() => {
    const mockTypes: DocumentType[] = [
      {
        id: '1',
        name: 'Bulletin de Notes',
        code: 'BULLETIN',
        description: 'Bulletin de notes semestriel ou annuel',
        icon: 'FileText',
        color: 'blue',
        category: 'academique',
        variables: ['student_name', 'grades', 'semester', 'academic_year'],
        validation_rules: { required_grades: true, min_subjects: 3 },
        is_active: true,
        created_at: '2024-01-15'
      },
      {
        id: '2',
        name: 'Attestation de Scolarité',
        code: 'ATTESTATION',
        description: 'Attestation confirmant l\'inscription d\'un étudiant',
        icon: 'Award',
        color: 'green',
        category: 'administrative',
        variables: ['student_name', 'program', 'enrollment_date', 'academic_year'],
        validation_rules: { active_enrollment: true },
        is_active: true,
        created_at: '2024-01-10'
      },
      {
        id: '3',
        name: 'Relevé de Notes',
        code: 'TRANSCRIPT',
        description: 'Relevé complet des notes et crédits',
        icon: 'GraduationCap',
        color: 'purple',
        category: 'academique',
        variables: ['student_name', 'all_grades', 'credits', 'gpa', 'completion_status'],
        validation_rules: { complete_record: true, verified_grades: true },
        is_active: true,
        created_at: '2024-01-05'
      }
    ];
    setTypes(mockTypes);
  }, []);

  const filteredTypes = types.filter(type =>
    type.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    type.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    type.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (typeId: string) => {
    toast({
      title: "Type supprimé",
      description: "Le type de document a été supprimé avec succès"
    });
    setTypes(prev => prev.filter(t => t.id !== typeId));
  };

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
      {/* Search and Stats */}
      <div className="flex items-center justify-between gap-4">
        <Input
          placeholder="Rechercher un type de document..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md"
        />
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>{filteredTypes.length} type(s) trouvé(s)</span>
          <Badge variant="secondary">{types.filter(t => t.is_active).length} actif(s)</Badge>
        </div>
      </div>

      {/* Types Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTypes.map((type) => (
          <Card key={type.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-${type.color}-100`}>
                    <FileText className={`h-5 w-5 text-${type.color}-600`} />
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
                <Badge variant={type.is_active ? "default" : "secondary"}>
                  {type.is_active ? 'Actif' : 'Inactif'}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <CardDescription className="line-clamp-2">
                {type.description}
              </CardDescription>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Settings className="h-4 w-4 text-muted-foreground" />
                  <span>{type.variables.length} variable(s)</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {type.variables.slice(0, 3).map((variable, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {variable}
                    </Badge>
                  ))}
                  {type.variables.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{type.variables.length - 3}
                    </Badge>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-muted-foreground">
                  Créé le {new Date(type.created_at).toLocaleDateString()}
                </span>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onEdit(type)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={() => handleDelete(type.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
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
              {searchQuery ? 'Aucun résultat pour votre recherche.' : 'Commencez par créer votre premier type de document.'}
            </p>
            <Button onClick={onCreateNew}>
              <Plus className="h-4 w-4 mr-2" />
              Créer un type de document
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}