import { CommunicationModuleLayout } from "@/components/layouts/CommunicationModuleLayout";
import { CommunicationPageHeader } from "@/components/CommunicationPageHeader";
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Briefcase, 
  Plus, 
  MessageSquare, 
  Building, 
  MapPin, 
  Calendar,
  Users,
  TrendingUp,
  Mail
} from "lucide-react";
import { useAuth } from '@/hooks/useAuth';

export default function CommunicationInternships() {
  const { hasRole } = useAuth();
  const canManageInternships = hasRole(['admin', 'hr', 'teacher']);

  return (
    <ProtectedRoute allowedRoles={['admin', 'hr', 'teacher', 'student']}>
      <CommunicationModuleLayout>
        <CommunicationPageHeader 
          title="Communication Stages" 
          subtitle="Gestion des communications pour stages et emplois" 
        />
        <div className="p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">Communications Stages & Emplois</h2>
                <p className="text-muted-foreground">Gérez les échanges avec les entreprises pour stages et opportunités d'emploi</p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Campagne Email
                </Button>
                {canManageInternships && (
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Nouvelle Offre
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
                      <p className="text-sm font-medium text-muted-foreground">Offres Actives</p>
                      <p className="text-2xl font-bold">24</p>
                    </div>
                    <Briefcase className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Candidatures</p>
                      <p className="text-2xl font-bold">67</p>
                    </div>
                    <Users className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Entretiens</p>
                      <p className="text-2xl font-bold">15</p>
                    </div>
                    <Calendar className="h-8 w-8 text-orange-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Taux placement</p>
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
                    <Input placeholder="Rechercher une offre ou entreprise..." className="w-full" />
                  </div>
                  <Select>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="Type d'offre" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="stage">Stage</SelectItem>
                      <SelectItem value="emploi">Emploi</SelectItem>
                      <SelectItem value="alternance">Alternance</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="Statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="pourvue">Pourvue</SelectItem>
                      <SelectItem value="expiree">Expirée</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Communications List */}
            <Card>
              <CardHeader>
                <CardTitle>Communications Récentes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      company: "Digital Solutions",
                      position: "Stage Développeur Frontend",
                      type: "stage",
                      lastContact: "Il y a 1 jour",
                      status: "En cours",
                      applicants: 8,
                      contactPerson: "Julie Moreau",
                      location: "Paris"
                    },
                    {
                      company: "Tech Innovate",
                      position: "Développeur Full Stack",
                      type: "emploi",
                      lastContact: "Il y a 3 jours", 
                      status: "Entretiens",
                      applicants: 12,
                      contactPerson: "Marc Dubois",
                      location: "Lyon"
                    },
                    {
                      company: "StartUp Labs",
                      position: "Stage Marketing Digital",
                      type: "stage",
                      lastContact: "La semaine dernière",
                      status: "Pourvu",
                      applicants: 15,
                      contactPerson: "Sophie Martin",
                      location: "Toulouse"
                    }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                          <Briefcase className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{item.position}</h3>
                          <p className="text-sm text-muted-foreground flex items-center gap-4">
                            <span className="flex items-center gap-1">
                              <Building className="h-3 w-3" />
                              {item.company}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {item.location}
                            </span>
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Contact: {item.contactPerson} • {item.lastContact}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm font-medium">{item.applicants} candidats</p>
                          <Badge variant={
                            item.status === 'En cours' ? 'default' : 
                            item.status === 'Entretiens' ? 'secondary' : 
                            'outline'
                          }>
                            {item.status}
                          </Badge>
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
          </div>
        </div>
      </CommunicationModuleLayout>
    </ProtectedRoute>
  );
}