import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Settings,
  Folder,
  FolderPlus,
  MoreVertical,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  Palette
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useDocumentCategories, DocumentCategory } from '@/hooks/useDocumentCategories';
import { cn } from '@/lib/utils';

export function DocumentCategoriesManager() {
  const {
    categories,
    loading,
    error,
    filters,
    iconOptions,
    colorOptions,
    createCategory,
    updateCategory,
    deleteCategory,
    updateFilters,
    clearFilters,
    getStats
  } = useDocumentCategories();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<DocumentCategory | null>(null);
  const [newCategory, setNewCategory] = useState({
    name: '',
    code: '',
    description: '',
    icon: 'FileText',
    color: 'blue',
    parent_id: null,
    sort_order: 999,
    is_active: true,
    is_system: false
  });

  const stats = getStats();

  const handleCreateCategory = async () => {
    try {
      await createCategory(newCategory);
      setIsCreateDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error creating category:', error);
    }
  };

  const handleUpdateCategory = async (id: string, updates: Partial<DocumentCategory>) => {
    try {
      await updateCategory(id, updates);
      setEditingCategory(null);
    } catch (error) {
      console.error('Error updating category:', error);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir désactiver cette catégorie ?')) {
      try {
        await deleteCategory(id);
      } catch (error) {
        console.error('Error deleting category:', error);
      }
    }
  };

  const resetForm = () => {
    setNewCategory({
      name: '',
      code: '',
      description: '',
      icon: 'FileText',
      color: 'blue',
      parent_id: null,
      sort_order: 999,
      is_active: true,
      is_system: false
    });
  };

  const getColorClass = (color: string) => {
    const colorOption = colorOptions.find(c => c.value === color);
    return colorOption?.class || 'bg-gray-100 text-gray-700';
  };

  const getIconComponent = (iconName: string) => {
    // Simple mapping for common icons
    const iconMap: Record<string, React.ComponentType<any>> = {
      FileText: () => <div className="w-4 h-4 bg-current rounded-sm" />,
      FileCheck: () => <div className="w-4 h-4 bg-current rounded-sm" />,
      Award: () => <div className="w-4 h-4 bg-current rounded-full" />,
      Certificate: () => <div className="w-4 h-4 bg-current" />,
      Shield: () => <div className="w-4 h-4 bg-current" />,
      BookOpen: () => <div className="w-4 h-4 bg-current" />,
    };
    
    const IconComponent = iconMap[iconName] || iconMap.FileText;
    return <IconComponent />;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-600">
            Erreur lors du chargement: {error}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête avec actions */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Gestion des Catégories</h3>
            <p className="text-sm text-muted-foreground">
              Configurez les catégories de documents disponibles dans le système
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Nouvelle Catégorie
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Créer une Nouvelle Catégorie</DialogTitle>
                  <DialogDescription>
                    Définissez les caractéristiques de la nouvelle catégorie de documents
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Nom *</label>
                      <Input
                        value={newCategory.name}
                        onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                        placeholder="ex: Bulletins Spéciaux"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Code *</label>
                      <Input
                        value={newCategory.code}
                        onChange={(e) => setNewCategory({...newCategory, code: e.target.value})}
                        placeholder="ex: special_bulletin"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Description</label>
                    <Textarea
                      value={newCategory.description}
                      onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
                      placeholder="Description de la catégorie..."
                      rows={3}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Icône</label>
                      <Select 
                        value={newCategory.icon} 
                        onValueChange={(value) => setNewCategory({...newCategory, icon: value})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {iconOptions.map((icon) => (
                            <SelectItem key={icon} value={icon}>
                              <div className="flex items-center gap-2">
                                {getIconComponent(icon)}
                                {icon}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Couleur</label>
                      <Select 
                        value={newCategory.color} 
                        onValueChange={(value) => setNewCategory({...newCategory, color: value})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {colorOptions.map((color) => (
                            <SelectItem key={color.value} value={color.value}>
                              <div className="flex items-center gap-2">
                                <div className={`w-3 h-3 rounded-full ${color.class}`} />
                                {color.label}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Ordre d'affichage</label>
                    <Input
                      type="number"
                      value={newCategory.sort_order}
                      onChange={(e) => setNewCategory({...newCategory, sort_order: parseInt(e.target.value) || 999})}
                      placeholder="999"
                    />
                  </div>
                  
                  <div className="flex justify-end gap-2 pt-4">
                    <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                      Annuler
                    </Button>
                    <Button 
                      onClick={handleCreateCategory} 
                      disabled={!newCategory.name || !newCategory.code}
                    >
                      Créer
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Barre de recherche et filtres */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Rechercher une catégorie..."
              value={filters.search}
              onChange={(e) => updateFilters({ search: e.target.value })}
              className="pl-10"
            />
          </div>
          
          <Select 
            value={filters.isActive === null ? 'all' : filters.isActive.toString()} 
            onValueChange={(value) => updateFilters({ 
              isActive: value === 'all' ? null : value === 'true' 
            })}
          >
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous</SelectItem>
              <SelectItem value="true">Actifs</SelectItem>
              <SelectItem value="false">Inactifs</SelectItem>
            </SelectContent>
          </Select>
          
          {(filters.search || filters.isActive !== null) && (
            <Button variant="outline" size="sm" onClick={clearFilters}>
              Réinitialiser
            </Button>
          )}
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Folder className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Eye className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Actives</p>
                <p className="text-2xl font-bold">{stats.active}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gray-100 rounded-lg">
                <EyeOff className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Inactives</p>
                <p className="text-2xl font-bold">{stats.inactive}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Settings className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Système</p>
                <p className="text-2xl font-bold">{stats.system}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <FolderPlus className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Personnalisées</p>
                <p className="text-2xl font-bold">{stats.custom}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Liste des catégories */}
      <Card>
        <CardHeader>
          <CardTitle>Catégories Configurées ({categories.length})</CardTitle>
          <CardDescription>
            Gérez les catégories de documents et leurs propriétés
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {categories.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Aucune catégorie trouvée
              </div>
            ) : (
              categories.map((category) => (
                <Card 
                  key={category.id} 
                  className={cn(
                    "border transition-colors",
                    category.is_active ? "border-border/50" : "border-dashed border-gray-300 opacity-60"
                  )}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={cn(
                          "p-2 rounded-lg",
                          category.is_active ? getColorClass(category.color) : "bg-gray-100 text-gray-400"
                        )}>
                          {getIconComponent(category.icon)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className={cn(
                              "font-medium",
                              !category.is_active && "text-gray-500"
                            )}>
                              {category.name}
                            </h3>
                            {!category.is_active && (
                              <Badge variant="secondary" className="text-xs">
                                Inactive
                              </Badge>
                            )}
                            {category.is_system && (
                              <Badge variant="outline" className="text-xs">
                                Système
                              </Badge>
                            )}
                          </div>
                          <p className={cn(
                            "text-sm",
                            category.is_active ? "text-muted-foreground" : "text-gray-400"
                          )}>
                            {category.description}
                          </p>
                          <div className="flex items-center gap-3 mt-2">
                            <Badge className={cn("text-xs", getColorClass(category.color))}>
                              {category.code}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              Ordre: {category.sort_order}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="sm" variant="ghost">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem 
                              onClick={() => setEditingCategory(category)}
                            >
                              <Edit className="w-4 h-4 mr-2" />
                              Modifier
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleUpdateCategory(category.id, { 
                                is_active: !category.is_active 
                              })}
                            >
                              {category.is_active ? (
                                <>
                                  <EyeOff className="w-4 h-4 mr-2" />
                                  Désactiver
                                </>
                              ) : (
                                <>
                                  <Eye className="w-4 h-4 mr-2" />
                                  Activer
                                </>
                              )}
                            </DropdownMenuItem>
                            {!category.is_system && (
                              <DropdownMenuItem 
                                onClick={() => handleDeleteCategory(category.id)}
                                className="text-red-600"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Supprimer
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Dialog d'édition */}
      {editingCategory && (
        <Dialog open={!!editingCategory} onOpenChange={() => setEditingCategory(null)}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Modifier la Catégorie</DialogTitle>
              <DialogDescription>
                Modifiez les propriétés de la catégorie
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Nom *</label>
                  <Input
                    value={editingCategory.name}
                    onChange={(e) => setEditingCategory({
                      ...editingCategory, 
                      name: e.target.value
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Code *</label>
                  <Input
                    value={editingCategory.code}
                    onChange={(e) => setEditingCategory({
                      ...editingCategory, 
                      code: e.target.value
                    })}
                    disabled={editingCategory.is_system}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={editingCategory.description || ''}
                  onChange={(e) => setEditingCategory({
                    ...editingCategory, 
                    description: e.target.value
                  })}
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Icône</label>
                  <Select 
                    value={editingCategory.icon} 
                    onValueChange={(value) => setEditingCategory({
                      ...editingCategory, 
                      icon: value
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {iconOptions.map((icon) => (
                        <SelectItem key={icon} value={icon}>
                          <div className="flex items-center gap-2">
                            {getIconComponent(icon)}
                            {icon}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Couleur</label>
                  <Select 
                    value={editingCategory.color} 
                    onValueChange={(value) => setEditingCategory({
                      ...editingCategory, 
                      color: value
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {colorOptions.map((color) => (
                        <SelectItem key={color.value} value={color.value}>
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${color.class}`} />
                            {color.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Ordre d'affichage</label>
                <Input
                  type="number"
                  value={editingCategory.sort_order}
                  onChange={(e) => setEditingCategory({
                    ...editingCategory, 
                    sort_order: parseInt(e.target.value) || 999
                  })}
                />
              </div>
              
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setEditingCategory(null)}>
                  Annuler
                </Button>
                <Button 
                  onClick={() => handleUpdateCategory(editingCategory.id, editingCategory)}
                  disabled={!editingCategory.name || !editingCategory.code}
                >
                  Sauvegarder
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}