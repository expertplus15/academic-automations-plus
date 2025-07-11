import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { FileSpreadsheet, FileText, Download } from 'lucide-react';
import { ExportService } from '@/services/ExportService';
import { LevelExportData } from '@/types/ImportExport';

interface ExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: any[];
}

export function ExportDialog({ open, onOpenChange, data }: ExportDialogProps) {
  const [format, setFormat] = useState<'excel' | 'pdf'>('excel');
  const [includeAll, setIncludeAll] = useState(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const handleExport = () => {
    let exportData: LevelExportData[];
    
    if (includeAll) {
      exportData = data.map(level => ({
        name: level.name,
        code: level.code,
        education_cycle: level.education_cycle,
        duration_years: level.duration_years,
        semesters: level.semesters,
        ects_credits: level.ects_credits,
        order_index: level.order_index
      }));
    } else {
      exportData = data
        .filter(level => selectedIds.includes(level.id))
        .map(level => ({
          name: level.name,
          code: level.code,
          education_cycle: level.education_cycle,
          duration_years: level.duration_years,
          semesters: level.semesters,
          ects_credits: level.ects_credits,
          order_index: level.order_index
        }));
    }

    const filename = includeAll 
      ? 'niveaux-academiques-complet'
      : `niveaux-academiques-selection-${selectedIds.length}`;

    if (format === 'excel') {
      ExportService.exportToExcel(exportData, filename);
    } else {
      ExportService.exportToPDF(exportData, filename);
    }

    onOpenChange(false);
  };

  const toggleSelection = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) 
        ? prev.filter(i => i !== id)
        : [...prev, id]
    );
  };

  const getCycleLabel = (cycle: string) => {
    const cycleLabels: Record<string, string> = {
      license: 'Licence',
      master: 'Master',
      doctorat: 'Doctorat',
      prepa: 'Classes Préparatoires',
      bts: 'BTS/DUT',
      custom: 'Cycle Personnalisé'
    };
    return cycleLabels[cycle] || cycle;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Export avancé des niveaux</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Format selection */}
          <div>
            <Label className="text-base font-semibold">Format d'export</Label>
            <RadioGroup value={format} onValueChange={(value: 'excel' | 'pdf') => setFormat(value)} className="mt-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="excel" id="excel" />
                <Label htmlFor="excel" className="flex items-center gap-2 cursor-pointer">
                  <FileSpreadsheet className="h-4 w-4" />
                  Excel (.xlsx)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="pdf" id="pdf" />
                <Label htmlFor="pdf" className="flex items-center gap-2 cursor-pointer">
                  <FileText className="h-4 w-4" />
                  PDF
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Data selection */}
          <div>
            <Label className="text-base font-semibold">Données à exporter</Label>
            <div className="mt-2 space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="all-data" 
                  checked={includeAll}
                  onCheckedChange={(checked) => setIncludeAll(checked as boolean)}
                />
                <Label htmlFor="all-data" className="cursor-pointer">
                  Tous les niveaux ({data.length})
                </Label>
              </div>
              
              {!includeAll && (
                <div className="ml-6 space-y-2 max-h-40 overflow-y-auto border rounded p-3">
                  <Label className="text-sm font-medium">Sélectionner les niveaux:</Label>
                  {data.map(level => (
                    <div key={level.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={level.id}
                        checked={selectedIds.includes(level.id)}
                        onCheckedChange={() => toggleSelection(level.id)}
                      />
                      <Label htmlFor={level.id} className="cursor-pointer text-sm">
                        {level.name} ({level.code}) - {getCycleLabel(level.education_cycle)}
                      </Label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Export summary */}
          <div className="bg-muted p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Résumé de l'export:</h4>
            <ul className="text-sm space-y-1">
              <li>• Format: {format === 'excel' ? 'Excel (.xlsx)' : 'PDF'}</li>
              <li>• Nombre de niveaux: {includeAll ? data.length : selectedIds.length}</li>
              <li>• Colonnes: Nom, Code, Cycle, Durée, Semestres, ECTS, Ordre</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button 
              onClick={handleExport}
              disabled={!includeAll && selectedIds.length === 0}
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              Exporter
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}