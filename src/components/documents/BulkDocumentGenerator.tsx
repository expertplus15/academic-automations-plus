import React, { useState } from 'react';
import { FileText, Download, Users, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

interface Student {
  id: string;
  student_number: string;
  profile: {
    full_name: string;
    email: string;
  };
  program: {
    name: string;
    code: string;
  };
}

interface Template {
  id: string;
  name: string;
  type: string;
  description?: string;
}

interface GenerationResult {
  student_id: string;
  student_name: string;
  success: boolean;
  error?: string;
  document_url?: string;
}

export function BulkDocumentGenerator() {
  const [students, setStudents] = useState<Student[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<Set<string>>(new Set());
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [selectedProgram, setSelectedProgram] = useState('');
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<GenerationResult[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  React.useEffect(() => {
    fetchInitialData();
  }, []);

  React.useEffect(() => {
    if (selectedProgram) {
      fetchStudentsByProgram();
    }
  }, [selectedProgram]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);

      // Fetch templates
      const { data: templatesData, error: templatesError } = await supabase
        .from('document_templates')
        .select('*')
        .order('created_at');

      if (templatesError) throw templatesError;

      // Fetch programs for filtering
      const { data: programsData, error: programsError } = await supabase
        .from('programs')
        .select('id, name, code')
        .order('name');

      if (programsError) throw programsError;

      const mappedTemplates = templatesData?.map(t => ({
        id: t.id,
        name: `Template ${t.id}`,
        type: 'Document',
        description: 'Template de document'
      })) || [];
      setTemplates(mappedTemplates);
      
    } catch (error) {
      console.error('Error fetching initial data:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les données",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentsByProgram = async () => {
    try {
      const { data, error } = await supabase
        .from('students')
        .select(`
          id,
          student_number,
          profile:profiles!inner (
            full_name,
            email
          ),
          program:programs!inner (
            name,
            code
          )
        `)
        .eq('program_id', selectedProgram)
        .eq('status', 'active')
        .order('student_number');

      if (error) throw error;
      setStudents(data || []);
      setSelectedStudents(new Set());
    } catch (error) {
      console.error('Error fetching students:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les étudiants",
        variant: "destructive"
      });
    }
  };

  const toggleStudentSelection = (studentId: string) => {
    const newSelection = new Set(selectedStudents);
    if (newSelection.has(studentId)) {
      newSelection.delete(studentId);
    } else {
      newSelection.add(studentId);
    }
    setSelectedStudents(newSelection);
  };

  const selectAllStudents = () => {
    if (selectedStudents.size === students.length) {
      setSelectedStudents(new Set());
    } else {
      setSelectedStudents(new Set(students.map(s => s.id)));
    }
  };

  const generateDocumentForStudent = async (student: Student, templateId: string): Promise<GenerationResult> => {
    try {
      // Call edge function to generate document
      const { data, error } = await supabase.functions.invoke('generate-pdf', {
        body: {
          templateId,
          studentId: student.id,
          documentType: 'releve_notes'
        }
      });

      if (error) throw error;

      return {
        student_id: student.id,
        student_name: student.profile.full_name,
        success: true,
        document_url: data.url
      };

    } catch (error) {
      console.error(`Error generating document for ${student.profile.full_name}:`, error);
      return {
        student_id: student.id,
        student_name: student.profile.full_name,
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      };
    }
  };

  const generateBulkDocuments = async () => {
    if (!selectedTemplate || selectedStudents.size === 0) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un template et des étudiants",
        variant: "destructive"
      });
      return;
    }

    setGenerating(true);
    setProgress(0);
    setResults([]);

    const selectedStudentsList = students.filter(s => selectedStudents.has(s.id));
    const results: GenerationResult[] = [];

    try {
      for (let i = 0; i < selectedStudentsList.length; i++) {
        const student = selectedStudentsList[i];
        setProgress(((i + 1) / selectedStudentsList.length) * 100);

        const result = await generateDocumentForStudent(student, selectedTemplate);
        results.push(result);
        setResults([...results]);

        // Small delay to prevent overwhelming the server
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      const successful = results.filter(r => r.success).length;
      const failed = results.filter(r => !r.success).length;

      toast({
        title: "Génération terminée",
        description: `${successful} documents générés, ${failed} erreurs`,
        variant: failed > 0 ? "destructive" : "default"
      });

      // Auto-download if all successful
      if (failed === 0 && successful > 0) {
        await downloadAllDocuments(results.filter(r => r.success));
      }

    } catch (error) {
      console.error('Bulk generation error:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la génération en lot",
        variant: "destructive"
      });
    } finally {
      setGenerating(false);
      setProgress(0);
    }
  };

  const downloadAllDocuments = async (successfulResults: GenerationResult[]) => {
    try {
      const zip = new JSZip();
      const template = templates.find(t => t.id === selectedTemplate);
      
      for (const result of successfulResults) {
        if (result.document_url) {
          // In a real implementation, you would fetch the actual PDF blob
          // For now, we'll create a placeholder
          const pdfContent = `Document généré pour ${result.student_name}`;
          zip.file(`${result.student_name}_${template?.name || 'document'}.pdf`, pdfContent);
        }
      }

      const blob = await zip.generateAsync({ type: 'blob' });
      saveAs(blob, `Documents_${template?.name || 'Export'}_${new Date().toISOString().split('T')[0]}.zip`);

      toast({
        title: "Téléchargement",
        description: "Archive ZIP téléchargée avec succès"
      });

    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors du téléchargement",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader className="w-6 h-6 animate-spin mr-2" />
        <span>Chargement...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Génération en Lot</h2>
        <p className="text-muted-foreground">
          Générez des documents pour plusieurs étudiants simultanément
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Configuration de la génération</CardTitle>
          <CardDescription>
            Sélectionnez le template et les étudiants concernés
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Template de document</label>
              <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un template" />
                </SelectTrigger>
                 <SelectContent>
                  {templates.map(template => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name} - {template.type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Filtrer par programme</label>
              <Select value={selectedProgram} onValueChange={setSelectedProgram}>
                <SelectTrigger>
                  <SelectValue placeholder="Tous les programmes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tous les programmes</SelectItem>
                  {/* Add programs from fetchInitialData */}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {students.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Sélection des étudiants</CardTitle>
                <CardDescription>
                  {selectedStudents.size} étudiant(s) sélectionné(s) sur {students.length}
                </CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  onClick={selectAllStudents}
                >
                  {selectedStudents.size === students.length ? 'Désélectionner tout' : 'Sélectionner tout'}
                </Button>
                <Button
                  onClick={generateBulkDocuments}
                  disabled={generating || selectedStudents.size === 0 || !selectedTemplate}
                >
                  {generating ? <Loader className="w-4 h-4 animate-spin mr-2" /> : <FileText className="w-4 h-4 mr-2" />}
                  Générer {selectedStudents.size} document(s)
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 max-h-96 overflow-y-auto">
              {students.map(student => (
                <div
                  key={student.id}
                  className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50"
                >
                  <Checkbox
                    checked={selectedStudents.has(student.id)}
                    onCheckedChange={() => toggleStudentSelection(student.id)}
                  />
                  <div className="flex-1">
                    <p className="font-medium">{student.profile.full_name}</p>
                    <p className="text-sm text-muted-foreground">
                      {student.student_number} • {student.program.name}
                    </p>
                  </div>
                  {results.find(r => r.student_id === student.id) && (
                    <Badge variant={results.find(r => r.student_id === student.id)?.success ? "default" : "destructive"}>
                      {results.find(r => r.student_id === student.id)?.success ? "Généré" : "Erreur"}
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {generating && (
        <Card>
          <CardContent className="py-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Génération en cours...</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} />
            </div>
          </CardContent>
        </Card>
      )}

      {results.length > 0 && !generating && (
        <Card>
          <CardHeader>
            <CardTitle>Résultats de la génération</CardTitle>
            <CardDescription>
              {results.filter(r => r.success).length} succès, {results.filter(r => !r.success).length} erreurs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {results.map(result => (
                <div
                  key={result.student_id}
                  className="flex items-center justify-between p-3 rounded-lg border"
                >
                  <div className="flex items-center space-x-3">
                    {result.success ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-red-600" />
                    )}
                    <span className="font-medium">{result.student_name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {result.success ? (
                      <Badge variant="default">Généré</Badge>
                    ) : (
                      <Badge variant="destructive">Erreur</Badge>
                    )}
                    {result.success && result.document_url && (
                      <Button size="sm" variant="outline">
                        <Download className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            {results.filter(r => r.success).length > 0 && (
              <div className="mt-4 pt-4 border-t">
                <Button onClick={() => downloadAllDocuments(results.filter(r => r.success))}>
                  <Download className="w-4 h-4 mr-2" />
                  Télécharger tous les documents (ZIP)
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}