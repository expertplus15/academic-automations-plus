import { useState, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Upload, FileText, AlertCircle, CheckCircle, X } from 'lucide-react';
import { ImportService } from '@/services/ImportService';
import { ImportPreviewData, ImportResult } from '@/types/ImportExport';
import { DataPreview } from './DataPreview';
import { useToast } from '@/hooks/use-toast';

interface ImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  type?: 'levels' | 'subjects';
}

export function ImportDialog({ open, onOpenChange, onSuccess, type = 'levels' }: ImportDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<ImportPreviewData | null>(null);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [step, setStep] = useState<'upload' | 'preview' | 'importing' | 'result'>('upload');
  const { toast } = useToast();

  const handleFileUpload = useCallback(async (uploadedFile: File) => {
    setFile(uploadedFile);
    
    try {
      let preview;
      if (type === 'subjects') {
        // Pour les matières, nous devons utiliser une validation adaptée
        const data = await ImportService.parseFile(uploadedFile);
        const validatedData = ImportService.validateSubjectsData(data.valid as any);
        preview = {
          valid: validatedData.valid as any,
          errors: validatedData.errors.map((error, index) => ({
            row: index + 1,
            field: 'general',
            message: error
          })),
          totalRows: data.totalRows
        };
      } else {
        preview = await ImportService.parseFile(uploadedFile);
      }
      setPreviewData(preview);
      setStep('preview');
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de lire le fichier. Vérifiez le format.',
        variant: 'destructive',
      });
    }
  }, [toast, type]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && (droppedFile.type.includes('spreadsheet') || droppedFile.name.endsWith('.xlsx') || droppedFile.name.endsWith('.xls'))) {
      handleFileUpload(droppedFile);
    } else {
      toast({
        title: 'Format invalide',
        description: 'Veuillez utiliser un fichier Excel (.xlsx ou .xls)',
        variant: 'destructive',
      });
    }
  }, [handleFileUpload, toast]);

  const handleImport = async () => {
    if (!previewData?.valid) return;

    setStep('importing');
    setImporting(true);

    try {
      let result;
      if (type === 'subjects') {
        // Pour les matières, nous devons adapter la validation et l'import
        const validatedData = ImportService.validateSubjectsData(previewData.valid as any);
        result = await ImportService.importSubjectsToDatabase(validatedData.valid);
        // Adapter le format de retour pour compatibility
        setImportResult({
          success: result.errors.length === 0,
          imported: result.success,
          errors: result.errors.map((error, index) => ({
            row: index + 1,
            field: 'general',
            message: error
          })),
          skipped: 0
        });
      } else {
        result = await ImportService.importData(previewData.valid);
        setImportResult(result);
      }
      
      setStep('result');
      
      if (result.success || (type === 'subjects' && result.success > 0)) {
        toast({
          title: 'Import réussi',
          description: `${type === 'subjects' ? result.success : result.imported} ${type === 'subjects' ? 'matières' : 'niveaux'} importés avec succès`,
        });
        onSuccess();
      } else {
        toast({
          title: 'Import partiellement réussi',
          description: `${type === 'subjects' ? result.success : result.imported} importés, ${type === 'subjects' ? result.errors.length : result.errors.length} erreurs`,
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

  const handleClose = () => {
    setFile(null);
    setPreviewData(null);
    setImportResult(null);
    setStep('upload');
    onOpenChange(false);
  };

  const renderUploadStep = () => (
    <div className="space-y-4">
      <div
        className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => document.getElementById('file-input')?.click()}
      >
        <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <p className="text-lg font-medium mb-2">
          Glissez votre fichier Excel ici ou cliquez pour sélectionner
        </p>
        <p className="text-sm text-muted-foreground">
          Formats supportés: .xlsx, .xls
        </p>
        <input
          id="file-input"
          type="file"
          accept=".xlsx,.xls"
          className="hidden"
          onChange={(e) => {
            const selectedFile = e.target.files?.[0];
            if (selectedFile) handleFileUpload(selectedFile);
          }}
        />
      </div>

      <Alert>
        <FileText className="h-4 w-4" />
        <AlertDescription>
          Assurez-vous que votre fichier respecte le format du template. 
          Téléchargez le template si vous n'en avez pas.
        </AlertDescription>
      </Alert>
    </div>
  );

  const renderPreviewStep = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Aperçu des données</h3>
        <Button variant="outline" size="sm" onClick={() => setStep('upload')}>
          Changer de fichier
        </Button>
      </div>

      {previewData && (
        <>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-muted rounded">
              <div className="text-2xl font-bold text-green-600">{previewData.valid.length}</div>
              <div className="text-sm">Lignes valides</div>
            </div>
            <div className="text-center p-4 bg-muted rounded">
              <div className="text-2xl font-bold text-red-600">{previewData.errors.length}</div>
              <div className="text-sm">Erreurs</div>
            </div>
            <div className="text-center p-4 bg-muted rounded">
              <div className="text-2xl font-bold">{previewData.totalRows}</div>
              <div className="text-sm">Total lignes</div>
            </div>
          </div>

          {previewData.errors.length > 0 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {previewData.errors.length} erreur(s) détectée(s). Corrigez le fichier avant l'import.
              </AlertDescription>
            </Alert>
          )}

          <DataPreview data={previewData} />

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleClose}>
              Annuler
            </Button>
            <Button 
              onClick={handleImport} 
              disabled={previewData.valid.length === 0 || previewData.errors.length > 0}
            >
              Importer {previewData.valid.length} {type === 'subjects' ? 'matière(s)' : 'niveau(x)'}
            </Button>
          </div>
        </>
      )}
    </div>
  );

  const renderImportingStep = () => (
    <div className="space-y-4 text-center">
      <div className="py-8">
        <Upload className="h-12 w-12 mx-auto mb-4 text-primary animate-pulse" />
        <h3 className="text-lg font-semibold mb-2">Import en cours...</h3>
        <p className="text-muted-foreground mb-4">
          Veuillez patienter pendant l'import des données
        </p>
        <Progress value={undefined} className="w-full" />
      </div>
    </div>
  );

  const renderResultStep = () => (
    <div className="space-y-4">
      <div className="text-center py-4">
        {importResult?.success ? (
          <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-600" />
        ) : (
          <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-600" />
        )}
        
        <h3 className="text-lg font-semibold mb-2">
          {importResult?.success ? 'Import réussi!' : 'Import terminé avec des erreurs'}
        </h3>
        
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="text-center p-4 bg-green-50 rounded">
            <div className="text-2xl font-bold text-green-600">{importResult?.imported}</div>
            <div className="text-sm">Importés</div>
          </div>
          <div className="text-center p-4 bg-red-50 rounded">
            <div className="text-2xl font-bold text-red-600">{importResult?.errors.length}</div>
            <div className="text-sm">Erreurs</div>
          </div>
        </div>
      </div>

      {importResult?.errors && importResult.errors.length > 0 && (
        <div className="max-h-40 overflow-y-auto border rounded p-3">
          <h4 className="font-semibold mb-2">Erreurs:</h4>
          {importResult.errors.map((error, index) => (
            <div key={index} className="text-sm text-red-600 mb-1">
              Ligne {error.row}: {error.message}
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-end">
        <Button onClick={handleClose}>
          Fermer
        </Button>
      </div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Import de {type === 'subjects' ? 'matières' : 'niveaux académiques'}</DialogTitle>
            <Button variant="ghost" size="sm" onClick={handleClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        {step === 'upload' && renderUploadStep()}
        {step === 'preview' && renderPreviewStep()}
        {step === 'importing' && renderImportingStep()}
        {step === 'result' && renderResultStep()}
      </DialogContent>
    </Dialog>
  );
}