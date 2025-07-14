import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FileDown, Eye, Printer, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { usePrograms } from '@/hooks/usePrograms';
import { useStudents } from '@/hooks/useStudents';
import { useAcademicYears } from '@/hooks/useAcademicYears';
import { useDocumentTemplates } from '@/hooks/useDocumentTemplates';
import { DatabaseDocumentService } from '@/services/DatabaseDocumentService';

interface DocumentGenerationForm {
  documentType: string;
  programId: string;
  studentId: string;
  academicYearId: string;
}

const documentTypes = [
  { value: 'bulletins', label: 'Bulletins de Notes' },
  { value: 'releves', label: 'Relevés de Notes' },
  { value: 'attestations', label: 'Attestations' },
  { value: 'divers', label: 'Divers' }
];

export function DatabaseDocumentGenerator() {
  const [form, setForm] = useState<DocumentGenerationForm>({
    documentType: '',
    programId: '',
    studentId: '',
    academicYearId: ''
  });
  
  const [studentSearch, setStudentSearch] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [generatedHtml, setGeneratedHtml] = useState('');
  
  const { toast } = useToast();
  const { programs, loading: programsLoading } = usePrograms();
  const { students, loading: studentsLoading } = useStudents();
  const { academicYears, currentYear, loading: yearsLoading } = useAcademicYears();
  const { templates, loading: templatesLoading } = useDocumentTemplates();

  // Filter students based on search and selected program
  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      const matchesSearch = student.profile.full_name.toLowerCase().includes(studentSearch.toLowerCase()) ||
                          student.student_number.toLowerCase().includes(studentSearch.toLowerCase());
      const matchesProgram = !form.programId || form.programId === 'all' || student.program_id === form.programId;
      return matchesSearch && matchesProgram;
    });
  }, [students, studentSearch, form.programId]);

  // Get selected student details
  const selectedStudent = students.find(s => s.id === form.studentId);
  const selectedProgram = programs.find(p => p.id === form.programId);
  const selectedYear = academicYears.find(y => y.id === form.academicYearId);

  // Auto-select current academic year if available
  React.useEffect(() => {
    if (currentYear && !form.academicYearId) {
      setForm(prev => ({ ...prev, academicYearId: currentYear.id }));
    }
  }, [currentYear, form.academicYearId]);

  const handleFormChange = (field: keyof DocumentGenerationForm, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleStudentSelect = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    if (student) {
      setForm(prev => ({ 
        ...prev, 
        studentId,
        programId: student.program_id // Auto-select student's program
      }));
      setStudentSearch(student.profile.full_name);
    }
  };

  const isFormValid = form.documentType && form.studentId && form.academicYearId;

  const handlePreview = async () => {
    if (!isFormValid) {
      toast({
        title: "Formulaire incomplet",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsGenerating(true);
      const html = await DatabaseDocumentService.generateHTML({
        documentType: form.documentType,
        student: selectedStudent!,
        program: selectedProgram!,
        academicYear: selectedYear!
      });
      
      setGeneratedHtml(html);
      setPreviewMode(true);
    } catch (error) {
      console.error('Erreur génération aperçu:', error);
      toast({
        title: "Erreur",
        description: "Impossible de générer l'aperçu du document",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrint = async () => {
    if (!isFormValid) return;

    try {
      setIsGenerating(true);
      await DatabaseDocumentService.printDocument({
        documentType: form.documentType,
        student: selectedStudent!,
        program: selectedProgram!,
        academicYear: selectedYear!
      });
    } catch (error) {
      console.error('Erreur impression:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'imprimer le document",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!isFormValid) return;

    try {
      setIsGenerating(true);
      const blob = await DatabaseDocumentService.generatePDF({
        documentType: form.documentType,
        student: selectedStudent!,
        program: selectedProgram!,
        academicYear: selectedYear!
      });
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${form.documentType}_${selectedStudent?.student_number}_${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Succès",
        description: "Document PDF téléchargé avec succès",
      });
    } catch (error) {
      console.error('Erreur téléchargement PDF:', error);
      toast({
        title: "Erreur",
        description: "Impossible de télécharger le PDF",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  if (previewMode && generatedHtml) {
    return (
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Aperçu du Document</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setPreviewMode(false)}>
                Retour
              </Button>
              <Button onClick={handlePrint} disabled={isGenerating}>
                <Printer className="w-4 h-4 mr-2" />
                Imprimer
              </Button>
              <Button onClick={handleDownloadPDF} disabled={isGenerating}>
                <FileDown className="w-4 h-4 mr-2" />
                PDF
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div 
            className="border rounded p-4 bg-white text-black min-h-[600px]"
            dangerouslySetInnerHTML={{ __html: generatedHtml }}
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Générateur de Documents</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Type de Document */}
        <div className="space-y-2">
          <Label htmlFor="documentType">Type de Document *</Label>
          <Select value={form.documentType} onValueChange={(value) => handleFormChange('documentType', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner le type de document" />
            </SelectTrigger>
            <SelectContent>
              {documentTypes.map(type => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Programme */}
        <div className="space-y-2">
          <Label htmlFor="program">Programme</Label>
          <Select 
            value={form.programId} 
            onValueChange={(value) => handleFormChange('programId', value)}
            disabled={programsLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder={programsLoading ? "Chargement..." : "Sélectionner un programme (optionnel)"} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les programmes</SelectItem>
              {programs.map(program => (
                <SelectItem key={program.id} value={program.id}>
                  {program.name} ({program.code})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Étudiant */}
        <div className="space-y-2">
          <Label htmlFor="student">Étudiant *</Label>
          <div className="space-y-2">
            <Input
              placeholder="Rechercher par nom ou numéro étudiant..."
              value={studentSearch}
              onChange={(e) => setStudentSearch(e.target.value)}
              disabled={studentsLoading}
            />
            {studentSearch && (
              <div className="max-h-40 overflow-y-auto border rounded">
                {filteredStudents.length > 0 ? (
                  filteredStudents.slice(0, 10).map(student => (
                    <div
                      key={student.id}
                      className="p-2 hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
                      onClick={() => handleStudentSelect(student.id)}
                    >
                      <div className="font-medium">{student.profile.full_name}</div>
                      <div className="text-sm text-gray-500">
                        {student.student_number} - {student.program.name}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-2 text-gray-500">Aucun étudiant trouvé</div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Année Académique */}
        <div className="space-y-2">
          <Label htmlFor="academicYear">Année Académique *</Label>
          <Select 
            value={form.academicYearId} 
            onValueChange={(value) => handleFormChange('academicYearId', value)}
            disabled={yearsLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder={yearsLoading ? "Chargement..." : "Sélectionner l'année académique"} />
            </SelectTrigger>
            <SelectContent>
              {academicYears.map(year => (
                <SelectItem key={year.id} value={year.id}>
                  {year.name} {year.is_current && "(Actuelle)"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Résumé de la sélection */}
        {selectedStudent && (
          <div className="bg-blue-50 p-4 rounded border">
            <h4 className="font-medium mb-2">Document sélectionné :</h4>
            <div className="space-y-1 text-sm">
              <div><strong>Type :</strong> {documentTypes.find(t => t.value === form.documentType)?.label || 'Non sélectionné'}</div>
              <div><strong>Étudiant :</strong> {selectedStudent.profile.full_name} ({selectedStudent.student_number})</div>
              <div><strong>Programme :</strong> {selectedStudent.program.name}</div>
              <div><strong>Année :</strong> {selectedYear?.name || 'Non sélectionnée'}</div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-4">
          <Button 
            onClick={handlePreview} 
            disabled={!isFormValid || isGenerating}
            variant="outline"
          >
            {isGenerating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Eye className="w-4 h-4 mr-2" />}
            Aperçu
          </Button>
          
          <Button 
            onClick={handlePrint} 
            disabled={!isFormValid || isGenerating}
            variant="outline"
          >
            <Printer className="w-4 h-4 mr-2" />
            Imprimer
          </Button>
          
          <Button 
            onClick={handleDownloadPDF} 
            disabled={!isFormValid || isGenerating}
          >
            <FileDown className="w-4 h-4 mr-2" />
            Télécharger PDF
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}