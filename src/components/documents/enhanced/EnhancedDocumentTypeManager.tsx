import React, { useState } from 'react';
import { Search, Filter, Plus, SlidersHorizontal, BarChart3 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useDocumentTypes } from '@/hooks/useDocumentTypes';
import { DocumentTypeCard } from './DocumentTypeCard';
import { StatsCard } from './StatsCard';
import type { DocumentType } from '@/hooks/useDocumentTypes';

interface EnhancedDocumentTypeManagerProps {
  onEdit: (type: DocumentType) => void;
  onCreateNew: () => void;
  onViewDetails: (type: DocumentType) => void;
}

export function EnhancedDocumentTypeManager({ 
  onEdit, 
  onCreateNew, 
  onViewDetails 
}: EnhancedDocumentTypeManagerProps) {
  const { 
    types, 
    loading, 
    error, 
    filters, 
    updateFilters, 
    clearFilters, 
    getStats,
    deleteType,
    duplicateType
  } = useDocumentTypes();

  const [showFilters, setShowFilters] = useState(false);
  const stats = getStats();

  const handleSearch = (value: string) => {
    updateFilters({ search: value });
  };

  const handleCategoryFilter = (category: string) => {
    updateFilters({ category: category === 'all' ? '' : category });
  };

  const handleStatusFilter = (status: string) => {
    const isActive = status === 'all' ? null : status === 'active';
    updateFilters({ isActive });
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce type de document ?')) {
      await deleteType(id);
    }
  };

  const handleDuplicate = async (type: DocumentType) => {
    await duplicateType(type);
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
          title="Total des types"
          value={stats.total}
          description="Types de documents"
          icon={BarChart3}
          color="blue"
        />
        <StatsCard
          title="Types actifs"
          value={stats.active}
          description="Actuellement utilisés"
          icon={BarChart3}
          color="green"
        />
        <StatsCard
          title="Types inactifs"
          value={stats.inactive}
          description="Non utilisés"
          icon={BarChart3}
          color="orange"
        />
        <StatsCard
          title="Catégories"
          value={Object.keys(stats.byCategory).length}
          description="Différentes catégories"
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
              placeholder="Rechercher un type de document..."
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
            {(filters.category || filters.isActive !== null) && (
              <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 flex items-center justify-center">
                !
              </Badge>
            )}
          </Button>
          <Button onClick={onCreateNew} className="flex-1 sm:flex-none">
            <Plus className="w-4 h-4 mr-2" />
            Nouveau Type
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Catégorie</label>
                <Select
                  value={filters.category || 'all'}
                  onValueChange={handleCategoryFilter}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Toutes les catégories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les catégories</SelectItem>
                    <SelectItem value="academique">Académique</SelectItem>
                    <SelectItem value="administratif">Administratif</SelectItem>
                    <SelectItem value="officiel">Officiel</SelectItem>
                    <SelectItem value="autre">Autre</SelectItem>
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
      ) : types.length === 0 ? (
        <Card>
          <CardContent className="pt-8 pb-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <Filter className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="font-semibold mb-2">Aucun type trouvé</h3>
              <p className="text-muted-foreground mb-4">
                {filters.search || filters.category || filters.isActive !== null
                  ? 'Aucun type de document ne correspond à vos critères de recherche.'
                  : 'Commencez par créer votre premier type de document.'}
              </p>
              {(filters.search || filters.category || filters.isActive !== null) ? (
                <Button variant="outline" onClick={clearFilters}>
                  Réinitialiser les filtres
                </Button>
              ) : (
                <Button onClick={onCreateNew}>
                  <Plus className="w-4 h-4 mr-2" />
                  Créer un type
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {types.map((type) => (
            <DocumentTypeCard
              key={type.id}
              documentType={type}
              onEdit={onEdit}
              onDelete={handleDelete}
              onDuplicate={handleDuplicate}
              onViewDetails={onViewDetails}
              className="animate-fade-in"
            />
          ))}
        </div>
      )}
    </div>
  );
}