import { CommunicationModuleLayout } from "@/components/layouts/CommunicationModuleLayout";
import { CommunicationPageHeader } from "@/components/CommunicationPageHeader";
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Phone, 
  Mail,
  MessageSquare,
  Video,
  MapPin,
  Building,
  Users,
  Search,
  Filter,
  UserCheck,
  Calendar,
  Clock,
  Download,
  Plus
} from "lucide-react";
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export default function CommunicationDirectory() {
  const { hasRole } = useAuth();
  const { toast } = useToast();

  const contacts = [
    {
      id: "1",
      name: "Marie Dubois",
      role: "Enseignant",
      department: "Informatique",
      email: "marie.dubois@etablissement.edu",
      phone: "+33 1 23 45 67 89",
      extension: "1234",
      office: "B-205",
      avatar: "/avatars/marie.jpg",
      status: "online",
      lastSeen: "Maintenant"
    },
    {
      id: "2",
      name: "Pierre Martin",
      role: "Directeur des Études",
      department: "Administration",
      email: "pierre.martin@etablissement.edu",
      phone: "+33 1 23 45 67 90",
      extension: "1001",
      office: "A-101",
      avatar: "/avatars/pierre.jpg",
      status: "offline",
      lastSeen: "Il y a 2h"
    },
    {
      id: "3",
      name: "Sophie Laurent",
      role: "Enseignant",
      department: "Mathématiques",
      email: "sophie.laurent@etablissement.edu",
      phone: "+33 1 23 45 67 91",
      extension: "1235",
      office: "C-102",
      avatar: "/avatars/sophie.jpg",
      status: "busy",
      lastSeen: "En réunion"
    },
    {
      id: "4",
      name: "Jean Dupont",
      role: "Responsable IT",
      department: "Support Technique",
      email: "jean.dupont@etablissement.edu",
      phone: "+33 1 23 45 67 92",
      extension: "2000",
      office: "Sous-sol - ST1",
      avatar: "/avatars/jean.jpg",
      status: "online",
      lastSeen: "Maintenant"
    }
  ];

  const departments = [
    { name: "Administration", count: 12 },
    { name: "Informatique", count: 8 },
    { name: "Mathématiques", count: 6 },
    { name: "Support Technique", count: 4 },
    { name: "Scolarité", count: 5 }
  ];

  const handleCall = (contact: any) => {
    toast({
      title: "Appel en cours",
      description: `Appel vers ${contact.name} (${contact.phone})`,
    });
  };

  const handleMessage = (contact: any) => {
    toast({
      title: "Message",
      description: `Ouverture de la conversation avec ${contact.name}`,
    });
  };

  const handleVideoCall = (contact: any) => {
    toast({
      title: "Appel vidéo",
      description: `Appel vidéo vers ${contact.name}`,
    });
  };

  const handleEmail = (contact: any) => {
    toast({
      title: "Email",
      description: `Ouverture du client email pour ${contact.email}`,
    });
  };

  const handleExportDirectory = () => {
    toast({
      title: "Export en cours",
      description: "Le répertoire est en cours d'export au format CSV",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-500';
      case 'busy':
        return 'bg-orange-500';
      case 'offline':
        return 'bg-gray-400';
      default:
        return 'bg-gray-400';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'online':
        return 'En ligne';
      case 'busy':
        return 'Occupé';
      case 'offline':
        return 'Hors ligne';
      default:
        return 'Inconnu';
    }
  };

  return (
    <ProtectedRoute allowedRoles={['admin', 'hr', 'teacher', 'student']}>
      <CommunicationModuleLayout>
        <CommunicationPageHeader 
          title="Répertoire Interne" 
          subtitle="Annuaire des contacts et coordonnées du personnel" 
        />
        <div className="p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            
            {/* Header */}
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">Répertoire des Contacts</h2>
                <p className="text-muted-foreground">Annuaire du personnel et contacts de l'établissement</p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={handleExportDirectory}>
                  <Download className="w-4 h-4 mr-2" />
                  Exporter
                </Button>
                {hasRole(['admin', 'hr']) && (
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Ajouter Contact
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
                      <p className="text-sm font-medium text-muted-foreground">Total contacts</p>
                      <p className="text-2xl font-bold">35</p>
                    </div>
                    <Users className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">En ligne</p>
                      <p className="text-2xl font-bold">12</p>
                    </div>
                    <UserCheck className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Départements</p>
                      <p className="text-2xl font-bold">5</p>
                    </div>
                    <Building className="h-8 w-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Appels aujourd'hui</p>
                      <p className="text-2xl font-bold">23</p>
                    </div>
                    <Phone className="h-8 w-8 text-orange-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              
              {/* Filters Sidebar */}
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Filtres</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Recherche</label>
                      <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Nom, email, poste..." className="pl-9" />
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-2 block">Département</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Tous les départements" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Tous</SelectItem>
                          {departments.map((dept, index) => (
                            <SelectItem key={index} value={dept.name.toLowerCase()}>
                              {dept.name} ({dept.count})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Statut</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Tous les statuts" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Tous</SelectItem>
                          <SelectItem value="online">En ligne</SelectItem>
                          <SelectItem value="busy">Occupé</SelectItem>
                          <SelectItem value="offline">Hors ligne</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Rôle</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Tous les rôles" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Tous</SelectItem>
                          <SelectItem value="teacher">Enseignant</SelectItem>
                          <SelectItem value="admin">Administration</SelectItem>
                          <SelectItem value="support">Support</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Départements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {departments.map((dept, index) => (
                        <div key={index} className="flex items-center justify-between p-2 rounded hover:bg-muted/50 cursor-pointer">
                          <span className="text-sm">{dept.name}</span>
                          <Badge variant="outline">{dept.count}</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Contacts List */}
              <div className="lg:col-span-3">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Contacts</CardTitle>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Filter className="h-4 w-4 mr-2" />
                          Filtrer
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {contacts.map((contact) => (
                        <div key={contact.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                          <div className="flex items-start gap-4">
                            <div className="relative">
                              <Avatar className="h-12 w-12">
                                <AvatarImage src={contact.avatar} />
                                <AvatarFallback>{contact.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                              </Avatar>
                              <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${getStatusColor(contact.status)} rounded-full border-2 border-white`}></div>
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-2">
                                <h3 className="font-semibold text-lg">{contact.name}</h3>
                                <Badge variant="outline">{getStatusText(contact.status)}</Badge>
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-muted-foreground">
                                <div className="space-y-1">
                                  <p className="flex items-center gap-2">
                                    <UserCheck className="h-3 w-3" />
                                    {contact.role}
                                  </p>
                                  <p className="flex items-center gap-2">
                                    <Building className="h-3 w-3" />
                                    {contact.department}
                                  </p>
                                  <p className="flex items-center gap-2">
                                    <MapPin className="h-3 w-3" />
                                    Bureau {contact.office}
                                  </p>
                                </div>
                                
                                <div className="space-y-1">
                                  <p className="flex items-center gap-2">
                                    <Mail className="h-3 w-3" />
                                    {contact.email}
                                  </p>
                                  <p className="flex items-center gap-2">
                                    <Phone className="h-3 w-3" />
                                    {contact.phone} (ext. {contact.extension})
                                  </p>
                                  <p className="flex items-center gap-2">
                                    <Clock className="h-3 w-3" />
                                    {contact.lastSeen}
                                  </p>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex flex-col gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleCall(contact)}
                              >
                                <Phone className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleVideoCall(contact)}
                              >
                                <Video className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleMessage(contact)}
                              >
                                <MessageSquare className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleEmail(contact)}
                              >
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
          </div>
        </div>
      </CommunicationModuleLayout>
    </ProtectedRoute>
  );
}