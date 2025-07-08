import { CommunicationModuleLayout } from "@/components/layouts/CommunicationModuleLayout";
import { CommunicationPageHeader } from "@/components/CommunicationPageHeader";
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Megaphone, 
  Plus, 
  Edit, 
  Eye,
  Clock,
  Users,
  AlertTriangle,
  Info,
  Star,
  Calendar,
  Search,
  Filter
} from "lucide-react";
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export default function CommunicationAnnouncements() {
  const { hasRole } = useAuth();
  const { toast } = useToast();

  const canManageAnnouncements = hasRole(['admin', 'hr']);

  const announcements = [
    {
      id: "1",
      title: "Mise à jour du système de notation",
      content: "Le nouveau système de notation sera disponible à partir du 15 janvier. Formation obligatoire pour tous les enseignants.",
      category: "Système",
      priority: "high",
      status: "published",
      author: "Administration",
      publishDate: "2024-01-08",
      views: 234,
      targetAudience: "Enseignants"
    },
    {
      id: "2",
      title: "Nouvelle procédure de demande de matériel",
      content: "Les demandes de matériel pédagogique doivent maintenant être soumises via le portail intranet.",
      category: "Procédure",
      priority: "normal",
      status: "published",
      author: "Service Technique",
      publishDate: "2024-01-07",
      views: 156,
      targetAudience: "Tous"
    },
    {
      id: "3",
      title: "Fermeture exceptionnelle bibliothèque",
      content: "La bibliothèque sera fermée le 20 janvier pour maintenance des systèmes informatiques.",
      category: "Information",
      priority: "normal",
      status: "scheduled",
      author: "Bibliothèque",
      publishDate: "2024-01-15",
      views: 0,
      targetAudience: "Étudiants"
    }
  ];

  const handleCreateAnnouncement = () => {
    if (canManageAnnouncements) {
      toast({
        title: "Nouvelle annonce",
        description: "Fonctionnalité de création d'annonce en développement",
      });
    } else {
      toast({
        title: "Accès refusé",
        description: "Vous n'avez pas les permissions pour créer des annonces",
        variant: "destructive"
      });
    }
  };

  const handleEditAnnouncement = (id: string) => {
    if (canManageAnnouncements) {
      toast({
        title: "Modifier l'annonce",
        description: `Modification de l'annonce ${id} en développement`,
      });
    } else {
      toast({
        title: "Accès refusé",
        description: "Vous n'avez pas les permissions pour modifier des annonces",
        variant: "destructive"
      });
    }
  };

  const handleViewAnnouncement = (id: string) => {
    toast({
      title: "Affichage de l'annonce",
      description: `Affichage détaillé de l'annonce ${id} en développement`,
    });
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive" className="flex items-center gap-1">
          <AlertTriangle className="h-3 w-3" />
          Urgent
        </Badge>;
      case 'normal':
        return <Badge variant="secondary">Normal</Badge>;
      case 'low':
        return <Badge variant="outline">Faible</Badge>;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <Badge variant="default">Publié</Badge>;
      case 'scheduled':
        return <Badge variant="secondary">Programmé</Badge>;
      case 'draft':
        return <Badge variant="outline">Brouillon</Badge>;
      default:
        return null;
    }
  };

  return (
    <ProtectedRoute allowedRoles={['admin', 'hr', 'teacher', 'student']}>
      <CommunicationModuleLayout>
        <CommunicationPageHeader 
          title="Annonces Officielles" 
          subtitle="Diffusion d'informations officielles et communications importantes" 
        />
        <div className="p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            
            {/* Header */}
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">Annonces & Communications</h2>
                <p className="text-muted-foreground">Gestion des annonces officielles de l'établissement</p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  Filtrer
                </Button>
                {canManageAnnouncements && (
                  <Button onClick={handleCreateAnnouncement}>
                    <Plus className="w-4 h-4 mr-2" />
                    Nouvelle Annonce
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
                      <p className="text-sm font-medium text-muted-foreground">Annonces actives</p>
                      <p className="text-2xl font-bold">12</p>
                    </div>
                    <Megaphone className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Vues totales</p>
                      <p className="text-2xl font-bold">2,847</p>
                    </div>
                    <Eye className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Programmées</p>
                      <p className="text-2xl font-bold">3</p>
                    </div>
                    <Clock className="h-8 w-8 text-orange-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Importantes</p>
                      <p className="text-2xl font-bold">5</p>
                    </div>
                    <Star className="h-8 w-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="Rechercher une annonce..." className="pl-9" />
                    </div>
                  </div>
                  <Select>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="Catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="system">Système</SelectItem>
                      <SelectItem value="procedure">Procédure</SelectItem>
                      <SelectItem value="information">Information</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="Public cible" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous</SelectItem>
                      <SelectItem value="teachers">Enseignants</SelectItem>
                      <SelectItem value="students">Étudiants</SelectItem>
                      <SelectItem value="admin">Administration</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="Statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="published">Publié</SelectItem>
                      <SelectItem value="scheduled">Programmé</SelectItem>
                      <SelectItem value="draft">Brouillon</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Announcements List */}
            <Card>
              <CardHeader>
                <CardTitle>Liste des Annonces</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {announcements.map((announcement) => (
                    <div key={announcement.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-lg">{announcement.title}</h3>
                            {getPriorityBadge(announcement.priority)}
                            {getStatusBadge(announcement.status)}
                          </div>
                          <p className="text-muted-foreground mb-3 line-clamp-2">
                            {announcement.content}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {announcement.targetAudience}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {announcement.publishDate}
                            </span>
                            <span className="flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              {announcement.views} vues
                            </span>
                            <span>{announcement.author}</span>
                          </div>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleViewAnnouncement(announcement.id)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {canManageAnnouncements && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleEditAnnouncement(announcement.id)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          )}
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