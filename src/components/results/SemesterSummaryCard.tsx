import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SemesterCalculation } from '@/hooks/useGradeCalculations';
import { BookOpen, Calculator } from 'lucide-react';

interface SemesterSummaryCardProps {
  semesterData: SemesterCalculation;
  title: string;
}

export function SemesterSummaryCard({ semesterData, title }: SemesterSummaryCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="w-5 h-5" />
          {title}
          <Badge variant="secondary" className="ml-auto">
            Moyenne: {semesterData.semester_average.toFixed(2)}/20
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2 font-medium">Cours</th>
                <th className="text-center p-2 font-medium w-20">CC</th>
                <th className="text-center p-2 font-medium w-20">Examen</th>
                <th className="text-center p-2 font-medium w-24">Moyenne</th>
                <th className="text-center p-2 font-medium w-20">Coeff</th>
                <th className="text-center p-2 font-medium w-20">Total</th>
                <th className="text-center p-2 font-medium w-24">Nature</th>
              </tr>
            </thead>
            
            <tbody>
              {semesterData.courses.map((course, index) => (
                <tr key={course.subject_id} className={index % 2 === 0 ? 'bg-muted/20' : ''}>
                  <td className="p-2 font-medium">{course.subject_name}</td>
                  <td className="p-2 text-center">{course.cc_grade.toFixed(2)}</td>
                  <td className="p-2 text-center">{course.exam_grade.toFixed(2)}</td>
                  <td className="p-2 text-center font-semibold">
                    {course.weighted_average.toFixed(2)}
                  </td>
                  <td className="p-2 text-center">{course.coefficient}</td>
                  <td className="p-2 text-center font-bold">
                    {course.total.toFixed(2)}
                  </td>
                  <td className="p-2 text-center">
                    <Badge 
                      variant={course.nature === 'fondamentale' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {course.nature === 'fondamentale' ? 'Fond.' : 'Comp.'}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
            
            <tfoot>
              <tr className="border-t-2 bg-primary/5">
                <td className="p-2 font-bold">Total Semestre</td>
                <td className="p-2"></td>
                <td className="p-2"></td>
                <td className="p-2"></td>
                <td className="p-2 text-center font-bold">
                  {semesterData.total_coefficients}
                </td>
                <td className="p-2 text-center font-bold">
                  {semesterData.total_points.toFixed(2)}
                </td>
                <td className="p-2 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Calculator className="w-3 h-3" />
                    <span className="font-bold text-primary">
                      {semesterData.semester_average.toFixed(2)}
                    </span>
                  </div>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
        
        <div className="mt-4 p-3 bg-muted/30 rounded-lg">
          <p className="text-sm text-muted-foreground">
            <strong>Formule de calcul:</strong> Moyenne = ((CC × 0,4) + (Examen × 0,6)) / 2 | 
            Total = Moyenne × Coefficient | 
            Moyenne Semestre = ∑(Total) / ∑(Coefficient)
          </p>
        </div>
      </CardContent>
    </Card>
  );
}