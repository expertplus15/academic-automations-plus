import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useTreasuryPeriod } from '@/hooks/finance/useTreasuryPeriod';
import { 
  Plus, 
  Download, 
  Filter, 
  Calendar,
  FileText,
  TableIcon
} from 'lucide-react';

interface TreasuryActionHeaderProps {
  title: string;
  onNewAction?: () => void;
  newActionText?: string;
  onExport?: (format: string) => void;
  filters?: React.ReactNode;
  showPeriodSelector?: boolean;
}

export function TreasuryActionHeader({ 
  title, 
  onNewAction, 
  newActionText = "Nouveau", 
  onExport,
  filters,
  showPeriodSelector = true 
}: TreasuryActionHeaderProps) {
  const { selectedPeriod, setSelectedPeriod, getPeriodLabel } = useTreasuryPeriod();
  const [showFilters, setShowFilters] = useState(false);

  const handleExport = (format: string) => {
    if (onExport) {
      onExport(format);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header principal */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold">{title}</h2>
          {showPeriodSelector && (
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <Select value={selectedPeriod} onValueChange={(value) => setSelectedPeriod(value as any)}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Aujourd'hui</SelectItem>
                  <SelectItem value="yesterday">Hier</SelectItem>
                  <SelectItem value="week">Cette semaine</SelectItem>
                  <SelectItem value="month">Ce mois</SelectItem>
                  <SelectItem value="quarter">Ce trimestre</SelectItem>
                  <SelectItem value="year">Cette année</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Bouton Filtres */}
          {filters && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Filtres
            </Button>
          )}

          {/* Bouton Export */}
          {onExport && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handleExport('excel')}>
                  <TableIcon className="w-4 h-4 mr-2" />
                  Export Excel
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('pdf')}>
                  <FileText className="w-4 h-4 mr-2" />
                  Export PDF
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Bouton Nouvelle Action */}
          {onNewAction && (
            <Button onClick={onNewAction} className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              {newActionText}
            </Button>
          )}
        </div>
      </div>

      {/* Période sélectionnée */}
      {showPeriodSelector && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Période:</span>
          <span className="font-medium">{getPeriodLabel(selectedPeriod)}</span>
        </div>
      )}

      {/* Filtres extensibles */}
      {showFilters && filters && (
        <div className="p-4 bg-accent/30 rounded-lg border">
          {filters}
        </div>
      )}
    </div>
  );
}