import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Bell, 
  MessageCircle, 
  Award, 
  BookOpen, 
  Calendar,
  Settings as SettingsIcon,
  Check,
  ExternalLink
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'forum_reply' | 'badge_earned' | 'course_update' | 'assignment_due' | 'system';
  is_read: boolean;
  created_at: string;
}

export function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Nouveau message forum',
      message: 'Réponse dans "JavaScript Avancé"',
      type: 'forum_reply',
      is_read: false,
      created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    },
    {
      id: '2',
      title: 'Badge débloqué !',
      message: 'Expert JavaScript obtenu',
      type: 'badge_earned',
      is_read: false,
      created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '3',
      title: 'Nouveau contenu',
      message: 'Chapitre 5 - React Hooks disponible',
      type: 'course_update',
      is_read: true,
      created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    }
  ]);

  const [isOpen, setIsOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'forum_reply':
        return <MessageCircle className="w-3 h-3 text-blue-500" />;
      case 'badge_earned':
        return <Award className="w-3 h-3 text-yellow-500" />;
      case 'course_update':
        return <BookOpen className="w-3 h-3 text-green-500" />;
      case 'assignment_due':
        return <Calendar className="w-3 h-3 text-orange-500" />;
      default:
        return <SettingsIcon className="w-3 h-3 text-gray-500" />;
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, is_read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
  };

  // Simuler nouvelles notifications
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.98) { // 2% chance
        const newNotification: Notification = {
          id: Date.now().toString(),
          title: 'Nouvelle activité',
          message: 'Quelque chose d\'intéressant !',
          type: 'system',
          is_read: false,
          created_at: new Date().toISOString(),
        };
        setNotifications(prev => [newNotification, ...prev].slice(0, 10)); // Limite à 10
      }
    }, 10000); // Check toutes les 10 secondes

    return () => clearInterval(interval);
  }, []);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs bg-red-500 hover:bg-red-500">
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Notifications</h3>
            {unreadCount > 0 && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={markAllAsRead}
                className="text-xs"
              >
                <Check className="w-3 h-3 mr-1" />
                Tout lire
              </Button>
            )}
          </div>
          {unreadCount > 0 && (
            <p className="text-xs text-muted-foreground mt-1">
              {unreadCount} nouvelle{unreadCount > 1 ? 's' : ''}
            </p>
          )}
        </div>
        
        <ScrollArea className="h-80">
          <div className="p-2">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 rounded-lg mb-2 cursor-pointer transition-colors hover:bg-accent ${
                    !notification.is_read ? 'bg-blue-50 dark:bg-blue-950/20' : ''
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <p className={`text-sm font-medium ${!notification.is_read ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {notification.title}
                        </p>
                        {!notification.is_read && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full ml-2 mt-1 flex-shrink-0"></div>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDistanceToNow(new Date(notification.created_at), { 
                          addSuffix: true, 
                          locale: fr 
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center">
                <Bell className="w-8 h-8 mx-auto mb-2 text-muted-foreground opacity-50" />
                <p className="text-sm text-muted-foreground">
                  Aucune notification
                </p>
              </div>
            )}
          </div>
        </ScrollArea>
        
        {notifications.length > 0 && (
          <div className="p-3 border-t">
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full justify-center text-xs"
              onClick={() => {
                setIsOpen(false);
                // Navigation vers le centre de notifications
                window.location.href = '/elearning/notifications';
              }}
            >
              Voir toutes les notifications
              <ExternalLink className="w-3 h-3 ml-1" />
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}