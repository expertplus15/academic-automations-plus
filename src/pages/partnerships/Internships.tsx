import { PartnershipsModuleLayout } from "@/components/layouts/PartnershipsModuleLayout";
import { PartnershipsPageHeader } from "@/components/PartnershipsPageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { 
  Briefcase, 
  Plus, 
  Search, 
  Filter, 
  User, 
  Building, 
  Calendar, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  MoreHorizontal,
  MapPin,
  Euro,
  FileText,
  TrendingUp
} from "lucide-react";

export default function Internships() {
  const internshipStats = [
    { title: "Stages Actifs", value: "187", icon: Briefcase, color: "text-blue-500" },
    { title: "En Recherche", value: "23", icon: Search, color: "text-orange-500" },
    { title: "Complétés", value: "456", icon: CheckCircle, color: "text-green-500" },
    { title: "Taux de Placement", value: "92%", icon: TrendingUp, color: "text-purple-500" }
  ];

  const activeInternships = [
    {
      student: "Marie Dubois",
      company: "TechCorp Solutions",
      position: "Développeur Frontend",
      duration: "6 mois",
      startDate: "15 Jan 2024",
      status: "En cours",
      progress: 65,
      supervisor: "Jean Martin",
      salary: "800€"
    },
    {
      student: "Pierre Rousseau",
      company: "Global Industries",
      position: "Ingénieur Qualité",
      duration: "4 mois",
      startDate: "1 Fév 2024",
      status: "En cours",
      progress: 45,
      supervisor: "Sophie Durand",
      salary: "750€"
    },
    {
      student: "Alice Martin",
      company: "Innovation Labs",
      position: "Data Analyst",
      duration: "6 mois",
      startDate: "8 Jan 2024",
      status: "En cours",
      progress: 80,
      supervisor: "Marc Leclerc",
      salary: "900€"
    }
  ];

  const availableOffers = [
    {
      company: "TechStart Inc.",
      position: "UX/UI Designer",
      location: "Paris",
      duration: "6 mois",
      salary: "850€",
      description: "Conception d'interfaces utilisateur pour applications mobiles",
      requirements: ["Adobe XD", "Figma", "Prototypage"],
      posted: "Il y a 2 jours"
    },
    {
      company: "CloudSoft",
      position: "DevOps Engineer",
      location: "Lyon",
      duration: "5 mois",
      salary: "950€",
      description: "Automatisation et déploiement d'infrastructures cloud",
      requirements: ["Docker", "Kubernetes", "AWS"],
      posted: "Il y a 5 jours"
    }
  ];

  return (
    <PartnershipsModuleLayout>
      <PartnershipsPageHeader 
        title="Gestion stages" 
        subtitle="Stages & insertions professionnelles" 
      />
      <div className="p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Suivi des Stages</h2>
              <p className="text-muted-foreground">Gérez les stages et opportunités professionnelles</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline">
                <FileText className="w-4 h-4 mr-2" />
                Rapport
              </Button>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Nouvelle Offre
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {internshipStats.map((stat, index) => {
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
          <Tabs defaultValue="active" className="space-y-4">
            <TabsList>
              <TabsTrigger value="active">Stages en cours</TabsTrigger>
              <TabsTrigger value="offers">Offres disponibles</TabsTrigger>
              <TabsTrigger value="search">Étudiants en recherche</TabsTrigger>
            </TabsList>

            <TabsContent value="active" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Stages Actifs</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {activeInternships.map((internship, index) => (
                      <div key={index} className="p-4 border rounded-lg space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <User className="h-5 w-5 text-blue-600" />
                              </div>
                              <div>
                                <h3 className="font-semibold">{internship.student}</h3>
                                <p className="text-sm text-muted-foreground">{internship.position}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-6 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Building className="h-4 w-4" />
                                {internship.company}
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {internship.startDate}
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {internship.duration}
                              </div>
                              <div className="flex items-center gap-1">
                                <Euro className="h-4 w-4" />
                                {internship.salary}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge variant="default">{internship.status}</Badge>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>Voir détails</DropdownMenuItem>
                                <DropdownMenuItem>Contacter superviseur</DropdownMenuItem>
                                <DropdownMenuItem>Évaluation</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>Rapport visite</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Progression</span>
                            <span>{internship.progress}%</span>
                          </div>
                          <Progress value={internship.progress} className="h-2" />
                          <p className="text-xs text-muted-foreground">
                            Superviseur: {internship.supervisor}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="offers" className="space-y-4">
              <div className="flex gap-4 mb-4">
                <Input placeholder="Rechercher une offre..." className="flex-1" />
                <Select>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Localisation" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="paris">Paris</SelectItem>
                    <SelectItem value="lyon">Lyon</SelectItem>
                    <SelectItem value="toulouse">Toulouse</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  Filtres
                </Button>
              </div>

              <div className="grid gap-4">
                {availableOffers.map((offer, index) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-semibold">{offer.position}</h3>
                          <p className="text-muted-foreground">{offer.company}</p>
                        </div>
                        <Badge variant="outline">{offer.posted}</Badge>
                      </div>
                      
                      <p className="text-sm mb-4">{offer.description}</p>
                      
                      <div className="flex items-center gap-6 text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {offer.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {offer.duration}
                        </div>
                        <div className="flex items-center gap-1">
                          <Euro className="h-4 w-4" />
                          {offer.salary}
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="flex gap-2">
                          {offer.requirements.map((req, reqIndex) => (
                            <Badge key={reqIndex} variant="secondary">{req}</Badge>
                          ))}
                        </div>
                        <Button>Proposer candidature</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="search" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Étudiants en Recherche de Stage</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        name: "Thomas Legrand",
                        level: "Master 1",
                        specialization: "Informatique",
                        desired: "Développement Web",
                        cv: "Disponible",
                        status: "Recherche active"
                      },
                      {
                        name: "Emma Moreau",
                        level: "Licence 3",
                        specialization: "Marketing",
                        desired: "Communication digitale",
                        cv: "Disponible", 
                        status: "En attente réponse"
                      }
                    ].map((student, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-orange-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{student.name}</h3>
                            <p className="text-sm text-muted-foreground">{student.level} - {student.specialization}</p>
                            <p className="text-sm">Recherche: {student.desired}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant="outline">{student.status}</Badge>
                          <Button variant="outline" size="sm">Voir profil</Button>
                          <Button size="sm">Proposer offre</Button>
                        </div>
                      </div>
                    ))}
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