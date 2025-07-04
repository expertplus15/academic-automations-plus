import { PartnershipsModuleLayout } from "@/components/layouts/PartnershipsModuleLayout";
import { PartnershipsPageHeader } from "@/components/PartnershipsPageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  GraduationCap, 
  Plus, 
  Search, 
  Filter, 
  Users, 
  Building, 
  MapPin, 
  Calendar, 
  Mail, 
  Linkedin, 
  Award,
  TrendingUp,
  UserCheck,
  MessageCircle,
  Network
} from "lucide-react";

export default function Alumni() {
  const alumniStats = [
    { title: "Total Alumni", value: "1,456", icon: GraduationCap, color: "text-purple-500" },
    { title: "Actifs ce mois", value: "342", icon: UserCheck, color: "text-green-500" },
    { title: "Nouvelles connexions", value: "28", icon: Network, color: "text-blue-500" },
    { title: "Taux d'engagement", value: "78%", icon: TrendingUp, color: "text-orange-500" }
  ];

  const featuredAlumni = [
    {
      name: "Sarah Martinez",
      graduation: "Promotion 2019",
      position: "Senior Data Scientist",
      company: "Google",
      location: "Paris, France",
      specialization: "Intelligence Artificielle",
      avatar: "/placeholder.svg",
      status: "Mentor actif",
      connections: 156,
      mentees: 8
    },
    {
      name: "Thomas Dubois",
      graduation: "Promotion 2018",
      position: "CTO & Co-founder",
      company: "TechStart",
      location: "Londres, UK",
      specialization: "Entrepreneuriat Tech",
      avatar: "/placeholder.svg",
      status: "Entrepreneur",
      connections: 89,
      startups: 2
    },
    {
      name: "Marie Chen",
      graduation: "Promotion 2020",
      position: "Product Manager",
      company: "Microsoft",
      location: "Seattle, USA",
      specialization: "Product Strategy",
      avatar: "/placeholder.svg",
      status: "Speaker",
      connections: 124,
      talks: 12
    }
  ];

  const recentAlumni = [
    {
      name: "Pierre Rousseau",
      graduation: "Promotion 2023",
      position: "Frontend Developer",
      company: "Spotify",
      location: "Stockholm",
      joinedNetwork: "Il y a 2 semaines"
    },
    {
      name: "Emma Laurent",
      graduation: "Promotion 2023",
      position: "UX Designer",
      company: "Airbnb",
      location: "San Francisco",
      joinedNetwork: "Il y a 1 mois"
    }
  ];

  const upcomingEvents = [
    {
      title: "Alumni Tech Meetup",
      date: "15 Mars 2024",
      location: "Paris",
      attendees: 45,
      type: "Networking"
    },
    {
      title: "Conférence Carrières",
      date: "22 Mars 2024",
      location: "Lyon",
      attendees: 120,
      type: "Orientation"
    },
    {
      title: "Webinar Entrepreneuriat",
      date: "5 Avril 2024",
      location: "En ligne",
      attendees: 200,
      type: "Formation"
    }
  ];

  return (
    <PartnershipsModuleLayout>
      <PartnershipsPageHeader 
        title="Réseau alumni" 
        subtitle="Anciens étudiants & networking" 
      />
      <div className="p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Réseau Alumni</h2>
              <p className="text-muted-foreground">Connectez et valorisez votre communauté d'anciens</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline">
                <Mail className="w-4 h-4 mr-2" />
                Newsletter
              </Button>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Ajouter Alumni
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {alumniStats.map((stat, index) => {
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
          <Tabs defaultValue="directory" className="space-y-4">
            <TabsList>
              <TabsTrigger value="directory">Annuaire</TabsTrigger>
              <TabsTrigger value="featured">Alumni en vedette</TabsTrigger>
              <TabsTrigger value="events">Événements</TabsTrigger>
              <TabsTrigger value="mentoring">Mentorat</TabsTrigger>
            </TabsList>

            <TabsContent value="directory" className="space-y-4">
              {/* Search and Filters */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex flex-col md:flex-row gap-4">
                    <Input placeholder="Rechercher un alumni..." className="flex-1" />
                    <Select>
                      <SelectTrigger className="w-full md:w-48">
                        <SelectValue placeholder="Promotion" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2023">Promotion 2023</SelectItem>
                        <SelectItem value="2022">Promotion 2022</SelectItem>
                        <SelectItem value="2021">Promotion 2021</SelectItem>
                        <SelectItem value="2020">Promotion 2020</SelectItem>
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
                    <Button variant="outline">
                      <Filter className="w-4 h-4 mr-2" />
                      Plus de filtres
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Alumni List */}
              <div className="grid gap-4">
                {recentAlumni.map((alumni, index) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src="/placeholder.svg" />
                            <AvatarFallback>{alumni.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold">{alumni.name}</h3>
                            <p className="text-sm text-muted-foreground">{alumni.position} chez {alumni.company}</p>
                            <div className="flex items-center gap-4 mt-1">
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <GraduationCap className="h-3 w-3" />
                                {alumni.graduation}
                              </div>
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <MapPin className="h-3 w-3" />
                                {alumni.location}
                              </div>
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Calendar className="h-3 w-3" />
                                {alumni.joinedNetwork}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <MessageCircle className="w-4 h-4 mr-2" />
                            Contacter
                          </Button>
                          <Button variant="outline" size="sm">
                            <Linkedin className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="featured" className="space-y-4">
              <div className="grid gap-6">
                {featuredAlumni.map((alumni, index) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-6">
                        <Avatar className="h-16 w-16">
                          <AvatarImage src={alumni.avatar} />
                          <AvatarFallback>{alumni.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-3">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-semibold">{alumni.name}</h3>
                              <Badge variant="outline">{alumni.status}</Badge>
                            </div>
                            <p className="text-muted-foreground">{alumni.position} chez {alumni.company}</p>
                            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <GraduationCap className="h-4 w-4" />
                                {alumni.graduation}
                              </div>
                              <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                {alumni.location}
                              </div>
                              <div className="flex items-center gap-1">
                                <Award className="h-4 w-4" />
                                {alumni.specialization}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-6 text-sm">
                            <span>{alumni.connections} connexions</span>
                            {alumni.mentees && <span>{alumni.mentees} mentorés</span>}
                            {alumni.startups && <span>{alumni.startups} startups créées</span>}
                            {alumni.talks && <span>{alumni.talks} conférences</span>}
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Button size="sm">Voir profil</Button>
                          <Button variant="outline" size="sm">Contacter</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="events" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Événements Alumni</h3>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Nouvel événement
                </Button>
              </div>
              
              <div className="grid gap-4">
                {upcomingEvents.map((event, index) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold">{event.title}</h4>
                          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {event.date}
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {event.location}
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              {event.attendees} participants
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant="secondary">{event.type}</Badge>
                          <Button variant="outline" size="sm">Gérer</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="mentoring" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Programme de Mentorat</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-semibold">Mentors Actifs</h4>
                      <div className="space-y-3">
                        {[
                          { name: "Sarah Martinez", mentees: 8, domain: "Data Science" },
                          { name: "Thomas Dubois", mentees: 5, domain: "Entrepreneuriat" },
                          { name: "Marie Chen", mentees: 6, domain: "Product Management" }
                        ].map((mentor, index) => (
                          <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                              <p className="font-medium">{mentor.name}</p>
                              <p className="text-sm text-muted-foreground">{mentor.domain}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium">{mentor.mentees} mentorés</p>
                              <Button variant="outline" size="sm">Voir profil</Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h4 className="font-semibold">Demandes de Mentorat</h4>
                      <div className="space-y-3">
                        {[
                          { name: "Lucas Martin", year: "Master 1", domain: "IA", status: "En attente" },
                          { name: "Sophie Durand", year: "Master 2", domain: "Fintech", status: "Assigné" }
                        ].map((request, index) => (
                          <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                              <p className="font-medium">{request.name}</p>
                              <p className="text-sm text-muted-foreground">{request.year} - {request.domain}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant={request.status === 'Assigné' ? 'default' : 'secondary'}>
                                {request.status}
                              </Badge>
                              <Button size="sm">Assigner</Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </PartnershipsModuleLayout>
  );
}