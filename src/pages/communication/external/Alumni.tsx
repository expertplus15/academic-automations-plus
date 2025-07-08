import { CommunicationModuleLayout } from "@/components/layouts/CommunicationModuleLayout";
import { CommunicationPageHeader } from "@/components/CommunicationPageHeader";
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  GraduationCap, 
  Plus, 
  MessageSquare, 
  Building, 
  MapPin, 
  Calendar,
  Users,
  TrendingUp,
  Mail,
  LinkedinIcon
} from "lucide-react";
import { useAuth } from '@/hooks/useAuth';

export default function CommunicationAlumni() {
  const { hasRole } = useAuth();
  const canManageAlumni = hasRole(['admin', 'hr']);

  return (
    <ProtectedRoute allowedRoles={['admin', 'hr', 'teacher', 'student']}>
      <CommunicationModuleLayout>
        <CommunicationPageHeader 
          title="Communication Alumni" 
          subtitle="Gestion des communications avec le réseau des anciens" 
        />
        <div className="p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">Réseau Alumni</h2>
                <p className="text-muted-foreground">Communications et engagement avec les anciens étudiants</p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Newsletter Alumni
                </Button>
                {canManageAlumni && (
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Nouvel Événement
                  </Button>
                )}
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Alumni Actifs</p>
                      <p className="text-2xl font-bold">342</p>
                    </div>
                    <GraduationCap className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Événements ce mois</p>
                      <p className="text-2xl font-bold">5</p>
                    </div>
                    <Calendar className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Participations</p>
                      <p className="text-2xl font-bold">89</p>
                    </div>
                    <Users className="h-8 w-8 text-orange-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Taux engagement</p>
                      <p className="text-2xl font-bold">67%</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <Input placeholder="Rechercher un alumni..." className="w-full" />
                  </div>
                  <Select>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="Promotion" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2024">2024</SelectItem>
                      <SelectItem value="2023">2023</SelectItem>
                      <SelectItem value="2022">2022</SelectItem>
                      <SelectItem value="2021">2021</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="Secteur" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tech">Technologie</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="consulting">Conseil</SelectItem>
                      <SelectItem value="startup">Startup</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Alumni Communications */}
            <Card>
              <CardHeader>
                <CardTitle>Alumni Actifs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      name: "Sarah Martin",
                      promotion: "2022",
                      company: "Google",
                      position: "Software Engineer",
                      location: "Paris",
                      lastInteraction: "Il y a 2 jours",
                      engagement: "Élevé",
                      events: 3,
                      email: "sarah.martin@google.com"
                    },
                    {
                      name: "Pierre Dubois",
                      promotion: "2021",
                      company: "BCG",
                      position: "Senior Consultant",
                      location: "Londres",
                      lastInteraction: "La semaine dernière",
                      engagement: "Moyen",
                      events: 1,
                      email: "pierre.dubois@bcg.com"
                    },
                    {
                      name: "Marie Rousseau",
                      promotion: "2023",
                      company: "Startup Labs",
                      position: "CTO",
                      location: "Berlin",
                      lastInteraction: "Il y a 3 jours",
                      engagement: "Élevé",
                      events: 5,
                      email: "marie@startuplabs.de"
                    }
                  ].map((alumni, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                          {alumni.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <h3 className="font-semibold">{alumni.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {alumni.position} chez {alumni.company}
                          </p>
                          <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <GraduationCap className="h-3 w-3" />
                              Promo {alumni.promotion}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {alumni.location}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm font-medium">{alumni.events} événements</p>
                          <Badge variant={
                            alumni.engagement === 'Élevé' ? 'default' : 
                            alumni.engagement === 'Moyen' ? 'secondary' : 
                            'outline'
                          }>
                            {alumni.engagement}
                          </Badge>
                          <p className="text-xs text-muted-foreground mt-1">{alumni.lastInteraction}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Mail className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <LinkedinIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Events */}
            <Card>
              <CardHeader>
                <CardTitle>Événements Alumni Récents</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    {
                      title: "Afterwork Tech Alumni",
                      date: "15 Dec 2024",
                      participants: 45,
                      type: "Networking"
                    },
                    {
                      title: "Conférence IA & Machine Learning",
                      date: "8 Dec 2024",
                      participants: 78,
                      type: "Conference"
                    },
                    {
                      title: "Job Fair Alumni",
                      date: "1 Dec 2024",
                      participants: 156,
                      type: "Recrutement"
                    }
                  ].map((event, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div>
                        <h4 className="font-medium">{event.title}</h4>
                        <p className="text-sm text-muted-foreground">{event.date} • {event.type}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{event.participants} participants</p>
                        <Button size="sm" variant="ghost">Voir détails</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </CommunicationModuleLayout>
    </ProtectedRoute>
  );
}