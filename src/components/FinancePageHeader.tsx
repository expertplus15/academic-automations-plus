import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DollarSign, 
  Plus, 
  FileText, 
  Download,
  Filter,
  Calendar
} from 'lucide-react';

interface FinancePageHeaderProps {
  title: string;
  subtitle?: string;
  showCreateButton?: boolean;
  createButtonText?: string;
  onCreateClick?: () => void;
  showExportButton?: boolean;
  onExportClick?: () => void;
  stats?: {
    label: string;
    value: string;
    change?: string;
    changeType?: 'positive' | 'negative' | 'neutral';
  }[];
}

export function FinancePageHeader({
  title,
  subtitle,
  showCreateButton = false,
  createButtonText = "Créer",
  onCreateClick,
  showExportButton = false,
  onExportClick,
  stats = []
}: FinancePageHeaderProps) {
  return (
    <div className="space-y-6">
      {/* Header principal */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-[rgb(245,158,11)] rounded-2xl">
            <DollarSign className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{title}</h1>
            {subtitle && (
              <p className="text-muted-foreground text-lg">{subtitle}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {showExportButton && (
            <Button
              variant="outline"
              onClick={onExportClick}
              className="gap-2"
            >
              <Download className="w-4 h-4" />
              Exporter
            </Button>
          )}
          
          <Button
            variant="outline"
            className="gap-2"
          >
            <Filter className="w-4 h-4" />
            Filtres
          </Button>

          <Button
            variant="outline"
            className="gap-2"
          >
            <Calendar className="w-4 h-4" />
            Période
          </Button>

          {showCreateButton && (
            <Button
              onClick={onCreateClick}
              className="bg-[rgb(245,158,11)] hover:bg-[rgb(245,158,11)]/90 text-white gap-2"
            >
              <Plus className="w-4 h-4" />
              {createButtonText}
            </Button>
          )}
        </div>
      </div>

      {/* Statistiques */}
      {stats.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 shadow-sm border border-border/50"
            >
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground font-medium">
                  {stat.label}
                </p>
                <div className="flex items-center justify-between">
                  <p className="text-2xl font-bold text-foreground">
                    {stat.value}
                  </p>
                  {stat.change && (
                    <Badge
                      className={`
                        ${stat.changeType === 'positive' ? 'bg-green-100 text-green-700 border-green-200' : ''}
                        ${stat.changeType === 'negative' ? 'bg-red-100 text-red-700 border-red-200' : ''}
                        ${stat.changeType === 'neutral' ? 'bg-gray-100 text-gray-700 border-gray-200' : ''}
                      `}
                    >
                      {stat.change}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}