import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Bell,
  Check,
  CheckCheck,
  Trash2,
  Settings,
  MessageCircle,
  Award,
  BookOpen,
  Users,
  Calendar,
  AlertCircle,
  Info,
  CheckCircle,
  X
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  notification_type: 'forum_reply' | 'badge_earned' | 'course_update' | 'assignment_due' | 'system';
  reference_id?: string;
  reference_type?: string;
  is_read: boolean;
  is_sent_email: boolean;
  created_at: string;
  expires_at?: string;
}

export function NotificationCenter() {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([
    // Mock data
    {
      id: '1',
      user_id: 'user-1',
      title: 'Nouveau message dans le forum',
      message: 'John Doe a répondu à votre question dans "JavaScript Avancé"',
      notification_type: 'forum_reply',
      reference_id: 'forum-post-123',
      reference_type: 'forum_post',
      is_read: false,
      is_sent_email: true,
      created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2h ago
    },
    {
      id: '2',
      user_id: 'user-1',
      title: 'Badge débloqué !',
      message: 'Félicitations ! Vous avez obtenu le badge "Expert JavaScript"',
      notification_type: 'badge_earned',
      reference_id: 'badge-js-expert',
      reference_type: 'badge',
      is_read: false,
      is_sent_email: false,
      created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4h ago
    },
    {
      id: '3',
      user_id: 'user-1',
      title: 'Nouveau contenu disponible',
      message: 'Le chapitre 5 du cours "React Hooks" est maintenant disponible',
      notification_type: 'course_update',
      reference_id: 'course-react-hooks',
      reference_type: 'course',
      is_read: true,
      is_sent_email: true,
      created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6h ago
    },
    {
      id: '4',
      user_id: 'user-1',
      title: 'Devoir à rendre',
      message: 'Le projet "API REST" doit être rendu avant demain 18h',
      notification_type: 'assignment_due',
      reference_id: 'assignment-api-rest',
      reference_type: 'assignment',
      is_read: true,
      is_sent_email: true,
      created_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8h ago
    },
    {
      id: '5',
      user_id: 'user-1',
      title: 'Maintenance programmée',
      message: 'La plateforme sera indisponible dimanche de 2h à 4h pour maintenance',
      notification_type: 'system',
      is_read: false,
      is_sent_email: false,
      created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1d ago
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7d from now
    }
  ]);

  const [selectedTab, setSelectedTab] = useState('all');
  const [showSettings, setShowSettings] = useState(false);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'forum_reply':
        return <MessageCircle className="w-4 h-4 text-blue-500" />;
      case 'badge_earned':
        return <Award className="w-4 h-4 text-yellow-500" />;
      case 'course_update':
        return <BookOpen className="w-4 h-4 text-green-500" />;
      case 'assignment_due':
        return <Calendar className="w-4 h-4 text-orange-500" />;
      case 'system':
        return <Settings className="w-4 h-4 text-gray-500" />;
      default:
        return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  const getNotificationColor = (type: string, isRead: boolean) => {
    const baseColor = isRead ? 'bg-muted/30' : 'bg-white';
    const borderColor = isRead ? 'border-muted' : 'border-primary/20';
    return `${baseColor} ${borderColor}`;
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'forum_reply':
        return 'Forum';
      case 'badge_earned':
        return 'Badge';
      case 'course_update':
        return 'Cours';
      case 'assignment_due':
        return 'Devoir';
      case 'system':
        return 'Système';
      default:
        return 'Info';
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    if (selectedTab === 'all') return true;
    if (selectedTab === 'unread') return !notification.is_read;
    if (selectedTab === 'read') return notification.is_read;
    return notification.notification_type === selectedTab;
  });

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, is_read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, is_read: true }))
    );
    toast({
      title: "Notifications marquées comme lues",
      description: "Toutes les notifications ont été marquées comme lues",
    });
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    toast({
      title: "Notification supprimée",
      description: "La notification a été supprimée",
    });
  };

  const clearAllRead = () => {
    setNotifications(prev => prev.filter(n => !n.is_read));
    toast({
      title: "Notifications supprimées",
      description: "Toutes les notifications lues ont été supprimées",
    });
  };

  // Simuler les notifications temps réel
  useEffect(() => {
    const interval = setInterval(() => {
      // Exemple: ajouter une nouvelle notification toutes les 30 secondes en dev
      if (Math.random() > 0.95) { // 5% de chance
        const newNotification: Notification = {
          id: Date.now().toString(),
          user_id: 'user-1',
          title: 'Nouvelle activité',
          message: 'Quelque chose d\'intéressant vient de se passer !',
          notification_type: 'system',
          is_read: false,
          is_sent_email: false,
          created_at: new Date().toISOString(),
        };
        setNotifications(prev => [newNotification, ...prev]);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Bell className="w-6 h-6" />
            {unreadCount > 0 && (
              <Badge className="absolute -top-2 -right-2 w-5 h-5 p-0 flex items-center justify-center text-xs bg-red-500">
                {unreadCount > 99 ? '99+' : unreadCount}
              </Badge>
            )}
          </div>
          <div>
            <h2 className="text-2xl font-bold">Notifications</h2>
            <p className="text-muted-foreground">
              {unreadCount > 0 ? `${unreadCount} notification${unreadCount > 1 ? 's' : ''} non lue${unreadCount > 1 ? 's' : ''}` : 'Toutes les notifications sont lues'}
            </p>
          </div>
        </div>
        
        <div className="flex gap-2">
          {unreadCount > 0 && (
            <Button variant="outline" onClick={markAllAsRead}>
              <CheckCheck className="w-4 h-4 mr-2" />
              Tout marquer comme lu
            </Button>
          )}
          <Button variant="outline" onClick={clearAllRead}>
            <Trash2 className="w-4 h-4 mr-2" />
            Supprimer les lues
          </Button>
          <Button variant="outline" onClick={() => setShowSettings(!showSettings)}>
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Filtres */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="all">
            Toutes ({notifications.length})
          </TabsTrigger>
          <TabsTrigger value="unread">
            Non lues ({unreadCount})
          </TabsTrigger>
          <TabsTrigger value="forum_reply">
            <MessageCircle className="w-4 h-4 mr-1" />
            Forums
          </TabsTrigger>
          <TabsTrigger value="badge_earned">
            <Award className="w-4 h-4 mr-1" />
            Badges
          </TabsTrigger>
          <TabsTrigger value="course_update">
            <BookOpen className="w-4 h-4 mr-1" />
            Cours
          </TabsTrigger>
          <TabsTrigger value="system">
            <Settings className="w-4 h-4 mr-1" />
            Système
          </TabsTrigger>
        </TabsList>

        <TabsContent value={selectedTab} className="mt-6">
          <ScrollArea className="h-[600px]">
            <div className="space-y-3">
              {filteredNotifications.map((notification) => (
                <Card 
                  key={notification.id}
                  className={`transition-all duration-200 hover:shadow-md cursor-pointer ${getNotificationColor(notification.notification_type, notification.is_read)}`}
                  onClick={() => !notification.is_read && markAsRead(notification.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="mt-1">
                        {getNotificationIcon(notification.notification_type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className={`text-sm font-medium ${!notification.is_read ? 'text-foreground' : 'text-muted-foreground'}`}>
                                {notification.title}
                              </h4>
                              <Badge variant="outline" className="text-xs">
                                {getTypeLabel(notification.notification_type)}
                              </Badge>
                              {!notification.is_read && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              {notification.message}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span>
                                {formatDistanceToNow(new Date(notification.created_at), { 
                                  addSuffix: true, 
                                  locale: fr 
                                })}
                              </span>
                              {notification.is_sent_email && (
                                <Badge variant="outline" className="text-xs">
                                  Email envoyé
                                </Badge>
                              )}
                              {notification.expires_at && (
                                <Badge variant="outline" className="text-xs text-orange-600">
                                  Expire {formatDistanceToNow(new Date(notification.expires_at), { locale: fr })}
                                </Badge>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex gap-1">
                            {!notification.is_read && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  markAsRead(notification.id);
                                }}
                              >
                                <Check className="w-3 h-3" />
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteNotification(notification.id);
                              }}
                              className="text-red-600 hover:text-red-700"
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {filteredNotifications.length === 0 && (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Bell className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <h3 className="text-lg font-semibold mb-2">Aucune notification</h3>
                    <p className="text-muted-foreground">
                      {selectedTab === 'unread' ? 'Toutes les notifications sont lues' : 'Aucune notification dans cette catégorie'}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>

      {/* Paramètres */}
      {showSettings && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Paramètres de notification
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Notifications par email</h4>
                  <p className="text-sm text-muted-foreground">Recevoir les notifications importantes par email</p>
                </div>
                <Button variant="outline" size="sm">
                  Activé
                </Button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Notifications push</h4>
                  <p className="text-sm text-muted-foreground">Notifications en temps réel dans le navigateur</p>
                </div>
                <Button variant="outline" size="sm">
                  Activé
                </Button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Fréquence digest</h4>
                  <p className="text-sm text-muted-foreground">Résumé des notifications par email</p>
                </div>
                <Button variant="outline" size="sm">
                  Quotidien
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}