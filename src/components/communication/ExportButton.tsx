import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Download, FileText, FileSpreadsheet, FileImage, Calendar, Filter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ExportButtonProps {
  data: any[];
  filename?: string;
  allowedFormats?: ('json' | 'csv' | 'pdf' | 'xlsx')[];
  onExport?: (format: string, data: any[], options: any) => Promise<void>;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

interface ExportOptions {
  format: string;
  dateRange: string;
  includeMetadata: boolean;
  includeAttachments: boolean;
  filters: string[];
}

export function ExportButton({
  data,
  filename = 'export',
  allowedFormats = ['json', 'csv', 'pdf', 'xlsx'],
  onExport,
  variant = "outline",
  size = "default",
  className
}: ExportButtonProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: allowedFormats[0],
    dateRange: 'all',
    includeMetadata: true,
    includeAttachments: false,
    filters: []
  });
  const { toast } = useToast();

  const formatInfo = {
    json: { icon: FileText, label: 'JSON', description: 'Format de données structurées' },
    csv: { icon: FileSpreadsheet, label: 'CSV', description: 'Compatible Excel et tableurs' },
    pdf: { icon: FileText, label: 'PDF', description: 'Document portable formaté' },
    xlsx: { icon: FileSpreadsheet, label: 'Excel', description: 'Fichier Excel natif' }
  };

  const dateRangeOptions = [
    { value: 'all', label: 'Toutes les données' },
    { value: 'today', label: "Aujourd'hui" },
    { value: 'week', label: 'Cette semaine' },
    { value: 'month', label: 'Ce mois' },
    { value: 'quarter', label: 'Ce trimestre' },
    { value: 'year', label: 'Cette année' },
    { value: 'custom', label: 'Période personnalisée' }
  ];

  const filterData = (data: any[]) => {
    let filteredData = [...data];

    // Apply date range filter
    if (exportOptions.dateRange !== 'all') {
      const now = new Date();
      const filterDate = new Date();

      switch (exportOptions.dateRange) {
        case 'today':
          filterDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          break;
        case 'quarter':
          filterDate.setMonth(now.getMonth() - 3);
          break;
        case 'year':
          filterDate.setFullYear(now.getFullYear() - 1);
          break;
      }

      filteredData = filteredData.filter(item => {
        const itemDate = new Date(item.created_at || item.date || item.timestamp);
        return itemDate >= filterDate;
      });
    }

    return filteredData;
  };

  const formatDataForExport = (data: any[]) => {
    let exportData = filterData(data);

    if (!exportOptions.includeMetadata) {
      exportData = exportData.map(item => {
        const { metadata, ...rest } = item;
        return rest;
      });
    }

    return exportData;
  };

  const generateFile = (data: any[], format: string) => {
    const timestamp = new Date().toISOString().split('T')[0];
    const fullFilename = `${filename}_${timestamp}`;

    switch (format) {
      case 'json':
        return {
          blob: new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }),
          filename: `${fullFilename}.json`
        };
      
      case 'csv':
        const headers = Object.keys(data[0] || {});
        const csvContent = [
          headers.join(','),
          ...data.map(row => 
            headers.map(header => 
              JSON.stringify(row[header] || '')
            ).join(',')
          )
        ].join('\n');
        
        return {
          blob: new Blob([csvContent], { type: 'text/csv' }),
          filename: `${fullFilename}.csv`
        };
      
      case 'xlsx':
        // For Excel files, you would typically use a library like xlsx
        toast({
          title: "Format non supporté",
          description: "L'export Excel nécessite une configuration supplémentaire",
          variant: "destructive"
        });
        return null;
      
      case 'pdf':
        // For PDF, you would typically use a library like jsPDF
        toast({
          title: "Format non supporté", 
          description: "L'export PDF nécessite une configuration supplémentaire",
          variant: "destructive"
        });
        return null;
      
      default:
        return null;
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    setExportProgress(0);

    try {
      const exportData = formatDataForExport(data);
      
      // Simulate progress
      const progressInterval = setInterval(() => {
        setExportProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 100);

      if (onExport) {
        await onExport(exportOptions.format, exportData, exportOptions);
      } else {
        // Default export behavior
        const fileData = generateFile(exportData, exportOptions.format);
        
        if (fileData) {
          const url = URL.createObjectURL(fileData.blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = fileData.filename;
          a.click();
          URL.revokeObjectURL(url);
        }
      }

      clearInterval(progressInterval);
      setExportProgress(100);

      toast({
        title: "Export réussi",
        description: `${exportData.length} éléments exportés en ${exportOptions.format.toUpperCase()}`
      });

      setTimeout(() => {
        setIsDialogOpen(false);
        setExportProgress(0);
      }, 1000);

    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Erreur d'export",
        description: "Une erreur est survenue lors de l'export",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };

  const selectedFormat = formatInfo[exportOptions.format as keyof typeof formatInfo];

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant={variant} size={size} className={className}>
          <Download className="w-4 h-4 mr-2" />
          Exporter
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            Exporter les données
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Format Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Format d'export</label>
            <Select 
              value={exportOptions.format} 
              onValueChange={(value) => 
                setExportOptions(prev => ({ ...prev, format: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {allowedFormats.map(format => {
                  const info = formatInfo[format];
                  const IconComponent = info.icon;
                  return (
                    <SelectItem key={format} value={format}>
                      <div className="flex items-center gap-2">
                        <IconComponent className="w-4 h-4" />
                        <div>
                          <div className="font-medium">{info.label}</div>
                          <div className="text-xs text-muted-foreground">{info.description}</div>
                        </div>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          {/* Date Range */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Période</label>
            <Select 
              value={exportOptions.dateRange} 
              onValueChange={(value) => 
                setExportOptions(prev => ({ ...prev, dateRange: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {dateRangeOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Options */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Options</label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="metadata"
                  checked={exportOptions.includeMetadata}
                  onCheckedChange={(checked) =>
                    setExportOptions(prev => ({ ...prev, includeMetadata: checked as boolean }))
                  }
                />
                <label htmlFor="metadata" className="text-sm">
                  Inclure les métadonnées
                </label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="attachments"
                  checked={exportOptions.includeAttachments}
                  onCheckedChange={(checked) =>
                    setExportOptions(prev => ({ ...prev, includeAttachments: checked as boolean }))
                  }
                />
                <label htmlFor="attachments" className="text-sm">
                  Inclure les pièces jointes
                </label>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="p-4 bg-muted rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Résumé</span>
              <Badge variant="secondary">{filterData(data).length} éléments</Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Export en {selectedFormat?.label} • {exportOptions.dateRange === 'all' ? 'Toutes les données' : dateRangeOptions.find(o => o.value === exportOptions.dateRange)?.label}
            </p>
          </div>

          {/* Progress */}
          {isExporting && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Export en cours...</span>
                <span>{exportProgress}%</span>
              </div>
              <Progress value={exportProgress} />
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={() => setIsDialogOpen(false)}
              disabled={isExporting}
              className="flex-1"
            >
              Annuler
            </Button>
            <Button 
              onClick={handleExport}
              disabled={isExporting || data.length === 0}
              className="flex-1"
            >
              {isExporting ? (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
              ) : (
                <Download className="w-4 h-4 mr-2" />
              )}
              Exporter
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}