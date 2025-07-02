import { useState } from 'react';
import { ExamsModuleLayout } from "@/components/layouts/ExamsModuleLayout";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Mail, 
  Download, 
  Send, 
  FileText, 
  Users, 
  Calendar,
  Filter,
  Search,
  Zap,
  CheckCircle,
  Clock
} from 'lucide-react';

export default function Invitations() {
  const [selectedExam, setSelectedExam] = useState('');
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [emailTemplate, setEmailTemplate] = useState('default');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showPreview, setShowPreview] = useState(false);

  // Données simulées
  const exams = [
    { id: '1', title: 'Mathématiques - Session 1', date: '2024-07-15', time: '09:00', room: 'Amphi A' },
    { id: '2', title: 'Physique - Session 2', date: '2024-07-16', time: '14:00', room: 'Salle 205' },
    { id: '3', title: 'Chimie - Session 1', date: '2024-07-17', time: '10:30', room: 'Labo C' }
  ];

  const students = [
    { 
      id: '1', 
      name: 'Jean Dupont', 
      email: 'jean.dupont@email.com', 
      program: 'Informatique',
      status: 'registered',
      sent: false 
    },
    { 
      id: '2', 
      name: 'Marie Claire', 
      email: 'marie.claire@email.com', 
      program: 'Mathématiques',
      status: 'registered',
      sent: true 
    },
    { 
      id: '3', 
      name: 'Pierre Martin', 
      email: 'pierre.martin@email.com', 
      program: 'Physique',
      status: 'pending',
      sent: false 
    }
  ];

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'sent' && student.sent) ||
                         (statusFilter === 'not_sent' && !student.sent);
    return matchesSearch && matchesStatus;
  });

  const handleStudentSelect = (studentId: string, checked: boolean) => {
    if (checked) {
      setSelectedStudents(prev => [...prev, studentId]);
    } else {
      setSelectedStudents(prev => prev.filter(id => id !== studentId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedStudents(filteredStudents.map(s => s.id));
    } else {
      setSelectedStudents([]);
    }
  };

  const handleSendInvitations = () => {
    console.log('Sending invitations to:', selectedStudents);
    // TODO: Implémenter l'envoi des convocations
  };

  const handleGeneratePDF = () => {
    console.log('Generating PDF for:', selectedStudents);
    // TODO: Implémenter la génération PDF
  };

  const templateOptions = [
    { value: 'default', label: 'Modèle Standard' },
    { value: 'formal', label: 'Modèle Formel' },
    { value: 'reminder', label: 'Modèle Rappel' },
    { value: 'custom', label: 'Modèle Personnalisé' }
  ];

  // Métriques
  const totalStudents = students.length;
  const sentInvitations = students.filter(s => s.sent).length;
  const pendingInvitations = students.filter(s => !s.sent).length;
  const selectedCount = selectedStudents.length;

  return (
    <ExamsModuleLayout 
      title="Convocations massives" 
      subtitle="Génération automatique des convocations"
    >
      <div className="p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Métriques */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <Users className="w-8 h-8 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold">{totalStudents}</p>
                    <p className="text-sm text-muted-foreground">Étudiants Total</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold">{sentInvitations}</p>
                    <p className="text-sm text-muted-foreground">Envoyées</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <Clock className="w-8 h-8 text-orange-600" />
                  <div>
                    <p className="text-2xl font-bold">{pendingInvitations}</p>
                    <p className="text-sm text-muted-foreground">En Attente</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <Mail className="w-8 h-8 text-purple-600" />
                  <div>
                    <p className="text-2xl font-bold">{selectedCount}</p>
                    <p className="text-sm text-muted-foreground">Sélectionnés</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="generate" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="generate">Génération</TabsTrigger>
              <TabsTrigger value="templates">Modèles</TabsTrigger>
              <TabsTrigger value="history">Historique</TabsTrigger>
            </TabsList>
            
            <TabsContent value="generate" className="space-y-6">
              {/* Configuration */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-purple-600" />
                    Configuration des Convocations
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Sélectionner un examen
                      </label>
                      <Select value={selectedExam} onValueChange={setSelectedExam}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choisir un examen..." />
                        </SelectTrigger>
                        <SelectContent>
                          {exams.map((exam) => (
                            <SelectItem key={exam.id} value={exam.id}>
                              {exam.title} - {exam.date} à {exam.time}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Modèle de convocation
                      </label>
                      <Select value={emailTemplate} onValueChange={setEmailTemplate}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {templateOptions.map((template) => (
                            <SelectItem key={template.value} value={template.value}>
                              {template.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button 
                      onClick={handleSendInvitations}
                      disabled={selectedStudents.length === 0 || !selectedExam}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Envoyer par Email ({selectedCount})
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={handleGeneratePDF}
                      disabled={selectedStudents.length === 0 || !selectedExam}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Télécharger PDF
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => setShowPreview(!showPreview)}
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      {showPreview ? 'Masquer' : 'Aperçu'}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Filtres et sélection */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex gap-4 items-center mb-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Rechercher un étudiant..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Statut d'envoi" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous</SelectItem>
                        <SelectItem value="sent">Envoyées</SelectItem>
                        <SelectItem value="not_sent">Non envoyées</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="select-all"
                        checked={selectedStudents.length === filteredStudents.length && filteredStudents.length > 0}
                        onCheckedChange={handleSelectAll}
                      />
                      <label htmlFor="select-all" className="text-sm font-medium">
                        Sélectionner tout ({filteredStudents.length})
                      </label>
                    </div>
                    {selectedStudents.length > 0 && (
                      <Badge variant="outline">
                        {selectedStudents.length} sélectionné(s)
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Liste des étudiants */}
              <Card>
                <CardHeader>
                  <CardTitle>Étudiants Concernés</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {filteredStudents.map((student) => (
                      <div key={student.id} className="flex items-center justify-between p-3 border rounded hover:bg-accent/50">
                        <div className="flex items-center gap-3">
                          <Checkbox
                            checked={selectedStudents.includes(student.id)}
                            onCheckedChange={(checked) => handleStudentSelect(student.id, checked as boolean)}
                          />
                          <div>
                            <p className="font-medium">{student.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {student.email} • {student.program}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={student.status === 'registered' ? 'default' : 'outline'}>
                            {student.status}
                          </Badge>
                          {student.sent ? (
                            <Badge className="bg-green-100 text-green-700">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Envoyée
                            </Badge>
                          ) : (
                            <Badge variant="outline">
                              <Clock className="w-3 h-3 mr-1" />
                              En attente
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Aperçu */}
              {showPreview && (
                <Card>
                  <CardHeader>
                    <CardTitle>Aperçu de la Convocation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-50 p-6 rounded border">
                      <div className="text-center mb-6">
                        <h2 className="text-2xl font-bold">CONVOCATION D'EXAMEN</h2>
                        <p className="text-lg text-muted-foreground">Université XYZ</p>
                      </div>
                      
                      <div className="space-y-4">
                        <p><strong>Nom:</strong> [Nom de l'étudiant]</p>
                        <p><strong>Numéro étudiant:</strong> [Numéro]</p>
                        <p><strong>Examen:</strong> {exams.find(e => e.id === selectedExam)?.title || 'Sélectionner un examen'}</p>
                        <p><strong>Date:</strong> {exams.find(e => e.id === selectedExam)?.date || 'Date à définir'}</p>
                        <p><strong>Heure:</strong> {exams.find(e => e.id === selectedExam)?.time || 'Heure à définir'}</p>
                        <p><strong>Lieu:</strong> {exams.find(e => e.id === selectedExam)?.room || 'Lieu à définir'}</p>
                        
                        <div className="mt-6 text-sm text-muted-foreground">
                          <p>Veuillez vous présenter 15 minutes avant le début de l'épreuve avec votre carte d'étudiant et une pièce d'identité.</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="templates" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Gestion des Modèles</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <FileText className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Modèles de Convocations</h3>
                    <p className="text-muted-foreground mb-4">
                      Créez et gérez vos modèles de convocations personnalisés.
                    </p>
                    <Button variant="outline">
                      <FileText className="w-4 h-4 mr-2" />
                      Créer un Modèle
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="history" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Historique des Envois</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 border rounded">
                      <div>
                        <p className="font-medium">Mathématiques - Session 1</p>
                        <p className="text-sm text-muted-foreground">25 convocations envoyées • 2024-07-10</p>
                      </div>
                      <Badge className="bg-green-100 text-green-700">Envoyé</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 border rounded">
                      <div>
                        <p className="font-medium">Physique - Session 2</p>
                        <p className="text-sm text-muted-foreground">18 convocations envoyées • 2024-07-09</p>
                      </div>
                      <Badge className="bg-green-100 text-green-700">Envoyé</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ExamsModuleLayout>
  );
}