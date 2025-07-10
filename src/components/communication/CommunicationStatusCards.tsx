import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { MessageSquare, Bell, Users, Megaphone } from 'lucide-react';
import { useCommunicationStats } from '@/hooks/communication/useCommunicationStats';

export function CommunicationStatusCards() {
  const { stats, isLoading } = useCommunicationStats();

  const cards = [
    {
      title: "Messages non lus",
      value: stats?.unreadMessages || 0,
      icon: MessageSquare,
      gradient: "from-communication/20 via-communication/10 to-communication/5",
      iconBg: "bg-communication/15",
      iconColor: "text-communication",
      trend: "+12%",
      trendPositive: true
    },
    {
      title: "Notifications actives",
      value: stats?.activeNotifications || 0,
      icon: Bell,
      gradient: "from-emerald-500/20 via-emerald-500/10 to-emerald-500/5",
      iconBg: "bg-emerald-500/15",
      iconColor: "text-emerald-600",
      trend: "+8%",
      trendPositive: true
    },
    {
      title: "Contacts disponibles",
      value: stats?.availableContacts || 0,
      icon: Users,
      gradient: "from-purple-500/20 via-purple-500/10 to-purple-500/5",
      iconBg: "bg-purple-500/15",
      iconColor: "text-purple-600",
      trend: "+3%",
      trendPositive: true
    },
    {
      title: "Annonces publiées",
      value: stats?.publishedAnnouncements || 0,
      icon: Megaphone,
      gradient: "from-orange-500/20 via-orange-500/10 to-orange-500/5",
      iconBg: "bg-orange-500/15",
      iconColor: "text-orange-600",
      trend: "-2%",
      trendPositive: false
    }
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="border-0 shadow-lg overflow-hidden">
            <CardContent className="p-6">
              <div className="animate-pulse space-y-3">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded w-24"></div>
                    <div className="h-8 bg-muted rounded w-16"></div>
                  </div>
                  <div className="w-12 h-12 bg-muted rounded-xl"></div>
                </div>
                <div className="h-3 bg-muted rounded w-12"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Statistiques en temps réel</h2>
        <div className="text-sm text-muted-foreground">Dernière mise à jour: il y a 2 min</div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, index) => (
          <Card key={index} className="group hover:shadow-xl hover:scale-[1.02] transition-all duration-300 border-0 shadow-lg cursor-pointer overflow-hidden relative">
            <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
            <CardContent className="p-6 relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">{card.title}</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-3xl font-bold text-foreground tabular-nums">{card.value.toLocaleString()}</p>
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      card.trendPositive 
                        ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10' 
                        : 'text-red-600 bg-red-50 dark:bg-red-500/10'
                    }`}>
                      {card.trend}
                    </span>
                  </div>
                </div>
                <div className={`w-14 h-14 rounded-xl ${card.iconBg} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <card.icon className={`w-7 h-7 ${card.iconColor}`} />
                </div>
              </div>
              
              {/* Mini sparkline effect */}
              <div className="flex items-center gap-1 h-1">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div 
                    key={i} 
                    className={`h-full rounded-full ${card.iconColor.replace('text-', 'bg-')} opacity-30`}
                    style={{ 
                      width: '6px',
                      height: `${Math.random() * 4 + 2}px`,
                      animationDelay: `${i * 100}ms`
                    }}
                  ></div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}