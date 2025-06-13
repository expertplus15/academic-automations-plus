import { DashboardHeader } from "@/components/DashboardHeader";
import { ModuleCard } from "@/components/ModuleCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Calendar, 
  MapPin, 
  Users,
  Clock,
  AlertTriangle,
  CheckCircle,
  Plus,
  Settings,
  Eye,
  Bot
} from "lucide-react";

export default function Exams() {
  const examStats = [
    { label: "Examens Planifiés", value: "23" },
    { label: "Salles Réservées", value: "15" },
    { label: "Surveillants Assignés", value: "47" },
    { label: "Étudiants Inscrits", value: "1,247" }
  ];

  const upcomingExams = [
    {
      id: "EXM001",
      subject: "Algorithmique Avancée",
      date: "2025-01-15",
      time: "09:00 - 12:00",
      duration: "3h",
      room: "Amphi A",
      capacity: 150,
      registered: 127,
      supervisors: ["Prof. Martin", "Dr. Dubois"],
      status: "confirmed",
      conflicts: false
    },
    {
      id: "EXM002",
      subject: "Marketing Digital",
      date: "2025-01-15", 
      time: "14:00 - 16:00",
      duration: "2h",
      room: "Salle B205",
      capacity: 50,
      registered: 45,
      supervisors: ["Dr. Chen"],
      status: "pending_supervisor",
      conflicts: false
    },
    {
      id: "EXM003",
      subject: "Base de Données",
      date: "2025-01-16",
      time: "10:00 - 12:00", 
      duration: "2h",
      room: "Lab Info 1",
      capacity: 30,
      registered: 32,
      supervisors: ["Prof. Wilson"],
      status: "conflict",
      conflicts: true
    },
    {
      id: "EXM004",
      subject: "Résistance des Matériaux",
      date: "2025-01-16",
      time: "14:30 - 17:30",
      duration: "3h",
      room: "Amphi C",
      capacity: 120,
      registered: 89,
      supervisors: ["Dr. Moreau", "Prof. Zhang"],
      status: "confirmed",
      conflicts: false
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-exams/10 text-exams border-exams/20">Confirmé</Badge>;
      case "pending_supervisor":
        return <Badge variant="secondary">Surveillant requis</Badge>;
      case "conflict":
        return <Badge variant="destructive">Conflit</Badge>;
      default:
        return <Badge variant="outline">En attente</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="w-4 h-4 text-exams" />;
      case "pending_supervisor":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case "conflict":
        return <AlertTriangle className="w-4 h-4 text-destructive" />;
      default:
        return <Clock className="w-4 h-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader 
        title="Examens & Organisation" 
        subtitle="Planification intelligente et gestion des épreuves"
      />
      
      <main className="p-6 space-y-6">
        {/* Feature Highlight */}
        <div className="bg-gradient-to-r from-exams/10 to-exams/5 rounded-lg p-6 border border-exams/20">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-exams rounded-lg flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">Planification IA Anti-Conflits</h2>
              <p className="text-muted-foreground">Optimisation automatique des créneaux et ressources</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Notre intelligence artificielle analyse automatiquement les disponibilités des salles, 
            enseignants et étudiants pour générer un planning d'examens optimal sans conflits.
          </p>
          <div className="flex gap-3">
            <Button className="bg-exams hover:bg-exams/90">
              <Bot className="w-4 h-4 mr-2" />
              Générer Planning IA
            </Button>
            <Button variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Nouvel Examen
            </Button>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {examStats.map((stat, index) => (
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
            title="Planification IA"
            description="Génération automatique optimisée"
            icon={Bot}
            color="exams"
            actions={[
              { label: "Lancer IA", onClick: () => {} }
            ]}
          />
          <ModuleCard
            title="Gestion Salles"
            description="Réservations et capacités"
            icon={MapPin}
            color="exams"
            actions={[
              { label: "Voir Salles", onClick: () => {}, variant: "outline" }
            ]}
          />
          <ModuleCard
            title="Surveillants"
            description="Attribution automatique"
            icon={Users}
            color="exams"
            actions={[
              { label: "Assigner", onClick: () => {}, variant: "outline" }
            ]}
          />
        </div>

        {/* Upcoming Exams */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-exams" />
                  Examens à Venir
                </CardTitle>
                <CardDescription>
                  Planning des prochaines épreuves avec statut temps réel
                </CardDescription>
              </div>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Planifier Examen
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingExams.map((exam) => (
                <div key={exam.id} className={`p-4 rounded-lg border transition-colors ${
                  exam.conflicts 
                    ? "border-destructive/20 bg-destructive/5" 
                    : "border-border/50 hover:bg-muted/30"
                }`}>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(exam.status)}
                      <div>
                        <h3 className="font-medium text-foreground">{exam.subject}</h3>
                        <p className="text-sm text-muted-foreground">{exam.id}</p>
                      </div>
                    </div>
                    
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Date & Heure</p>
                        <p className="font-medium">{exam.date}</p>
                        <p className="text-xs text-muted-foreground">{exam.time}</p>
                      </div>
                      
                      <div>
                        <p className="text-muted-foreground">Salle</p>
                        <p className="font-medium">{exam.room}</p>
                        <p className="text-xs text-muted-foreground">
                          {exam.registered}/{exam.capacity} places
                        </p>
                      </div>
                      
                      <div>
                        <p className="text-muted-foreground">Surveillants</p>
                        <p className="font-medium">{exam.supervisors.length} assignés</p>
                        <p className="text-xs text-muted-foreground">
                          {exam.supervisors.join(", ")}
                        </p>
                      </div>
                      
                      <div>
                        <p className="text-muted-foreground">Durée</p>
                        <p className="font-medium">{exam.duration}</p>
                        <p className="text-xs text-muted-foreground">
                          {exam.registered} inscrits
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      {getStatusBadge(exam.status)}
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Settings className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {exam.conflicts && (
                    <div className="mt-3 p-3 bg-destructive/10 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="w-4 h-4 text-destructive" />
                        <span className="text-sm font-medium text-destructive">Conflit détecté</span>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">
                        Capacité insuffisante: {exam.registered} inscrits pour {exam.capacity} places
                      </p>
                      <Button size="sm" variant="destructive">
                        Résoudre Automatiquement
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Room Management & Statistics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-exams" />
                Occupation des Salles
              </CardTitle>
              <CardDescription>Taux d'utilisation en temps réel</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium">Amphi A (150 places)</span>
                    <p className="text-xs text-muted-foreground">Examens: 15 Jan</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-2 bg-muted rounded-full">
                      <div className="w-[85%] h-full bg-exams rounded-full"></div>
                    </div>
                    <span className="text-sm">85%</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium">Salle B205 (50 places)</span>
                    <p className="text-xs text-muted-foreground">Examens: 15 Jan</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-2 bg-muted rounded-full">
                      <div className="w-[90%] h-full bg-exams rounded-full"></div>
                    </div>
                    <span className="text-sm">90%</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium">Lab Info 1 (30 places)</span>
                    <p className="text-xs text-destructive text-xs">Surréservé</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-2 bg-muted rounded-full">
                      <div className="w-[107%] h-full bg-destructive rounded-full"></div>
                    </div>
                    <span className="text-sm text-destructive">107%</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium">Amphi C (120 places)</span>
                    <p className="text-xs text-muted-foreground">Examens: 16 Jan</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-2 bg-muted rounded-full">
                      <div className="w-[74%] h-full bg-exams rounded-full"></div>
                    </div>
                    <span className="text-sm">74%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-exams" />
                Surveillance & Personnel
              </CardTitle>
              <CardDescription>Attribution des surveillants</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border border-border/50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">Prof. Martin</p>
                    <p className="text-xs text-muted-foreground">3 examens assignés</p>
                  </div>
                  <Badge className="bg-exams/10 text-exams border-exams/20">Disponible</Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 border border-border/50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">Dr. Chen</p>
                    <p className="text-xs text-muted-foreground">1 examen assigné</p>
                  </div>
                  <Badge variant="secondary">Partiellement libre</Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 border border-border/50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">Prof. Wilson</p>
                    <p className="text-xs text-muted-foreground">2 examens assignés</p>
                  </div>
                  <Badge className="bg-exams/10 text-exams border-exams/20">Disponible</Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 border border-border/50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">Dr. Dubois</p>
                    <p className="text-xs text-destructive">Conflit horaire</p>
                  </div>
                  <Badge variant="destructive">Non disponible</Badge>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-border/50">
                <Button variant="outline" className="w-full">
                  <Users className="w-4 h-4 mr-2" />
                  Attribution Automatique
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}