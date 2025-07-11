import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useDocumentTemplates } from '@/hooks/useDocumentTemplates';
import { useDocumentGeneration } from '@/hooks/useDocumentGeneration';
import { useToast } from '@/hooks/use-toast';
import { FileText, Download, Eye, Users, Send } from 'lucide-react';

export function DocumentGenerator() {
  const { templates, loading: templatesLoading } = useDocumentTemplates();
  const { loading, error, progress, generateDocument, previewDocument, batchGenerate } = useDocumentGeneration();
  const { toast } = useToast();
  
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [generationMode, setGenerationMode] = useState<'single' | 'batch'>('single');

  // Mock students data - should be replaced with real data
  const students = [
    { id: '1', name: 'Marie Dubois', number: 'ETU2024001' },
    { id: '2', name: 'Pierre Martin', number: 'ETU2024002' },
    { id: '3', name: 'Sophie Bernard', number: 'ETU2024003' },
  ];

  const handlePreview = async () => {
    if (!selectedTemplate || !selectedStudent) {
      toast({
        title: "Sélection incomplète",
        description: "Veuillez sélectionner un modèle et un étudiant.",
        variant: "destructive",
      });
      return;
    }

    try {
      const result = await previewDocument(selectedTemplate, selectedStudent);
      toast({
        title: "Aperçu généré",
        description: "L'aperçu du document a été généré avec succès.",
      });
      // Here you would typically open a preview modal with the result
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de générer l'aperçu.",
        variant: "destructive",
      });
    }
  };

  const handleGenerate = async () => {
    if (!selectedTemplate || !selectedStudent) {
      toast({
        title: "Sélection incomplète",
        description: "Veuillez sélectionner un modèle et un étudiant.",
        variant: "destructive",
      });
      return;
    }

    try {
      const result = await generateDocument(selectedTemplate, selectedStudent);
      toast({
        title: "Document généré",
        description: "Le document a été généré avec succès.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de générer le document.",
        variant: "destructive",
      });
    }
  };

  const handleBatchGenerate = async () => {
    if (!selectedTemplate || selectedStudents.length === 0) {
      toast({
        title: "Sélection incomplète",
        description: "Veuillez sélectionner un modèle et au moins un étudiant.",
        variant: "destructive",
      });
      return;
    }

    try {
      const result = await batchGenerate(selectedTemplate, selectedStudents);
      toast({
        title: "Génération en lot lancée",
        description: `Génération en cours pour ${selectedStudents.length} étudiants.`,
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de lancer la génération en lot.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Générateur de Documents</h2>
        <p className="text-muted-foreground">Générez des documents automatiquement à partir des modèles</p>
      </div>

      <Tabs value={generationMode} onValueChange={(value) => setGenerationMode(value as 'single' | 'batch')}>
        <TabsList>
          <TabsTrigger value="single">Génération Simple</TabsTrigger>
          <TabsTrigger value="batch">Génération en Lot</TabsTrigger>
        </TabsList>

        <TabsContent value="single" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Génération pour un étudiant
              </CardTitle>
              <CardDescription>
                Sélectionnez un modèle et un étudiant pour générer un document
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="template-select">Modèle de document</Label>
                  <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un modèle" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.isArray(templates) ? templates.map((template) => (
                        <SelectItem key={template.id} value={template.id}>
                          {template.name}
                        </SelectItem>
                      )) : null}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="student-select">Étudiant</Label>
                  <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un étudiant" />
                    </SelectTrigger>
                    <SelectContent>
                      {students.map((student) => (
                        <SelectItem key={student.id} value={student.id}>
                          {student.name} ({student.number})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  onClick={handlePreview}
                  disabled={loading || !selectedTemplate || !selectedStudent}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Aperçu
                </Button>
                <Button 
                  onClick={handleGenerate}
                  disabled={loading || !selectedTemplate || !selectedStudent}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Générer
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="batch" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Génération en lot
              </CardTitle>
              <CardDescription>
                Générez des documents pour plusieurs étudiants simultanément
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="batch-template-select">Modèle de document</Label>
                <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un modèle" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.isArray(templates) ? templates.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name}
                      </SelectItem>
                    )) : null}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Étudiants sélectionnés ({selectedStudents.length})</Label>
                <div className="border rounded-md p-4 max-h-40 overflow-y-auto">
                  {students.map((student) => (
                    <div key={student.id} className="flex items-center space-x-2 py-1">
                      <input
                        type="checkbox"
                        id={`student-${student.id}`}
                        checked={selectedStudents.includes(student.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedStudents([...selectedStudents, student.id]);
                          } else {
                            setSelectedStudents(selectedStudents.filter(id => id !== student.id));
                          }
                        }}
                        className="rounded"
                      />
                      <label htmlFor={`student-${student.id}`} className="text-sm">
                        {student.name} ({student.number})
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {loading && (
                <div className="space-y-2">
                  <Label>Progression: {progress}%</Label>
                  <Progress value={progress} className="w-full" />
                </div>
              )}

              <Button 
                onClick={handleBatchGenerate}
                disabled={loading || !selectedTemplate || selectedStudents.length === 0}
                className="w-full"
              >
                <Send className="w-4 h-4 mr-2" />
                Générer en lot ({selectedStudents.length} étudiants)
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {error && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded">
          {error}
        </div>
      )}
    </div>
  );
}