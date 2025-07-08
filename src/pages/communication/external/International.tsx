import { CommunicationModuleLayout } from "@/components/layouts/CommunicationModuleLayout";
import { CommunicationPageHeader } from "@/components/CommunicationPageHeader";
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Globe, 
  Plus, 
  MessageSquare, 
  Plane, 
  MapPin, 
  Calendar,
  Users,
  TrendingUp,
  Mail,
  Flag
} from "lucide-react";
import { useAuth } from '@/hooks/useAuth';

export default function CommunicationInternational() {
  const { hasRole } = useAuth();
  const canManageInternational = hasRole(['admin', 'hr']);

  return (
    <ProtectedRoute allowedRoles={['admin', 'hr', 'teacher', 'student']}>
      <CommunicationModuleLayout>
        <CommunicationPageHeader 
          title="Relations Internationales" 
          subtitle="Communications avec partenaires internationaux et programmes d'échange" 
        />
        <div className="p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">Relations Internationales</h2>
                <p className="text-muted-foreground">Gestion des communications internationales et programmes d'échange</p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Communication Groupe
                </Button>
                {canManageInternational && (
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Nouveau Partenariat
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
                      <p className="text-sm font-medium text-muted-foreground">Universités Partenaires</p>
                      <p className="text-2xl font-bold">28</p>
                    </div>
                    <Globe className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Étudiants en échange</p>
                      <p className="text-2xl font-bold">45</p>
                    </div>
                    <Plane className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Pays actifs</p>
                      <p className="text-2xl font-bold">12</p>
                    </div>
                    <Flag className="h-8 w-8 text-orange-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Communications/mois</p>
                      <p className="text-2xl font-bold">156</p>
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
                    <Input placeholder="Rechercher une université ou pays..." className="w-full" />
                  </div>
                  <Select>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="Continent" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="europe">Europe</SelectItem>
                      <SelectItem value="america">Amérique</SelectItem>
                      <SelectItem value="asia">Asie</SelectItem>
                      <SelectItem value="africa">Afrique</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="Type de programme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="exchange">Échange</SelectItem>
                      <SelectItem value="research">Recherche</SelectItem>
                      <SelectItem value="internship">Stage</SelectItem>
                      <SelectItem value="double_degree">Double diplôme</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* International Partners Communications */}
            <Card>
              <CardHeader>
                <CardTitle>Partenaires Internationaux Actifs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      university: "MIT",
                      country: "États-Unis",
                      city: "Boston",
                      contact: "Dr. Sarah Johnson",
                      email: "s.johnson@mit.edu",
                      program: "Échange technologique",
                      students: 8,
                      lastContact: "Il y a 2 jours",
                      status: "Actif",
                      flag: "🇺🇸"
                    },
                    {
                      university: "University of Oxford",
                      country: "Royaume-Uni",
                      city: "Oxford",
                      contact: "Prof. James Smith",
                      email: "james.smith@ox.ac.uk",
                      program: "Double diplôme",
                      students: 5,
                      lastContact: "La semaine dernière",
                      status: "Actif",
                      flag: "🇬🇧"
                    },
                    {
                      university: "Technical University Munich",
                      country: "Allemagne",
                      city: "Munich",
                      contact: "Dr. Hans Mueller",
                      email: "h.mueller@tum.de",
                      program: "Recherche collaborative",
                      students: 12,
                      lastContact: "Il y a 5 jours",
                      status: "En négociation",
                      flag: "🇩🇪"
                    }
                  ].map((partner, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center text-2xl">
                          {partner.flag}
                        </div>
                        <div>
                          <h3 className="font-semibold">{partner.university}</h3>
                          <p className="text-sm text-muted-foreground">{partner.program}</p>
                          <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {partner.city}, {partner.country}
                            </span>
                            <span className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {partner.contact}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm font-medium">{partner.students} étudiants</p>
                          <Badge variant={partner.status === 'Actif' ? 'default' : 'secondary'}>
                            {partner.status}
                          </Badge>
                          <p className="text-xs text-muted-foreground mt-1">{partner.lastContact}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Mail className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Current Exchange Programs */}
            <Card>
              <CardHeader>
                <CardTitle>Programmes d'Échange en Cours</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    {
                      program: "Erasmus+ 2024",
                      participants: 23,
                      destination: "Europe",
                      duration: "1 semestre",
                      coordinator: "Marie Dubois"
                    },
                    {
                      program: "MIT Exchange",
                      participants: 5,
                      destination: "États-Unis",
                      duration: "1 année",
                      coordinator: "Pierre Martin"
                    },
                    {
                      program: "Asia Pacific Program",
                      participants: 12,
                      destination: "Asie",
                      duration: "6 mois",
                      coordinator: "Sophie Chen"
                    },
                    {
                      program: "Research Collaboration",
                      participants: 8,
                      destination: "Canada",
                      duration: "2 semestres",
                      coordinator: "Jean Rousseau"
                    }
                  ].map((program, index) => (
                    <div key={index} className="p-4 bg-muted/30 rounded-lg">
                      <h4 className="font-semibold">{program.program}</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {program.participants} participants • {program.destination}
                      </p>
                      <div className="flex items-center justify-between mt-3">
                        <div className="text-xs text-muted-foreground">
                          <p>Durée: {program.duration}</p>
                          <p>Coordinateur: {program.coordinator}</p>
                        </div>
                        <Button size="sm" variant="ghost">
                          Voir détails
                        </Button>
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