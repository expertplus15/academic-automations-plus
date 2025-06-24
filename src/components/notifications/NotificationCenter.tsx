
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Bell,
  Check,
  CheckCheck,
  X,
  AlertTriangle,
  Info,
  Calendar,
  Users,
  MapPin
} from 'lucide-react';
import { useRealTimeNotifications, Notification } from '@/hooks/useRealTimeNotifications';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

export function NotificationCenter() {
  const {
    notifications,
    unreadCount,
    isConnected,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAllNotifications
  } = useRealTimeNotifications();

  const [isOpen, setIsOpen] = useState(false);

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'exam_scheduled':
        return <Calendar className="w-4 h-4 text-blue-500" />;
      case 'exam_cancelled':
        return <X className="w-4 h-4 text-red-500" />;
      case 'conflict_detected':
        return <AlertTriangle className="w-4 h-4 text-orange-500" />;
      case 'supervisor_assigned':
        return <Users className="w-4 h-4 text-green-500" />;
      case 'room_changed':
        return <MapPin className="w-4 h-4 text-purple-500" />;
      default:
        return <Info className="w-4 h-4 text-gray-500" />;
    }
  };

  const getPriorityBadge = (priority: Notification['priority']) => {
    const configs = {
      urgent: { label: 'Urgent', className: 'bg-red-100 text-red-800' },
      high: { label: 'Important', className: 'bg-orange-100 text-orange-800' },
      medium: { label: 'Moyen', className: 'bg-blue-100 text-blue-800' },
      low: { label: 'Info', className: 'bg-gray-100 text-gray-800' }
    };

    const config = configs[priority];
    return <Badge className={`text-xs ${config.className}`}>{config.label}</Badge>;
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    // Add navigation logic here based on notification type
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="relative">
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <Badge 
              className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs bg-red-500 text-white"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-80 p-0">
        <Card className="border-0 shadow-none">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">
                Notifications
                {!isConnected && (
                  <Badge variant="outline" className="ml-2 text-xs">
                    Hors ligne
                  </Badge>
                )}
              </CardTitle>
              {notifications.length > 0 && (
                <div className="flex gap-1">
                  {unreadCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={markAllAsRead}
                      className="h-6 px-2 text-xs"
                    >
                      <CheckCheck className="w-3 h-3 mr-1" />
                      Tout lire
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAllNotifications}
                    className="h-6 px-2 text-xs"
                  >
                    <X className="w-3 h-3 mr-1" />
                    Effacer
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          
          <CardContent className="p-0">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-sm text-muted-foreground">
                Aucune notification
              </div>
            ) : (
              <ScrollArea className="h-96">
                <div className="space-y-1">
                  {notifications.map((notification, index) => (
                    <div key={notification.id}>
                      <div
                        className={`p-3 hover:bg-muted/50 cursor-pointer transition-colors ${
                          !notification.read ? 'bg-blue-50/50 border-l-2 border-l-blue-500' : ''
                        }`}
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5">
                            {getNotificationIcon(notification.type)}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <p className="text-sm font-medium truncate">
                                {notification.title}
                              </p>
                              {getPriorityBadge(notification.priority)}
                            </div>
                            
                            <p className="text-xs text-muted-foreground mb-2">
                              {notification.message}
                            </p>
                            
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-muted-foreground">
                                {formatDistanceToNow(notification.timestamp, {
                                  addSuffix: true,
                                  locale: fr
                                })}
                              </span>
                              
                              <div className="flex gap-1">
                                {!notification.read && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      markAsRead(notification.id);
                                    }}
                                    className="h-6 w-6 p-0"
                                  >
                                    <Check className="w-3 h-3" />
                                  </Button>
                                )}
                                
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeNotification(notification.id);
                                  }}
                                  className="h-6 w-6 p-0"
                                >
                                  <X className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {index < notifications.length - 1 && <Separator />}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
