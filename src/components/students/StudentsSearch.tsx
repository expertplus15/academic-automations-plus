import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Filter, 
  X,
  ChevronDown
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu";

interface StudentsSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  selectedProgram?: string;
  onProgramChange?: (program: string) => void;
  totalResults: number;
}

export function StudentsSearch({
  searchTerm,
  onSearchChange,
  selectedStatus,
  onStatusChange,
  selectedProgram,
  onProgramChange,
  totalResults
}: StudentsSearchProps) {
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const statusOptions = [
    { value: 'all', label: 'Tous les statuts', count: totalResults },
    { value: 'active', label: 'Actif', count: 0 },
    { value: 'suspended', label: 'Suspendu', count: 0 },
    { value: 'graduated', label: 'Diplômé', count: 0 },
    { value: 'dropped', label: 'Abandonné', count: 0 }
  ];

  const programOptions = [
    { value: 'all', label: 'Tous les programmes' },
    { value: 'informatique', label: 'Informatique' },
    { value: 'gestion', label: 'Gestion' },
    { value: 'commerce', label: 'Commerce' }
  ];

  const clearFilters = () => {
    onSearchChange('');
    onStatusChange('all');
    onProgramChange?.('all');
    setActiveFilters([]);
  };

  const hasActiveFilters = searchTerm || selectedStatus !== 'all' || (selectedProgram && selectedProgram !== 'all');

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher par nom, email ou numéro étudiant..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 pr-10 h-12"
        />
        {searchTerm && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
            onClick={() => onSearchChange('')}
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Filters Row */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Status Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="h-9">
              <Filter className="w-4 h-4 mr-2" />
              Statut
              <ChevronDown className="w-4 h-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            <DropdownMenuLabel>Filtrer par statut</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {statusOptions.map((option) => (
              <DropdownMenuItem
                key={option.value}
                onClick={() => onStatusChange(option.value)}
                className={selectedStatus === option.value ? 'bg-muted' : ''}
              >
                <div className="flex items-center justify-between w-full">
                  <span>{option.label}</span>
                  <Badge variant="secondary" className="ml-2">
                    {option.count}
                  </Badge>
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Program Filter */}
        {onProgramChange && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-9">
                Programme
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              <DropdownMenuLabel>Filtrer par programme</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {programOptions.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => onProgramChange(option.value)}
                  className={selectedProgram === option.value ? 'bg-muted' : ''}
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4 mr-2" />
            Effacer filtres
          </Button>
        )}

        {/* Results Count */}
        <div className="text-sm text-muted-foreground ml-auto">
          {totalResults} résultat(s)
        </div>
      </div>

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-muted-foreground">Filtres actifs:</span>
          
          {searchTerm && (
            <Badge variant="secondary" className="gap-1">
              Recherche: "{searchTerm}"
              <X 
                className="w-3 h-3 cursor-pointer" 
                onClick={() => onSearchChange('')}
              />
            </Badge>
          )}
          
          {selectedStatus !== 'all' && (
            <Badge variant="secondary" className="gap-1">
              Statut: {statusOptions.find(s => s.value === selectedStatus)?.label}
              <X 
                className="w-3 h-3 cursor-pointer" 
                onClick={() => onStatusChange('all')}
              />
            </Badge>
          )}
          
          {selectedProgram && selectedProgram !== 'all' && (
            <Badge variant="secondary" className="gap-1">
              Programme: {programOptions.find(p => p.value === selectedProgram)?.label}
              <X 
                className="w-3 h-3 cursor-pointer" 
                onClick={() => onProgramChange?.('all')}
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}