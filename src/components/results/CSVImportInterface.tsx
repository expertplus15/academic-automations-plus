
import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle, Eye } from 'lucide-react';
import { CSVGradeImporter, CSVGradeRow, ImportValidation, SubjectMapping } from '@/services/CSVGradeImporter';
import { useAcademicYear } from '@/hooks/useAcademicYear';
import { useToast } from '@/hooks/use-toast';

export function CSVImportInterface() {
  const [file, setFile] = useState<File | null>(null);
  const [csvData, setCsvData] = useState<CSVGradeRow[]>([]);
  const [mappings, setMappings] = useState<SubjectMapping[]>([]);
  const [validation, setValidation] = useState<ImportValidation | null>(null);
  const [selectedSemester, setSelectedSemester] = useState<string>('3');
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<{ success: number; errors: string[] } | null>(null);

  const { currentYear } = useAcademicYear();
  const { toast } = useToast();
  const importer = new CSVGradeImporter();

  const handleFileUpload = useCallback(async (uploadedFile: File) => {
    setFile(uploadedFile);
    
    try {
      const content = await uploadedFile.text();
      const parsedData = importer.parseCSV(content);
      setCsvData(parsedData);
      
      if (parsedData.length > 0) {
        const headers = Object.keys(parsedData[0]).filter(h => h !== 'matricule');
        const generatedMappings = importer.createSubjectMappings(['matricule', ...headers]);
        setMappings(generatedMappings);
        
        // Validate data
        const validationResult = await importer.validateData(parsedData, generatedMappings);
        setValidation(validationResult);
      }
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de lire le fichier CSV',
        variant: 'destructive',
      });
    }
  }, [importer, toast]);

  const handleAutoImport = async (semester: string) => {
    try {
      setSelectedSemester(semester);
      
      // Charger le fichier d'exemple correspondant au semestre
      const fileName = `Notes_S${semester}_DUT2GE_Session1.csv`;
      const response = await fetch(`/samples/${fileName}`);
      
      if (!response.ok) {
        throw new Error(`Fichier ${fileName} non trouvé`);
      }
      
      const content = await response.text();
      const parsedData = importer.parseCSV(content);
      setCsvData(parsedData);
      
      // Créer un objet File simulé pour l'affichage
      const simulatedFile = new File([content], fileName, { type: 'text/csv' });
      setFile(simulatedFile);
      
      if (parsedData.length > 0) {
        const headers = Object.keys(parsedData[0]).filter(h => h !== 'matricule');
        const generatedMappings = importer.createSubjectMappings(['matricule', ...headers]);
        setMappings(generatedMappings);
        
        // Valider les données
        const validationResult = await importer.validateData(parsedData, generatedMappings);
        setValidation(validationResult);
        
        toast({
          title: 'Données chargées',
          description: `Fichier d'exemple Semestre ${semester} chargé avec succès`,
        });
      }
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les données d\'exemple',
        variant: 'destructive',
      });
    }
  };

  const handleImport = async () => {
    if (!csvData || !mappings || !currentYear || !validation?.valid) return;

    setImporting(true);
    try {
      const result = await importer.importGrades(
        csvData, 
        mappings, 
        currentYear.id, 
        parseInt(selectedSemester)
      );
      
      setImportResult(result);
      
      if (result.success > 0) {
        toast({
          title: 'Import réussi',
          description: `${result.success} notes importées avec succès`,
        });
      }
      
      if (result.errors.length > 0) {
        toast({
          title: 'Import partiel',
          description: `${result.errors.length} erreurs détectées`,
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Erreur d\'import',
        description: 'Une erreur est survenue lors de l\'import',
        variant: 'destructive',
      });
    } finally {
      setImporting(false);
    }
  };

  const resetImport = () => {
    setFile(null);
    setCsvData([]);
    setMappings([]);
    setValidation(null);
    setImportResult(null);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" />
            Import CSV - Notes DUT2-GE
          </CardTitle>
          <CardDescription>
            Importez les notes depuis un fichier CSV au format DUT2-GE (Matricule, matières_CC, matières_Ex)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="upload" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="upload">1. Upload</TabsTrigger>
              <TabsTrigger value="preview" disabled={!csvData.length}>2. Aperçu</TabsTrigger>
              <TabsTrigger value="import" disabled={!validation?.valid}>3. Import</TabsTrigger>
            </TabsList>

            <TabsContent value="upload" className="space-y-4">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-sm font-medium">Semestre</label>
                  <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">Semestre 3</SelectItem>
                      <SelectItem value="4">Semestre 4</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Année académique</label>
                  <Input value={currentYear?.name || ''} disabled />
                </div>
              </div>

              {/* Import automatique */}
              <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="text-blue-800 text-lg">Import automatique - Données d'exemple</CardTitle>
                  <CardDescription className="text-blue-600">
                    Utilisez les données d'exemple préremplies pour tester l'importation
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => handleAutoImport('3')}
                    className="border-blue-300 text-blue-700 hover:bg-blue-100"
                  >
                    Charger Semestre 3
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => handleAutoImport('4')}
                    className="border-blue-300 text-blue-700 hover:bg-blue-100"
                  >
                    Charger Semestre 4
                  </Button>
                </CardContent>
              </Card>

              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-lg font-medium mb-2">
                  Glissez votre fichier CSV ici ou cliquez pour sélectionner
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  Format: Matricule, Matière_CC, Matière_Ex, ...
                </p>
                <Input
                  type="file"
                  accept=".csv"
                  onChange={(e) => {
                    const selectedFile = e.target.files?.[0];
                    if (selectedFile) handleFileUpload(selectedFile);
                  }}
                  className="max-w-xs mx-auto"
                />
              </div>

              {file && (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    Fichier sélectionné: {file.name} ({(file.size / 1024).toFixed(1)} KB)
                  </AlertDescription>
                </Alert>
              )}
            </TabsContent>

            <TabsContent value="preview" className="space-y-4">
              {validation && (
                <div className="grid grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="pt-4">
                      <div className="text-2xl font-bold text-green-600">{validation.studentCount}</div>
                      <div className="text-sm text-muted-foreground">Étudiants</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-4">
                      <div className="text-2xl font-bold text-blue-600">{validation.subjectCount}</div>
                      <div className="text-sm text-muted-foreground">Matières</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-4">
                      <div className="text-2xl font-bold text-red-600">{validation.errors.length}</div>
                      <div className="text-sm text-muted-foreground">Erreurs</div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {validation?.errors && validation.errors.length > 0 && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="font-medium mb-2">Erreurs détectées:</div>
                    <ul className="list-disc list-inside space-y-1">
                      {validation.errors.slice(0, 5).map((error, index) => (
                        <li key={index} className="text-sm">{error}</li>
                      ))}
                      {validation.errors.length > 5 && (
                        <li className="text-sm">... et {validation.errors.length - 5} autres erreurs</li>
                      )}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}

              {validation?.warnings && validation.warnings.length > 0 && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="font-medium mb-2">Avertissements:</div>
                    <ul className="list-disc list-inside space-y-1">
                      {validation.warnings.map((warning, index) => (
                        <li key={index} className="text-sm">{warning}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    Aperçu des données ({csvData.length} lignes)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2">Matricule</th>
                          {mappings.slice(0, 6).map(mapping => (
                            <th key={mapping.columnName} className="text-left p-2">
                              {mapping.columnName}
                            </th>
                          ))}
                          {mappings.length > 6 && <th className="text-left p-2">...</th>}
                        </tr>
                      </thead>
                      <tbody>
                        {csvData.slice(0, 5).map((row, index) => (
                          <tr key={index} className="border-b">
                            <td className="p-2 font-mono">{row.matricule}</td>
                            {mappings.slice(0, 6).map(mapping => (
                              <td key={mapping.columnName} className="p-2">
                                {row[mapping.columnName] || '-'}
                              </td>
                            ))}
                            {mappings.length > 6 && <td className="p-2">...</td>}
                          </tr>
                        ))}
                        {csvData.length > 5 && (
                          <tr>
                            <td colSpan={Math.min(mappings.length + 1, 8)} className="p-2 text-center text-muted-foreground">
                              ... et {csvData.length - 5} autres lignes
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="import" className="space-y-4">
              {!importResult ? (
                <div className="text-center space-y-4">
                  <div className="text-lg font-medium">Prêt pour l'import</div>
                  <div className="text-sm text-muted-foreground">
                    {validation?.studentCount} étudiants • {validation?.subjectCount} matières • Semestre {selectedSemester}
                  </div>
                  <div className="flex justify-center gap-2">
                    <Button variant="outline" onClick={resetImport}>
                      Annuler
                    </Button>
                    <Button onClick={handleImport} disabled={importing}>
                      {importing ? 'Import en cours...' : 'Importer les notes'}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-center">
                    <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-600" />
                    <div className="text-lg font-medium">Import terminé</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Card>
                      <CardContent className="pt-4">
                        <div className="text-2xl font-bold text-green-600">{importResult.success}</div>
                        <div className="text-sm text-muted-foreground">Notes importées</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-4">
                        <div className="text-2xl font-bold text-red-600">{importResult.errors.length}</div>
                        <div className="text-sm text-muted-foreground">Erreurs</div>
                      </CardContent>
                    </Card>
                  </div>
                  {importResult.errors.length > 0 && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        <div className="font-medium mb-2">Erreurs d'import:</div>
                        <ul className="list-disc list-inside space-y-1">
                          {importResult.errors.slice(0, 5).map((error, index) => (
                            <li key={index} className="text-sm">{error}</li>
                          ))}
                        </ul>
                      </AlertDescription>
                    </Alert>
                  )}
                  <div className="flex justify-center">
                    <Button onClick={resetImport}>
                      Nouvel import
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
