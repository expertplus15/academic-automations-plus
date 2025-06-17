
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Download, Search, Filter, Plus, Eye, Clock, CheckCircle } from 'lucide-react';

const mockDocuments = [
  {
    id: '1',
    type: 'certificate_enrollment',
    title: 'Certificat de scolarité',
    student: 'Jean Dupont',
    studentNumber: 'INF24001',
    requestDate: '2024-01-15',
    status: 'approved',
    documentNumber: 'CS24001'
  },
  {
    id: '2',
    type: 'transcript',
    title: 'Relevé de notes',
    student: 'Marie Martin',
    studentNumber: 'MAT24002',
    requestDate: '2024-01-14',
    status: 'pending',
    documentNumber: null
  },
  {
    id: '3',
    type: 'internship_agreement',
    title: 'Convention de stage',
    student: 'Pierre Moreau',
    studentNumber: 'GC24003',
    requestDate: '2024-01-13',
    status: 'generated',
    documentNumber: 'ST24001'
  }
];

const documentTypes = [
  { code: 'certificate_enrollment', name: 'Certificat de scolarité', description: 'Attestation d\'inscription' },
  { code: 'transcript', name: 'Relevé de notes', description: 'Bulletin officiel des notes' },
  { code: 'internship_agreement', name: 'Convention de stage', description: 'Document pour les stages' },
  { code: 'diploma', name: 'Diplôme', description: 'Certificat de fin d\'études' },
  { code: 'attendance_certificate', name: 'Certificat d\'assiduité', description: 'Attestation de présence' }
];

export function DocumentsManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState('requests');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Approuvé</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">En attente</Badge>;
      case 'generated':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Généré</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejeté</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'generated':
        return <Download className="w-4 h-4 text-blue-500" />;
      default:
        return <FileText className="w-4 h-4 text-gray-500" />;
    }
  };

  const filteredRequests = mockDocuments.filter(doc =>
    doc.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.studentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">23</p>
                <p className="text-sm text-muted-foreground">Demandes actives</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">156</p>
                <p className="text-sm text-muted-foreground">Documents générés</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">2.3h</p>
                <p className="text-sm text-muted-foreground">Délai moyen</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Download className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">94%</p>
                <p className="text-sm text-muted-foreground">Taux de satisfaction</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-students" />
                Documents Administratifs
              </CardTitle>
              <CardDescription>
                Génération automatique de certificats et attestations
              </CardDescription>
            </div>
            <Button className="bg-students hover:bg-students/90">
              <Plus className="w-4 h-4 mr-2" />
              Nouvelle demande
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par étudiant, numéro ou type de document..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filtres
            </Button>
          </div>

          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="requests">Demandes</TabsTrigger>
              <TabsTrigger value="templates">Modèles</TabsTrigger>
              <TabsTrigger value="generated">Générés</TabsTrigger>
            </TabsList>

            <TabsContent value="requests" className="space-y-4">
              {filteredRequests.map((request) => (
                <div key={request.id} className="flex items-center gap-4 p-4 border border-border/50 rounded-lg hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(request.status)}
                    <div>
                      <p className="font-medium text-foreground">{request.title}</p>
                      {request.documentNumber && (
                        <p className="text-sm text-muted-foreground">N° {request.documentNumber}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <p className="text-sm font-medium">{request.student}</p>
                    <p className="text-xs text-muted-foreground">{request.studentNumber}</p>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">{request.requestDate}</p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {getStatusBadge(request.status)}
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                    {request.status === 'generated' && (
                      <Button variant="ghost" size="sm">
                        <Download className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="templates" className="space-y-4">
              {documentTypes.map((template) => (
                <div key={template.code} className="flex items-center gap-4 p-4 border border-border/50 rounded-lg hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-blue-500" />
                    <div>
                      <p className="font-medium text-foreground">{template.name}</p>
                      <p className="text-sm text-muted-foreground">{template.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex-1" />
                  
                  <div className="flex items-center gap-3">
                    <Badge variant="outline">Actif</Badge>
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="generated" className="space-y-4">
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Documents générés</h3>
                <p className="text-muted-foreground">Les documents générés apparaîtront ici</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
