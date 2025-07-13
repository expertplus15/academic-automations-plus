import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Download, ZoomIn, ZoomOut, Printer, X } from 'lucide-react';

interface DocumentPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  type?: 'bulletin' | 'transcript' | 'certificate' | 'attestation';
  previewData?: {
    html?: string;
    pdf_url?: string;
  };
  loading?: boolean;
  onDownload?: () => void;
  onPrint?: () => void;
}

export function DocumentPreview({
  isOpen,
  onClose,
  title,
  type,
  previewData,
  loading = false,
  onDownload,
  onPrint
}: DocumentPreviewProps) {
  const [zoom, setZoom] = useState(100);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 10, 200));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 10, 50));

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <DialogTitle>{title}</DialogTitle>
              {type && (
                <Badge variant="outline">
                  {type === 'bulletin' && 'Bulletin'}
                  {type === 'transcript' && 'Relevé'}
                  {type === 'certificate' && 'Certificat'}
                  {type === 'attestation' && 'Attestation'}
                </Badge>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleZoomOut}>
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium w-12 text-center">{zoom}%</span>
              <Button variant="outline" size="sm" onClick={handleZoomIn}>
                <ZoomIn className="h-4 w-4" />
              </Button>
              
              {onPrint && (
                <Button variant="outline" size="sm" onClick={onPrint}>
                  <Printer className="h-4 w-4" />
                </Button>
              )}
              
              {onDownload && (
                <Button size="sm" onClick={onDownload}>
                  <Download className="h-4 w-4 mr-1" />
                  Télécharger
                </Button>
              )}
              
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 border rounded-lg overflow-hidden bg-gray-50">
          {loading ? (
            <div className="p-6 space-y-4">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          ) : previewData?.pdf_url ? (
            <iframe
              src={previewData.pdf_url}
              className="w-full h-full"
              style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top left' }}
              title="Document Preview"
            />
          ) : previewData?.html ? (
            <div 
              className="p-6 bg-white overflow-auto h-full"
              style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top left' }}
              dangerouslySetInnerHTML={{ __html: previewData.html }}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <div className="text-center space-y-2">
                <div className="text-lg font-medium">Aucun aperçu disponible</div>
                <div className="text-sm">Le document ne peut pas être prévisualisé</div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}