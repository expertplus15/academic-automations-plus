import { CommunicationModuleLayout } from "@/components/layouts/CommunicationModuleLayout";
import { CommunicationPageHeader } from "@/components/CommunicationPageHeader";
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
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
  MailOpen,
  Search,
  Archive,
  Star,
  Plus,
  Download,
  RefreshCw,
  Volume
} from "lucide-react";
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useNotifications } from '@/hooks/communication/useNotifications';
import { NotificationCenter } from '@/components/communication/NotificationCenter';
import { useState, useEffect } from 'react';

export default function CommunicationNotifications() {
  const { hasRole } = useAuth();
  const { toast } = useToast();
  
  // Real-time notifications hook
  const {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    createNotification
  } = useNotifications();

  // Local state for UI
  const [selectedTab, setSelectedTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);
  const [filterType, setFilterType] = useState<string | null>(null);

  const notificationSettings = [
    {
      category: "Messages",
      email: true,
      push: true,
      desktop: true,
      sound: true
    },
    {
      category: "Événements",
      email: true,
      push: false,
      desktop: true,
      sound: false
    },
    {
      category: "Système",
      email: false,
      push: true,
      desktop: true,
      sound: true
    },
    {
      category: "Rappels",
      email: true,
      push: true,
      desktop: false,
      sound: false
    }
  ];

  // Filter notifications based on tab and search
  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = selectedTab === 'all' || 
                      (selectedTab === 'unread' && !notification.is_read) ||
                      (selectedTab === 'read' && notification.is_read);
    const matchesType = !filterType || notification.notification_type === filterType;
    
    return matchesSearch && matchesTab && matchesType;
  });

  const handleBulkAction = async (action: 'read' | 'delete' | 'archive') => {
    if (selectedNotifications.length === 0) return;

    try {
      switch (action) {
        case 'read':
          await Promise.all(selectedNotifications.map(id => markAsRead(id)));
          toast({
            title: "Notifications marquées",
            description: `${selectedNotifications.length} notifications marquées comme lues`,
          });
          break;
        case 'delete':
          await Promise.all(selectedNotifications.map(id => deleteNotification(id)));
          toast({
            title: "Notifications supprimées",
            description: `${selectedNotifications.length} notifications supprimées`,
          });
          break;
        case 'archive':
          // Archive functionality would be implemented here
          toast({
            title: "Notifications archivées",
            description: `${selectedNotifications.length} notifications archivées`,
          });
          break;
      }
      setSelectedNotifications([]);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de l'action",
        variant: "destructive"
      });
    }
  };

  const handleCreateTestNotification = async () => {
    if (!hasRole(['admin', 'hr'])) return;
    
    try {
      const testNotifications = [
        {
          title: "Nouveau message de test",
          message: "Ceci est une notification de test pour vérifier le système",
          notification_type: 'MESSAGE' as const
        },
        {
          title: "Rappel système",
          message: "Maintenance programmée ce soir à 22h00",
          notification_type: 'SYSTEM' as const
        }
      ];

      const randomNotif = testNotifications[Math.floor(Math.random() * testNotifications.length)];
      
      // Create for current user (in real app, you'd specify the target user)
      await createNotification('current-user-id', randomNotif);
      
      toast({
        title: "Notification créée",
        description: "Une notification de test a été créée",
      });
    } catch (error) {
      console.error('Error creating test notification:', error);
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'MESSAGE':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700">Message</Badge>;
      case 'EVENT':
        return <Badge variant="outline" className="bg-green-50 text-green-700">Événement</Badge>;
      case 'SYSTEM':
        return <Badge variant="outline" className="bg-red-50 text-red-700">Système</Badge>;
      case 'REMINDER':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700">Rappel</Badge>;
      default:
        return <Badge variant="outline">Autre</Badge>;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'MESSAGE':
        return MessageSquare;
      case 'EVENT':
        return Calendar;
      case 'SYSTEM':
        return AlertTriangle;
      case 'REMINDER':
        return Bell;
      default:
        return Info;
    }
  };

  const formatNotificationTime = (timestamp: string) => {
    const now = new Date();
    const notifDate = new Date(timestamp);
    const diffInMinutes = (now.getTime() - notifDate.getTime()) / (1000 * 60);
    
    if (diffInMinutes < 1) return 'À l\'instant';
    if (diffInMinutes < 60) return `Il y a ${Math.floor(diffInMinutes)} min`;
    if (diffInMinutes < 1440) return `Il y a ${Math.floor(diffInMinutes / 60)}h`;
    return `Il y a ${Math.floor(diffInMinutes / 1440)} jour${Math.floor(diffInMinutes / 1440) > 1 ? 's' : ''}`;
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
                      <p className="text-2xl font-bold">{unreadCount}</p>
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
                      <p className="text-2xl font-bold">
                        {notifications.filter(n => {
                          const today = new Date().toDateString();
                          return new Date(n.created_at).toDateString() === today;
                        }).length}
                      </p>
                    </div>
                    <Bell className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total</p>
                      <p className="text-2xl font-bold">{notifications.length}</p>
                    </div>
                    <Mail className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Types</p>
                      <p className="text-2xl font-bold">
                        {new Set(notifications.map(n => n.notification_type)).size}
                      </p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="flex gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-80">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher des notifications..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Button 
                  variant="outline"
                  onClick={() => setFilterType(filterType ? null : 'MESSAGE')}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  {filterType ? 'Effacer' : 'Filtrer'}
                </Button>
              </div>
              
              <div className="flex gap-2">
                {hasRole(['admin', 'hr']) && (
                  <Button onClick={handleCreateTestNotification} variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Test
                  </Button>
                )}
                <Button onClick={() => window.location.reload()} variant="outline" size="sm">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Actualiser
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Liste des notifications */}
              <div className="lg:col-span-2 space-y-4">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Bell className="h-5 w-5" />
                        Notifications 
                        {loading && <RefreshCw className="h-4 w-4 animate-spin" />}
                      </CardTitle>
                      <div className="flex gap-2">
                        {selectedNotifications.length > 0 && (
                          <>
                            <Button variant="outline" size="sm" onClick={() => handleBulkAction('read')}>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Marquer lues ({selectedNotifications.length})
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleBulkAction('delete')}>
                              <Trash2 className="h-4 w-4 mr-2" />
                              Supprimer
                            </Button>
                          </>
                        )}
                        <Button variant="outline" size="sm" onClick={markAllAsRead}>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Tout marquer lu
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="all">
                          Toutes ({notifications.length})
                        </TabsTrigger>
                        <TabsTrigger value="unread">
                          Non lues ({unreadCount})
                        </TabsTrigger>
                        <TabsTrigger value="read">
                          Lues ({notifications.length - unreadCount})
                        </TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value={selectedTab} className="mt-4">
                        <ScrollArea className="h-[600px]">
                          {filteredNotifications.length === 0 ? (
                            <div className="text-center py-8">
                              <Bell className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                              <p className="text-muted-foreground">
                                {searchQuery ? 'Aucune notification trouvée' : 'Aucune notification'}
                              </p>
                            </div>
                          ) : (
                            <div className="space-y-3">
                              {filteredNotifications.map((notification) => {
                                const IconComponent = getTypeIcon(notification.notification_type);
                                const isSelected = selectedNotifications.includes(notification.id);
                                return (
                                  <div 
                                    key={notification.id} 
                                    className={`p-4 border rounded-lg transition-colors hover:bg-muted/50 ${
                                      !notification.is_read ? 'bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800' : ''
                                    } ${isSelected ? 'ring-2 ring-primary' : ''}`}
                                  >
                                    <div className="flex items-start gap-3">
                                      <Checkbox
                                        checked={isSelected}
                                        onCheckedChange={(checked) => {
                                          if (checked) {
                                            setSelectedNotifications([...selectedNotifications, notification.id]);
                                          } else {
                                            setSelectedNotifications(selectedNotifications.filter(id => id !== notification.id));
                                          }
                                        }}
                                      />
                                      <div className="p-2 rounded-lg bg-muted">
                                        <IconComponent className="h-4 w-4" />
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between">
                                          <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                              <h3 className={`font-medium ${!notification.is_read ? 'text-primary' : ''}`}>
                                                {notification.title}
                                              </h3>
                                              {!notification.is_read && (
                                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                              )}
                                            </div>
                                            <p className="text-sm text-muted-foreground mb-2">
                                              {notification.message}
                                            </p>
                                            <div className="flex items-center gap-2">
                                              <span className="text-xs text-muted-foreground">
                                                {formatNotificationTime(notification.created_at)}
                                              </span>
                                              {getTypeBadge(notification.notification_type)}
                                            </div>
                                          </div>
                                          <div className="flex gap-1 ml-2">
                                            {!notification.is_read && (
                                              <Button 
                                                variant="ghost" 
                                                size="icon"
                                                onClick={() => markAsRead(notification.id)}
                                              >
                                                <CheckCircle className="h-4 w-4" />
                                              </Button>
                                            )}
                                            <Button 
                                              variant="ghost" 
                                              size="icon"
                                              onClick={() => deleteNotification(notification.id)}
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
                          )}
                        </ScrollArea>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </div>

              {/* Paramètres et actions */}
              <div className="space-y-6">
                {/* Live Notification Center */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BellRing className="h-5 w-5" />
                      Centre en Temps Réel
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <NotificationCenter />
                  </CardContent>
                </Card>

                {/* Notification Settings */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="h-5 w-5" />
                      Paramètres
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {notificationSettings.map((setting, index) => (
                      <div key={index} className="space-y-3">
                        <h4 className="font-medium">{setting.category}</h4>
                        <div className="space-y-2 pl-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Mail className="h-3 w-3" />
                              <span className="text-sm">Email</span>
                            </div>
                            <Switch defaultChecked={setting.email} />
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Bell className="h-3 w-3" />
                              <span className="text-sm">Push</span>
                            </div>
                            <Switch defaultChecked={setting.push} />
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Settings className="h-3 w-3" />
                              <span className="text-sm">Bureau</span>
                            </div>
                            <Switch defaultChecked={setting.desktop} />
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Volume className="h-3 w-3" />
                              <span className="text-sm">Son</span>
                            </div>
                            <Switch defaultChecked={setting.sound} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Actions Rapides</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => {
                        const unreadIds = notifications
                          .filter(n => !n.is_read)
                          .map(n => n.id);
                        setSelectedNotifications(unreadIds);
                      }}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Sélectionner non lues
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => handleBulkAction('archive')}
                      disabled={selectedNotifications.length === 0}
                    >
                      <Archive className="h-4 w-4 mr-2" />
                      Archiver sélectionnées
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => {
                        // Export functionality
                        const data = filteredNotifications.map(n => ({
                          title: n.title,
                          message: n.message,
                          type: n.notification_type,
                          created: n.created_at,
                          read: n.is_read
                        }));
                        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = 'notifications.json';
                        a.click();
                      }}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Exporter JSON
                    </Button>
                  </CardContent>
                </Card>

                {/* Statistics */}
                <Card>
                  <CardHeader>
                    <CardTitle>Statistiques</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Messages</span>
                      <span className="font-medium">
                        {notifications.filter(n => n.notification_type === 'MESSAGE').length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Événements</span>
                      <span className="font-medium">
                        {notifications.filter(n => n.notification_type === 'EVENT').length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Système</span>
                      <span className="font-medium">
                        {notifications.filter(n => n.notification_type === 'SYSTEM').length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Rappels</span>
                      <span className="font-medium">
                        {notifications.filter(n => n.notification_type === 'REMINDER').length}
                      </span>
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