import { DashboardHeader } from "@/components/DashboardHeader";
import { ModuleCard } from "@/components/ModuleCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  GraduationCap, 
  BookOpen, 
  Calendar, 
  Clock,
  Users,
  MapPin,
  Plus,
  Settings,
  AlertTriangle
} from "lucide-react";

export default function Academic() {
  const academicStats = [
    { label: "Programmes Actifs", value: "24" },
    { label: "Matières Enseignées", value: "156" },
    { label: "Classes Formées", value: "89" },
    { label: "Heures/Semaine", value: "2,340" }
  ];

  const programs = [
    {
      name: "Master Informatique",
      code: "MI-2025",
      level: "Master",
      duration: "4 semestres",
      credits: 120,
      students: 847,
      status: "active"
    },
    {
      name: "Licence Marketing Digital",
      code: "LMD-2025", 
      level: "Licence",
      duration: "6 semestres",
      credits: 180,
      students: 623,
      status: "active"
    },
    {
      name: "DUT Génie Civil",
      code: "DGC-2025",
      level: "DUT",
      duration: "4 semestres", 
      credits: 120,
      students: 456,
      status: "active"
    }
  ];

  const todaySchedule = [
    {
      time: "08:00 - 10:00",
      subject: "Algorithmique Avancée",
      teacher: "Prof. Martin",
      room: "A101",
      class: "MI-M1",
      students: 45,
      conflicts: false
    },
    {
      time: "10:15 - 12:15", 
      subject: "Marketing Digital",
      teacher: "Dr. Dubois",
      room: "B205",
      class: "LMD-L3",
      students: 38,
      conflicts: false
    },
    {
      time: "14:00 - 16:00",
      subject: "Résistance des Matériaux",
      teacher: "Prof. Chen",
      room: "C301",
      class: "DGC-DUT2",
      students: 42,
      conflicts: true
    },
    {
      time: "16:15 - 18:15",
      subject: "Base de Données",
      teacher: "Dr. Wilson",
      room: "A102",
      class: "MI-M1",
      students: 45,
      conflicts: false
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-academic/10 text-academic border-academic/20">Actif</Badge>;
      case "inactive":
        return <Badge variant="secondary">Inactif</Badge>;
      default:
        return <Badge variant="outline">Inconnu</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader 
        title="Académique & Pédagogie" 
        subtitle="Gestion des programmes, matières et emplois du temps"
      />
      
      <main className="p-6 space-y-6">
        {/* Feature Highlight */}
        <div className="bg-gradient-to-r from-academic/10 to-academic/5 rounded-lg p-6 border border-academic/20">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-academic rounded-lg flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">Gestion Académique Intégrée</h2>
              <p className="text-muted-foreground">Programmes, matières, emplois du temps intelligents</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Gérez l'ensemble de votre offre pédagogique avec notre système intelligent de planification 
            anti-conflits et de gestion des cursus conformes aux standards ECTS.
          </p>
          <div className="flex gap-3">
            <Button className="bg-academic hover:bg-academic/90">
              <Plus className="w-4 h-4 mr-2" />
              Nouveau Programme
            </Button>
            <Button variant="outline">
              <Calendar className="w-4 h-4 mr-2" />
              Planifier Cours
            </Button>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {academicStats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ModuleCard
            title="Emploi du Temps IA"
            description="Planification anti-conflits"
            icon={Calendar}
            color="academic"
            actions={[
              { label: "Générer Planning", onClick: () => {} }
            ]}
          />
          <ModuleCard
            title="Gestion Programmes"
            description="Cursus et diplômes"
            icon={BookOpen}
            color="academic"
            actions={[
              { label: "Voir Programmes", onClick: () => {}, variant: "outline" }
            ]}
          />
          <ModuleCard
            title="Configuration"
            description="Paramètres académiques"
            icon={Settings}
            color="academic"
            actions={[
              { label: "Configurer", onClick: () => {}, variant: "outline" }
            ]}
          />
        </div>

        {/* Programs Overview */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-academic" />
                  Programmes d'Études
                </CardTitle>
                <CardDescription>
                  Vue d'ensemble des cursus et filières
                </CardDescription>
              </div>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Nouveau Programme
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {programs.map((program, index) => (
                <div key={index} className="flex items-center gap-4 p-4 border border-border/50 rounded-lg hover:bg-muted/30 transition-colors">
                  <div className="w-12 h-12 bg-academic/10 rounded-lg flex items-center justify-center">
                    <GraduationCap className="w-6 h-6 text-academic" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-medium text-foreground">{program.name}</h3>
                      {getStatusBadge(program.status)}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {program.code} • {program.level} • {program.duration} • {program.credits} ECTS
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-lg font-semibold text-foreground">{program.students}</p>
                    <p className="text-xs text-muted-foreground">étudiants</p>
                  </div>
                  
                  <Button variant="ghost" size="sm">
                    <Settings className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Today's Schedule */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-academic" />
              Emploi du Temps Aujourd'hui
            </CardTitle>
            <CardDescription>
              Planning des cours en temps réel avec détection de conflits
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {todaySchedule.map((schedule, index) => (
                <div key={index} className={`flex items-center gap-4 p-4 rounded-lg transition-colors ${
                  schedule.conflicts 
                    ? "border border-destructive/20 bg-destructive/5" 
                    : "border border-border/50 hover:bg-muted/30"
                }`}>
                  <div className="text-center min-w-[100px]">
                    <p className="text-sm font-medium text-foreground">{schedule.time}</p>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-foreground">{schedule.subject}</h3>
                      {schedule.conflicts && (
                        <AlertTriangle className="w-4 h-4 text-destructive" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {schedule.teacher} • Classe {schedule.class}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {schedule.room}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {schedule.students}
                    </div>
                  </div>
                  
                  {schedule.conflicts && (
                    <Badge variant="destructive" className="ml-2">
                      Conflit détecté
                    </Badge>
                  )}
                </div>
              ))}
            </div>
            
            {todaySchedule.some(s => s.conflicts) && (
              <div className="mt-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-5 h-5 text-destructive" />
                  <h4 className="font-medium text-destructive">Conflits Détectés</h4>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  1 conflit d'emploi du temps détecté. Le système recommande une résolution automatique.
                </p>
                <Button size="sm" className="bg-destructive hover:bg-destructive/90">
                  Résoudre Automatiquement
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Academic Calendar */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Calendrier Académique</CardTitle>
              <CardDescription>Événements et échéances importantes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 border border-border/50 rounded-lg">
                  <div className="w-8 h-8 bg-academic text-white rounded-lg flex items-center justify-center text-xs font-semibold">
                    15
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Fin des inscriptions S2</p>
                    <p className="text-xs text-muted-foreground">Janvier 2025</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 border border-border/50 rounded-lg">
                  <div className="w-8 h-8 bg-academic text-white rounded-lg flex items-center justify-center text-xs font-semibold">
                    01
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Début semestre 2</p>
                    <p className="text-xs text-muted-foreground">Février 2025</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 border border-border/50 rounded-lg">
                  <div className="w-8 h-8 bg-academic text-white rounded-lg flex items-center justify-center text-xs font-semibold">
                    15
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Vacances d'hiver</p>
                    <p className="text-xs text-muted-foreground">Février 2025</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Statistiques des Cours</CardTitle>
              <CardDescription>Répartition par type d'enseignement</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Cours magistraux</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-muted rounded-full">
                      <div className="w-[60%] h-full bg-academic rounded-full"></div>
                    </div>
                    <span className="text-sm font-medium">60%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Travaux dirigés</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-muted rounded-full">
                      <div className="w-[25%] h-full bg-academic rounded-full"></div>
                    </div>
                    <span className="text-sm font-medium">25%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Travaux pratiques</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-muted rounded-full">
                      <div className="w-[15%] h-full bg-academic rounded-full"></div>
                    </div>
                    <span className="text-sm font-medium">15%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}