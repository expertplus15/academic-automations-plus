import { PartnershipsModuleLayout } from "@/components/layouts/PartnershipsModuleLayout";
import { PartnershipsPageHeader } from "@/components/PartnershipsPageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Calendar, 
  Plus, 
  Users, 
  MapPin, 
  Clock, 
  Building, 
  Mic,
  Ticket,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  Star
} from "lucide-react";

export default function Events() {
  const eventStats = [
    { title: "Événements cette année", value: "24", icon: Calendar, color: "text-green-500" },
    { title: "Participants totaux", value: "2,847", icon: Users, color: "text-blue-500" },
    { title: "Événements à venir", value: "8", icon: Clock, color: "text-orange-500" },
    { title: "Taux de satisfaction", value: "94%", icon: Star, color: "text-purple-500" }
  ];

  const upcomingEvents = [
    {
      title: "Forum Entreprises 2024",
      type: "Forum emploi",
      date: "15 Mars 2024",
      time: "09:00 - 18:00",
      location: "Campus Principal - Amphithéâtre",
      organizer: "Service Relations Entreprises",
      registered: 245,
      capacity: 300,
      speakers: 12,
      companies: 35,
      status: "Ouvert",
      description: "Rencontrez les recruteurs de grandes entreprises et startups"
    },
    {
      title: "Conférence Innovation Tech",
      type: "Conférence",
      date: "22 Mars 2024", 
      time: "14:00 - 17:30",
      location: "Auditorium Innovation",
      organizer: "Département Informatique",
      registered: 120,
      capacity: 150,
      speakers: 5,
      companies: 8,
      status: "Confirmé",
      description: "Intelligence artificielle et transformation digitale"
    },
    {
      title: "Journée Portes Ouvertes",
      type: "Orientation",
      date: "5 Avril 2024",
      time: "10:00 - 16:00", 
      location: "Tout le campus",
      organizer: "Service Communication",
      registered: 450,
      capacity: 500,
      speakers: 20,
      companies: 15,
      status: "Complet",
      description: "Découverte des formations et des opportunités"
    }
  ];

  const pastEvents = [
    {
      title: "Salon des Masters",
      date: "12 Février 2024",
      participants: 180,
      satisfaction: 92,
      feedback: "Excellent",
      type: "Orientation"
    },
    {
      title: "Conférence Entrepreneuriat",
      date: "8 Février 2024",
      participants: 95,
      satisfaction: 96,
      feedback: "Très bon",
      type: "Formation"
    },
    {
      title: "Meetup Alumni Tech",
      date: "25 Janvier 2024",
      participants: 65,
      satisfaction: 89,
      feedback: "Satisfaisant",
      type: "Networking"
    }
  ];

  const speakers = [
    {
      name: "Sarah Martinez",
      company: "Google France",
      position: "Senior Product Manager",
      topic: "Product Strategy",
      events: 3,
      rating: 4.8
    },
    {
      name: "Thomas Dubois",
      company: "Station F",
      position: "Startup Coach",
      topic: "Entrepreneuriat", 
      events: 5,
      rating: 4.9
    },
    {
      name: "Marie Chen",
      company: "Microsoft",
      position: "Cloud Architect",
      topic: "Cloud Computing",
      events: 2,
      rating: 4.7
    }
  ];

  return (
    <PartnershipsModuleLayout>
      <PartnershipsPageHeader 
        title="Organisation événements" 
        subtitle="Forums & conférences" 
      />
      <div className="p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Gestion des Événements</h2>
              <p className="text-muted-foreground">Organisez et gérez vos forums, conférences et événements</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline">
                <Calendar className="w-4 h-4 mr-2" />
                Calendrier
              </Button>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Nouvel Événement
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {eventStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                        <p className="text-2xl font-bold">{stat.value}</p>
                      </div>
                      <Icon className={`h-8 w-8 ${stat.color}`} />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Main Content */}
          <Tabs defaultValue="upcoming" className="space-y-4">
            <TabsList>
              <TabsTrigger value="upcoming">Événements à venir</TabsTrigger>
              <TabsTrigger value="past">Historique</TabsTrigger>
              <TabsTrigger value="speakers">Intervenants</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming" className="space-y-4">
              <div className="grid gap-6">
                {upcomingEvents.map((event, index) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-semibold">{event.title}</h3>
                            <Badge variant={
                              event.status === 'Complet' ? 'secondary' : 
                              event.status === 'Confirmé' ? 'default' : 'outline'
                            }>
                              {event.status}
                            </Badge>
                          </div>
                          <p className="text-muted-foreground mb-3">{event.description}</p>
                          
                          <div className="grid md:grid-cols-2 gap-4 text-sm">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span>{event.date}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <span>{event.time}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                <span>{event.location}</span>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <Users className="h-4 w-4 text-muted-foreground" />
                                <span>{event.organizer}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Mic className="h-4 w-4 text-muted-foreground" />
                                <span>{event.speakers} intervenants</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Building className="h-4 w-4 text-muted-foreground" />
                                <span>{event.companies} entreprises</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <Badge variant="outline">{event.type}</Badge>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span>Inscriptions</span>
                          <span>{event.registered}/{event.capacity}</span>
                        </div>
                        <Progress value={(event.registered / event.capacity) * 100} className="h-2" />
                        
                        <div className="flex gap-2 pt-2">
                          <Button variant="outline" size="sm">Gérer inscriptions</Button>
                          <Button variant="outline" size="sm">Modifier</Button>
                          <Button variant="outline" size="sm">Communications</Button>
                          <Button size="sm">Voir détails</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="past" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Événements Passés</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {pastEvents.map((event, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-semibold">{event.title}</h4>
                          <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {event.date}
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {event.participants} participants
                            </div>
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3" />
                              {event.satisfaction}% satisfaction
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant="outline">{event.type}</Badge>
                          <Badge variant={
                            event.satisfaction >= 95 ? 'default' :
                            event.satisfaction >= 90 ? 'secondary' : 'outline'
                          }>
                            {event.feedback}
                          </Badge>
                          <Button variant="outline" size="sm">Rapport</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="speakers" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Base de Données Intervenants</h3>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter Intervenant
                </Button>
              </div>
              
              <div className="grid gap-4">
                {speakers.map((speaker, index) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                            <Mic className="h-6 w-6 text-green-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold">{speaker.name}</h4>
                            <p className="text-sm text-muted-foreground">{speaker.position} chez {speaker.company}</p>
                            <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                              <span>Spécialité: {speaker.topic}</span>
                              <span>{speaker.events} événements</span>
                              <div className="flex items-center gap-1">
                                <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                                <span>{speaker.rating}/5</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">Contacter</Button>
                          <Button variant="outline" size="sm">Historique</Button>
                          <Button size="sm">Inviter</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Performance des Événements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span>Taux de participation moyen</span>
                        <span className="font-semibold">87%</span>
                      </div>
                      <Progress value={87} className="h-2" />
                      
                      <div className="flex justify-between items-center">
                        <span>Satisfaction moyenne</span>
                        <span className="font-semibold">92%</span>
                      </div>
                      <Progress value={92} className="h-2" />
                      
                      <div className="flex justify-between items-center">
                        <span>Taux de recommandation</span>
                        <span className="font-semibold">89%</span>
                      </div>
                      <Progress value={89} className="h-2" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Types d'Événements Populaires</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { type: "Forums emploi", events: 8, participants: 1240 },
                        { type: "Conférences", events: 6, participants: 890 },
                        { type: "Networking", events: 5, participants: 420 },
                        { type: "Orientation", events: 3, participants: 680 },
                        { type: "Formation", events: 2, participants: 157 }
                      ].map((item, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">{item.type}</p>
                            <p className="text-sm text-muted-foreground">{item.events} événements</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">{item.participants}</p>
                            <p className="text-sm text-muted-foreground">participants</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </PartnershipsModuleLayout>
  );
}