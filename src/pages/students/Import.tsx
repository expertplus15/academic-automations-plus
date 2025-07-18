
import React, { useState } from 'react';
import { StudentsModuleLayout } from "@/components/layouts/StudentsModuleLayout";
import { CSVUploader } from "@/components/students/import/CSVUploader";
import { ImportPreview } from "@/components/students/import/ImportPreview";
import { ImportProgress } from "@/components/students/import/ImportProgress";
import { ImportResults } from "@/components/students/import/ImportResults";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export type ImportStage = 'upload' | 'preview' | 'importing' | 'results';

export interface DutgeStudentData {
  matricule: string;
  nom: string;
  prenom: string;
  dateNaissance: string;
  lieuNaissance: string;
  email: string;
  telephone: string;
  classe: string;
  statut: string;
}

export interface ImportResult {
  success: number;
  errors: number;
  details: Array<{
    student: string;
    error?: string;
    success?: boolean;
  }>;
  createdStudents: any[];
  createdGroups: string[];
}

export default function Import() {
  const [stage, setStage] = useState<ImportStage>('upload');
  const [csvData, setCsvData] = useState<DutgeStudentData[]>([]);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [importProgress, setImportProgress] = useState(0);

  const handleCSVUploaded = (data: DutgeStudentData[]) => {
    setCsvData(data);
    setStage('preview');
  };

  const handleImportStart = () => {
    setStage('importing');
    setImportProgress(0);
  };

  const handleImportProgress = (progress: number) => {
    setImportProgress(progress);
  };

  const handleImportComplete = (result: ImportResult) => {
    setImportResult(result);
    setStage('results');
  };

  const resetImport = () => {
    setStage('upload');
    setCsvData([]);
    setImportResult(null);
    setImportProgress(0);
  };

  return (
    <StudentsModuleLayout 
      title="Import d'Étudiants" 
      subtitle="Import CSV des étudiants DUTGE - Promotion 2023/2024"
      showHeader={true}
    >
      <div className="p-6 space-y-6">
        {/* Header with stage indicator */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-4">
              <span>Import des Étudiants DUTGE</span>
              <div className="flex items-center gap-2 text-sm">
                <div className={`w-3 h-3 rounded-full ${stage === 'upload' ? 'bg-blue-500' : 'bg-green-500'}`} />
                <span>Upload</span>
                <div className={`w-3 h-3 rounded-full ${stage === 'preview' ? 'bg-blue-500' : stage === 'upload' ? 'bg-gray-300' : 'bg-green-500'}`} />
                <span>Aperçu</span>
                <div className={`w-3 h-3 rounded-full ${stage === 'importing' ? 'bg-blue-500' : (stage === 'results' ? 'bg-green-500' : 'bg-gray-300')}`} />
                <span>Import</span>
                <div className={`w-3 h-3 rounded-full ${stage === 'results' ? 'bg-green-500' : 'bg-gray-300'}`} />
                <span>Résultats</span>
              </div>
            </CardTitle>
          </CardHeader>
        </Card>

        {/* Stage-specific content */}
        {stage === 'upload' && (
          <CSVUploader onCSVUploaded={handleCSVUploaded} />
        )}

        {stage === 'preview' && (
          <ImportPreview 
            data={csvData}
            onImportStart={handleImportStart}
            onImportProgress={handleImportProgress}
            onImportComplete={handleImportComplete}
            onBack={() => setStage('upload')}
          />
        )}

        {stage === 'importing' && (
          <ImportProgress progress={importProgress} />
        )}

        {stage === 'results' && importResult && (
          <ImportResults 
            result={importResult}
            onReset={resetImport}
          />
        )}
      </div>
    </StudentsModuleLayout>
  );
}
