import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Send, 
  Users, 
  Mail, 
  MessageSquare, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Download,
  Filter
} from 'lucide-react';

interface Student {
  id: string;
  name: string;
  email: string;
  phone?: string;
  program: string;
  status: 'registered' | 'pending' | 'absent';
  lastInvitationSent?: string;
}

interface BulkInvitationJob {
  id: string;
  type: 'email' | 'sms' | 'both';
  examId: string;
  examTitle: string;
  totalStudents: number;
  sentCount: number;
  successCount: number;
  failedCount: number;
  status: 'preparing' | 'sending' | 'completed' | 'failed';
  createdAt: string;
  completedAt?: string;
}

export function BulkInvitations() {
  const [selectedExam, setSelectedExam] = useState('');
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [invitationType, setInvitationType] = useState<'email' | 'sms' | 'both'>('email');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [filterProgram, setFilterProgram] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const [students] = useState<Student[]>([
    {
      id: '1',
      name: 'Jean Dupont',
      email: 'jean.dupont@email.com',
      phone: '0123456789',
      program: 'Informatique L3',
      status: 'registered',
      lastInvitationSent: '2024-01-14'
    },
    {
      id: '2',
      name: 'Marie Martin',
      email: 'marie.martin@email.com',
      phone: '0123456790',
      program: 'Informatique L3',
      status: 'registered'
    },
    {
      id: '3',
      name: 'Pierre Durand',
      email: 'pierre.durand@email.com',
      program: 'Mathématiques L2',
      status: 'pending'
    }
  ]);

  const [jobs, setJobs] = useState<BulkInvitationJob[]>([
    {
      id: '1',
      type: 'email',
      examId: '1',
      examTitle: 'Mathématiques - Session 1',
      totalStudents: 45,
      sentCount: 45,
      successCount: 43,
      failedCount: 2,
      status: 'completed',
      createdAt: '2024-01-15 09:30',
      completedAt: '2024-01-15 09:35'
    },
    {
      id: '2',
      type: 'sms',
      examId: '2',
      examTitle: 'Physique - Session 2',
      totalStudents: 32,
      sentCount: 18,
      successCount: 17,
      failedCount: 1,
      status: 'sending',
      createdAt: '2024-01-15 10:15'
    }
  ]);

  const exams = [
    { id: '1', title: 'Mathématiques - Session 1', date: '2024-07-15', time: '09:00' },
    { id: '2', title: 'Physique - Session 2', date: '2024-07-16', time: '14:00' },
    { id: '3', title: 'Chimie - Session 1', date: '2024-07-17', time: '10:30' }
  ];

  const templates = [
    { id: '1', name: 'Convocation Standard', type: 'email' },
    { id: '2', name: 'Rappel SMS', type: 'sms' },
    { id: '3', name: 'Notification Urgente', type: 'both' }
  ];

  const filteredStudents = students.filter(student => {
    if (filterProgram !== 'all' && !student.program.includes(filterProgram)) return false;
    if (filterStatus !== 'all' && student.status !== filterStatus) return false;
    return true;
  });

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedStudents(filteredStudents.map(s => s.id));
    } else {
      setSelectedStudents([]);
    }
  };

  const handleStudentSelect = (studentId: string, checked: boolean) => {
    if (checked) {
      setSelectedStudents([...selectedStudents, studentId]);
    } else {
      setSelectedStudents(selectedStudents.filter(id => id !== studentId));
    }
  };

  const startBulkInvitation = () => {
    const selectedExamData = exams.find(e => e.id === selectedExam);
    if (!selectedExamData || selectedStudents.length === 0) return;

    const newJob: BulkInvitationJob = {
      id: Date.now().toString(),
      type: invitationType,
      examId: selectedExam,
      examTitle: selectedExamData.title,
      totalStudents: selectedStudents.length,
      sentCount: 0,
      successCount: 0,
      failedCount: 0,
      status: 'preparing',
      createdAt: new Date().toLocaleString()
    };

    setJobs([newJob, ...jobs]);

    // Simuler l'envoi
    setTimeout(() => {
      setJobs(prev => prev.map(job => 
        job.id === newJob.id 
          ? { ...job, status: 'sending' as const }
          : job
      ));
      
      // Simuler la progression
      let sent = 0;
      const interval = setInterval(() => {
        sent += Math.floor(Math.random() * 5) + 1;
        if (sent >= newJob.totalStudents) {
          sent = newJob.totalStudents;
          clearInterval(interval);
          setJobs(prev => prev.map(job => 
            job.id === newJob.id 
              ? { 
                  ...job, 
                  status: 'completed' as const,
                  sentCount: sent,
                  successCount: sent - Math.floor(Math.random() * 3),
                  failedCount: Math.floor(Math.random() * 3),
                  completedAt: new Date().toLocaleString()
                }
              : job
          ));
        } else {
          setJobs(prev => prev.map(job => 
            job.id === newJob.id 
              ? { 
                  ...job,
                  sentCount: sent,
                  successCount: sent - Math.floor(Math.random() * 2)
                }
              : job
          ));
        }
      }, 500);
    }, 1000);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'preparing':
        return <Badge className="bg-blue-100 text-blue-700"><Clock className="w-3 h-3 mr-1" />Préparation</Badge>;
      case 'sending':
        return <Badge className="bg-orange-100 text-orange-700"><Send className="w-3 h-3 mr-1" />Envoi en cours</Badge>;
      case 'completed':
        return <Badge className="bg-green-100 text-green-700"><CheckCircle className="w-3 h-3 mr-1" />Terminé</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-700"><AlertCircle className="w-3 h-3 mr-1" />Échec</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Configuration de l'envoi groupé */}
      <Card className="bg-white rounded-2xl shadow-sm border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="w-5 h-5 text-violet-500" />
            Envoi groupé de convocations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium">Examen</label>
              <Select value={selectedExam} onValueChange={setSelectedExam}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un examen" />
                </SelectTrigger>
                <SelectContent>
                  {exams.map(exam => (
                    <SelectItem key={exam.id} value={exam.id}>
                      {exam.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Type d'envoi</label>
              <Select value={invitationType} onValueChange={(value: any) => setInvitationType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">Email uniquement</SelectItem>
                  <SelectItem value="sms">SMS uniquement</SelectItem>
                  <SelectItem value="both">Email + SMS</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Modèle</label>
              <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                <SelectTrigger>
                  <SelectValue placeholder="Choisir un modèle" />
                </SelectTrigger>
                <SelectContent>
                  {templates
                    .filter(t => t.type === invitationType || t.type === 'both' || invitationType === 'both')
                    .map(template => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name}
                      </SelectItem>
                    ))
                  }
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button 
                onClick={startBulkInvitation}
                disabled={!selectedExam || selectedStudents.length === 0}
                className="w-full bg-violet-600 hover:bg-violet-700"
              >
                <Send className="w-4 h-4 mr-2" />
                Envoyer ({selectedStudents.length})
              </Button>
            </div>
          </div>

          {selectedStudents.length > 0 && (
            <Alert>
              <Users className="w-4 h-4" />
              <AlertDescription>
                {selectedStudents.length} étudiant(s) sélectionné(s) pour l'envoi groupé
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Sélection des étudiants */}
      <Card className="bg-white rounded-2xl shadow-sm border-0">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-violet-500" />
              Sélection des étudiants
            </CardTitle>
            <div className="flex items-center gap-2">
              <Select value={filterProgram} onValueChange={setFilterProgram}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Programme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les programmes</SelectItem>
                  <SelectItem value="Informatique">Informatique</SelectItem>
                  <SelectItem value="Mathématiques">Mathématiques</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  <SelectItem value="registered">Inscrits</SelectItem>
                  <SelectItem value="pending">En attente</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
              <Checkbox
                checked={selectedStudents.length === filteredStudents.length && filteredStudents.length > 0}
                onCheckedChange={handleSelectAll}
              />
              <span className="font-medium">Sélectionner tous ({filteredStudents.length})</span>
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto">
              {filteredStudents.map(student => (
                <div key={student.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={selectedStudents.includes(student.id)}
                      onCheckedChange={(checked) => handleStudentSelect(student.id, checked as boolean)}
                    />
                    <div>
                      <p className="font-medium">{student.name}</p>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <span>{student.email}</span>
                        {student.phone && <span>{student.phone}</span>}
                        <span>{student.program}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={student.status === 'registered' ? 'default' : 'secondary'}>
                      {student.status === 'registered' ? 'Inscrit' : 'En attente'}
                    </Badge>
                    {student.lastInvitationSent && (
                      <span className="text-xs text-muted-foreground">
                        Dernier envoi: {student.lastInvitationSent}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Historique des envois */}
      <Card className="bg-white rounded-2xl shadow-sm border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-violet-500" />
            Historique des envois groupés
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {jobs.map(job => (
              <div key={job.id} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">{job.examTitle}</h4>
                    <p className="text-sm text-muted-foreground">
                      {job.type === 'email' ? 'Email' : job.type === 'sms' ? 'SMS' : 'Email + SMS'} • 
                      {job.totalStudents} destinataires • {job.createdAt}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(job.status)}
                    <Button variant="ghost" size="sm">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {job.status === 'sending' && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Progression</span>
                      <span>{job.sentCount}/{job.totalStudents}</span>
                    </div>
                    <Progress value={(job.sentCount / job.totalStudents) * 100} className="h-2" />
                  </div>
                )}

                {job.status === 'completed' && (
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">{job.successCount}</p>
                      <p className="text-muted-foreground">Réussis</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-red-600">{job.failedCount}</p>
                      <p className="text-muted-foreground">Échecs</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">
                        {Math.round((job.successCount / job.totalStudents) * 100)}%
                      </p>
                      <p className="text-muted-foreground">Taux de réussite</p>
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