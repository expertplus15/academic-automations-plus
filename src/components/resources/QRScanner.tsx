import React, { useRef, useEffect, useState } from 'react';
import QrScanner from 'qr-scanner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Scan, Camera, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface QRScannerProps {
  isOpen: boolean;
  onClose: () => void;
  onScanSuccess: (result: string) => void;
}

export function QRScanner({ isOpen, onClose, onScanSuccess }: QRScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const scannerRef = useRef<QrScanner | null>(null);
  const [hasCamera, setHasCamera] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check camera availability
    QrScanner.hasCamera().then(setHasCamera);
  }, []);

  useEffect(() => {
    if (isOpen && hasCamera && videoRef.current) {
      initializeScanner();
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current.destroy();
        scannerRef.current = null;
      }
    };
  }, [isOpen, hasCamera]);

  const initializeScanner = async () => {
    if (!videoRef.current) return;

    try {
      setCameraError(null);
      setIsScanning(true);

      scannerRef.current = new QrScanner(
        videoRef.current,
        (result) => {
          onScanSuccess(result.data);
          toast({
            title: "QR Code détecté",
            description: `Code scanné: ${result.data}`,
          });
          handleClose();
        },
        {
          returnDetailedScanResult: true,
          highlightScanRegion: true,
          highlightCodeOutline: true,
          preferredCamera: 'environment'
        }
      );

      await scannerRef.current.start();
    } catch (error: any) {
      setCameraError(error.message || 'Erreur lors de l\'accès à la caméra');
      setIsScanning(false);
      toast({
        title: "Erreur caméra",
        description: "Impossible d'accéder à la caméra",
        variant: "destructive",
      });
    }
  };

  const handleClose = () => {
    if (scannerRef.current) {
      scannerRef.current.destroy();
      scannerRef.current = null;
    }
    setIsScanning(false);
    setCameraError(null);
    onClose();
  };

  const handleManualEntry = () => {
    const qrCode = prompt('Saisir le code QR manuellement:');
    if (qrCode && qrCode.trim()) {
      onScanSuccess(qrCode.trim());
      handleClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Scan className="w-5 h-5 text-primary" />
            Scanner QR Code
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {!hasCamera ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Aucune caméra détectée sur cet appareil.
              </AlertDescription>
            </Alert>
          ) : cameraError ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {cameraError}
              </AlertDescription>
            </Alert>
          ) : (
            <div className="relative">
              <video
                ref={videoRef}
                className="w-full rounded-lg bg-black"
                style={{ aspectRatio: '1/1' }}
              />
              {isScanning && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-lg">
                  <div className="w-32 h-32 border-2 border-primary border-dashed rounded-lg animate-pulse"></div>
                </div>
              )}
            </div>
          )}

          <div className="text-center text-sm text-muted-foreground">
            {isScanning ? (
              "Pointez la caméra vers un QR code"
            ) : (
              "Positionnez le QR code dans le cadre"
            )}
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={handleManualEntry} className="flex-1">
              Saisie manuelle
            </Button>
            <Button variant="outline" onClick={handleClose} className="flex-1">
              Annuler
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}