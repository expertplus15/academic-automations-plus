import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, 
  Download, 
  Eye, 
  Search, 
  Award, 
  Shield, 
  QrCode,
  Stamp,
  CheckCircle,
  Clock,
  User,
  GraduationCap
} from 'lucide-react';

interface Transcript {
  id: string;
  studentId: string;
  studentName: string;
  studentNumber: string;
  program: string;
  level: string;
  academicYear: string;
  type: 'partial' | 'complete' | 'official';
  status: 'draft' | 'validated' | 'signed' | 'delivered';
  createdAt: string;
  validatedAt?: string;
  downloadUrl?: string;
  qrCode: string;
  grades: {
    subject: string;
    grade: number;
    credits: number;
    semester: string;
  }[];
  statistics: {
    overallAverage: number;
    totalCredits: number;
    completionRate: number;
    rank?: number;
    classSize?: number;
  };
}

interface TranscriptRequest {
  id: string;
  studentId: string;
  studentName: string;
  requestType: 'official' | 'certified' | 'duplicate';
  purpose: 'employment' | 'transfer' | 'scholarship' | 'administrative' | 'other';
  status: 'pending' | 'processing' | 'ready' | 'delivered';
  requestedAt: string;
  notes?: string;
}

export function TranscriptManager() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');

  const [transcripts] = useState<Transcript[]>([
    {
      id: 'tr-001',
      studentId: 'st-001',
      studentName: 'Marie Dubois',
      studentNumber: 'L3INFO001',
      program: 'Licence Informatique',
      level: 'L3',
      academicYear: '2023-2024',
      type: 'official',
      status: 'signed',
      createdAt: '2024-01-15T10:30:00Z',
      validatedAt: '2024-01-16T14:20:00Z',
      downloadUrl: '/transcripts/tr-001.pdf',
      qrCode: 'QR-TR-001-2024',
      grades: [
        { subject: 'Algorithmes', grade: 16.5, credits: 6, semester: 'S5' },
        { subject: 'Base de données', grade: 15.0, credits: 4, semester: 'S5' },
        { subject: 'Réseaux', grade: 14.5, credits: 4, semester: 'S6' }
      ],
      statistics: {
        overallAverage: 15.2,
        totalCredits: 180,
        completionRate: 100,
        rank: 5,
        classSize: 45
      }
    },
    {
      id: 'tr-002',
      studentId: 'st-002',
      studentName: 'Pierre Martin',
      studentNumber: 'M1MATH001',
      program: 'Master Mathématiques',
      level: 'M1',
      academicYear: '2023-2024',
      type: 'partial',
      status: 'validated',
      createdAt: '2024-01-10T09:15:00Z',
      validatedAt: '2024-01-12T11:45:00Z',
      qrCode: 'QR-TR-002-2024',
      grades: [
        { subject: 'Analyse', grade: 17.0, credits: 6, semester: 'S1' },
        { subject: 'Algèbre', grade: 16.0, credits: 6, semester: 'S1' }
      ],
      statistics: {
        overallAverage: 16.5,
        totalCredits: 30,
        completionRate: 50
      }
    }
  ]);

  const [requests] = useState<TranscriptRequest[]>([
    {
      id: 'req-001',
      studentId: 'st-003',
      studentName: 'Julie Leclerc',
      requestType: 'official',
      purpose: 'employment',
      status: 'pending',
      requestedAt: '2024-01-18T08:30:00Z',
      notes: 'Urgent - Entretien le 25/01'
    },
    {
      id: 'req-002',
      studentId: 'st-004',
      studentName: 'Thomas Bernard',
      requestType: 'certified',
      purpose: 'transfer',
      status: 'processing',
      requestedAt: '2024-01-17T14:20:00Z'
    }
  ]);

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { label: string; className: string; icon: React.ReactNode }> = {
      draft: { 
        label: 'Brouillon', 
        className: 'bg-gray-100 text-gray-800',
        icon: <FileText className="h-3 w-3" />
      },
      validated: { 
        label: 'Validé', 
        className: 'bg-blue-100 text-blue-800',
        icon: <CheckCircle className="h-3 w-3" />
      },
      signed: { 
        label: 'Signé', 
        className: 'bg-green-100 text-green-800',
        icon: <Shield className="h-3 w-3" />
      },
      delivered: { 
        label: 'Délivré', 
        className: 'bg-purple-100 text-purple-800',
        icon: <Award className="h-3 w-3" />
      },
      pending: { 
        label: 'En attente', 
        className: 'bg-yellow-100 text-yellow-800',
        icon: <Clock className="h-3 w-3" />
      },
      processing: { 
        label: 'En cours', 
        className: 'bg-blue-100 text-blue-800',
        icon: <Clock className="h-3 w-3" />
      },
      ready: { 
        label: 'Prêt', 
        className: 'bg-green-100 text-green-800',
        icon: <CheckCircle className="h-3 w-3" />
      }
    };
    
    const variant = variants[status] || variants.draft;
    return (
      <Badge className={`${variant.className} flex items-center gap-1`}>
        {variant.icon}
        {variant.label}
      </Badge>
    );
  };

  const getTypeBadge = (type: string) => {
    const variants: Record<string, { label: string; className: string }> = {
      partial: { label: 'Partiel', className: 'bg-blue-100 text-blue-800' },
      complete: { label: 'Complet', className: 'bg-green-100 text-green-800' },
      official: { label: 'Officiel', className: 'bg-purple-100 text-purple-800' },
      certified: { label: 'Certifié', className: 'bg-orange-100 text-orange-800' },
      duplicate: { label: 'Duplicata', className: 'bg-gray-100 text-gray-800' }
    };
    
    const variant = variants[type] || variants.partial;
    return <Badge className={variant.className}>{variant.label}</Badge>;
  };

  const getPurposeLabel = (purpose: string) => {
    const labels: Record<string, string> = {
      employment: 'Emploi',
      transfer: 'Transfert',
      scholarship: 'Bourse',
      administrative: 'Administratif',
      other: 'Autre'
    };
    return labels[purpose] || purpose;
  };

  const filteredTranscripts = transcripts.filter(transcript => {
    const matchesSearch = transcript.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transcript.studentNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || transcript.status === filterStatus;
    const matchesType = filterType === 'all' || transcript.type === filterType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="space-y-6">
      <Tabs defaultValue="transcripts" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="transcripts">Relevés Existants</TabsTrigger>
          <TabsTrigger value="requests">Demandes</TabsTrigger>
          <TabsTrigger value="generate">Génération</TabsTrigger>
        </TabsList>

        <TabsContent value="transcripts" className="space-y-6">
          {/* Search and Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Recherche et Filtres
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label>Recherche</Label>
                  <Input
                    placeholder="Nom ou numéro étudiant..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Statut</Label>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les statuts</SelectItem>
                      <SelectItem value="draft">Brouillon</SelectItem>
                      <SelectItem value="validated">Validé</SelectItem>
                      <SelectItem value="signed">Signé</SelectItem>
                      <SelectItem value="delivered">Délivré</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les types</SelectItem>
                      <SelectItem value="partial">Partiel</SelectItem>
                      <SelectItem value="complete">Complet</SelectItem>
                      <SelectItem value="official">Officiel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>&nbsp;</Label>
                  <Button className="w-full">
                    <Search className="h-4 w-4 mr-2" />
                    Rechercher
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Transcripts List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Relevés de Notes ({filteredTranscripts.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredTranscripts.map((transcript) => (
                  <div key={transcript.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-3">
                        <GraduationCap className="h-6 w-6 mt-1 text-primary" />
                        <div>
                          <h3 className="font-semibold text-lg">{transcript.studentName}</h3>
                          <p className="text-muted-foreground">{transcript.studentNumber}</p>
                          <p className="text-sm text-muted-foreground">
                            {transcript.program} - {transcript.level}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        {getStatusBadge(transcript.status)}
                        {getTypeBadge(transcript.type)}
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4 mb-4">
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <p className="text-2xl font-bold text-primary">
                          {transcript.statistics.overallAverage.toFixed(1)}
                        </p>
                        <p className="text-sm text-muted-foreground">Moyenne générale</p>
                      </div>
                      
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <p className="text-2xl font-bold text-green-600">
                          {transcript.statistics.totalCredits}
                        </p>
                        <p className="text-sm text-muted-foreground">Crédits ECTS</p>
                      </div>
                      
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <p className="text-2xl font-bold text-blue-600">
                          {transcript.statistics.completionRate}%
                        </p>
                        <p className="text-sm text-muted-foreground">Progression</p>
                      </div>
                    </div>

                    {transcript.statistics.rank && (
                      <Alert className="mb-4">
                        <Award className="h-4 w-4" />
                        <AlertDescription>
                          Classement: {transcript.statistics.rank}e sur {transcript.statistics.classSize} étudiants
                        </AlertDescription>
                      </Alert>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <QrCode className="h-4 w-4" />
                        <span>Code: {transcript.qrCode}</span>
                        {transcript.validatedAt && (
                          <>
                            <Stamp className="h-4 w-4 ml-2" />
                            <span>Validé le {new Date(transcript.validatedAt).toLocaleDateString('fr-FR')}</span>
                          </>
                        )}
                      </div>
                      
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-1" />
                          Aperçu
                        </Button>
                        {transcript.downloadUrl && (
                          <Button size="sm">
                            <Download className="h-4 w-4 mr-1" />
                            Télécharger
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="requests">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Demandes de Relevés ({requests.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {requests.map((request) => (
                  <div key={request.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-3">
                        <User className="h-6 w-6 mt-1 text-primary" />
                        <div>
                          <h3 className="font-semibold">{request.studentName}</h3>
                          <p className="text-sm text-muted-foreground">
                            {getTypeBadge(request.requestType)} pour {getPurposeLabel(request.purpose)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Demandé le {new Date(request.requestedAt).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                      </div>
                      {getStatusBadge(request.status)}
                    </div>

                    {request.notes && (
                      <Alert className="mb-3">
                        <AlertDescription>{request.notes}</AlertDescription>
                      </Alert>
                    )}

                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="outline">
                        Voir Détails
                      </Button>
                      <Button size="sm">
                        Traiter
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="generate">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Génération de Nouveaux Relevés
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Étudiant</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un étudiant" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="st-001">Marie Dubois - L3INFO001</SelectItem>
                        <SelectItem value="st-002">Pierre Martin - M1MATH001</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Type de relevé</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Type de relevé" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="partial">Relevé partiel</SelectItem>
                        <SelectItem value="complete">Relevé complet</SelectItem>
                        <SelectItem value="official">Relevé officiel</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Période</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Période académique" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="current">Année en cours</SelectItem>
                        <SelectItem value="s1">Semestre 1</SelectItem>
                        <SelectItem value="s2">Semestre 2</SelectItem>
                        <SelectItem value="all">Toutes les années</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Options de sécurité</h4>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" defaultChecked />
                        <span className="text-sm">QR Code de vérification</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" defaultChecked />
                        <span className="text-sm">Filigrane de sécurité</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" />
                        <span className="text-sm">Signature électronique</span>
                      </label>
                    </div>
                  </div>

                  <Button className="w-full">
                    <FileText className="h-4 w-4 mr-2" />
                    Générer le Relevé
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}