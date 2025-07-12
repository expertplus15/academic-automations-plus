import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, FileType, CheckCircle, AlertCircle } from 'lucide-react';
import { useBankReconciliation } from '@/hooks/finance/useBankReconciliation';

export function ReconciliationUpload() {
  const { uploadBankStatement, loading } = useBankReconciliation();
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileUpload = async (file: File) => {
    const allowedTypes = ['.csv', '.ofx', '.qif', '.xlsx'];
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    
    if (!allowedTypes.includes(fileExtension)) {
      alert('Format de fichier non supporté. Veuillez utiliser CSV, OFX, QIF ou XLSX.');
      return;
    }

    try {
      await uploadBankStatement(file);
    } catch (error) {
      // Error handled by hook
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="w-5 h-5" />
          Import de relevé bancaire
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive ? 'border-primary bg-primary/5' : 'border-border'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            Glissez votre relevé bancaire ici
          </h3>
          <p className="text-muted-foreground mb-4">
            ou cliquez pour sélectionner un fichier
          </p>
          
          <input
            id="file-upload"
            type="file"
            accept=".csv,.ofx,.qif,.xlsx"
            onChange={handleInputChange}
            className="hidden"
            disabled={loading}
          />
          
          <label htmlFor="file-upload">
            <Button 
              variant="outline" 
              disabled={loading}
              className="cursor-pointer"
              asChild
            >
              <span>
                {loading ? 'Import en cours...' : 'Sélectionner un fichier'}
              </span>
            </Button>
          </label>

          <div className="mt-6 space-y-2">
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <FileType className="w-4 h-4" />
              Formats supportés: CSV, OFX, QIF, XLSX
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 text-xs">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Détection automatique des colonnes</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Rapprochement intelligent</span>
              </div>
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-blue-500" />
                <span>Validation manuelle requise</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}