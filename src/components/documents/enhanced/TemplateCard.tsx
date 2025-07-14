import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Edit, 
  Trash2, 
  Copy, 
  Eye, 
  Star,
  FileText,
  Calendar,
  Code,
  CheckCircle,
  XCircle,
  Crown
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { DocumentTemplate } from '@/hooks/useDocumentTemplatesEnhanced';

interface TemplateCardProps {
  template: DocumentTemplate;
  onEdit: (template: DocumentTemplate) => void;
  onDelete: (id: string) => void;
  onDuplicate: (template: DocumentTemplate) => void;
  onSetDefault: (id: string) => void;
  onPreview: (template: DocumentTemplate) => void;
  className?: string;
}

export function TemplateCard({ 
  template, 
  onEdit, 
  onDelete, 
  onDuplicate, 
  onSetDefault,
  onPreview,
  className 
}: TemplateCardProps) {
  const documentType = template.document_type;

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(template);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(template.id);
  };

  const handleDuplicate = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDuplicate(template);
  };

  const handleSetDefault = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSetDefault(template.id);
  };

  const handlePreview = () => {
    onPreview(template);
  };

  return (
    <Card 
      className={cn(
        "group relative overflow-hidden transition-all duration-300 cursor-pointer",
        "hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1",
        "border-2 hover:border-primary/30",
        template.is_default && "ring-2 ring-yellow-200 border-yellow-300",
        !template.is_active && "opacity-60",
        className
      )}
      onClick={handlePreview}
    >
      {/* Header avec nom et statut */}
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-lg truncate group-hover:text-primary transition-colors">
                  {template.name}
                </h3>
                {template.is_default && (
                  <Crown className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                )}
              </div>
              {documentType && (
                <p className="text-sm text-muted-foreground">
                  Type: {documentType.name}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {template.is_active ? (
              <CheckCircle className="w-4 h-4 text-green-500" />
            ) : (
              <XCircle className="w-4 h-4 text-red-500" />
            )}
          </div>
        </div>
      </CardHeader>

      {/* Contenu */}
      <CardContent className="py-3">
        <div className="space-y-3">
          {/* Description */}
          {template.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {template.description}
            </p>
          )}

          {/* Badges */}
          <div className="flex items-center gap-2 flex-wrap">
            {documentType && (
              <Badge variant="outline" className="text-xs">
                {documentType.category}
              </Badge>
            )}
            <Badge variant="secondary" className="text-xs">
              v{template.version}
            </Badge>
            {template.is_default && (
              <Badge variant="default" className="text-xs bg-yellow-100 text-yellow-800 border-yellow-300">
                Par défaut
              </Badge>
            )}
            {Object.keys(template.variables).length > 0 && (
              <Badge variant="outline" className="text-xs text-blue-600">
                {Object.keys(template.variables).length} variables
              </Badge>
            )}
          </div>

          {/* Métadonnées */}
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {new Date(template.created_at).toLocaleDateString('fr-FR')}
            </div>
            {template.updated_at !== template.created_at && (
              <div className="flex items-center gap-1">
                <Edit className="w-3 h-3" />
                Modifié
              </div>
            )}
            <div className="flex items-center gap-1">
              <Code className="w-3 h-3" />
              Version {template.version}
            </div>
          </div>
        </div>
      </CardContent>

      {/* Actions */}
      <CardFooter className="pt-3 border-t bg-muted/20">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePreview}
              className="h-8 px-2"
            >
              <Eye className="w-3 h-3 mr-1" />
              Aperçu
            </Button>
          </div>
          
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleEdit}
              className="h-8 px-2 hover:bg-primary/10"
            >
              <Edit className="w-3 h-3" />
            </Button>
            {!template.is_default && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSetDefault}
                className="h-8 px-2 hover:bg-yellow-50"
                title="Définir par défaut"
              >
                <Star className="w-3 h-3" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDuplicate}
              className="h-8 px-2 hover:bg-blue-50"
            >
              <Copy className="w-3 h-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              className="h-8 px-2 hover:bg-destructive/10 text-destructive"
              disabled={!template.is_active}
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </CardFooter>

      {/* Indicateur de survol */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      
      {/* Indicateur template par défaut */}
      {template.is_default && (
        <div className="absolute top-2 right-2 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium border border-yellow-300">
          Défaut
        </div>
      )}
    </Card>
  );
}