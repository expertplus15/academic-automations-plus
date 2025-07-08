import { CommunicationModuleLayout } from "@/components/layouts/CommunicationModuleLayout";
import { CommunicationPageHeader } from "@/components/CommunicationPageHeader";
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
  Bell, 
  BellRing,
  Mail,
  MessageSquare,
  Calendar,
  AlertTriangle,
  Info,
  CheckCircle,
  Settings,
  Filter,
  Trash2,
  MailOpen
} from "lucide-react";
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export default function CommunicationNotifications() {
  const { hasRole } = useAuth();
  const { toast } = useToast();

  const notifications = [
    {
      id: "1",
      type: "message",
      title: "Nouveau message de Marie Dubois",
      content: "Documents du cours disponibles",
      timestamp: "Il y a 5 min",
      read: false,
      priority: "normal",
      icon: MessageSquare,
      color: "text-blue-500"
    },
    {
      id: "2",
      type: "system",
      title: "Maintenance programmée",
      content: "Le système sera indisponible dimanche de 2h à 4h",
      timestamp: "Il y a 1h",
      read: false,
      priority: "high",
      icon: AlertTriangle,
      color: "text-orange-500"
    },
    {
      id: "3",
      type: "calendar",
      title: "Rappel: Réunion dans 30 minutes",
      content: "Réunion équipe pédagogique - Salle 201",
      timestamp: "Il y a 2h",
      read: true,
      priority: "high",
      icon: Calendar,
      color: "text-green-500"
    },
    {
      id: "4",
      type: "info",
      title: "Nouvelle fonctionnalité disponible",
      content: "Le module de suivi des notes a été mis à jour",
      timestamp: "Il y a 1 jour",
      read: true,
      priority: "low",
      icon: Info,
      color: "text-blue-500"
    }
  ];

  const notificationSettings = [
    {
      category: "Messages",
      email: true,
      push: true,
      desktop: true
    },
    {
      category: "Événements",
      email: true,
      push: false,
      desktop: true
    },
    {
      category: "Système",
      email: false,
      push: true,
      desktop: true
    },
    {
      category: "Rappels",
      email: true,
      push: true,
      desktop: false
    }
  ];

  const handleMarkAsRead = (id: string) => {
    toast({
      title: "Notification marquée comme lue",
      description: "La notification a été marquée comme lue",
    });
  };

  const handleMarkAllAsRead = () => {
    toast({
      title: "Toutes les notifications marquées comme lues",
      description: "Toutes les notifications ont été marquées comme lues",
    });
  };

  const handleDeleteNotification = (id: string) => {
    toast({
      title: "Notification supprimée",
      description: "La notification a été supprimée",
    });
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive">Priorité élevée</Badge>;
      case 'normal':
        return <Badge variant="secondary">Normal</Badge>;
      case 'low':
        return <Badge variant="outline">Faible</Badge>;
      default:
        return null;
    }
  };

  return (
    <ProtectedRoute allowedRoles={['admin', 'hr', 'teacher', 'student']}>
      <CommunicationModuleLayout>
        <CommunicationPageHeader 
          title="Centre de Notifications" 
          subtitle="Gestion des notifications et alertes système" 
        />
        <div className="p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Non lues</p>
                      <p className="text-2xl font-bold">7</p>
                    </div>
                    <BellRing className="h-8 w-8 text-red-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Aujourd'hui</p>
                      <p className="text-2xl font-bold">12</p>
                    </div>
                    <Bell className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Cette semaine</p>
                      <p className="text-2xl font-bold">45</p>
                    </div>
                    <Mail className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Archivées</p>
                      <p className="text-2xl font-bold">156</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Liste des notifications */}
              <div className="lg:col-span-2 space-y-4">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Notifications</CardTitle>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Filter className="h-4 w-4 mr-2" />
                          Filtrer
                        </Button>
                        <Button variant="outline" size="sm" onClick={handleMarkAllAsRead}>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Tout marquer comme lu
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {notifications.map((notification) => {
                        const IconComponent = notification.icon;
                        return (
                          <div 
                            key={notification.id} 
                            className={`p-4 border rounded-lg ${!notification.read ? 'bg-blue-50 border-blue-200' : ''}`}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`p-2 rounded-lg bg-muted ${notification.color}`}>
                                <IconComponent className="h-4 w-4" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <h3 className={`font-medium ${!notification.read ? 'text-primary' : ''}`}>
                                      {notification.title}
                                    </h3>
                                    <p className="text-sm text-muted-foreground mt-1">
                                      {notification.content}
                                    </p>
                                    <div className="flex items-center gap-2 mt-2">
                                      <span className="text-xs text-muted-foreground">
                                        {notification.timestamp}
                                      </span>
                                      {getPriorityBadge(notification.priority)}
                                    </div>
                                  </div>
                                  <div className="flex gap-1 ml-2">
                                    {!notification.read && (
                                      <Button 
                                        variant="ghost" 
                                        size="icon"
                                        onClick={() => handleMarkAsRead(notification.id)}
                                      >
                                        <CheckCircle className="h-4 w-4" />
                                      </Button>
                                    )}
                                    <Button 
                                      variant="ghost" 
                                      size="icon"
                                      onClick={() => handleDeleteNotification(notification.id)}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Paramètres de notifications */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="h-5 h-5" />
                      Paramètres
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {notificationSettings.map((setting, index) => (
                      <div key={index} className="space-y-3">
                        <h4 className="font-medium">{setting.category}</h4>
                        <div className="space-y-2 pl-4">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Email</span>
                            <Switch defaultChecked={setting.email} />
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Push</span>
                            <Switch defaultChecked={setting.push} />
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Bureau</span>
                            <Switch defaultChecked={setting.desktop} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Actions Rapides</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">
                      <MailOpen className="h-4 w-4 mr-2" />
                      Marquer tout comme non lu
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Supprimer toutes les notifications lues
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Settings className="h-4 w-4 mr-2" />
                      Paramètres avancés
                    </Button>
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