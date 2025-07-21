import React from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  FileSpreadsheet, 
  Upload, 
  Download, 
  Settings, 
  RefreshCw,
  Filter
} from "lucide-react";

interface ResultsQuickActionsProps {
  onImport?: () => void;
  onExport?: () => void;
  onRefresh?: () => void;
  onSettings?: () => void;
  onFilter?: () => void;
  isLoading?: boolean;
  pendingActions?: number;
}

export function ResultsQuickActions({
  onImport,
  onExport,
  onRefresh,
  onSettings,
  onFilter,
  isLoading = false,
  pendingActions = 0
}: ResultsQuickActionsProps) {
  return (
    <Card className="p-4 bg-gradient-to-r from-background to-muted/20 border-primary/10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
              <FileSpreadsheet className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h3 className="font-medium text-foreground">Actions Rapides</h3>
              <p className="text-xs text-muted-foreground">Outils de gestion des notes</p>
            </div>
          </div>
          
          {pendingActions > 0 && (
            <Badge variant="secondary" className="animate-pulse">
              {pendingActions} action{pendingActions > 1 ? 's' : ''} en attente
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-2">
          {onFilter && (
            <Button
              size="sm"
              variant="outline"
              onClick={onFilter}
              className="hover-scale"
            >
              <Filter className="w-4 h-4 mr-1" />
              Filtres
            </Button>
          )}
          
          {onImport && (
            <Button
              size="sm"
              variant="outline"
              onClick={onImport}
              disabled={isLoading}
              className="hover-scale"
            >
              <Upload className="w-4 h-4 mr-1" />
              Import
            </Button>
          )}

          {onExport && (
            <Button
              size="sm"
              variant="outline"
              onClick={onExport}
              disabled={isLoading}
              className="hover-scale"
            >
              <Download className="w-4 h-4 mr-1" />
              Export
            </Button>
          )}

          {onRefresh && (
            <Button
              size="sm"
              variant="outline"
              onClick={onRefresh}
              disabled={isLoading}
              className="hover-scale"
            >
              <RefreshCw className={`w-4 h-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
              Actualiser
            </Button>
          )}

          {onSettings && (
            <Button
              size="sm"
              variant="ghost"
              onClick={onSettings}
              className="hover-scale"
            >
              <Settings className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}