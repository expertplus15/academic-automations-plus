
import React from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart3, Download } from 'lucide-react';

interface AnalyticsHeaderProps {
  selectedPeriod: string;
  selectedProgram: string;
  onPeriodChange: (value: string) => void;
  onProgramChange: (value: string) => void;
}

export function AnalyticsHeader({ 
  selectedPeriod, 
  selectedProgram, 
  onPeriodChange, 
  onProgramChange 
}: AnalyticsHeaderProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Analytics des Emplois du Temps
          </CardTitle>
          <div className="flex items-center gap-4">
            <Select value={selectedPeriod} onValueChange={onPeriodChange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Semaine</SelectItem>
                <SelectItem value="month">Mois</SelectItem>
                <SelectItem value="semester">Semestre</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedProgram} onValueChange={onProgramChange}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les programmes</SelectItem>
                <SelectItem value="info">Informatique</SelectItem>
                <SelectItem value="math">Mathématiques</SelectItem>
                <SelectItem value="physics">Physique</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Rapport
            </Button>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}
