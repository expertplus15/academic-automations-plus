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
      color: "text-[#4F78FF]",
      bgColor: "bg-[#4F78FF]/10"
    },
    {
      title: "Notifications actives",
      value: stats?.activeNotifications || 0,
      icon: Bell,
      color: "text-[#10B981]",
      bgColor: "bg-[#10B981]/10"
    },
    {
      title: "Contacts disponibles",
      value: stats?.availableContacts || 0,
      icon: Users,
      color: "text-[#8B5CF6]",
      bgColor: "bg-[#8B5CF6]/10"
    },
    {
      title: "Annonces publiées",
      value: stats?.publishedAnnouncements || 0,
      icon: Megaphone,
      color: "text-[#F59E0B]",
      bgColor: "bg-[#F59E0B]/10"
    }
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-16 bg-muted rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <Card key={index} className="hover:shadow-lg transition-all duration-200 border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-2">{card.title}</p>
                <p className="text-2xl font-bold text-foreground">{card.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-xl ${card.bgColor} flex items-center justify-center`}>
                <card.icon className={`w-6 h-6 ${card.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}