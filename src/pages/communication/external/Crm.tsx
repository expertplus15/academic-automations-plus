import { CommunicationModuleLayout } from "@/components/layouts/CommunicationModuleLayout";
import { CommunicationPageHeader } from "@/components/CommunicationPageHeader";
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { 
  Building, 
  Plus, 
  FileText, 
  Mail, 
  Phone, 
  MoreHorizontal, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  MessageSquare,
  Video
} from "lucide-react";
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export default function CommunicationCrm() {
  const { hasRole } = useAuth();
  const { toast } = useToast();

  const canManagePartners = hasRole(['admin', 'hr']);

  const handleRestrictedAction = (action: string) => {
    if (!canManagePartners) {
      toast({
        title: "Accès refusé",
        description: `Vous n'avez pas les permissions pour ${action}`,
        variant: "destructive"
      });
      return;
    }
  };

  return (
    <ProtectedRoute allowedRoles={['admin', 'hr', 'teacher', 'student']}>
      <CommunicationModuleLayout>
        <CommunicationPageHeader 
          title="CRM Partenaires" 
          subtitle="Communication et relations avec les partenaires externes" 
        />
        <div className="p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header with Actions */}
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">Relations Partenaires</h2>
                <p className="text-muted-foreground">Gérez vos communications avec les entreprises partenaires</p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => {
                  toast({
                    title: "Message groupé",
                    description: "Fonctionnalité de messagerie en développement",
                  });
                }}>
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Message Groupé
                </Button>
                <Button 
                  onClick={() => {
                    if (canManagePartners) {
                      toast({
                        title: "Nouveau contact",
                        description: "Formulaire de création de contact en développement",
                      });
                    } else {
                      handleRestrictedAction("ajouter des partenaires");
                    }
                  }}
                  disabled={!canManagePartners}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Nouveau Contact
                </Button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Contacts Actifs</p>
                      <p className="text-2xl font-bold">89</p>
                    </div>
                    <Building className="h-8 w-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Messages ce mois</p>
                      <p className="text-2xl font-bold">156</p>
                    </div>
                    <MessageSquare className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Appels programmés</p>
                      <p className="text-2xl font-bold">12</p>
                    </div>
                    <Video className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Taux de réponse</p>
                      <p className="text-2xl font-bold">87%</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-orange-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filters and Search */}
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <Input placeholder="Rechercher un contact partenaire..." className="w-full" />
                  </div>
                  <Select>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="Type de relation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="stages">Stages</SelectItem>
                      <SelectItem value="emplois">Emplois</SelectItem>
                      <SelectItem value="projets">Projets</SelectItem>
                      <SelectItem value="recherche">Recherche</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="Statut communication" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="actif">Actif</SelectItem>
                      <SelectItem value="attente">En attente</SelectItem>
                      <SelectItem value="suspendu">Suspendu</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Partners Communication List */}
            <Card>
              <CardHeader>
                <CardTitle>Contacts & Communications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      name: "TechCorp Solutions",
                      contact: "sarah.martin@techcorp.com",
                      phone: "+33 1 23 45 67 89",
                      lastContact: "Il y a 2 jours",
                      relation: "Stages informatique",
                      status: "Actif",
                      messages: 23
                    },
                    {
                      name: "Global Industries",
                      contact: "pierre.dubois@global.com", 
                      phone: "+33 1 98 76 54 32",
                      lastContact: "La semaine dernière",
                      relation: "Projets étudiants",
                      status: "Actif",
                      messages: 8
                    },
                    {
                      name: "Innovation Labs",
                      contact: "marie.rousseau@labs.com",
                      phone: "+33 1 45 67 89 12",
                      lastContact: "Il y a 1 mois",
                      relation: "Recherche & Développement",
                      status: "En attente",
                      messages: 5
                    }
                  ].map((partner, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                          <Building className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{partner.name}</h3>
                          <p className="text-sm text-muted-foreground">{partner.relation}</p>
                          <div className="flex items-center gap-4 mt-1">
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Mail className="h-3 w-3" />
                              {partner.contact}
                            </div>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Phone className="h-3 w-3" />
                              {partner.phone}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm font-medium">{partner.messages} messages</p>
                          <p className="text-xs text-muted-foreground">{partner.lastContact}</p>
                        </div>
                        <Badge variant={partner.status === 'Actif' ? 'default' : 'secondary'}>
                          {partner.status}
                        </Badge>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => {
                            toast({
                              title: "Message envoyé",
                              description: `Message envoyé à ${partner.name}`,
                            });
                          }}>
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => {
                            toast({
                              title: "Appel initié",
                              description: `Appel vers ${partner.phone}`,
                            });
                          }}>
                            <Phone className="h-4 w-4" />
                          </Button>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => {
                              toast({
                                title: "Historique",
                                description: `Consultation de l'historique de ${partner.name}`,
                              });
                            }}>Voir historique</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => {
                              toast({
                                title: "Appel programmé",
                                description: `Appel programmé avec ${partner.name}`,
                              });
                            }}>Programmer appel</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => {
                              toast({
                                title: "Modification",
                                description: `Ouverture du formulaire de modification de ${partner.name}`,
                              });
                            }}>Modifier contact</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600" onClick={() => {
                              if (!canManagePartners) {
                                handleRestrictedAction("suspendre des partenaires");
                              } else {
                                toast({
                                  title: "Contact suspendu",
                                  description: `${partner.name} a été suspendu`,
                                  variant: "destructive"
                                });
                              }
                            }}>Suspendre</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
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