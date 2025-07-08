import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, CheckCircle, AlertTriangle, Clock, Settings, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Notification {
  id: string;
  type: 'maintenance' | 'procurement' | 'booking' | 'system';
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  isRead: boolean;
  createdAt: string;
  actionUrl?: string;
  data?: any;
}

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const { toast } = useToast();

  // Mock notifications - replace with real data source
  useEffect(() => {
    const mockNotifications: Notification[] = [
      {
        id: '1',
        type: 'maintenance',
        title: 'Maintenance planifiée',
        message: 'Maintenance préventive du projecteur Salle A1 prévue demain à 14h00',
        priority: 'medium',
        isRead: false,
        createdAt: new Date().toISOString(),
        actionUrl: '/ressources/maintenance'
      },
      {
        id: '2',
        type: 'procurement',
        title: 'Demande d\'approbation',
        message: 'Nouvelle demande d\'achat en attente d\'approbation (2,500€)',
        priority: 'high',
        isRead: false,
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        actionUrl: '/ressources/achats'
      },
      {
        id: '3',
        type: 'booking',
        title: 'Conflit de réservation',
        message: 'Conflit détecté pour la Salle B2 le 25 janvier à 10h00',
        priority: 'urgent',
        isRead: true,
        createdAt: new Date(Date.now() - 7200000).toISOString(),
        actionUrl: '/ressources/reservations'
      },
      {
        id: '4',
        type: 'system',
        title: 'Sauvegarde terminée',
        message: 'Sauvegarde automatique du système terminée avec succès',
        priority: 'low',
        isRead: true,
        createdAt: new Date(Date.now() - 86400000).toISOString()
      }
    ];

    setNotifications(mockNotifications);
  }, []);

  // Real-time notifications using WebSocket (mock implementation)
  useEffect(() => {
    const simulateRealTime = () => {
      const newNotification: Notification = {
        id: Date.now().toString(),
        type: 'maintenance',
        title: 'Maintenance terminée',
        message: 'Maintenance corrective de l\'ordinateur Lab Info terminée',
        priority: 'medium',
        isRead: false,
        createdAt: new Date().toISOString(),
        actionUrl: '/ressources/maintenance'
      };

      setNotifications(prev => [newNotification, ...prev]);
      
      // Show toast for high priority notifications
      if (newNotification.priority === 'high' || newNotification.priority === 'urgent') {
        toast({
          title: newNotification.title,
          description: newNotification.message,
          duration: 5000,
        });
      }
    };

    // Simulate random notifications
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        simulateRealTime();
      }
    }, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, [toast]);

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, isRead: true }))
    );
  };

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'maintenance': return <Settings className="w-4 h-4" />;
      case 'procurement': return <CheckCircle className="w-4 h-4" />;
      case 'booking': return <Clock className="w-4 h-4" />;
      case 'system': return <Bell className="w-4 h-4" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'low': return 'text-gray-600 bg-gray-50 border-gray-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const filteredNotifications = notifications.filter(notif => 
    filter === 'all' || (filter === 'unread' && !notif.isRead)
  );

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notifications
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unreadCount}
              </Badge>
            )}
          </CardTitle>
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
              Non lues
            </Button>
            {unreadCount > 0 && (
              <Button variant="outline" size="sm" onClick={markAllAsRead}>
                Tout marquer lu
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Aucune notification {filter === 'unread' ? 'non lue' : ''}</p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 rounded-lg border transition-colors cursor-pointer ${
                  notification.isRead 
                    ? 'bg-gray-50 border-gray-200' 
                    : 'bg-white border-blue-200 shadow-sm'
                }`}
                onClick={() => !notification.isRead && markAsRead(notification.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className={`p-2 rounded-full ${getPriorityColor(notification.priority)}`}>
                      {getTypeIcon(notification.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className={`font-medium text-sm ${!notification.isRead ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {notification.title}
                        </h4>
                        {!notification.isRead && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(notification.createdAt), 'dd MMM yyyy à HH:mm', { locale: fr })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Badge className={getPriorityColor(notification.priority)}>
                      {notification.priority === 'urgent' && 'Urgent'}
                      {notification.priority === 'high' && 'Élevée'}
                      {notification.priority === 'medium' && 'Moyenne'}
                      {notification.priority === 'low' && 'Faible'}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        dismissNotification(notification.id);
                      }}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                {notification.actionUrl && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <Button variant="outline" size="sm" onClick={() => window.location.href = notification.actionUrl!}>
                      Voir détails
                    </Button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}