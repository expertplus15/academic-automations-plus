import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ImportPreviewData } from '@/types/ImportExport';
import { AlertCircle, CheckCircle } from 'lucide-react';

interface DataPreviewProps {
  data: ImportPreviewData;
}

export function DataPreview({ data }: DataPreviewProps) {
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
    <div className="space-y-4">
      {/* Valid data preview */}
      {data.valid.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <h4 className="font-semibold">Données valides ({data.valid.length})</h4>
          </div>
          
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Cycle</TableHead>
                  <TableHead>Durée</TableHead>
                  <TableHead>Semestres</TableHead>
                  <TableHead>ECTS</TableHead>
                  <TableHead>Ordre</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.valid.slice(0, 5).map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{item.code}</Badge>
                    </TableCell>
                    <TableCell>{getCycleLabel(item.education_cycle)}</TableCell>
                    <TableCell>{item.duration_years} an(s)</TableCell>
                    <TableCell>{item.semesters}</TableCell>
                    <TableCell>{item.ects_credits || '-'}</TableCell>
                    <TableCell>{item.order_index}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {data.valid.length > 5 && (
              <div className="p-3 text-center text-sm text-muted-foreground border-t">
                ... et {data.valid.length - 5} autres lignes valides
              </div>
            )}
          </div>
        </div>
      )}

      {/* Errors */}
      {data.errors.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <h4 className="font-semibold">Erreurs détectées ({data.errors.length})</h4>
          </div>
          
          <Alert variant="destructive">
            <AlertDescription>
              <div className="max-h-32 overflow-y-auto space-y-1">
                {data.errors.slice(0, 10).map((error, index) => (
                  <div key={index} className="text-sm">
                    <strong>Ligne {error.row}</strong> - {error.field}: {error.message}
                  </div>
                ))}
                {data.errors.length > 10 && (
                  <div className="text-sm font-medium">
                    ... et {data.errors.length - 10} autres erreurs
                  </div>
                )}
              </div>
            </AlertDescription>
          </Alert>
        </div>
      )}

      {data.valid.length === 0 && data.errors.length === 0 && (
        <Alert>
          <AlertDescription>
            Aucune donnée valide trouvée dans le fichier.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}