import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calculator } from 'lucide-react';
import { SemesterCalculation } from '@/hooks/useGradeCalculations';

interface StudentDetailsCardsProps {
  generalAverage: number;
  semester1Data: SemesterCalculation | null;
  semester2Data: SemesterCalculation | null;
  getMention: (average: number) => string;
  getDecision: (average: number) => string;
}

export function StudentDetailsCards({ 
  generalAverage, 
  semester1Data, 
  semester2Data, 
  getMention, 
  getDecision 
}: StudentDetailsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card className="relative overflow-hidden">
        <div className="absolute top-0 right-0 w-20 h-20 bg-primary/10 rounded-full -translate-y-10 translate-x-10"></div>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Calculator className="w-4 h-4" />
            Moyenne Générale
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-primary">
            {generalAverage.toFixed(2)}/20
          </div>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant={generalAverage >= 10 ? "default" : "destructive"}>
              {getMention(generalAverage)}
            </Badge>
            <Badge variant={generalAverage >= 10 ? "default" : "destructive"}>
              {getDecision(generalAverage)}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card className="relative overflow-hidden">
        <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/10 rounded-full -translate-y-10 translate-x-10"></div>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Semestre 1
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">
            {semester1Data ? `${semester1Data.semester_average.toFixed(2)}/20` : '--'}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {semester1Data ? `${semester1Data.courses.length} cours` : 'Aucune donnée'}
          </p>
        </CardContent>
      </Card>

      <Card className="relative overflow-hidden">
        <div className="absolute top-0 right-0 w-20 h-20 bg-green-500/10 rounded-full -translate-y-10 translate-x-10"></div>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Semestre 2
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            {semester2Data ? `${semester2Data.semester_average.toFixed(2)}/20` : '--'}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {semester2Data ? `${semester2Data.courses.length} cours` : 'Aucune donnée'}
          </p>
        </CardContent>
      </Card>

      <Card className="relative overflow-hidden">
        <div className="absolute top-0 right-0 w-20 h-20 bg-amber-500/10 rounded-full -translate-y-10 translate-x-10"></div>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Coefficients Totaux
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-amber-600">
            {(semester1Data?.total_coefficients || 0) + (semester2Data?.total_coefficients || 0)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            S1: {semester1Data?.total_coefficients || 0} | S2: {semester2Data?.total_coefficients || 0}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}