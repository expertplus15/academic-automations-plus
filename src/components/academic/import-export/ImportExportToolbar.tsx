import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Download, FileText, FileSpreadsheet } from 'lucide-react';
import { ImportDialog } from './ImportDialog';
import { ExportDialog } from './ExportDialog';
import { ExportService } from '@/services/ExportService';
import { LevelExportData } from '@/types/ImportExport';

interface ImportExportToolbarProps {
  data: any[];
  onImportSuccess: () => void;
}

export function ImportExportToolbar({ data, onImportSuccess }: ImportExportToolbarProps) {
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);

  const handleQuickExportExcel = () => {
    const exportData: LevelExportData[] = data.map(level => ({
      name: level.name,
      code: level.code,
      education_cycle: level.education_cycle,
      duration_years: level.duration_years,
      semesters: level.semesters,
      ects_credits: level.ects_credits,
      order_index: level.order_index
    }));
    
    ExportService.exportToExcel(exportData);
  };

  const handleQuickExportPDF = () => {
    const exportData: LevelExportData[] = data.map(level => ({
      name: level.name,
      code: level.code,
      education_cycle: level.education_cycle,
      duration_years: level.duration_years,
      semesters: level.semesters,
      ects_credits: level.ects_credits,
      order_index: level.order_index
    }));
    
    ExportService.exportToPDF(exportData);
  };

  const handleDownloadTemplate = () => {
    ExportService.downloadTemplate();
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
      />

      <ExportDialog
        open={showExportDialog}
        onOpenChange={setShowExportDialog}
        data={data}
      />
    </div>
  );
}