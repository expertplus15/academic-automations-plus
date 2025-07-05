import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CardTemplate } from '@/hooks/students/useStudentCards';
import { Edit, Star, Eye, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface TemplatesListProps {
  templates: CardTemplate[];
  loading: boolean;
  onEdit: (template: CardTemplate) => void;
}

export function TemplatesList({ templates, loading, onEdit }: TemplatesListProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Chargement des templates...</div>
      </div>
    );
  }

  if (templates.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-8">
            <div className="text-lg font-semibold text-muted-foreground mb-2">
              Aucun template trouvé
            </div>
            <p className="text-muted-foreground">
              Créez votre premier template de carte étudiante.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4 h-full overflow-y-auto">
      {templates.map((template) => (
        <Card key={template.id} className="relative">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <CardTitle className="flex items-center gap-2">
                  {template.name}
                  {template.is_default && (
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                      <Star className="w-3 h-3 mr-1" />
                      Défaut
                    </Badge>
                  )}
                  {!template.is_active && (
                    <Badge variant="outline" className="text-gray-500">
                      Inactif
                    </Badge>
                  )}
                </CardTitle>
                {template.description && (
                  <p className="text-sm text-muted-foreground">
                    {template.description}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(template)}
                  className="h-8 w-8 p-0"
                  title="Modifier"
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  title="Aperçu"
                >
                  <Eye className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                  title="Supprimer"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-0">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="font-medium text-muted-foreground">Layout:</span>
                <div className="capitalize">{template.template_data.layout}</div>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Champs:</span>
                <div>{template.template_data.fields?.length || 0} éléments</div>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Dimensions:</span>
                <div>
                  {template.template_data.dimensions?.width} x {template.template_data.dimensions?.height} 
                  {template.template_data.dimensions?.unit}
                </div>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Créé le:</span>
                <div>{format(new Date(template.created_at), 'dd/MM/yyyy', { locale: fr })}</div>
              </div>
            </div>

            <div className="mt-3 flex items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground">Couleurs:</span>
              <div className="flex items-center gap-1">
                <div 
                  className="w-4 h-4 rounded border"
                  style={{ backgroundColor: template.template_data.colors?.primary }}
                  title="Couleur primaire"
                />
                <div 
                  className="w-4 h-4 rounded border"
                  style={{ backgroundColor: template.template_data.colors?.secondary }}
                  title="Couleur secondaire"
                />
                <div 
                  className="w-4 h-4 rounded border"
                  style={{ backgroundColor: template.template_data.colors?.text }}
                  title="Couleur du texte"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}