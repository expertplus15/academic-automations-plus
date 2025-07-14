import React, { useState } from 'react';
import { FileText, Plus, Search, Filter, Eye, Edit, Copy, Trash2, Star, Download, Grid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { useDocumentTemplatesEnhanced, type DocumentTemplate, type TemplateFilters } from '@/hooks/useDocumentTemplatesEnhanced';
import { useDocumentTypes, type DocumentType } from '@/hooks/useDocumentTypes';

interface EnhancedTemplateManagerProps {
  onEdit: (template: DocumentTemplate) => void;
  onPreview: (template: DocumentTemplate) => void;
}

export function EnhancedTemplateManager({ onEdit, onPreview }: EnhancedTemplateManagerProps) {
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  
  const {
    templates,
    loading,
    error,
    filters,
    updateFilters,
    clearFilters,
    deleteTemplate,
    duplicateTemplate,
    setAsDefault,
    getStats
  } = useDocumentTemplatesEnhanced();
  
  const { types: documentTypes } = useDocumentTypes();
  const stats = getStats();

  const handleFilterChange = (field: keyof TemplateFilters, value: any) => {
    updateFilters({ [field]: value });
  };

  const handleDuplicate = async (template: DocumentTemplate) => {
    const result = await duplicateTemplate(template);
    if (result.data) {
      toast({
        title: "Template dupliqué",
        description: `Le template "${result.data.name}" a été créé`
      });
    }
  };

  const handleDelete = async (template: DocumentTemplate) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer le template "${template.name}" ?`)) {
      await deleteTemplate(template.id);
    }
  };

  const handleSetDefault = async (template: DocumentTemplate) => {
    await setAsDefault(template.id);
    toast({
      title: "Template par défaut",
      description: `"${template.name}" est maintenant le template par défaut`
    });
  };

  const getDocumentTypeName = (template: DocumentTemplate): string => {
    const docType = documentTypes.find(dt => dt.id === template.document_type_id);
    return docType?.name || template.document_type?.name || 'Type inconnu';
  };

  const getDocumentTypeColor = (template: DocumentTemplate): string => {
    const docType = documentTypes.find(dt => dt.id === template.document_type_id);
    return docType?.color || template.document_type?.color || 'gray';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-4">
        <p>Erreur lors du chargement: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Gestion des Templates</h2>
          <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
            <span>{stats.total} templates</span>
            <span>{stats.active} actifs</span>
            <span>{stats.defaults} par défaut</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filtres
          </Button>
          
          <div className="flex items-center border rounded-lg">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Filtres</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label>Recherche</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Nom ou description..."
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div>
                <Label>Type de document</Label>
                <Select
                  value={filters.documentTypeId}
                  onValueChange={(value) => handleFilterChange('documentTypeId', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Tous les types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Tous les types</SelectItem>
                    {documentTypes.map(type => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Statut</Label>
                <Select
                  value={filters.isActive === null ? '' : filters.isActive.toString()}
                  onValueChange={(value) => handleFilterChange('isActive', value === '' ? null : value === 'true')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Tous" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Tous</SelectItem>
                    <SelectItem value="true">Actifs</SelectItem>
                    <SelectItem value="false">Inactifs</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-end">
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="w-full"
                >
                  Effacer les filtres
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Templates Grid/List */}
      {templates.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Aucun template trouvé</h3>
          <p className="text-muted-foreground mb-4">
            {filters.search || filters.documentTypeId || filters.isActive !== null
              ? 'Aucun template ne correspond aux critères de recherche'
              : 'Commencez par créer votre premier template'
            }
          </p>
          {(filters.search || filters.documentTypeId || filters.isActive !== null) && (
            <Button variant="outline" onClick={clearFilters}>
              Effacer les filtres
            </Button>
          )}
        </div>
      ) : (
        <div className={viewMode === 'grid' 
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
          : 'space-y-4'
        }>
          {templates.map(template => (
            <Card key={template.id} className={`hover:shadow-md transition-shadow ${
              !template.is_active ? 'opacity-60' : ''
            }`}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg flex items-center gap-2">
                      {template.name}
                      {template.is_default && (
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      )}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {template.description || 'Aucune description'}
                    </CardDescription>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        •••
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit(template)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Modifier
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onPreview(template)}>
                        <Eye className="h-4 w-4 mr-2" />
                        Aperçu
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDuplicate(template)}>
                        <Copy className="h-4 w-4 mr-2" />
                        Dupliquer
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {!template.is_default && (
                        <DropdownMenuItem onClick={() => handleSetDefault(template)}>
                          <Star className="h-4 w-4 mr-2" />
                          Définir par défaut
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem 
                        onClick={() => handleDelete(template)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Supprimer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant="outline"
                      className={`bg-${getDocumentTypeColor(template)}-100 text-${getDocumentTypeColor(template)}-800`}
                    >
                      {getDocumentTypeName(template)}
                    </Badge>
                    <Badge variant={template.is_active ? 'default' : 'secondary'}>
                      {template.is_active ? 'Actif' : 'Inactif'}
                    </Badge>
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    {template.content?.sections ? (
                      <span>{template.content.sections.length} sections</span>
                    ) : (
                      <span>Template simple</span>
                    )}
                    <span className="mx-2">•</span>
                    <span>v{template.version}</span>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => onEdit(template)}
                      className="flex-1"
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Modifier
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => onPreview(template)}
                    >
                      <Eye className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}