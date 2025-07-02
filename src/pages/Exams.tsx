
import React from 'react';
import { ModuleLayout } from '@/components/layouts/ModuleLayout';
import { ExamsModuleSidebar } from '@/components/ExamsModuleSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Calendar, 
  Building,
  Users,
  Bot,
  Monitor,
  AlertTriangle,
  TrendingUp,
  CheckCircle,
  Clock,
  MapPin
} from 'lucide-react';

export default function Exams() {
  const stats = [
    {
      label: "Examens planifiés",
      value: "45",
      change: "+8",
      changeType: "positive" as const
    },
    {
      label: "Salles réservées",
      value: "23",
      change: "+100%",
      changeType: "positive" as const
    },
    {
      label: "Surveillants assignés",
      value: "67",
      change: "+12%",
      changeType: "positive" as const
    },
    {
      label: "Conflits détectés",
      value: "0",
      change: "-100%",
      changeType: "positive" as const
    }
  ];

  const recentExams = [
    {
      id: 1,
      subject: "Mathématiques Avancées",
      date: "2024-01-20",
      room: "Amphi A",
      students: 120,
      status: "scheduled",
      supervisor: "Dr. Marie Dubois"
    },
    {
      id: 2,
      subject: "Informatique Théorique",
      date: "2024-01-22",
      room: "Salle B102",
      students: 85,
      status: "confirmed",
      supervisor: "Prof. Jean Martin"
    },
    {
      id: 3,
      subject: "Économie Générale",
      date: "2024-01-25",
      room: "Amphi C",
      students: 150,
      status: "in_progress",
      supervisor: "Dr. Sophie Laurent"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <Badge className="bg-blue-100 text-blue-700 border-blue-200"><Calendar className="w-3 h-3 mr-1" />Planifié</Badge>;
      case 'confirmed':
        return <Badge className="bg-green-100 text-green-700 border-green-200"><CheckCircle className="w-3 h-3 mr-1" />Confirmé</Badge>;
      case 'in_progress':
        return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200"><Clock className="w-3 h-3 mr-1" />En cours</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <ModuleLayout sidebar={<ExamsModuleSidebar />}>
      <div className="p-8 space-y-8">
        {/* Header avec statistiques */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Examens IA</h1>
            <p className="text-muted-foreground text-lg mt-1">Gestion intelligente des examens avec IA anti-conflits</p>
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Card key={index} className="bg-white rounded-2xl shadow-sm border-0">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    </div>
                    <div className="p-3 bg-violet-100 rounded-xl">
                      <FileText className="w-6 h-6 text-violet-600" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-green-600">{stat.change}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonne principale */}
          <div className="lg:col-span-2 space-y-6">
            {/* Examens à venir */}
            <Card className="bg-white rounded-2xl shadow-sm border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-violet-500" />
                  Examens à venir
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentExams.map((exam) => (
                    <div
                      key={exam.id}
                      className="flex items-center justify-between p-4 rounded-xl border border-border/50 hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-violet-100 rounded-lg">
                          <FileText className="w-4 h-4 text-violet-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">{exam.subject}</p>
                          <p className="text-sm text-muted-foreground">{exam.supervisor}</p>
                        </div>
                      </div>
                      <div className="text-right space-y-1">
                        <div className="flex items-center gap-2">
                          {getStatusBadge(exam.status)}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <MapPin className="w-3 h-3" />
                          <span>{exam.room}</span>
                          <span>•</span>
                          <span>{exam.students} étudiants</span>
                        </div>
                        <span className="text-xs text-muted-foreground block">
                          {exam.date}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* IA Anti-conflits */}
            <Card className="bg-white rounded-2xl shadow-sm border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="w-5 h-5 text-violet-500" />
                  IA Anti-conflits
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <Bot className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Algorithmes d'optimisation en cours d'exécution</p>
                    <p className="text-sm mt-1">0 conflit détecté</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Colonne latérale */}
          <div className="space-y-6">
            {/* Actions rapides */}
            <Card className="bg-white rounded-2xl shadow-sm border-0">
              <CardHeader>
                <CardTitle className="text-lg">Actions rapides</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <button className="w-full p-3 text-left rounded-xl border border-border/50 hover:bg-accent/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-violet-500" />
                    <div>
                      <p className="font-medium">Planifier un examen</p>
                      <p className="text-xs text-muted-foreground">IA optimisée</p>
                    </div>
                  </div>
                </button>
                
                <button className="w-full p-3 text-left rounded-xl border border-border/50 hover:bg-accent/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <Building className="w-5 h-5 text-violet-500" />
                    <div>
                      <p className="font-medium">Gérer les salles</p>
                      <p className="text-xs text-muted-foreground">Réservations</p>
                    </div>
                  </div>
                </button>

                <button className="w-full p-3 text-left rounded-xl border border-border/50 hover:bg-accent/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-violet-500" />
                    <div>
                      <p className="font-medium">Surveillants</p>
                      <p className="text-xs text-muted-foreground">Attribution auto</p>
                    </div>
                  </div>
                </button>
              </CardContent>
            </Card>

            {/* Surveillance temps réel */}
            <Card className="bg-white rounded-2xl shadow-sm border-0">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Monitor className="w-5 h-5 text-violet-500" />
                  Surveillance temps réel
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-green-50 rounded-xl border border-green-200">
                  <p className="text-sm font-medium text-green-700">3 examens en cours</p>
                  <p className="text-xs text-green-600">Tout se déroule normalement</p>
                </div>
                
                <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
                  <p className="text-sm font-medium text-blue-700">Convocations envoyées</p>
                  <p className="text-xs text-blue-600">245 étudiants notifiés</p>
                </div>

                <div className="p-3 bg-violet-50 rounded-xl border border-violet-200">
                  <p className="text-sm font-medium text-violet-700">IA active</p>
                  <p className="text-xs text-violet-600">Optimisation continue</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ModuleLayout>
  );
}
