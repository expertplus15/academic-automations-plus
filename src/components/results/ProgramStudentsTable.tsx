
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users } from 'lucide-react';
import { formatStudentName } from '@/utils/formatStudentName';

interface StudentData {
  id: string;
  profile?: { 
    full_name?: string;
    first_name?: string;
    last_name?: string;
  };
  student_number: string;
  semester1Average: number;
  semester2Average: number;
  generalAverage: number;
  mention: string;
  decision: string;
}

interface ProgramStudentsTableProps {
  students: StudentData[];
  onSelectStudent: (studentId: string) => void;
}

export function ProgramStudentsTable({ students, onSelectStudent }: ProgramStudentsTableProps) {
  if (students.length === 0) {
    return (
      <div className="text-center py-8">
        <Users className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground">Aucun étudiant trouvé dans ce programme</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left p-3 font-medium">Étudiant</th>
            <th className="text-center p-3 font-medium">N° Étudiant</th>
            <th className="text-center p-3 font-medium">Semestre 1</th>
            <th className="text-center p-3 font-medium">Semestre 2</th>
            <th className="text-center p-3 font-medium">Moyenne Générale</th>
            <th className="text-center p-3 font-medium">Mention</th>
            <th className="text-center p-3 font-medium">Décision</th>
            <th className="text-center p-3 font-medium">Actions</th>
          </tr>
        </thead>
        
        <tbody>
          {students.map((student, index) => (
            <tr key={student.id} className={index % 2 === 0 ? 'bg-muted/20' : ''}>
              <td className="p-3 font-medium">
                {formatStudentName(student.profile)}
              </td>
              <td className="p-3 text-center">{student.student_number}</td>
              <td className="p-3 text-center font-semibold">
                {student.semester1Average.toFixed(2)}/20
              </td>
              <td className="p-3 text-center font-semibold">
                {student.semester2Average.toFixed(2)}/20
              </td>
              <td className="p-3 text-center font-bold text-primary">
                {student.generalAverage.toFixed(2)}/20
              </td>
              <td className="p-3 text-center">
                <Badge variant={student.generalAverage >= 10 ? "default" : "destructive"}>
                  {student.mention}
                </Badge>
              </td>
              <td className="p-3 text-center">
                <Badge variant={student.generalAverage >= 10 ? "default" : "destructive"}>
                  {student.decision}
                </Badge>
              </td>
              <td className="p-3 text-center">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => onSelectStudent(student.id)}
                >
                  Voir détails
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
