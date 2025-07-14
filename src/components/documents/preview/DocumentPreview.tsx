import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Download, Eye } from 'lucide-react';
import { useDocumentGeneration } from '@/hooks/useDocumentGeneration';
import { useToast } from '@/hooks/use-toast';

interface DocumentPreviewProps {
  templateId: string;
  studentId: string;
  additionalData?: any;
  onGenerate?: (result: any) => void;
}

export function DocumentPreview({ 
  templateId, 
  studentId, 
  additionalData, 
  onGenerate 
}: DocumentPreviewProps) {
  const [previewHtml, setPreviewHtml] = useState<string>('');
  const [showPreview, setShowPreview] = useState(false);
  const { loading, error, generateDocument, previewDocument } = useDocumentGeneration();
  const { toast } = useToast();

  const handlePreview = async () => {
    try {
      const result = await previewDocument(templateId, studentId, additionalData);
      if (result.html) {
        setPreviewHtml(result.html);
        setShowPreview(true);
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de générer la prévisualisation",
        variant: "destructive"
      });
    }
  };

  const handleGenerate = async () => {
    try {
      const result = await generateDocument(templateId, studentId, additionalData);
      
      toast({
        title: "Document généré",
        description: `Le document ${result.fileName} a été téléchargé avec succès`,
      });

      onGenerate?.(result);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de générer le document",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button
          onClick={handlePreview}
          disabled={loading}
          variant="outline"
          className="flex items-center gap-2"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
          Prévisualiser
        </Button>

        <Button
          onClick={handleGenerate}
          disabled={loading}
          className="flex items-center gap-2"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Download className="h-4 w-4" />
          )}
          Générer PDF
        </Button>
      </div>

      {error && (
        <Card className="border-destructive">
          <CardContent className="p-4">
            <p className="text-destructive text-sm">{error}</p>
          </CardContent>
        </Card>
      )}

      {showPreview && previewHtml && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Aperçu du document
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div 
              className="border rounded-lg p-4 bg-background max-h-96 overflow-y-auto"
              dangerouslySetInnerHTML={{ __html: previewHtml }}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}