import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Bell, 
  BellOff, 
  Check, 
  CheckCheck, 
  Filter,
  Trash2,
  Settings,
  AlertCircle,
  Info,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { 
  useNotifications, 
  useMarkNotificationAsRead, 
  useMarkAllNotificationsAsRead,
  Notification 
} from '@/hooks/useCommunication';
import { cn } from '@/lib/utils';

const notificationIcons = {
  info: Info,
  success: CheckCircle,
  warning: AlertCircle,
  error: XCircle,
};

const notificationColors = {
  info: 'text-blue-500',
  success: 'text-green-500',
  warning: 'text-yellow-500',
  error: 'text-red-500',
};

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
}

function NotificationItem({ notification, onMarkAsRead }: NotificationItemProps) {
  const Icon = notificationIcons[notification.notification_type as keyof typeof notificationIcons] || Bell;
  const iconColor = notificationColors[notification.notification_type as keyof typeof notificationColors] || 'text-muted-foreground';

  return (
    <div
      className={cn(
        "p-4 border-l-4 hover:bg-muted/50 transition-colors cursor-pointer",
        notification.is_read 
          ? "border-l-muted bg-background" 
          : "border-l-primary bg-muted/30"
      )}
      onClick={() => !notification.is_read && onMarkAsRead(notification.id)}
    >
      <div className="flex items-start gap-3">
        <div className={cn("p-2 rounded-full bg-background", iconColor)}>
          <Icon className="w-4 h-4" />
        </div>
        
        <div className="flex-1 space-y-1">
          <div className="flex items-start justify-between gap-2">
            <h4 className={cn(
              "text-sm font-medium",
              !notification.is_read && "font-semibold"
            )}>
              {notification.title}
            </h4>
            <div className="flex items-center gap-2">
              {!notification.is_read && (
                <div className="w-2 h-2 bg-primary rounded-full" />
              )}
              <span className="text-xs text-muted-foreground">
                {format(new Date(notification.created_at), 'dd MMM HH:mm', { locale: fr })}
              </span>
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground">
            {notification.message}
          </p>
          
          <div className="flex items-center gap-2 pt-1">
            <Badge variant="outline" className="text-xs">
              {notification.notification_type}
            </Badge>
            {notification.expires_at && (
              <Badge variant="secondary" className="text-xs">
                Expire le {format(new Date(notification.expires_at), 'dd/MM', { locale: fr })}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function NotificationCenter() {
  const [activeTab, setActiveTab] = useState('all');
  const { notifications, isLoading } = useNotifications();
  const markAsRead = useMarkNotificationAsRead();
  const markAllAsRead = useMarkAllNotificationsAsRead();

  const unreadCount = notifications?.filter(n => !n.is_read).length || 0;
  const todayNotifications = notifications?.filter(n => {
    const notificationDate = new Date(n.created_at);
    const today = new Date();
    return notificationDate.toDateString() === today.toDateString();
  }) || [];

  const filteredNotifications = notifications?.filter(notification => {
    switch (activeTab) {
      case 'unread':
        return !notification.is_read;
      case 'today':
        return todayNotifications.includes(notification);
      default:
        return true;
    }
  }) || [];

  const handleMarkAsRead = (id: string) => {
    markAsRead.mutate(id);
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead.mutate();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notifications
            {unreadCount > 0 && (
              <Badge variant="destructive" className="text-xs">
                {unreadCount}
              </Badge>
            )}
          </CardTitle>
          
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleMarkAllAsRead}
                className="text-xs"
              >
                <CheckCheck className="w-4 h-4 mr-1" />
                Tout marquer comme lu
              </Button>
            )}
            <Button variant="ghost" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="px-6 pb-3">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">
                Toutes ({notifications?.length || 0})
              </TabsTrigger>
              <TabsTrigger value="unread">
                Non lues ({unreadCount})
              </TabsTrigger>
              <TabsTrigger value="today">
                Aujourd'hui ({todayNotifications.length})
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value={activeTab} className="mt-0">
            <div className="max-h-[500px] overflow-y-auto">
              {filteredNotifications.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  <BellOff className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-sm">
                    {activeTab === 'unread' 
                      ? 'Aucune notification non lue'
                      : activeTab === 'today'
                      ? 'Aucune notification aujourd\'hui'
                      : 'Aucune notification'
                    }
                  </p>
                </div>
              ) : (
                <div className="divide-y">
                  {filteredNotifications.map(notification => (
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                      onMarkAsRead={handleMarkAsRead}
                    />
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}