import { CommunicationModuleLayout } from "@/components/layouts/CommunicationModuleLayout";
import { CommunicationPageHeader } from "@/components/CommunicationPageHeader";
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Calendar, 
  Plus, 
  MessageSquare, 
  Users, 
  MapPin, 
  Clock,
  Building,
  TrendingUp,
  Mail,
  Video
} from "lucide-react";
import { useAuth } from '@/hooks/useAuth';

export default function CommunicationEvents() {
  const { hasRole } = useAuth();
  const canManageEvents = hasRole(['admin', 'hr']);

  return (
    <ProtectedRoute allowedRoles={['admin', 'hr', 'teacher', 'student']}>
      <CommunicationModuleLayout>
        <CommunicationPageHeader 
          title="Communication Événements" 
          subtitle="Gestion des communications pour événements et manifestations" 
        />
        <div className="p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">Événements & Communications</h2>
                <p className="text-muted-foreground">Organisation et promotion des événements institutionnels</p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Campagne Promo
                </Button>
                {canManageEvents && (
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
                      <p className="text-sm font-medium text-muted-foreground">Événements ce mois</p>
                      <p className="text-2xl font-bold">8</p>
                    </div>
                    <Calendar className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Participants totaux</p>
                      <p className="text-2xl font-bold">456</p>
                    </div>
                    <Users className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Partenaires impliqués</p>
                      <p className="text-2xl font-bold">15</p>
                    </div>
                    <Building className="h-8 w-8 text-orange-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Taux participation</p>
                      <p className="text-2xl font-bold">78%</p>
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
                    <Input placeholder="Rechercher un événement..." className="w-full" />
                  </div>
                  <Select>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="Type d'événement" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="conference">Conférence</SelectItem>
                      <SelectItem value="workshop">Atelier</SelectItem>
                      <SelectItem value="networking">Networking</SelectItem>
                      <SelectItem value="ceremony">Cérémonie</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="Statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="upcoming">À venir</SelectItem>
                      <SelectItem value="ongoing">En cours</SelectItem>
                      <SelectItem value="completed">Terminé</SelectItem>
                      <SelectItem value="cancelled">Annulé</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Events List */}
            <Card>
              <CardHeader>
                <CardTitle>Événements Récents & À Venir</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      title: "Forum Entreprises 2024",
                      type: "Networking",
                      date: "15 Dec 2024",
                      time: "09:00 - 17:00",
                      location: "Grand Amphithéâtre",
                      participants: 156,
                      partners: ["TechCorp", "Innovation Labs", "Digital Solutions"],
                      status: "À venir",
                      coordinator: "Marie Dubois",
                      communications: 45
                    },
                    {
                      title: "Conférence IA & Machine Learning",
                      type: "Conférence",
                      date: "10 Dec 2024",
                      time: "14:00 - 18:00", 
                      location: "Salle de conférence A",
                      participants: 89,
                      partners: ["MIT", "Google AI"],
                      status: "En cours",
                      coordinator: "Pierre Martin",
                      communications: 23
                    },
                    {
                      title: "Atelier Entrepreneuriat",
                      type: "Atelier",
                      date: "5 Dec 2024",
                      time: "10:00 - 16:00",
                      location: "Innovation Hub",
                      participants: 45,
                      partners: ["Startup Incubator", "Business Angels"],
                      status: "Terminé",
                      coordinator: "Sophie Chen",
                      communications: 67
                    }
                  ].map((event, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                          <Calendar className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{event.title}</h3>
                          <p className="text-sm text-muted-foreground">{event.type}</p>
                          <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {event.date}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {event.time}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {event.location}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            Coordinateur: {event.coordinator}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm font-medium">{event.participants} participants</p>
                          <p className="text-xs text-muted-foreground">{event.communications} communications</p>
                          <Badge variant={
                            event.status === 'À venir' ? 'default' : 
                            event.status === 'En cours' ? 'secondary' : 
                            event.status === 'Terminé' ? 'outline' :
                            'destructive'
                          }>
                            {event.status}
                          </Badge>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" title="Message groupé">
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" title="Email invitation">
                            <Mail className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" title="Visio planning">
                            <Video className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Event Communication Templates */}
            <Card>
              <CardHeader>
                <CardTitle>Templates de Communication</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    {
                      name: "Invitation Événement",
                      usage: "Invitations initiales",
                      lastUsed: "Il y a 2 jours"
                    },
                    {
                      name: "Rappel Participation",
                      usage: "Rappels avant événement",
                      lastUsed: "La semaine dernière"
                    },
                    {
                      name: "Suivi Post-Événement",
                      usage: "Feedback et remerciements",
                      lastUsed: "Il y a 3 jours"
                    }
                  ].map((template, index) => (
                    <div key={index} className="p-4 bg-muted/30 rounded-lg">
                      <h4 className="font-semibold">{template.name}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{template.usage}</p>
                      <div className="flex items-center justify-between mt-3">
                        <p className="text-xs text-muted-foreground">{template.lastUsed}</p>
                        <Button size="sm" variant="ghost">Utiliser</Button>
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