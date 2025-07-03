import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ResultsPageHeader } from "@/components/ResultsPageHeader";
import { MatriceInterface } from "@/components/results/MatriceInterface";
import { EvaluationTypesSettings } from "@/components/results/EvaluationTypesSettings";
import { ExcelImportDialog } from "@/components/results/ExcelImportDialog";
import { ManualGradeEntry } from "@/components/results/ManualGradeEntry";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Grid, Plus, Settings, ArrowLeft, Upload, FileSpreadsheet } from 'lucide-react';
import { useAcademicYears } from '@/hooks/useAcademicYears';
import { useSubjects } from '@/hooks/useSubjects';
import { usePrograms } from '@/hooks/usePrograms';

export default function Matrix() {
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedProgram, setSelectedProgram] = useState<string>('all');
  const [selectedSemester, setSelectedSemester] = useState<string>('1');
  const [activeTab, setActiveTab] = useState<string>('matrix');
  const [showExcelImport, setShowExcelImport] = useState(false);
  const [showManualEntry, setShowManualEntry] = useState(false);
  
  const navigate = useNavigate();
  
  // Real hooks
  const { currentYear } = useAcademicYears();
  const { subjects, loading: subjectsLoading } = useSubjects();
  const { programs, loading: programsLoading } = usePrograms();

  const handleBackToResults = () => {
    navigate('/results');
  };

  const handleMatrixRefresh = () => {
    // Force refresh of matrix data
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="p-6">
          <div className="max-w-7xl mx-auto">
            {/* Breadcrumb Navigation */}
            <Breadcrumb className="mb-4">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink onClick={handleBackToResults} className="cursor-pointer">
                    Résultats
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Interface Matricielle</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            {/* Header with back button */}
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={handleBackToResults}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour
              </Button>
              <div>
                <h1 className="text-3xl font-bold">Interface Matricielle</h1>
                <p className="text-muted-foreground">
                  Saisie collaborative des notes en temps réel
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          
          {/* Configuration Panel */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Grid className="w-5 h-5" />
                Configuration de la Matrice
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Select value={selectedProgram} onValueChange={setSelectedProgram}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un programme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les programmes</SelectItem>
                    {programsLoading ? (
                      <SelectItem value="loading" disabled>Chargement...</SelectItem>
                    ) : programs.length === 0 ? (
                      <SelectItem value="empty" disabled>Aucun programme disponible</SelectItem>
                    ) : (
                      programs.map(program => (
                        <SelectItem key={program.id} value={program.id}>
                          {program.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                
                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une matière" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjectsLoading ? (
                      <SelectItem value="loading" disabled>Chargement...</SelectItem>
                    ) : subjects.length === 0 ? (
                      <SelectItem value="empty" disabled>Aucune matière disponible</SelectItem>
                    ) : (
                      subjects.map(subject => (
                        <SelectItem key={subject.id} value={subject.id}>
                          {subject.name} ({subject.code})
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                
                <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                  <SelectTrigger>
                    <SelectValue placeholder="Semestre" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Semestre 1</SelectItem>
                    <SelectItem value="2">Semestre 2</SelectItem>
                  </SelectContent>
                </Select>
                
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowExcelImport(true)}
                  >
                    <Upload className="w-4 h-4 mr-1" />
                    Import Excel
                  </Button>
                  <Button 
                    size="sm"
                    onClick={() => setShowManualEntry(true)}
                    className="bg-primary hover:bg-primary/90"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Saisie Manuelle
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main Content with Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="matrix" className="flex items-center gap-2">
                <Grid className="w-4 h-4" />
                Matrice des Notes
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Paramètres
              </TabsTrigger>
            </TabsList>

            <TabsContent value="matrix">
              {selectedSubject && (selectedProgram || selectedProgram === 'all') && currentYear ? (
                <MatriceInterface
                  subjectId={selectedSubject}
                  academicYearId={currentYear.id}
                  semester={parseInt(selectedSemester)}
                  programId={selectedProgram === 'all' ? undefined : selectedProgram}
                />
              ) : (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Grid className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Sélectionnez une configuration</h3>
                    <p className="text-muted-foreground">
                      Choisissez un programme et une matière pour commencer la saisie collaborative des notes.
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="settings">
              <EvaluationTypesSettings onClose={() => setActiveTab('matrix')} />
            </TabsContent>
          </Tabs>

          {/* Dialog Components */}
          <ExcelImportDialog
            open={showExcelImport}
            onOpenChange={setShowExcelImport}
            onImportComplete={handleMatrixRefresh}
          />

          {selectedSubject && selectedProgram && currentYear && (
            <ManualGradeEntry
              open={showManualEntry}
              onOpenChange={setShowManualEntry}
              subjectId={selectedSubject}
              academicYearId={currentYear.id}
              semester={parseInt(selectedSemester)}
              onGradeAdded={handleMatrixRefresh}
            />
          )}
        </div>
      </div>
    </div>
  );
}