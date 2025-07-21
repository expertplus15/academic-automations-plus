import React from 'react';
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, BarChart3 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAcademicYearContext } from '@/contexts/AcademicYearContext';

interface ResultsPageHeaderProps {
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export function ResultsPageHeader({ title, subtitle, actions }: ResultsPageHeaderProps) {
  const navigate = useNavigate();
  const { selectedAcademicYear, setSelectedAcademicYear, academicYears, loading } = useAcademicYearContext();

  const getStatusBadge = (status: string) => {
    const variants = {
      current: "bg-success/10 text-success border-success/20",
      planning: "bg-primary/10 text-primary border-primary/20", 
      archived: "bg-muted text-muted-foreground border-border",
      closed: "bg-destructive/10 text-destructive border-destructive/20"
    };

    const labels = {
      current: "En cours",
      planning: "Planification",
      archived: "Archivée",
      closed: "Fermée"
    };

    return (
      <Badge className={variants[status as keyof typeof variants] || variants.planning}>
        {labels[status as keyof typeof labels] || status}
      </Badge>
    );
  };

  return (
    <div className="bg-card border-b border-border/20">
      {/* Navigation Bar */}
      <div className="flex items-center h-12 px-4 border-b border-border/10">
        <SidebarTrigger />
        <div className="flex items-center gap-2 ml-4">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate("/dashboard")}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Dashboard
          </Button>
          <span className="text-muted-foreground">/</span>
          <div className="flex items-center gap-2 text-sm font-medium">
            <BarChart3 className="w-4 h-4 text-primary" />
            Évaluations & Résultats
          </div>
        </div>
      </div>

      {/* Header Content */}
      <div className="px-8 py-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            {title && (
              <h1 className="text-2xl font-bold text-foreground tracking-tight">{title}</h1>
            )}
            {subtitle && (
              <p className="text-muted-foreground max-w-2xl">{subtitle}</p>
            )}
          </div>

          <div className="flex items-center gap-4">
            {/* Academic Year Selector */}
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-sm font-medium text-foreground">Année Académique</div>
                <div className="text-xs text-muted-foreground">Contexte actuel</div>
              </div>
              <div className="flex items-center gap-2">
                <Select 
                  value={selectedAcademicYear?.id || ''} 
                  onValueChange={(value) => {
                    const year = academicYears.find(y => y.id === value);
                    if (year) setSelectedAcademicYear(year);
                  }}
                  disabled={loading}
                >
                  <SelectTrigger className="w-[220px] bg-background">
                    <SelectValue placeholder="Sélectionner une année" />
                  </SelectTrigger>
                  <SelectContent>
                    {academicYears.map((year) => (
                      <SelectItem key={year.id} value={year.id}>
                        <div className="flex items-center justify-between w-full">
                          <span>{year.name}</span>
                          <Badge variant="outline" className="ml-2 text-xs">
                            {year.status}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedAcademicYear && getStatusBadge(selectedAcademicYear.status)}
              </div>
            </div>

            {/* Actions */}
            {actions && (
              <div className="flex items-center gap-2 border-l border-border/20 pl-4">
                {actions}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}