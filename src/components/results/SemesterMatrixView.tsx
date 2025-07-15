import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar } from 'lucide-react';

interface SemesterMatrixViewProps {
  selectedProgram: string;
  selectedGroup: string;
  selectedSemester: number;
}

export function SemesterMatrixView({ selectedProgram, selectedGroup, selectedSemester }: SemesterMatrixViewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Vue Semestre - Toutes les matières
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8 text-muted-foreground">
          <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium">Vue Semestre</p>
          <p>Fonctionnalité en cours de développement</p>
          <Badge variant="outline" className="mt-2">
            Semestre {selectedSemester}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}