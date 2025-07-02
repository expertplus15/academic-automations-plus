import React from 'react';
import { ModuleLayout } from '@/components/layouts/ModuleLayout';
import { ElearningModuleSidebar } from '@/components/ElearningModuleSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Monitor, 
  Play, 
  Users,
  BookOpen,
  Award,
  MessageCircle,
  BarChart3,
  TrendingUp,
  Video,
  CheckCircle,
  Clock,
  AlertTriangle
} from 'lucide-react';

export default function Elearning() {
  const stats = [
    {
      label: "Cours actifs",
      value: "142",
      change: "+8",
      changeType: "positive" as const
    },
    {
      label: "Étudiants connectés",
      value: "1,234",
      change: "+15%",
      changeType: "positive" as const
    },
    {
      label: "Taux de completion",
      value: "87%",
      change: "+5%",
      changeType: "positive" as const
    },
    {
      label: "Classes virtuelles",
      value: "23",
      change: "+12",
      changeType: "positive" as const
    }
  ];

  const recentCourses = [
    {
      id: 1,
      title: "Introduction à la Programmation",
      instructor: "Dr. Marie Dubois",
      students: 45,
      status: "active",
      completion: "78%"
    },
    {
      id: 2,
      title: "Marketing Digital Avancé",
      instructor: "Prof. Jean Martin",
      students: 32,
      status: "pending",
      completion: "92%"
    },
    {
      id: 3,
      title: "Gestion de Projet Agile",
      instructor: "Dr. Sophie Laurent",
      students: 28,
      status: "completed",
      completion: "100%"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-700 border-green-200"><Play className="w-3 h-3 mr-1" />Actif</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200"><Clock className="w-3 h-3 mr-1" />En attente</Badge>;
      case 'completed':
        return <Badge className="bg-blue-100 text-blue-700 border-blue-200"><CheckCircle className="w-3 h-3 mr-1" />Terminé</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <ModuleLayout sidebar={<ElearningModuleSidebar />}>
      <div className="p-8 space-y-8">
        {/* Header avec statistiques */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">eLearning</h1>
            <p className="text-muted-foreground text-lg mt-1">Plateforme d'apprentissage numérique</p>
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
                    <div className="p-3 bg-cyan-100 rounded-xl">
                      <Monitor className="w-6 h-6 text-cyan-600" />
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
            {/* Cours récents */}
            <Card className="bg-white rounded-2xl shadow-sm border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-cyan-500" />
                  Cours récents
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentCourses.map((course) => (
                    <div
                      key={course.id}
                      className="flex items-center justify-between p-4 rounded-xl border border-border/50 hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-cyan-100 rounded-lg">
                          <BookOpen className="w-4 h-4 text-cyan-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">{course.title}</p>
                          <p className="text-sm text-muted-foreground">{course.instructor}</p>
                        </div>
                      </div>
                      <div className="text-right space-y-1">
                        <div className="flex items-center gap-2">
                          {getStatusBadge(course.status)}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Users className="w-3 h-3" />
                          <span>{course.students} étudiants</span>
                          <span>•</span>
                          <span>{course.completion}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Analytics */}
            <Card className="bg-white rounded-2xl shadow-sm border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-cyan-500" />
                  Analytics d'engagement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Graphiques d'engagement à venir</p>
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
                    <BookOpen className="w-5 h-5 text-cyan-500" />
                    <div>
                      <p className="font-medium">Créer un cours</p>
                      <p className="text-xs text-muted-foreground">Nouveau contenu</p>
                    </div>
                  </div>
                </button>
                
                <button className="w-full p-3 text-left rounded-xl border border-border/50 hover:bg-accent/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <Video className="w-5 h-5 text-cyan-500" />
                    <div>
                      <p className="font-medium">Classe virtuelle</p>
                      <p className="text-xs text-muted-foreground">Démarrer session</p>
                    </div>
                  </div>
                </button>

                <button className="w-full p-3 text-left rounded-xl border border-border/50 hover:bg-accent/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <Award className="w-5 h-5 text-cyan-500" />
                    <div>
                      <p className="font-medium">Gamification</p>
                      <p className="text-xs text-muted-foreground">Badges & récompenses</p>
                    </div>
                  </div>
                </button>
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card className="bg-white rounded-2xl shadow-sm border-0">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-cyan-500" />
                  Notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
                  <p className="text-sm font-medium text-blue-700">5 nouveaux forums</p>
                  <p className="text-xs text-blue-600">Discussions actives</p>
                </div>
                
                <div className="p-3 bg-green-50 rounded-xl border border-green-200">
                  <p className="text-sm font-medium text-green-700">Streaming optimisé</p>
                  <p className="text-xs text-green-600">Performance +20%</p>
                </div>

                <div className="p-3 bg-yellow-50 rounded-xl border border-yellow-200">
                  <p className="text-sm font-medium text-yellow-700">Mise à jour SCORM</p>
                  <p className="text-xs text-yellow-600">Nouvelle version disponible</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ModuleLayout>
  );
}