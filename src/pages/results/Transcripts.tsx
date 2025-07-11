import React, { useState } from 'react';
import { ResultsPageHeader } from "@/components/ResultsPageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  FileText, 
  Download, 
  Eye, 
  Search, 
  Filter, 
  GraduationCap,
  Calendar,
  Award,
  Globe,
  Shield,
  FileCheck,
  Printer,
  Mail,
  RefreshCw,
  CheckCircle,
  Clock,
  User
} from 'lucide-react';

interface Student {
  id: string;
  studentNumber: string;
  firstName: string;
  lastName: string;
  program: string;
  level: string;
  year: string;
  status: 'active' | 'graduated' | 'suspended';
  gpa: number;
  creditsEarned: number;
  totalCredits: number;
}

interface TranscriptRequest {
  id: string;
  student: Student;
  type: 'official' | 'partial' | 'international' | 'attestation';
  language: 'fr' | 'en' | 'ar';
  purpose: string;
  requestDate: string;
  status: 'pending' | 'approved' | 'ready' | 'delivered' | 'rejected';
  deliveryMethod: 'email' | 'pickup' | 'mail';
  fees: number;
  approvedBy?: string;
}

export default function Transcripts() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [transcriptType, setTranscriptType] = useState<string>('official');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('fr');

  const stats = [
    {
      title: 'Relevés Générés',
      value: '2,156',
      change: '+12%',
      changeType: 'positive' as const,
      icon: FileText,
      description: 'Ce trimestre'
    },
    {
      title: 'Demandes en Cours',
      value: '43',
      change: '-8%',
      changeType: 'positive' as const,
      icon: Clock,
      description: 'En traitement'
    },
    {
      title: 'Taux d\'Approbation',
      value: '98.2%',
      change: '+1.1%',
      changeType: 'positive' as const,
      icon: CheckCircle,
      description: 'Demandes approuvées'
    },
    {
      title: 'Temps Moyen',
      value: '2.4j',
      change: '-15%',
      changeType: 'positive' as const,
      icon: Award,
      description: 'Traitement demande'
    }
  ];

  const students: Student[] = [
    {
      id: '1',
      studentNumber: 'ETU001',
      firstName: 'Marie',
      lastName: 'Dubois',
      program: 'Informatique',
      level: 'L3',
      year: '2024',
      status: 'active',
      gpa: 15.2,
      creditsEarned: 150,
      totalCredits: 180
    },
    {
      id: '2',
      studentNumber: 'ETU002',
      firstName: 'Ahmed',
      lastName: 'Benali',
      program: 'Mathématiques',
      level: 'M1',
      year: '2024',
      status: 'active',
      gpa: 16.8,
      creditsEarned: 240,
      totalCredits: 300
    },
    {
      id: '3',
      studentNumber: 'ETU003',
      firstName: 'Sarah',
      lastName: 'Martin',
      program: 'Informatique',
      level: 'L2',
      year: '2024',
      status: 'active',
      gpa: 14.1,
      creditsEarned: 90,
      totalCredits: 120
    }
  ];

  const requests: TranscriptRequest[] = [
    {
      id: '1',
      student: students[0],
      type: 'official',
      language: 'fr',
      purpose: 'Candidature Master',
      requestDate: '2024-01-15',
      status: 'ready',
      deliveryMethod: 'email',
      fees: 15,
      approvedBy: 'Service Scolarité'
    },
    {
      id: '2',
      student: students[1],
      type: 'international',
      language: 'en',
      purpose: 'Échange international',
      requestDate: '2024-01-14',
      status: 'pending',
      deliveryMethod: 'pickup',
      fees: 25
    },
    {
      id: '3',
      student: students[2],
      type: 'partial',
      language: 'fr',
      purpose: 'Stage entreprise',
      requestDate: '2024-01-13',
      status: 'approved',
      deliveryMethod: 'email',
      fees: 10,
      approvedBy: 'Responsable L2'
    }
  ];

  const getTypeBadge = (type: TranscriptRequest['type']) => {
    const config = {
      official: { label: 'Officiel', className: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' },
      partial: { label: 'Partiel', className: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300' },
      international: { label: 'International', className: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300' },
      attestation: { label: 'Attestation', className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' }
    };
    return config[type];
  };

  const getStatusBadge = (status: TranscriptRequest['status']) => {
    const config = {
      pending: { label: 'En attente', className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' },
      approved: { label: 'Approuvé', className: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' },
      ready: { label: 'Prêt', className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' },
      delivered: { label: 'Livré', className: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300' },
      rejected: { label: 'Rejeté', className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' }
    };
    return config[status];
  };

  const getStatusColor = (status: Student['status']) => {
    const config = {
      active: 'text-green-600',
      graduated: 'text-blue-600',
      suspended: 'text-red-600'
    };
    return config[status];
  };

  const handleStudentSelection = (studentId: string, checked: boolean) => {
    if (checked) {
      setSelectedStudents(prev => [...prev, studentId]);
    } else {
      setSelectedStudents(prev => prev.filter(id => id !== studentId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedStudents(students.map(s => s.id));
    } else {
      setSelectedStudents([]);
    }
  };

  const handleGenerateTranscripts = () => {
    console.log('Génération des relevés pour:', selectedStudents);
    // Ici on implémenterait la logique de génération
  };

  const filteredStudents = students.filter(student =>
    student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.studentNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredRequests = requests.filter(request =>
    request.student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.purpose.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <ResultsPageHeader 
        title="Relevés standards" 
        subtitle="Standards académiques officiels"
      />
      
      <div className="p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          
          {/* Génération Rapide */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileCheck className="h-5 w-5 text-primary" />
                Génération Rapide de Relevés
              </CardTitle>
              <CardDescription>
                Générez des relevés de notes officiels pour vos étudiants
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Type de relevé</label>
                  <Select value={transcriptType} onValueChange={setTranscriptType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="official">Relevé officiel</SelectItem>
                      <SelectItem value="partial">Relevé partiel</SelectItem>
                      <SelectItem value="international">Transcript international</SelectItem>
                      <SelectItem value="attestation">Attestation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Langue</label>
                  <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="en">Anglais</SelectItem>
                      <SelectItem value="ar">Arabe</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Période</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="s1-2024">Semestre 1 2024</SelectItem>
                      <SelectItem value="s2-2024">Semestre 2 2024</SelectItem>
                      <SelectItem value="annuel-2024">Année complète 2024</SelectItem>
                      <SelectItem value="all">Tout le cursus</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Format</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF sécurisé</SelectItem>
                      <SelectItem value="pdf-signature">PDF + signature électronique</SelectItem>
                      <SelectItem value="blockchain">PDF + blockchain</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex gap-3">
                <Button 
                  onClick={handleGenerateTranscripts}
                  disabled={selectedStudents.length === 0}
                  className="flex items-center gap-2"
                >
                  <FileText className="h-4 w-4" />
                  Générer ({selectedStudents.length})
                </Button>
                <Button variant="outline">
                  <Eye className="h-4 w-4 mr-2" />
                  Aperçu modèle
                </Button>
                <Button variant="outline">
                  <Shield className="h-4 w-4 mr-2" />
                  Signature électronique
                </Button>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="students" className="space-y-6">
            <TabsList>
              <TabsTrigger value="students">Sélection étudiants</TabsTrigger>
              <TabsTrigger value="requests">Demandes en cours</TabsTrigger>
              <TabsTrigger value="templates">Modèles</TabsTrigger>
              <TabsTrigger value="verification">Vérification</TabsTrigger>
            </TabsList>

            <TabsContent value="students" className="space-y-4">
              {/* Recherche et actions */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Rechercher un étudiant..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filtres
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleSelectAll(selectedStudents.length !== students.length)}
                  >
                    {selectedStudents.length === students.length ? 'Désélectionner tout' : 'Sélectionner tout'}
                  </Button>
                </div>
              </div>

              {/* Liste des étudiants */}
              <div className="grid gap-4">
                {filteredStudents.map((student) => (
                  <Card key={student.id} className={`hover:shadow-md transition-shadow ${selectedStudents.includes(student.id) ? 'ring-2 ring-primary' : ''}`}>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-4">
                        <Checkbox
                          checked={selectedStudents.includes(student.id)}
                          onCheckedChange={(checked) => handleStudentSelection(student.id, checked as boolean)}
                        />
                        
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
                          <div>
                            <p className="font-medium">{student.firstName} {student.lastName}</p>
                            <p className="text-sm text-muted-foreground">{student.studentNumber}</p>
                          </div>
                          
                          <div>
                            <p className="text-sm font-medium">{student.program}</p>
                            <p className="text-sm text-muted-foreground">{student.level} - {student.year}</p>
                          </div>
                          
                          <div>
                            <p className="text-sm font-medium">Moyenne: {student.gpa}/20</p>
                            <p className={`text-sm ${getStatusColor(student.status)}`}>
                              {student.status === 'active' ? 'Actif' : 
                               student.status === 'graduated' ? 'Diplômé' : 'Suspendu'}
                            </p>
                          </div>
                          
                          <div>
                            <p className="text-sm font-medium">Crédits ECTS</p>
                            <p className="text-sm text-muted-foreground">
                              {student.creditsEarned}/{student.totalCredits}
                            </p>
                          </div>
                          
                          <div className="hidden md:block">
                            <div className="w-full bg-muted rounded-full h-2">
                              <div 
                                className="bg-primary h-2 rounded-full" 
                                style={{ width: `${(student.creditsEarned / student.totalCredits) * 100}%` }}
                              ></div>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              {Math.round((student.creditsEarned / student.totalCredits) * 100)}% complété
                            </p>
                          </div>
                          
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <FileText className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="requests" className="space-y-4">
              <div className="space-y-4">
                {filteredRequests.map((request) => {
                  const typeBadge = getTypeBadge(request.type);
                  const statusBadge = getStatusBadge(request.status);
                  
                  return (
                    <Card key={request.id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-medium">
                              {request.student.firstName} {request.student.lastName}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {request.student.studentNumber} • {request.purpose}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Badge className={typeBadge.className}>
                              {typeBadge.label}
                            </Badge>
                            <Badge className={statusBadge.className}>
                              {statusBadge.label}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                          <div>
                            <span className="text-muted-foreground">Date demande:</span>
                            <p>{new Date(request.requestDate).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Langue:</span>
                            <p>{request.language === 'fr' ? 'Français' : request.language === 'en' ? 'Anglais' : 'Arabe'}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Livraison:</span>
                            <p>{request.deliveryMethod === 'email' ? 'Email' : request.deliveryMethod === 'pickup' ? 'Retrait' : 'Courrier'}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Frais:</span>
                            <p>{request.fees}€</p>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          {request.status === 'pending' && (
                            <>
                              <Button size="sm">
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Approuver
                              </Button>
                              <Button size="sm" variant="outline">
                                Rejeter
                              </Button>
                            </>
                          )}
                          
                          {request.status === 'ready' && (
                            <>
                              <Button size="sm">
                                <Download className="h-4 w-4 mr-2" />
                                Télécharger
                              </Button>
                              <Button size="sm" variant="outline">
                                <Mail className="h-4 w-4 mr-2" />
                                Envoyer
                              </Button>
                            </>
                          )}
                          
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4 mr-2" />
                            Détails
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="templates" className="space-y-4">
              <Card>
                <CardContent className="text-center py-8">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Modèles de relevés</h3>
                  <p className="text-muted-foreground">
                    Gérez et personnalisez vos modèles de relevés de notes
                  </p>
                  <Button className="mt-4">
                    <FileText className="h-4 w-4 mr-2" />
                    Créer un modèle
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="verification" className="space-y-4">
              <Card>
                <CardContent className="text-center py-8">
                  <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Vérification des relevés</h3>
                  <p className="text-muted-foreground">
                    Vérifiez l'authenticité des relevés avec signature électronique et blockchain
                  </p>
                  <Button className="mt-4">
                    <Shield className="h-4 w-4 mr-2" />
                    Vérifier un document
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}