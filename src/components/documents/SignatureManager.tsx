import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useSignatures } from '@/hooks/useSignatures';
import { CheckCircle, X, Clock, FileText, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function SignatureManager() {
  const { pendingSignatures, loading, error, signDocument, rejectSignature } = useSignatures();
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
  const [signatureData, setSignatureData] = useState('');
  const [comments, setComments] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleSign = async (documentId: string) => {
    if (!signatureData.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez saisir votre signature",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsProcessing(true);
      await signDocument(documentId, signatureData, comments);
      toast({
        title: "Succès",
        description: "Document signé avec succès"
      });
      setSelectedDocument(null);
      setSignatureData('');
      setComments('');
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors de la signature",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async (documentId: string) => {
    if (!comments.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez indiquer la raison du rejet",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsProcessing(true);
      await rejectSignature(documentId, comments);
      toast({
        title: "Succès",
        description: "Document rejeté"
      });
      setSelectedDocument(null);
      setComments('');
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors du rejet",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Chargement des signatures...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <X className="h-8 w-8 text-destructive mx-auto mb-2" />
          <p className="text-destructive">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Signatures électroniques</h2>
        <p className="text-muted-foreground">
          Gérez vos demandes de signature de documents
        </p>
      </div>

      {pendingSignatures.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <CheckCircle className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Aucune signature en attente</h3>
            <p className="text-muted-foreground text-center">
              Vous n'avez actuellement aucun document à signer
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {pendingSignatures.map((signature) => (
            <Card key={signature.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5" />
                    <div>
                      <CardTitle className="text-lg">
                        Document {signature.generated_documents?.document_number || signature.document_id}
                      </CardTitle>
                      <CardDescription>
                        Ordre de signature: {signature.signature_order}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">
                      <Clock className="h-3 w-3 mr-1" />
                      En attente
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-sm text-muted-foreground">
                    Demandé le {new Date(signature.created_at).toLocaleDateString()}
                  </div>

                  {selectedDocument === signature.document_id ? (
                    <div className="space-y-4 border-t pt-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Signature électronique (saisissez votre nom)
                        </label>
                        <Textarea
                          placeholder="Votre nom complet"
                          value={signatureData}
                          onChange={(e) => setSignatureData(e.target.value)}
                          className="min-h-[80px]"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Commentaires (optionnel)
                        </label>
                        <Textarea
                          placeholder="Ajoutez des commentaires si nécessaire"
                          value={comments}
                          onChange={(e) => setComments(e.target.value)}
                          rows={3}
                        />
                      </div>

                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleSign(signature.document_id)}
                          disabled={isProcessing}
                          className="flex-1"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          {isProcessing ? 'Signature...' : 'Signer'}
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => handleReject(signature.document_id)}
                          disabled={isProcessing}
                          className="flex-1"
                        >
                          <X className="h-4 w-4 mr-2" />
                          {isProcessing ? 'Rejet...' : 'Rejeter'}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setSelectedDocument(null)}
                          disabled={isProcessing}
                        >
                          Annuler
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <Button
                        onClick={() => {
                          setSelectedDocument(signature.document_id);
                          setSignatureData('');
                          setComments('');
                        }}
                      >
                        <User className="h-4 w-4 mr-2" />
                        Signer le document
                      </Button>
                      {signature.generated_documents?.file_path && (
                        <Button variant="outline">
                          <FileText className="h-4 w-4 mr-2" />
                          Voir le document
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}