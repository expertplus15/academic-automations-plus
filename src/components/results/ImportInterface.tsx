import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  FileSpreadsheet, 
  Database, 
  Download, 
  CheckCircle, 
  AlertCircle,
  FileText,
  Clock
} from 'lucide-react';
import { FileService } from '@/services/FileService';

interface ImportJob {
  id: string;
  fileName: string;
  type: 'excel' | 'csv' | 'database';
  status: 'pending' | 'processing' | 'completed' | 'error';
  progress: number;
  recordsProcessed: number;
  totalRecords: number;
  errors: string[];
  createdAt: string;
}

export function ImportInterface() {
  const [dragActive, setDragActive] = useState(false);
  const [importJobs, setImportJobs] = useState<ImportJob[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const startImport = async () => {
    if (!selectedFile) return;

    const newJob: ImportJob = {
      id: `import-${Date.now()}`,
      fileName: selectedFile.name,
      type: selectedFile.name.endsWith('.xlsx') ? 'excel' : 'csv',
      status: 'processing',
      progress: 0,
      recordsProcessed: 0,
      totalRecords: 0,
      errors: [],
      createdAt: new Date().toISOString()
    };

    setImportJobs(prev => [newJob, ...prev]);
    
    // Import using FileService
    try {
      const fileType = selectedFile.name.endsWith('.xlsx') || selectedFile.name.endsWith('.csv') ? 'grades' : 'students';
      const result = await FileService.uploadFile(selectedFile, fileType);
      
      if (result.success) {
        setImportJobs(prev => prev.map(job => 
          job.id === newJob.id 
            ? {
                ...job,
                status: 'completed',
                progress: 100,
                recordsProcessed: result.processedData?.records || 0,
                totalRecords: result.processedData?.total || 0
              }
            : job
        ));
      } else {
        setImportJobs(prev => prev.map(job => 
          job.id === newJob.id 
            ? {
                ...job,
                status: 'error',
                errors: [result.error || 'Erreur lors de l\'import']
              }
            : job
        ));
      }
    } catch (error) {
      setImportJobs(prev => prev.map(job => 
        job.id === newJob.id 
          ? {
              ...job,
              status: 'error',
              errors: ['Erreur lors de l\'import']
            }
          : job
      ));
    }

    setSelectedFile(null);
  };

  const getStatusIcon = (status: ImportJob['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'processing':
        return <Clock className="h-4 w-4 text-blue-500 animate-spin" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: ImportJob['status']) => {
    const variants = {
      pending: { label: 'En attente', className: 'bg-gray-100 text-gray-800' },
      processing: { label: 'En cours', className: 'bg-blue-100 text-blue-800' },
      completed: { label: 'Terminé', className: 'bg-green-100 text-green-800' },
      error: { label: 'Erreur', className: 'bg-red-100 text-red-800' }
    };
    
    const variant = variants[status];
    return <Badge className={variant.className}>{variant.label}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Import de Fichier
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive 
                ? 'border-primary bg-primary/5' 
                : 'border-border hover:border-primary/50'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <FileSpreadsheet className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">
              Glissez votre fichier ici ou cliquez pour sélectionner
            </h3>
            <p className="text-muted-foreground mb-4">
              Formats supportés: Excel (.xlsx), CSV (.csv)
            </p>
            
            <input
              type="file"
              accept=".xlsx,.csv"
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload">
              <Button asChild>
                <span>Sélectionner un fichier</span>
              </Button>
            </label>
            
            {selectedFile && (
              <div className="mt-4 p-4 bg-muted rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    <span className="font-medium">{selectedFile.name}</span>
                    <Badge variant="outline">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </Badge>
                  </div>
                  <Button onClick={startImport}>
                    Lancer l'import
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Import Templates */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Modèles d'Import
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-medium">Modèle Notes Standard</h4>
                <p className="text-sm text-muted-foreground">
                  Format Excel avec colonnes prédéfinies
                </p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={async () => {
                  const url = await FileService.downloadTemplate('grades');
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'modele-notes-standard.csv';
                  a.click();
                  URL.revokeObjectURL(url);
                }}
              >
                <Download className="h-4 w-4 mr-1" />
                Télécharger
              </Button>
            </div>
            
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-medium">Modèle ECTS</h4>
                <p className="text-sm text-muted-foreground">
                  Import des crédits et coefficients
                </p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={async () => {
                  const url = await FileService.downloadTemplate('ects');
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'modele-ects.csv';
                  a.click();
                  URL.revokeObjectURL(url);
                }}
              >
                <Download className="h-4 w-4 mr-1" />
                Télécharger
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Import History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Historique des Imports
          </CardTitle>
        </CardHeader>
        <CardContent>
          {importJobs.length === 0 ? (
            <div className="text-center py-8">
              <FileSpreadsheet className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">Aucun import récent</h3>
              <p className="text-muted-foreground">
                Vos imports apparaîtront ici
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {importJobs.map((job) => (
                <div key={job.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(job.status)}
                      <span className="font-medium">{job.fileName}</span>
                      {getStatusBadge(job.status)}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {new Date(job.createdAt).toLocaleString('fr-FR')}
                    </span>
                  </div>
                  
                  {job.status === 'processing' && (
                    <div className="space-y-2">
                      <Progress value={job.progress} className="h-2" />
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>{job.recordsProcessed} / {job.totalRecords} enregistrements</span>
                        <span>{job.progress}%</span>
                      </div>
                    </div>
                  )}
                  
                  {job.status === 'completed' && (
                    <Alert>
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription>
                        Import terminé avec succès: {job.totalRecords} enregistrements traités
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  {job.errors.length > 0 && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        {job.errors.length} erreur(s) détectée(s)
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}