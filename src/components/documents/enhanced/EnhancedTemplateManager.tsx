import React, { useState } from 'react';
import { Search, Filter, Plus, SlidersHorizontal, BarChart3, Star } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useDocumentTemplatesEnhanced } from '@/hooks/useDocumentTemplatesEnhanced';
import { useDocumentTypes } from '@/hooks/useDocumentTypes';
import { TemplateCard } from './TemplateCard';
import { StatsCard } from './StatsCard';
import type { DocumentTemplate } from '@/hooks/useDocumentTemplatesEnhanced';

interface EnhancedTemplateManagerProps {
  onEdit: (template: DocumentTemplate) => void;
  onCreateNew: () => void;
  onPreview: (template: DocumentTemplate) => void;
}

export function EnhancedTemplateManager({ 
  onEdit, 
  onCreateNew, 
  onPreview 
}: EnhancedTemplateManagerProps) {
  const { 
    templates, 
    loading, 
    error, 
    filters, 
    updateFilters, 
    clearFilters, 
    getStats,
    deleteTemplate,
    duplicateTemplate,
    setAsDefault
  } = useDocumentTemplatesEnhanced();

  const { types: documentTypes } = useDocumentTypes();
  const [showFilters, setShowFilters] = useState(false);
  const stats = getStats();

  const handleSearch = (value: string) => {
    updateFilters({ search: value });
  };

  const handleDocumentTypeFilter = (typeId: string) => {
    updateFilters({ documentTypeId: typeId === 'all' ? '' : typeId });
  };

  const handleStatusFilter = (status: string) => {
    const isActive = status === 'all' ? null : status === 'active';
    updateFilters({ isActive });
  };

  const handleDefaultFilter = (defaultStatus: string) => {
    const isDefault = defaultStatus === 'all' ? null : defaultStatus === 'default';
    updateFilters({ isDefault });
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce template ?')) {
      await deleteTemplate(id);
    }
  };

  const handleDuplicate = async (template: DocumentTemplate) => {
    await duplicateTemplate(template);
  };

  const handleSetDefault = async (id: string) => {
    await setAsDefault(id);
  };

  if (error) {
    return (
      <Card className="border-destructive/50">
        <CardContent className="pt-6">
          <div className="text-center">
            <p className="text-destructive font-medium">Erreur de chargement</p>
            <p className="text-sm text-muted-foreground mt-1">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatsCard
          title="Total templates"
          value={stats.total}
          description="Templates disponibles"
          icon={BarChart3}
          color="blue"
        />
        <StatsCard
          title="Templates actifs"
          value={stats.active}
          description="Actuellement utilisés"
          icon={BarChart3}
          color="green"
        />
        <StatsCard
          title="Par défaut"
          value={stats.defaults}
          description="Templates par défaut"
          icon={Star}
          color="orange"
        />
        <StatsCard
          title="Types couverts"
          value={Object.keys(stats.byType).length}
          description="Types avec templates"
          icon={BarChart3}
          color="purple"
        />
      </div>

      {/* Header with Search and Actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex-1 w-full sm:max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Rechercher un template..."
              value={filters.search}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="flex-1 sm:flex-none"
          >
            <SlidersHorizontal className="w-4 h-4 mr-2" />
            Filtres
            {(filters.documentTypeId || filters.isActive !== null || filters.isDefault !== null) && (
              <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 flex items-center justify-center">
                !
              </Badge>
            )}
          </Button>
          <Button onClick={onCreateNew} className="flex-1 sm:flex-none">
            <Plus className="w-4 h-4 mr-2" />
            Nouveau Template
          </Button>
        </div>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <Card className="animate-scale-in">
          <CardHeader>
            <CardTitle className="text-lg">Filtres avancés</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Type de document</label>
                <Select
                  value={filters.documentTypeId || 'all'}
                  onValueChange={handleDocumentTypeFilter}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Tous les types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les types</SelectItem>
                    {documentTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Statut</label>
                <Select
                  value={filters.isActive === null ? 'all' : filters.isActive ? 'active' : 'inactive'}
                  onValueChange={handleStatusFilter}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Tous les statuts" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="active">Actifs</SelectItem>
                    <SelectItem value="inactive">Inactifs</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Par défaut</label>
                <Select
                  value={filters.isDefault === null ? 'all' : filters.isDefault ? 'default' : 'custom'}
                  onValueChange={handleDefaultFilter}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Tous" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous</SelectItem>
                    <SelectItem value="default">Par défaut</SelectItem>
                    <SelectItem value="custom">Personnalisés</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-end">
                <Button 
                  variant="outline" 
                  onClick={clearFilters}
                  className="w-full"
                >
                  Réinitialiser
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="animate-fade-in">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Skeleton className="w-12 h-12 rounded-lg" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : templates.length === 0 ? (
        <Card>
          <CardContent className="pt-8 pb-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <Filter className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="font-semibold mb-2">Aucun template trouvé</h3>
              <p className="text-muted-foreground mb-4">
                {filters.search || filters.documentTypeId || filters.isActive !== null || filters.isDefault !== null
                  ? 'Aucun template ne correspond à vos critères de recherche.'
                  : 'Commencez par créer votre premier template.'}
              </p>
              {(filters.search || filters.documentTypeId || filters.isActive !== null || filters.isDefault !== null) ? (
                <Button variant="outline" onClick={clearFilters}>
                  Réinitialiser les filtres
                </Button>
              ) : (
                <Button onClick={onCreateNew}>
                  <Plus className="w-4 h-4 mr-2" />
                  Créer un template
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              onEdit={onEdit}
              onDelete={handleDelete}
              onDuplicate={handleDuplicate}
              onSetDefault={handleSetDefault}
              onPreview={onPreview}
              className="animate-fade-in"
            />
          ))}
        </div>
      )}
    </div>
  );
}