import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SemesterCalculation } from '@/hooks/useGradeCalculations';

interface StudentProgressChartsProps {
  semester1Data: SemesterCalculation | null;
  semester2Data: SemesterCalculation | null;
  generalAverage: number;
}

export function StudentProgressCharts({ 
  semester1Data, 
  semester2Data, 
  generalAverage 
}: StudentProgressChartsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Progression Semestrielle</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Semestre 1</span>
                <span className="font-semibold">{semester1Data?.semester_average.toFixed(2) || 0}/20</span>
              </div>
              <div className="w-full bg-muted rounded-full h-3">
                <div 
                  className="bg-blue-500 h-3 rounded-full transition-all duration-300" 
                  style={{ width: `${((semester1Data?.semester_average || 0) / 20) * 100}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Semestre 2</span>
                <span className="font-semibold">{semester2Data?.semester_average.toFixed(2) || 0}/20</span>
              </div>
              <div className="w-full bg-muted rounded-full h-3">
                <div 
                  className="bg-green-500 h-3 rounded-full transition-all duration-300" 
                  style={{ width: `${((semester2Data?.semester_average || 0) / 20) * 100}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Moyenne Générale</span>
                <span className="font-semibold">{generalAverage.toFixed(2)}/20</span>
              </div>
              <div className="w-full bg-muted rounded-full h-3">
                <div 
                  className="bg-primary h-3 rounded-full transition-all duration-300" 
                  style={{ width: `${(generalAverage / 20) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Répartition des Cours</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">Semestre 1</span>
              <div className="flex gap-2">
                <Badge variant="outline">
                  {semester1Data?.courses.filter(c => c.nature === 'fondamentale').length || 0} Fond.
                </Badge>
                <Badge variant="secondary">
                  {semester1Data?.courses.filter(c => c.nature === 'complementaire').length || 0} Comp.
                </Badge>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Semestre 2</span>
              <div className="flex gap-2">
                <Badge variant="outline">
                  {semester2Data?.courses.filter(c => c.nature === 'fondamentale').length || 0} Fond.
                </Badge>
                <Badge variant="secondary">
                  {semester2Data?.courses.filter(c => c.nature === 'complementaire').length || 0} Comp.
                </Badge>
              </div>
            </div>
            <div className="pt-3 border-t">
              <div className="flex justify-between items-center font-semibold">
                <span>Total des cours</span>
                <span className="text-primary">
                  {(semester1Data?.courses.length || 0) + (semester2Data?.courses.length || 0)}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}