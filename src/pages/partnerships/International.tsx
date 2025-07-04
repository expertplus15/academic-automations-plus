import { PartnershipsModuleLayout } from "@/components/layouts/PartnershipsModuleLayout";
import { PartnershipsPageHeader } from "@/components/PartnershipsPageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Globe, 
  Plus, 
  Plane, 
  MapPin, 
  Calendar, 
  Users, 
  GraduationCap, 
  Building,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle
} from "lucide-react";

export default function International() {
  const mobilityStats = [
    { title: "Programmes Actifs", value: "23", icon: Globe, color: "text-green-500" },
    { title: "Étudiants en Mobilité", value: "156", icon: Plane, color: "text-blue-500" },
    { title: "Universités Partenaires", value: "45", icon: Building, color: "text-purple-500" },
    { title: "Pays Couverts", value: "28", icon: MapPin, color: "text-orange-500" }
  ];

  const activePrograms = [
    {
      university: "Technical University of Munich",
      country: "Allemagne",
      city: "Munich",
      program: "Erasmus+",
      duration: "1 semestre",
      students: 12,
      capacity: 15,
      deadline: "15 Mars 2024",
      status: "Ouvert",
      specialties: ["Ingénierie", "Informatique", "Sciences"]
    },
    {
      university: "KTH Royal Institute",
      country: "Suède",
      city: "Stockholm",
      program: "Échange bilatéral",
      duration: "2 semestres",
      students: 8,
      capacity: 10,
      deadline: "30 Mars 2024",
      status: "Ouvert",
      specialties: ["Technologie", "Innovation"]
    },
    {
      university: "Politecnico di Milano",
      country: "Italie",
      city: "Milan",
      program: "Erasmus+",
      duration: "1 semestre",
      students: 6,
      capacity: 8,
      deadline: "10 Avril 2024",
      status: "Places limitées",
      specialties: ["Design", "Architecture", "Ingénierie"]
    }
  ];

  const currentStudents = [
    {
      name: "Marie Dubois",
      university: "TU Munich",
      country: "Allemagne",
      program: "Erasmus+",
      startDate: "Sept 2023",
      endDate: "Juin 2024",
      status: "En cours",
      progress: 75
    },
    {
      name: "Pierre Martin",
      university: "KTH Stockholm", 
      country: "Suède",
      program: "Échange",
      startDate: "Janv 2024",
      endDate: "Déc 2024",
      status: "En cours",
      progress: 35
    }
  ];

  const applications = [
    {
      student: "Sophie Laurent",
      destination: "University of Edinburgh",
      country: "Écosse",
      program: "Erasmus+",
      submitted: "Il y a 5 jours",
      status: "En révision",
      documents: "Complets"
    },
    {
      student: "Lucas Rousseau",
      destination: "ETH Zurich",
      country: "Suisse", 
      program: "Échange bilatéral",
      submitted: "Il y a 2 semaines",
      status: "Approuvé",
      documents: "Validés"
    }
  ];

  return (
    <PartnershipsModuleLayout>
      <PartnershipsPageHeader 
        title="Échanges internationaux" 
        subtitle="Programmes de mobilité" 
      />
      <div className="p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Mobilité Internationale</h2>
              <p className="text-muted-foreground">Gérez les programmes d'échanges et la mobilité étudiante</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline">
                <FileText className="w-4 h-4 mr-2" />
                Guides Mobilité
              </Button>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Nouveau Programme
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {mobilityStats.map((stat, index) => {
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
          <Tabs defaultValue="programs" className="space-y-4">
            <TabsList>
              <TabsTrigger value="programs">Programmes</TabsTrigger>
              <TabsTrigger value="students">Étudiants en mobilité</TabsTrigger>
              <TabsTrigger value="applications">Candidatures</TabsTrigger>
              <TabsTrigger value="partnerships">Partenariats</TabsTrigger>
            </TabsList>

            <TabsContent value="programs" className="space-y-4">
              <div className="grid gap-4">
                {activePrograms.map((program, index) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-semibold">{program.university}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">{program.city}, {program.country}</span>
                          </div>
                        </div>
                        <Badge variant={program.status === 'Ouvert' ? 'default' : 'secondary'}>
                          {program.status}
                        </Badge>
                      </div>
                      
                      <div className="grid md:grid-cols-3 gap-4 mb-4">
                        <div className="flex items-center gap-2 text-sm">
                          <GraduationCap className="h-4 w-4 text-muted-foreground" />
                          <span>{program.program}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>{program.duration}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>Échéance: {program.deadline}</span>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span>Places occupées</span>
                          <span>{program.students}/{program.capacity}</span>
                        </div>
                        <Progress value={(program.students / program.capacity) * 100} className="h-2" />
                        
                        <div className="flex justify-between items-center">
                          <div className="flex gap-2">
                            {program.specialties.map((specialty, specIndex) => (
                              <Badge key={specIndex} variant="outline">{specialty}</Badge>
                            ))}
                          </div>
                          <Button variant="outline" size="sm">Gérer programme</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="students" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Étudiants Actuellement en Mobilité</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {currentStudents.map((student, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-semibold">{student.name}</h4>
                            <p className="text-sm text-muted-foreground">{student.university}, {student.country}</p>
                            <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                              <span>{student.program}</span>
                              <span>{student.startDate} - {student.endDate}</span>
                            </div>
                          </div>
                          <Badge variant="default">{student.status}</Badge>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Progression du séjour</span>
                            <span>{student.progress}%</span>
                          </div>
                          <Progress value={student.progress} className="h-2" />
                        </div>
                        
                        <div className="flex gap-2 mt-4">
                          <Button variant="outline" size="sm">Contacter</Button>
                          <Button variant="outline" size="sm">Rapport de suivi</Button>
                          <Button variant="outline" size="sm">Documents</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="applications" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Candidatures en Cours</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {applications.map((app, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-semibold">{app.student}</h4>
                          <p className="text-sm text-muted-foreground">{app.destination}, {app.country}</p>
                          <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                            <span>{app.program}</span>
                            <span>Soumis {app.submitted}</span>
                            <span>Documents: {app.documents}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant={app.status === 'Approuvé' ? 'default' : 'secondary'}>
                            {app.status}
                          </Badge>
                          <Button variant="outline" size="sm">Évaluer</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="partnerships" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Partenariats Universitaires</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {[
                      { name: "TU Munich", country: "Allemagne", type: "Erasmus+", since: "2018", active: true },
                      { name: "KTH Stockholm", country: "Suède", type: "Bilatéral", since: "2020", active: true },
                      { name: "ETH Zurich", country: "Suisse", type: "Bilatéral", since: "2019", active: true },
                      { name: "University of Edinburgh", country: "Écosse", type: "Erasmus+", since: "2017", active: false }
                    ].map((partner, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                            <Building className="h-6 w-6 text-green-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold">{partner.name}</h4>
                            <p className="text-sm text-muted-foreground">{partner.country}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline">{partner.type}</Badge>
                              <span className="text-xs text-muted-foreground">Depuis {partner.since}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant={partner.active ? 'default' : 'secondary'}>
                            {partner.active ? 'Actif' : 'Suspendu'}
                          </Badge>
                          <Button variant="outline" size="sm">Gérer</Button>
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