import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Download, FileText, FileSpreadsheet } from 'lucide-react';
import { ImportDialog } from './ImportDialog';
import { ExportDialog } from './ExportDialog';
import { ExportService } from '@/services/ExportService';
import { SubjectExportData } from '@/types/ImportExport';

interface SubjectsImportExportToolbarProps {
  data: any[];
  onImportSuccess: () => void;
}

export function SubjectsImportExportToolbar({ data, onImportSuccess }: SubjectsImportExportToolbarProps) {
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);

  const handleQuickExportExcel = () => {
    const exportData: SubjectExportData[] = data.map(subject => ({
      name: subject.name,
      code: subject.code,
      description: subject.description,
      credits_ects: subject.credits_ects,
      coefficient: subject.coefficient,
      hours_theory: subject.hours_theory,
      hours_practice: subject.hours_practice,
      hours_project: subject.hours_project,
      status: subject.status
    }));
    
    ExportService.exportSubjectsToExcel(exportData);
  };

  const handleQuickExportPDF = () => {
    const exportData: SubjectExportData[] = data.map(subject => ({
      name: subject.name,
      code: subject.code,
      description: subject.description,
      credits_ects: subject.credits_ects,
      coefficient: subject.coefficient,
      hours_theory: subject.hours_theory,
      hours_practice: subject.hours_practice,
      hours_project: subject.hours_project,
      status: subject.status
    }));
    
    ExportService.exportSubjectsToPDF(exportData);
  };

  const handleDownloadTemplate = () => {
    ExportService.downloadSubjectsTemplate();
  };

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <Button
        variant="outline"
        onClick={() => setShowImportDialog(true)}
        className="gap-2"
      >
        <Upload className="h-4 w-4" />
        Importer
      </Button>

      <Button
        variant="outline"
        onClick={handleQuickExportExcel}
        className="gap-2"
      >
        <FileSpreadsheet className="h-4 w-4" />
        Export Excel
      </Button>

      <Button
        variant="outline"
        onClick={handleQuickExportPDF}
        className="gap-2"
      >
        <FileText className="h-4 w-4" />
        Export PDF
      </Button>

      <Button
        variant="outline"
        onClick={handleDownloadTemplate}
        className="gap-2"
      >
        <Download className="h-4 w-4" />
        Télécharger Template
      </Button>

      <Button
        variant="outline"
        onClick={() => setShowExportDialog(true)}
        className="gap-2"
      >
        <Download className="h-4 w-4" />
        Export Avancé
      </Button>

      <ImportDialog
        open={showImportDialog}
        onOpenChange={setShowImportDialog}
        onSuccess={onImportSuccess}
        type="subjects"
      />

      <ExportDialog
        open={showExportDialog}
        onOpenChange={setShowExportDialog}
        data={data}
        type="subjects"
      />
    </div>
  );
}