import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, XCircle, Clock, User, FileText, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function DocumentValidation() {
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
  const [comment, setComment] = useState('');
  const { toast } = useToast();

  // Mock data - à remplacer par de vraies données
  const pendingDocuments = [
    {
      id: '1',
      name: 'Certificat de Scolarité - Jean Dupont',
      student: 'Jean Dupont',
      requestedBy: 'Marie Martin',
      requestDate: '2024-01-15',
      type: 'certificat',
      status: 'pending',
      priority: 'normal'
    },
    {
      id: '2',
      name: 'Attestation de Réussite - Sophie Bernard',
      student: 'Sophie Bernard',
      requestedBy: 'Paul Durand',
      requestDate: '2024-01-14',
      type: 'attestation',
      status: 'pending',
      priority: 'urgent'
    }
  ];

  const handleApprove = (documentId: string) => {
    toast({
      title: "Document approuvé",
      description: "Le document a été validé avec succès.",
    });
  };

  const handleReject = (documentId: string) => {
    if (!comment.trim()) {
      toast({
        title: "Commentaire requis",
        description: "Veuillez ajouter un commentaire pour le rejet.",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Document rejeté",
      description: "Le document a été rejeté avec commentaire.",
    });
    setComment('');
    setSelectedDocument(null);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'destructive';
      case 'high':
        return 'default';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <CheckCircle className="w-6 h-6 text-primary" />
        <h1 className="text-2xl font-bold">Validation Officielle</h1>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-orange-500" />
              <div>
                <p className="text-2xl font-bold">12</p>
                <p className="text-sm text-muted-foreground">En attente</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-2xl font-bold">45</p>
                <p className="text-sm text-muted-foreground">Approuvés</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <XCircle className="w-5 h-5 text-red-500" />
              <div>
                <p className="text-2xl font-bold">3</p>
                <p className="text-sm text-muted-foreground">Rejetés</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Documents en attente de validation */}
      <Card>
        <CardHeader>
          <CardTitle>Documents en attente de validation</CardTitle>
          <CardDescription>
            Cliquez sur un document pour le valider ou le rejeter
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pendingDocuments.map((doc) => (
              <div 
                key={doc.id} 
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedDocument === doc.id ? 'bg-muted' : 'hover:bg-muted/50'
                }`}
                onClick={() => setSelectedDocument(selectedDocument === doc.id ? null : doc.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <FileText className="w-8 h-8 text-primary" />
                    <div>
                      <h3 className="font-medium">{doc.name}</h3>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <User className="w-4 h-4" />
                        <span>Étudiant: {doc.student}</span>
                        <span>•</span>
                        <span>Demandé par: {doc.requestedBy}</span>
                        <span>•</span>
                        <span>{new Date(doc.requestDate).toLocaleDateString('fr-FR')}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={getPriorityColor(doc.priority)}>
                      {doc.priority === 'urgent' ? 'Urgent' : 'Normal'}
                    </Badge>
                    <Badge variant="outline">
                      <Clock className="w-3 h-3 mr-1" />
                      En attente
                    </Badge>
                  </div>
                </div>

                {selectedDocument === doc.id && (
                  <div className="mt-4 pt-4 border-t space-y-4">
                    <div>
                      <label className="text-sm font-medium">Commentaire (optionnel pour approbation, requis pour rejet)</label>
                      <Textarea
                        placeholder="Ajoutez vos remarques..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="mt-2"
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        onClick={() => handleApprove(doc.id)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Approuver
                      </Button>
                      <Button 
                        variant="destructive"
                        onClick={() => handleReject(doc.id)}
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Rejeter
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => {
                          setSelectedDocument(null);
                          setComment('');
                        }}
                      >
                        Annuler
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}