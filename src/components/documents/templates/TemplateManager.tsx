import React, { useState, useEffect } from 'react';
import { Edit, Trash2, Eye, Plus, FileText, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import type { DocumentTemplate } from '@/hooks/useDocumentTemplatesEnhanced';

interface TemplateManagerProps {
  onEdit: (template: DocumentTemplate) => void;
  onCreateNew: () => void;
}

export function TemplateManager({ onEdit, onCreateNew }: TemplateManagerProps) {
  const [templates, setTemplates] = useState<DocumentTemplate[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Mock data pour la démonstration
  useEffect(() => {
    const mockTemplates: DocumentTemplate[] = [
      {
        id: '1',
        name: 'Bulletin Standard',
        document_type_id: '1',
        description: 'Template standard pour les bulletins de notes',
        content: '<h1>Bulletin de Notes</h1><p>Nom: {{student_name}}</p><p>Semestre: {{semester}}</p><div>{{grades}}</div>',
        variables: {},
        is_active: true,
        is_default: true,
        version: 1,
        created_at: '2024-01-15',
        updated_at: '2024-01-15',
          document_type: {
            id: '1',
            name: 'Bulletin de Notes',
            code: 'BULLETIN',
            category: 'academique',
            color: 'blue'
          }
      },
      {
        id: '2',
        name: 'Attestation Simple',
        document_type_id: '2',
        description: 'Template simple pour les attestations de scolarité',
        content: '<h1>Attestation de Scolarité</h1><p>{{student_name}} est inscrit en {{program}}</p>',
        variables: {},
        is_active: true,
        is_default: false,
        version: 2,
        created_at: '2024-01-10',
        updated_at: '2024-01-12',
          document_type: {
            id: '2',
            name: 'Attestation de Scolarité',
            code: 'ATTESTATION',
            category: 'administrative',
            color: 'green'
          }
      },
      {
        id: '3',
        name: 'Relevé Complet',
        document_type_id: '3',
        description: 'Template détaillé pour les relevés de notes',
        content: '<h1>Relevé de Notes</h1><p>Étudiant: {{student_name}}</p><div>{{all_grades}}</div><p>Moyenne: {{gpa}}</p>',
        variables: {},
        is_active: true,
        is_default: true,
        version: 1,
        created_at: '2024-01-05',
        updated_at: '2024-01-05',
          document_type: {
            id: '3',
            name: 'Relevé de Notes',
            code: 'TRANSCRIPT',
            category: 'academique',
            color: 'purple'
          }
      }
    ];
    setTemplates(mockTemplates);
  }, []);

  const filteredTemplates = templates.filter(template =>
    template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.document_type?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (templateId: string) => {
    toast({
      title: "Template supprimé",
      description: "Le template a été supprimé avec succès"
    });
    setTemplates(prev => prev.filter(t => t.id !== templateId));
  };

  const handleDuplicate = (template: DocumentTemplate) => {
    const duplicatedTemplate: DocumentTemplate = {
      ...template,
      id: crypto.randomUUID(),
      name: `${template.name} (Copie)`,
      is_default: false,
      version: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    setTemplates(prev => [...prev, duplicatedTemplate]);
    toast({
      title: "Template dupliqué",
      description: `Le template "${duplicatedTemplate.name}" a été créé`
    });
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
          placeholder="Rechercher un template..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md"
        />
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>{filteredTemplates.length} template(s) trouvé(s)</span>
          <Badge variant="secondary">{templates.filter(t => t.is_active).length} actif(s)</Badge>
          <Badge variant="outline">{templates.filter(t => t.is_default).length} par défaut</Badge>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <Card key={template.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-${template.document_type?.color || 'gray'}-100`}>
                    <FileText className={`h-5 w-5 text-${template.document_type?.color || 'gray'}-600`} />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        v{template.version}
                      </Badge>
                      {template.document_type && (
                        <Badge className={`text-xs ${getCategoryColor(template.document_type.category)}`}>
                          {template.document_type.name}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <Badge variant={template.is_active ? "default" : "secondary"} className="text-xs">
                    {template.is_active ? 'Actif' : 'Inactif'}
                  </Badge>
                  {template.is_default && (
                    <Badge variant="outline" className="text-xs">
                      Défaut
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <CardDescription className="line-clamp-2">
                {template.description}
              </CardDescription>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span>Variables disponibles</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  <Badge variant="outline" className="text-xs">
                    Version {template.version}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {template.document_type?.category}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-muted-foreground">
                  Mis à jour le {new Date(template.updated_at).toLocaleDateString()}
                </span>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleDuplicate(template)}
                    title="Dupliquer"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onEdit(template)}
                    title="Modifier"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={() => handleDelete(template.id)}
                    title="Supprimer"
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
      {filteredTemplates.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Aucun template trouvé</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery ? 'Aucun résultat pour votre recherche.' : 'Commencez par créer votre premier template.'}
            </p>
            <Button onClick={onCreateNew}>
              <Plus className="h-4 w-4 mr-2" />
              Créer un template
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}