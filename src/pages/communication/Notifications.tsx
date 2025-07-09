import { CommunicationModuleLayout } from "@/components/layouts/CommunicationModuleLayout";
import { CommunicationPageHeader } from "@/components/CommunicationPageHeader";
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Bell, 
  Search, 
  Filter,
  CheckCheck,
  Trash2,
  Clock,
  AlertCircle,
  Info,
  MessageSquare,
  Archive,
  MoreVertical
} from "lucide-react";
import { useNotifications } from '@/hooks/communication/useNotifications';
import { useState } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';

export default function CommunicationNotifications() {
  const { 
    notifications, 
    unreadCount, 
    loading, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification 
  } = useNotifications();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);
  const [bulkMode, setBulkMode] = useState(false);

  // Filter notifications
  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filter === 'unread') {
      return matchesSearch && !notification.is_read;
    }
    if (filter === 'read') {
      return matchesSearch && notification.is_read;
    }
    return matchesSearch;
  });

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'MESSAGE':
        return <MessageSquare className="w-4 h-4" />;
      case 'SYSTEM':
        return <AlertCircle className="w-4 h-4" />;
      case 'REMINDER':
        return <Clock className="w-4 h-4" />;
      default:
        return <Info className="w-4 h-4" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'MESSAGE':
        return 'text-blue-500';
      case 'SYSTEM':
        return 'text-red-500';
      case 'REMINDER':
        return 'text-orange-500';
      default:
        return 'text-gray-500';
    }
  };

  const formatNotificationTime = (timestamp: string) => {
    const now = new Date();
    const notifDate = new Date(timestamp);
    const diffInHours = Math.abs(now.getTime() - notifDate.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return format(notifDate, 'HH:mm', { locale: fr });
    } else if (diffInHours < 48) {
      return 'Hier ' + format(notifDate, 'HH:mm', { locale: fr });
    } else {
      return format(notifDate, 'dd/MM/yyyy', { locale: fr });
    }
  };

  return (
    <ProtectedRoute allowedRoles={['admin', 'hr', 'teacher', 'student']}>
      <CommunicationModuleLayout>
        <CommunicationPageHeader 
          title="Centre de Notifications" 
          subtitle="Gérez vos notifications en temps réel" 
        />
        
        <div className="space-y-6">
          {/* Header avec actions */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-500/10 rounded-lg flex items-center justify-center">
                    <Bell className="w-5 h-5 text-orange-500" />
                  </div>
                  <div>
                    <CardTitle>Notifications</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {unreadCount} notification{unreadCount !== 1 ? 's' : ''} non lue{unreadCount !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                
                {unreadCount > 0 && (
                  <Button onClick={markAllAsRead} variant="outline">
                    <CheckCheck className="w-4 h-4 mr-2" />
                    Tout marquer comme lu
                  </Button>
                )}
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-3">
                <div className="flex gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Rechercher dans les notifications..." 
                      className="pl-9"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant={filter === 'all' ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => setFilter('all')}
                    >
                      Toutes
                    </Button>
                    <Button 
                      variant={filter === 'unread' ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => setFilter('unread')}
                    >
                      Non lues ({unreadCount})
                    </Button>
                    <Button 
                      variant={filter === 'read' ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => setFilter('read')}
                    >
                      Lues
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setBulkMode(!bulkMode)}
                    >
                      {bulkMode ? 'Annuler' : 'Sélection'}
                    </Button>
                  </div>
                </div>

                {/* Bulk Actions */}
                {bulkMode && (
                  <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg">
                    <Checkbox 
                      checked={selectedNotifications.length === filteredNotifications.length}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedNotifications(filteredNotifications.map(n => n.id));
                        } else {
                          setSelectedNotifications([]);
                        }
                      }}
                    />
                    <span className="text-sm font-medium">
                      {selectedNotifications.length} sélectionnée(s)
                    </span>
                    {selectedNotifications.length > 0 && (
                      <div className="flex gap-2 ml-auto">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            selectedNotifications.forEach(id => markAsRead(id));
                            setSelectedNotifications([]);
                          }}
                        >
                          <CheckCheck className="w-4 h-4 mr-1" />
                          Marquer comme lues
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            selectedNotifications.forEach(id => deleteNotification(id));
                            setSelectedNotifications([]);
                          }}
                        >
                          <Archive className="w-4 h-4 mr-1" />
                          Archiver
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => {
                            selectedNotifications.forEach(id => deleteNotification(id));
                            setSelectedNotifications([]);
                          }}
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Supprimer
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Liste des notifications */}
          <Card>
            <CardContent className="p-0">
              <ScrollArea className="h-[600px]">
                {loading ? (
                  <div className="p-8 text-center">
                    <p className="text-muted-foreground">Chargement des notifications...</p>
                  </div>
                ) : filteredNotifications.length === 0 ? (
                  <div className="p-8 text-center">
                    <Bell className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">
                      {searchQuery ? 'Aucune notification trouvée' : 'Aucune notification'}
                    </p>
                  </div>
                ) : (
                  <div className="divide-y">
                    {filteredNotifications.map((notification) => (
                      <div 
                        key={notification.id}
                        className={cn(
                          "p-4 hover:bg-muted/50 cursor-pointer group transition-colors",
                          !notification.is_read && "bg-blue-50/50 border-l-2 border-l-blue-500"
                        )}
                        onClick={() => !notification.is_read && markAsRead(notification.id)}
                      >
                         <div className="flex items-start gap-3">
                           {bulkMode && (
                             <Checkbox 
                               checked={selectedNotifications.includes(notification.id)}
                               onCheckedChange={(checked) => {
                                 if (checked) {
                                   setSelectedNotifications(prev => [...prev, notification.id]);
                                 } else {
                                   setSelectedNotifications(prev => prev.filter(id => id !== notification.id));
                                 }
                               }}
                               onClick={(e) => e.stopPropagation()}
                             />
                           )}
                           
                           <div className={cn(
                             "w-8 h-8 rounded-full flex items-center justify-center bg-muted",
                             getNotificationColor(notification.notification_type)
                           )}>
                             {getNotificationIcon(notification.notification_type)}
                           </div>
                           
                           <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className={cn(
                                    "text-sm font-medium",
                                    !notification.is_read && "font-semibold"
                                  )}>
                                    {notification.title}
                                  </h4>
                                  {!notification.is_read && (
                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                  {notification.message}
                                </p>
                                <div className="flex items-center gap-2 mt-2">
                                  <Badge variant="secondary" className="text-xs">
                                    {notification.notification_type}
                                  </Badge>
                                  <span className="text-xs text-muted-foreground">
                                    {formatNotificationTime(notification.created_at)}
                                  </span>
                                </div>
                              </div>
                              
                              <Button
                                variant="ghost"
                                size="sm"
                                className="opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteNotification(notification.id);
                                }}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </CommunicationModuleLayout>
    </ProtectedRoute>
  );
}