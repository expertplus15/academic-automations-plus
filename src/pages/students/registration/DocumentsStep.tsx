
import { Upload, FileText, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useState } from 'react';

interface DocumentsStepProps {
  isSubmitting?: boolean;
  retryCount?: number;
}

export function DocumentsStep({ isSubmitting = false, retryCount = 0 }: DocumentsStepProps) {
  const [uploadedDocs, setUploadedDocs] = useState<string[]>([]);

  const requiredDocuments = [
    { id: 'identity', name: 'Pièce d\'identité', required: true },
    { id: 'diploma', name: 'Diplôme ou relevé de notes', required: true },
    { id: 'photo', name: 'Photo d\'identité', required: true },
    { id: 'medical', name: 'Certificat médical', required: false },
  ];

  const handleFileUpload = (docId: string) => {
    // Simulation d'upload
    setTimeout(() => {
      setUploadedDocs(prev => [...prev, docId]);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Documents administratifs</h3>
        <p className="text-muted-foreground">
          Téléchargez les documents requis. Les documents marqués d'un * sont obligatoires.
        </p>
      </div>

      <div className="grid gap-4">
        {requiredDocuments.map((doc) => {
          const isUploaded = uploadedDocs.includes(doc.id);
          
          return (
            <Card key={doc.id} className="relative">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                      {isUploaded ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <FileText className="w-5 h-5 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">
                        {doc.name}
                        {doc.required && <span className="text-destructive ml-1">*</span>}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {isUploaded ? 'Document téléchargé' : 'Format: PDF, JPG (max 5MB)'}
                      </p>
                    </div>
                  </div>
                  
                  {!isUploaded && !isSubmitting && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleFileUpload(doc.id)}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Télécharger
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {isSubmitting && retryCount > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start gap-2">
            <Clock className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-yellow-800">
              <p className="font-medium mb-1">Synchronisation en cours</p>
              <p>
                Tentative {retryCount} de création du compte. Ceci peut prendre quelques instants 
                le temps que tous les systèmes se synchronisent.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Information importante</p>
            <p>
              Vous pouvez compléter votre inscription même sans tous les documents. 
              Ceux-ci pourront être téléchargés ultérieurement depuis votre espace étudiant.
              L'inscription sera finalisée automatiquement une fois que vous cliquerez sur "Finaliser l'inscription".
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
