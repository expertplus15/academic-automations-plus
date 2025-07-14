import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Edit, 
  Trash2, 
  Copy, 
  Eye, 
  Settings,
  FileText,
  Calendar,
  Users,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { DocumentType } from '@/hooks/useDocumentTypes';

interface DocumentTypeCardProps {
  documentType: DocumentType;
  onEdit: (type: DocumentType) => void;
  onDelete: (id: string) => void;
  onDuplicate: (type: DocumentType) => void;
  onViewDetails: (type: DocumentType) => void;
  className?: string;
}

const colorMapping = {
  blue: 'bg-blue-50 border-blue-200 text-blue-700',
  green: 'bg-green-50 border-green-200 text-green-700',
  purple: 'bg-purple-50 border-purple-200 text-purple-700',
  red: 'bg-red-50 border-red-200 text-red-700',
  yellow: 'bg-yellow-50 border-yellow-200 text-yellow-700',
  orange: 'bg-orange-50 border-orange-200 text-orange-700',
};

const categoryIcons = {
  academique: FileText,
  administratif: Settings,
  officiel: CheckCircle,
  autre: Users,
};

export function DocumentTypeCard({ 
  documentType, 
  onEdit, 
  onDelete, 
  onDuplicate, 
  onViewDetails,
  className 
}: DocumentTypeCardProps) {
  const CategoryIcon = categoryIcons[documentType.category as keyof typeof categoryIcons] || FileText;
  const colorClasses = colorMapping[documentType.color as keyof typeof colorMapping] || colorMapping.blue;

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(documentType);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(documentType.id);
  };

  const handleDuplicate = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDuplicate(documentType);
  };

  const handleViewDetails = () => {
    onViewDetails(documentType);
  };

  return (
    <Card 
      className={cn(
        "group relative overflow-hidden transition-all duration-300 cursor-pointer",
        "hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1",
        "border-2 hover:border-primary/30",
        !documentType.is_active && "opacity-60",
        className
      )}
      onClick={handleViewDetails}
    >
      {/* Header avec icône et statut */}
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={cn(
              "p-3 rounded-lg border transition-colors",
              colorClasses
            )}>
              <CategoryIcon className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg truncate group-hover:text-primary transition-colors">
                {documentType.name}
              </h3>
              <p className="text-sm text-muted-foreground">
                Code: {documentType.code}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {documentType.is_active ? (
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
          {documentType.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {documentType.description}
            </p>
          )}

          {/* Badges */}
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className="text-xs">
              {documentType.category}
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {documentType.variables.length} variables
            </Badge>
            {Object.keys(documentType.validation_rules).length > 0 && (
              <Badge variant="outline" className="text-xs text-purple-600">
                Validations
              </Badge>
            )}
          </div>

          {/* Métadonnées */}
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {new Date(documentType.created_at).toLocaleDateString('fr-FR')}
            </div>
            {documentType.updated_at !== documentType.created_at && (
              <div className="flex items-center gap-1">
                <Edit className="w-3 h-3" />
                Modifié
              </div>
            )}
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
              onClick={handleViewDetails}
              className="h-8 px-2"
            >
              <Eye className="w-3 h-3 mr-1" />
              Détails
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
              disabled={!documentType.is_active}
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </CardFooter>

      {/* Indicateur de survol */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </Card>
  );
}