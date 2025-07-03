import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SemesterCalculation } from '@/hooks/useGradeCalculations';
import { useStudents } from '@/hooks/useStudents';
import { usePrograms } from '@/hooks/usePrograms';
import { useAcademicYears } from '@/hooks/useAcademicYears';
import { Download, FileText, Printer } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TranscriptPreviewProps {
  studentId: string;
  semester1Data: SemesterCalculation | null;
  semester2Data: SemesterCalculation | null;
  generalAverage: number;
}

export function TranscriptPreview({ 
  studentId, 
  semester1Data, 
  semester2Data, 
  generalAverage 
}: TranscriptPreviewProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  const { students } = useStudents();
  const { programs } = usePrograms();
  const { currentYear } = useAcademicYears();

  const student = students.find(s => s.id === studentId);
  const program = programs.find(p => p.name === student?.program?.name);

  const getMention = (average: number): string => {
    if (average >= 16) return "Très Bien";
    if (average >= 14) return "Bien";
    if (average >= 12) return "Assez Bien";
    if (average >= 10) return "Passable";
    return "Insuffisant";
  };

  const getDecision = (average: number): string => {
    return average >= 10 ? "Admis" : "Ajourné";
  };

  const handleExportPDF = async () => {
    setIsGenerating(true);
    try {
      // TODO: Implement PDF generation
      toast({
        title: "Export PDF",
        description: "Fonctionnalité à implémenter - génération PDF du relevé",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors de l'export PDF",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (!student || !currentYear) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <FileText className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">Données manquantes</h3>
          <p className="text-muted-foreground">
            Impossible de générer le relevé sans les données de l'étudiant.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Export Actions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Relevé de Notes - Aperçu
            </CardTitle>
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={handlePrint}>
                <Printer className="w-4 h-4 mr-2" />
                Imprimer
              </Button>
              <Button onClick={handleExportPDF} disabled={isGenerating}>
                <Download className="w-4 h-4 mr-2" />
                {isGenerating ? 'Génération...' : 'Export PDF'}
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Transcript Preview */}
      <div className="bg-white text-black p-8 rounded-lg border-2 print:shadow-none print:border-none">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-2xl font-bold text-primary">
              École de Management
            </h1>
            <p className="text-sm text-gray-600 mt-1">EMD</p>
          </div>
          
          <div className="text-right text-sm">
            <p><strong>Année académique:</strong> {currentYear.name}</p>
            <p><strong>Filière:</strong> {program?.name}</p>
            <p><strong>Date d'émission:</strong> {new Date().toLocaleDateString('fr-FR')}</p>
          </div>
        </div>

        {/* Student Info */}
        <div className="mb-8 p-4 bg-gray-50 rounded">
          <h2 className="text-lg font-semibold mb-3">Informations Étudiant</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p><strong>Nom et Prénom:</strong> {student.profile?.full_name || 'Nom non renseigné'}</p>
              <p><strong>Numéro d'étudiant:</strong> {student.student_number}</p>
            </div>
            <div>
              <p><strong>Date de naissance:</strong> Non renseignée</p>
              <p><strong>Lieu de naissance:</strong> Non renseigné</p>
            </div>
          </div>
        </div>

        {/* Semester 1 */}
        {semester1Data && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-3 text-primary">Semestre 1</h3>
            <table className="w-full border-collapse border border-gray-300 text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 p-2 text-left">Intitulé du cours</th>
                  <th className="border border-gray-300 p-2 text-center">CC</th>
                  <th className="border border-gray-300 p-2 text-center">Examen</th>
                  <th className="border border-gray-300 p-2 text-center">Moyenne</th>
                  <th className="border border-gray-300 p-2 text-center">Coefficient</th>
                  <th className="border border-gray-300 p-2 text-center">Total</th>
                  <th className="border border-gray-300 p-2 text-center">Nature</th>
                </tr>
              </thead>
              <tbody>
                {semester1Data.courses.map((course) => (
                  <tr key={course.subject_id}>
                    <td className="border border-gray-300 p-2">{course.subject_name}</td>
                    <td className="border border-gray-300 p-2 text-center">{course.cc_grade.toFixed(2)}</td>
                    <td className="border border-gray-300 p-2 text-center">{course.exam_grade.toFixed(2)}</td>
                    <td className="border border-gray-300 p-2 text-center font-semibold">
                      {course.weighted_average.toFixed(2)}
                    </td>
                    <td className="border border-gray-300 p-2 text-center">{course.coefficient}</td>
                    <td className="border border-gray-300 p-2 text-center font-bold">
                      {course.total.toFixed(2)}
                    </td>
                    <td className="border border-gray-300 p-2 text-center">
                      {course.nature === 'fondamentale' ? 'Fond.' : 'Comp.'}
                    </td>
                  </tr>
                ))}
                <tr className="bg-gray-100 font-bold">
                  <td className="border border-gray-300 p-2">Moyenne Semestre 1</td>
                  <td className="border border-gray-300 p-2"></td>
                  <td className="border border-gray-300 p-2"></td>
                  <td className="border border-gray-300 p-2"></td>
                  <td className="border border-gray-300 p-2 text-center">{semester1Data.total_coefficients}</td>
                  <td className="border border-gray-300 p-2 text-center">{semester1Data.total_points.toFixed(2)}</td>
                  <td className="border border-gray-300 p-2 text-center text-primary">
                    {semester1Data.semester_average.toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* Semester 2 */}
        {semester2Data && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-3 text-primary">Semestre 2</h3>
            <table className="w-full border-collapse border border-gray-300 text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 p-2 text-left">Intitulé du cours</th>
                  <th className="border border-gray-300 p-2 text-center">CC</th>
                  <th className="border border-gray-300 p-2 text-center">Examen</th>
                  <th className="border border-gray-300 p-2 text-center">Moyenne</th>
                  <th className="border border-gray-300 p-2 text-center">Coefficient</th>
                  <th className="border border-gray-300 p-2 text-center">Total</th>
                  <th className="border border-gray-300 p-2 text-center">Nature</th>
                </tr>
              </thead>
              <tbody>
                {semester2Data.courses.map((course) => (
                  <tr key={course.subject_id}>
                    <td className="border border-gray-300 p-2">{course.subject_name}</td>
                    <td className="border border-gray-300 p-2 text-center">{course.cc_grade.toFixed(2)}</td>
                    <td className="border border-gray-300 p-2 text-center">{course.exam_grade.toFixed(2)}</td>
                    <td className="border border-gray-300 p-2 text-center font-semibold">
                      {course.weighted_average.toFixed(2)}
                    </td>
                    <td className="border border-gray-300 p-2 text-center">{course.coefficient}</td>
                    <td className="border border-gray-300 p-2 text-center font-bold">
                      {course.total.toFixed(2)}
                    </td>
                    <td className="border border-gray-300 p-2 text-center">
                      {course.nature === 'fondamentale' ? 'Fond.' : 'Comp.'}
                    </td>
                  </tr>
                ))}
                <tr className="bg-gray-100 font-bold">
                  <td className="border border-gray-300 p-2">Moyenne Semestre 2</td>
                  <td className="border border-gray-300 p-2"></td>
                  <td className="border border-gray-300 p-2"></td>
                  <td className="border border-gray-300 p-2"></td>
                  <td className="border border-gray-300 p-2 text-center">{semester2Data.total_coefficients}</td>
                  <td className="border border-gray-300 p-2 text-center">{semester2Data.total_points.toFixed(2)}</td>
                  <td className="border border-gray-300 p-2 text-center text-primary">
                    {semester2Data.semester_average.toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* Final Summary */}
        <div className="mt-8 p-4 bg-primary/10 rounded border-2 border-primary">
          <h3 className="text-lg font-semibold mb-4 text-primary">Synthèse Générale</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-sm text-gray-600">Moyenne Générale</p>
              <p className="text-2xl font-bold text-primary">{generalAverage.toFixed(2)}/20</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Mention</p>
              <p className="text-lg font-semibold">{getMention(generalAverage)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Décision du Jury</p>
              <p className={`text-lg font-bold ${generalAverage >= 10 ? 'text-green-600' : 'text-red-600'}`}>
                {getDecision(generalAverage)}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-sm">
          <p>Le Directeur Général</p>
          <div className="mt-8 border-t border-gray-300 pt-2">
            <p className="text-xs text-gray-500">
              École de Management - {new Date().toLocaleDateString('fr-FR')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}