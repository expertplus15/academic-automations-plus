import { useState, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { 
  Upload, 
  FileSpreadsheet, 
  Download, 
  AlertCircle, 
  CheckCircle,
  X
} from 'lucide-react';

interface ExcelImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImportComplete: (data: any[]) => void;
}

interface ImportStep {
  id: string;
  title: string;
  completed: boolean;
  error?: string;
}

export function ExcelImportDialog({ open, onOpenChange, onImportComplete }: ExcelImportDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [importSteps, setImportSteps] = useState<ImportStep[]>([
    { id: 'upload', title: 'Chargement du fichier', completed: false },
    { id: 'validate', title: 'Validation des données', completed: false },
    { id: 'process', title: 'Traitement des données', completed: false },
    { id: 'save', title: 'Sauvegarde', completed: false }
  ]);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [errors, setErrors] = useState<string[]>([]);

  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (!selectedFile.name.toLowerCase().endsWith('.xlsx') && 
          !selectedFile.name.toLowerCase().endsWith('.xls')) {
        toast({
          title: "Format invalide",
          description: "Veuillez sélectionner un fichier Excel (.xlsx ou .xls)",
          variant: "destructive",
        });
        return;
      }
      setFile(selectedFile);
      setErrors([]);
    }
  };

  const updateStep = (stepId: string, completed: boolean, error?: string) => {
    setImportSteps(prev => prev.map(step => 
      step.id === stepId ? { ...step, completed, error } : step
    ));
  };

  const simulateImport = async () => {
    if (!file) return;

    setImporting(true);
    setProgress(0);
    setErrors([]);

    try {
      // Step 1: Upload
      setProgress(25);
      updateStep('upload', true);
      await new Promise(resolve => setTimeout(resolve, 500));

      // Step 2: Validate
      setProgress(50);
      // Simulate validation
      const mockErrors: string[] = [];
      if (file.size > 5 * 1024 * 1024) {
        mockErrors.push("Le fichier est trop volumineux (max 5MB)");
      }
      
      if (mockErrors.length > 0) {
        setErrors(mockErrors);
        updateStep('validate', false, mockErrors[0]);
        return;
      }
      
      updateStep('validate', true);
      await new Promise(resolve => setTimeout(resolve, 500));

      // Step 3: Process
      setProgress(75);
      // Simulate data processing
      const mockData = [
        { studentName: 'Jean Dupont', studentNumber: '12345', cc: 15, exam: 12 },
        { studentName: 'Marie Martin', studentNumber: '12346', cc: 18, exam: 16 },
        { studentName: 'Pierre Durand', studentNumber: '12347', cc: 12, exam: 14 }
      ];
      setPreviewData(mockData);
      updateStep('process', true);
      await new Promise(resolve => setTimeout(resolve, 500));

      // Step 4: Save
      setProgress(100);
      updateStep('save', true);
      
      toast({
        title: "Import réussi",
        description: `${mockData.length} lignes importées avec succès`,
      });

      onImportComplete(mockData);
      
    } catch (error) {
      toast({
        title: "Erreur d'import",
        description: "Une erreur est survenue lors de l'import",
        variant: "destructive",
      });
    } finally {
      setImporting(false);
    }
  };

  const downloadTemplate = () => {
    // Create a simple CSV template
    const csvContent = `Numéro Étudiant,Nom Complet,Contrôle Continu,Examen,Projet
12345,Jean Dupont,15,12,18
12346,Marie Martin,18,16,14`;
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'template_notes.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const resetDialog = () => {
    setFile(null);
    setImporting(false);
    setProgress(0);
    setPreviewData([]);
    setErrors([]);
    setImportSteps(prev => prev.map(step => ({ ...step, completed: false, error: undefined })));
  };

  const handleClose = () => {
    resetDialog();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5" />
              Import Excel
            </DialogTitle>
            <Button variant="ghost" size="sm" onClick={handleClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Template download */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Modèle Excel</h4>
                  <p className="text-sm text-muted-foreground">
                    Téléchargez le modèle pour le format requis
                  </p>
                </div>
                <Button variant="outline" onClick={downloadTemplate}>
                  <Download className="w-4 h-4 mr-2" />
                  Télécharger
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* File selection */}
          <div>
            <Label htmlFor="excel-file">Sélectionner un fichier Excel</Label>
            <div className="mt-2">
              <Input
                id="excel-file"
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileSelect}
                disabled={importing}
              />
            </div>
            {file && (
              <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                <FileSpreadsheet className="w-4 h-4" />
                {file.name} ({Math.round(file.size / 1024)} KB)
              </div>
            )}
          </div>

          {/* Progress and steps */}
          {importing && (
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span>Import en cours...</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>

              <div className="space-y-2">
                {importSteps.map((step) => (
                  <div key={step.id} className="flex items-center gap-2 text-sm">
                    {step.completed ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : step.error ? (
                      <AlertCircle className="w-4 h-4 text-red-600" />
                    ) : (
                      <div className="w-4 h-4 border-2 border-gray-300 rounded-full animate-pulse" />
                    )}
                    <span className={step.error ? 'text-red-600' : ''}>
                      {step.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Errors */}
          {errors.length > 0 && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="pt-6">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-red-800">Erreurs détectées</h4>
                    <ul className="mt-1 text-sm text-red-700">
                      {errors.map((error, index) => (
                        <li key={index}>• {error}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Preview data */}
          {previewData.length > 0 && (
            <Card>
              <CardContent className="pt-6">
                <h4 className="font-medium mb-3">Aperçu des données ({previewData.length} lignes)</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Nom</th>
                        <th className="text-left p-2">Numéro</th>
                        <th className="text-right p-2">CC</th>
                        <th className="text-right p-2">Examen</th>
                      </tr>
                    </thead>
                    <tbody>
                      {previewData.slice(0, 5).map((row, index) => (
                        <tr key={index} className="border-b">
                          <td className="p-2">{row.studentName}</td>
                          <td className="p-2">{row.studentNumber}</td>
                          <td className="p-2 text-right">{row.cc}</td>
                          <td className="p-2 text-right">{row.exam}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {previewData.length > 5 && (
                    <p className="text-center text-muted-foreground mt-2">
                      ... et {previewData.length - 5} lignes supplémentaires
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-4">
            {!importing && !previewData.length && (
              <Button 
                onClick={simulateImport} 
                disabled={!file}
                className="flex-1"
              >
                <Upload className="w-4 h-4 mr-2" />
                Importer
              </Button>
            )}
            
            {previewData.length > 0 && (
              <Button onClick={resetDialog} variant="outline">
                Nouveau fichier
              </Button>
            )}
            
            <Button variant="outline" onClick={handleClose}>
              Fermer
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}