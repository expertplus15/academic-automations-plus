import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bell, Info, AlertTriangle, CheckCircle } from 'lucide-react';

export function NotificationsList() {
  const notifications = [
    {
      id: 1,
      type: 'info',
      title: 'Nouvelle fonctionnalité disponible',
      message: 'Le module de messagerie instantanée est maintenant actif.',
      time: 'Il y a 2 heures',
      isRead: false
    },
    {
      id: 2,
      type: 'warning',
      title: 'Maintenance programmée',
      message: 'Une maintenance est prévue dimanche de 2h à 4h du matin.',
      time: 'Il y a 1 jour',
      isRead: true
    },
    {
      id: 3,
      type: 'success',
      title: 'Sauvegarde terminée',
      message: 'La sauvegarde automatique s\'est déroulée avec succès.',
      time: 'Il y a 2 jours',
      isRead: true
    }
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case 'info': return Info;
      case 'warning': return AlertTriangle;
      case 'success': return CheckCircle;
      default: return Bell;
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case 'info': return 'text-[#4F78FF]';
      case 'warning': return 'text-[#F59E0B]';
      case 'success': return 'text-[#10B981]';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="space-y-4">
      {notifications.map((notification) => {
        const IconComponent = getIcon(notification.type);
        const iconColor = getColor(notification.type);
        
        return (
          <Card key={notification.id} className={`hover:shadow-md transition-all ${!notification.isRead ? 'border-l-4 border-l-[#4F78FF]' : ''}`}>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-full bg-muted flex items-center justify-center mt-1`}>
                  <IconComponent className={`w-4 h-4 ${iconColor}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-foreground">{notification.title}</h4>
                    {!notification.isRead && (
                      <Badge variant="secondary" className="text-xs">Nouveau</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>
                  <p className="text-xs text-muted-foreground">{notification.time}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}