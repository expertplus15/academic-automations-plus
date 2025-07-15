import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Search, Filter, X, Calendar as CalendarIcon, Download, Sliders } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface SearchFiltersProps {
  onSearchChange: (query: string) => void;
  onFiltersChange: (filters: FilterState) => void;
  searchQuery: string;
  filters: FilterState;
}

export interface FilterState {
  category: string;
  status: string;
  dateRange: {
    from: Date | null;
    to: Date | null;
  };
  tags: string[];
  requiresApproval: boolean | null;
  autoGenerate: boolean | null;
  hasVariables: boolean | null;
}

const categories = [
  { value: 'bulletin', label: 'Bulletin de Notes' },
  { value: 'transcript', label: 'Relevé Officiel' },
  { value: 'certificate', label: 'Attestation' },
  { value: 'report', label: 'Rapport' }
];

const predefinedTags = [
  'officiel', 'temporaire', 'export', 'interne', 'externe', 
  'academic', 'administrative', 'evaluation'
];

export function SearchAndFilters({ 
  onSearchChange, 
  onFiltersChange, 
  searchQuery, 
  filters 
}: SearchFiltersProps) {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [tempFilters, setTempFilters] = useState<FilterState>(filters);

  const updateFilters = (newFilters: Partial<FilterState>) => {
    const updated = { ...filters, ...newFilters };
    onFiltersChange(updated);
  };

  const applyAdvancedFilters = () => {
    onFiltersChange(tempFilters);
    setIsAdvancedOpen(false);
  };

  const resetFilters = () => {
    const defaultFilters: FilterState = {
      category: 'all',
      status: 'all',
      dateRange: { from: null, to: null },
      tags: [],
      requiresApproval: null,
      autoGenerate: null,
      hasVariables: null
    };
    setTempFilters(defaultFilters);
    onFiltersChange(defaultFilters);
    setIsAdvancedOpen(false);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.category !== 'all') count++;
    if (filters.status !== 'all') count++;
    if (filters.dateRange.from || filters.dateRange.to) count++;
    if (filters.tags.length > 0) count++;
    if (filters.requiresApproval !== null) count++;
    if (filters.autoGenerate !== null) count++;
    if (filters.hasVariables !== null) count++;
    return count;
  };

  const removeFilter = (filterType: string, value?: string) => {
    switch (filterType) {
      case 'category':
        updateFilters({ category: 'all' });
        break;
      case 'status':
        updateFilters({ status: 'all' });
        break;
      case 'tag':
        updateFilters({ tags: filters.tags.filter(tag => tag !== value) });
        break;
      case 'dateRange':
        updateFilters({ dateRange: { from: null, to: null } });
        break;
      case 'requiresApproval':
        updateFilters({ requiresApproval: null });
        break;
      case 'autoGenerate':
        updateFilters({ autoGenerate: null });
        break;
      case 'hasVariables':
        updateFilters({ hasVariables: null });
        break;
    }
  };

  return (
    <div className="space-y-4">
      {/* Barre de recherche principale */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Rechercher un type de document..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        
        {/* Filtres rapides */}
        <Select value={filters.category} onValueChange={(value) => updateFilters({ category: value })}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Toutes les catégories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les catégories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.value} value={cat.value}>
                {cat.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select value={filters.status} onValueChange={(value) => updateFilters({ status: value })}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous</SelectItem>
            <SelectItem value="active">Actifs</SelectItem>
            <SelectItem value="inactive">Inactifs</SelectItem>
          </SelectContent>
        </Select>

        {/* Filtres avancés */}
        <Dialog open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="relative">
              <Sliders className="w-4 h-4 mr-2" />
              Filtres avancés
              {getActiveFiltersCount() > 0 && (
                <Badge 
                  className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                  variant="destructive"
                >
                  {getActiveFiltersCount()}
                </Badge>
              )}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Filtres Avancés</DialogTitle>
              <DialogDescription>
                Affinez votre recherche avec des critères spécifiques
              </DialogDescription>
            </DialogHeader>
            
            <Tabs defaultValue="general" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="general">Général</TabsTrigger>
                <TabsTrigger value="dates">Dates</TabsTrigger>
                <TabsTrigger value="options">Options</TabsTrigger>
              </TabsList>
              
              <TabsContent value="general" className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Tags</label>
                  <div className="flex flex-wrap gap-2">
                    {predefinedTags.map((tag) => (
                      <Badge
                        key={tag}
                        variant={tempFilters.tags.includes(tag) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => {
                          const newTags = tempFilters.tags.includes(tag)
                            ? tempFilters.tags.filter(t => t !== tag)
                            : [...tempFilters.tags, tag];
                          setTempFilters({ ...tempFilters, tags: newTags });
                        }}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="dates" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Date de début</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {tempFilters.dateRange.from 
                            ? format(tempFilters.dateRange.from, "dd/MM/yyyy", { locale: fr })
                            : "Sélectionner..."
                          }
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={tempFilters.dateRange.from}
                          onSelect={(date) => setTempFilters({
                            ...tempFilters,
                            dateRange: { ...tempFilters.dateRange, from: date }
                          })}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Date de fin</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {tempFilters.dateRange.to 
                            ? format(tempFilters.dateRange.to, "dd/MM/yyyy", { locale: fr })
                            : "Sélectionner..."
                          }
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={tempFilters.dateRange.to}
                          onSelect={(date) => setTempFilters({
                            ...tempFilters,
                            dateRange: { ...tempFilters.dateRange, to: date }
                          })}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="options" className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="requires-approval"
                      checked={tempFilters.requiresApproval === true}
                      onCheckedChange={(checked) => 
                        setTempFilters({
                          ...tempFilters,
                          requiresApproval: checked ? true : null
                        })
                      }
                    />
                    <label htmlFor="requires-approval" className="text-sm">
                      Nécessite une approbation
                    </label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="auto-generate"
                      checked={tempFilters.autoGenerate === true}
                      onCheckedChange={(checked) => 
                        setTempFilters({
                          ...tempFilters,
                          autoGenerate: checked ? true : null
                        })
                      }
                    />
                    <label htmlFor="auto-generate" className="text-sm">
                      Génération automatique
                    </label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="has-variables"
                      checked={tempFilters.hasVariables === true}
                      onCheckedChange={(checked) => 
                        setTempFilters({
                          ...tempFilters,
                          hasVariables: checked ? true : null
                        })
                      }
                    />
                    <label htmlFor="has-variables" className="text-sm">
                      Contient des variables
                    </label>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={resetFilters}>
                Réinitialiser
              </Button>
              <div className="space-x-2">
                <Button variant="outline" onClick={() => setIsAdvancedOpen(false)}>
                  Annuler
                </Button>
                <Button onClick={applyAdvancedFilters}>
                  Appliquer
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Button variant="outline" size="sm">
          <Download className="w-4 h-4 mr-2" />
          Exporter
        </Button>
      </div>

      {/* Filtres actifs */}
      {getActiveFiltersCount() > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-muted-foreground">Filtres actifs:</span>
          
          {filters.category !== 'all' && (
            <Badge variant="secondary" className="gap-1">
              Catégorie: {categories.find(c => c.value === filters.category)?.label}
              <X 
                className="w-3 h-3 cursor-pointer" 
                onClick={() => removeFilter('category')}
              />
            </Badge>
          )}
          
          {filters.status !== 'all' && (
            <Badge variant="secondary" className="gap-1">
              Statut: {filters.status === 'active' ? 'Actifs' : 'Inactifs'}
              <X 
                className="w-3 h-3 cursor-pointer" 
                onClick={() => removeFilter('status')}
              />
            </Badge>
          )}
          
          {filters.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="gap-1">
              {tag}
              <X 
                className="w-3 h-3 cursor-pointer" 
                onClick={() => removeFilter('tag', tag)}
              />
            </Badge>
          ))}
          
          {(filters.dateRange.from || filters.dateRange.to) && (
            <Badge variant="secondary" className="gap-1">
              Période: {filters.dateRange.from && format(filters.dateRange.from, "dd/MM/yy", { locale: fr })}
              {filters.dateRange.from && filters.dateRange.to && " - "}
              {filters.dateRange.to && format(filters.dateRange.to, "dd/MM/yy", { locale: fr })}
              <X 
                className="w-3 h-3 cursor-pointer" 
                onClick={() => removeFilter('dateRange')}
              />
            </Badge>
          )}
          
          {filters.requiresApproval === true && (
            <Badge variant="secondary" className="gap-1">
              Avec approbation
              <X 
                className="w-3 h-3 cursor-pointer" 
                onClick={() => removeFilter('requiresApproval')}
              />
            </Badge>
          )}
          
          {filters.autoGenerate === true && (
            <Badge variant="secondary" className="gap-1">
              Auto-génération
              <X 
                className="w-3 h-3 cursor-pointer" 
                onClick={() => removeFilter('autoGenerate')}
              />
            </Badge>
          )}
          
          {filters.hasVariables === true && (
            <Badge variant="secondary" className="gap-1">
              Avec variables
              <X 
                className="w-3 h-3 cursor-pointer" 
                onClick={() => removeFilter('hasVariables')}
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}