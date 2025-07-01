
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  FileText, 
  Download, 
  Clock, 
  CheckCircle,
  Search,
  Filter,
  Plus,
  Eye,
  Calendar,
  User
} from "lucide-react";

export function DocumentsManagement() {
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data for documents
  const documents = [
    {
      id: "1",
      type: "certificate",
      title: "Certificat de Scolarité",
      studentName: "Marie Dubois",
      studentNumber: "IG25001",
      status: "generated",
      requestDate: "2025-01-01T10:30:00Z",
      generatedDate: "2025-01-01T11:00:00Z",
      documentNumber: "CERT25001",
      downloadCount: 2
    },
    {
      id: "2",
      type: "transcript",
      title: "Relevé de Notes",
      studentName: "Jean Martin",
      studentNumber: "IG25002",
      status: "pending",
      requestDate: "2025-01-01T09:15:00Z",
      generatedDate: null,
      documentNumber: null,
      downloadCount: 0
    },
    {
      id: "3",
      type: "attestation",
      title: "Attestation de Stage",
      studentName: "Sophie Chen",
      studentNumber: "IG25003",
      status: "approved",
      requestDate: "2024-12-30T14:20:00Z",
      generatedDate: "2024-12-30T15:00:00Z",
      documentNumber: "ATT24156",
      downloadCount: 1
    }
  ];

  const getStatusBadge = (status: string) => {
    const config = {
      pending: { label: "En attente", className: "bg-yellow-100 text-yellow-800 border-yellow-200" },
      approved: { label: "Approuvé", className: "bg-blue-100 text-blue-800 border-blue-200" },
      generated: { label: "Généré", className: "bg-green-100 text-green-800 border-green-200" },
      rejected: { label: "Rejeté", className: "bg-red-100 text-red-800 border-red-200" }
    };
    
    const statusConfig = config[status as keyof typeof config] || config.pending;
    return (
      <Badge className={statusConfig.className}>
        {statusConfig.label}
      </Badge>
    );
  };

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case "certificate":
        return <FileText className="w-4 h-4" />;
      case "transcript":
        return <FileText className="w-4 h-4" />;
      case "attestation":
        return <FileText className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const pendingDocs = documents.filter(doc => doc.status === 'pending');
  const generatedDocs = documents.filter(doc => doc.status === 'generated');
  const totalDownloads = documents.reduce((sum, doc) => sum + doc.downloadCount, 0);

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">En Attente</p>
                <p className="text-2xl font-bold text-yellow-600">{pendingDocs.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Générés</p>
                <p className="text-2xl font-bold">{generatedDocs.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Download className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Téléchargements</p>
                <p className="text-2xl font-bold">{totalDownloads}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-students/10 rounded-lg">
                <FileText className="w-5 h-5 text-students" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Documents</p>
                <p className="text-2xl font-bold">{documents.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Documents Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-students" />
              Documents Administratifs
            </CardTitle>
            <div className="flex gap-2">
              <Button className="bg-students hover:bg-students/90">
                <Plus className="w-4 h-4 mr-2" />
                Nouveau Document
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par étudiant, type ou numéro de document..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filtres
            </Button>
          </div>

          {/* Documents List */}
          <div className="space-y-3">
            {documents.map((document) => (
              <div key={document.id} className="p-4 border border-border/50 rounded-lg hover:bg-muted/30 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-students/10 rounded-lg">
                    {getDocumentIcon(document.type)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-medium text-foreground">{document.title}</h3>
                      {getStatusBadge(document.status)}
                      {document.documentNumber && (
                        <Badge variant="outline" className="text-xs">
                          #{document.documentNumber}
                        </Badge>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <User className="w-3 h-3 text-muted-foreground" />
                        <span>{document.studentName}</span>
                        <span className="text-muted-foreground">({document.studentNumber})</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3 h-3 text-muted-foreground" />
                        <span>Demandé le {new Date(document.requestDate).toLocaleDateString('fr-FR')}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Download className="w-3 h-3 text-muted-foreground" />
                        <span>{document.downloadCount} téléchargement(s)</span>
                      </div>
                    </div>
                    
                    {document.generatedDate && (
                      <p className="text-xs text-muted-foreground mt-2">
                        Généré le {new Date(document.generatedDate).toLocaleDateString('fr-FR')} à {new Date(document.generatedDate).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                    {document.status === 'generated' && (
                      <Button variant="ghost" size="sm">
                        <Download className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="font-medium">Certificat de Scolarité</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              Génération automatique instantanée
            </p>
            <Button variant="outline" size="sm" className="w-full">
              Générer
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <FileText className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="font-medium">Relevé de Notes</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              Notes officielles par semestre
            </p>
            <Button variant="outline" size="sm" className="w-full">
              Générer
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <FileText className="w-5 h-5 text-purple-600" />
              </div>
              <h3 className="font-medium">Attestation Personnalisée</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              Document sur mesure
            </p>
            <Button variant="outline" size="sm" className="w-full">
              Créer
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
