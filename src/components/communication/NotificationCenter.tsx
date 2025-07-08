import React, { useState } from 'react';
import { Bell, Check, CheckCheck, Trash2, Archive, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { useNotifications } from '@/hooks/communication/useNotifications';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export function NotificationCenter() {
  const {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    deleteNotification
  } = useNotifications();

  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');

  const filteredNotifications = notifications.filter(notification => {
    switch (filter) {
      case 'unread':
        return !notification.is_read;
      case 'read':
        return notification.is_read;
      default:
        return true;
    }
  });

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'MESSAGE':
        return '💬';
      case 'EVENT':
        return '📅';
      case 'SYSTEM':
        return '⚙️';
      case 'REMINDER':
        return '⏰';
      default:
        return '📢';
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'MESSAGE':
        return 'bg-blue-100 dark:bg-blue-900';
      case 'EVENT':
        return 'bg-green-100 dark:bg-green-900';
      case 'SYSTEM':
        return 'bg-red-100 dark:bg-red-900';
      case 'REMINDER':
        return 'bg-yellow-100 dark:bg-yellow-900';
      default:
        return 'bg-gray-100 dark:bg-gray-800';
    }
  };

  const formatNotificationTime = (timestamp: string) => {
    const now = new Date();
    const notifDate = new Date(timestamp);
    const diffInHours = (now.getTime() - notifDate.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return format(notifDate, 'HH:mm', { locale: fr });
    } else if (diffInHours < 48) {
      return 'Hier';
    } else {
      return format(notifDate, 'dd/MM', { locale: fr });
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs">
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Notifications</h3>
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                <CheckCheck className="h-4 w-4 mr-2" />
                Tout lire
              </Button>
            )}
          </div>
        </div>

        <Tabs value={filter} onValueChange={(value) => setFilter(value as any)} className="w-full">
          <TabsList className="grid w-full grid-cols-3 m-2">
            <TabsTrigger value="all" className="text-xs">
              Tous ({notifications.length})
            </TabsTrigger>
            <TabsTrigger value="unread" className="text-xs">
              Non lus ({unreadCount})
            </TabsTrigger>
            <TabsTrigger value="read" className="text-xs">
              Lues ({notifications.length - unreadCount})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={filter} className="mt-0">
            <ScrollArea className="h-96">
              {loading ? (
                <div className="p-4 text-center">
                  <p className="text-sm text-muted-foreground">Chargement...</p>
                </div>
              ) : filteredNotifications.length === 0 ? (
                <div className="p-4 text-center">
                  <Bell className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    {filter === 'unread' ? 'Aucune notification non lue' : 'Aucune notification'}
                  </p>
                </div>
              ) : (
                <div className="space-y-1">
                  {filteredNotifications.map((notification) => (
                    <Card
                      key={notification.id}
                      className={`m-2 cursor-pointer transition-colors hover:bg-muted/50 ${
                        !notification.is_read ? 'border-l-4 border-l-primary' : ''
                      }`}
                      onClick={() => !notification.is_read && markAsRead(notification.id)}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-full text-sm ${getNotificationColor(notification.notification_type)}`}>
                            {getNotificationIcon(notification.notification_type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h4 className={`text-sm truncate ${!notification.is_read ? 'font-semibold' : 'font-medium'}`}>
                                {notification.title}
                              </h4>
                              <span className="text-xs text-muted-foreground">
                                {formatNotificationTime(notification.created_at)}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                              {notification.message}
                            </p>
                            <div className="flex items-center justify-between mt-2">
                              <Badge variant="outline" className="text-xs">
                                {notification.notification_type}
                              </Badge>
                              <div className="flex gap-1">
                                {!notification.is_read && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      markAsRead(notification.id);
                                    }}
                                  >
                                    <Check className="h-3 w-3" />
                                  </Button>
                                )}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteNotification(notification.id);
                                  }}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>

        {filteredNotifications.length > 0 && (
          <div className="p-3 border-t">
            <Button variant="ghost" size="sm" className="w-full text-xs">
              Voir toutes les notifications
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}