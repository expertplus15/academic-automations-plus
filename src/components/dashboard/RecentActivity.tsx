import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  UserPlus, 
  Edit, 
  DollarSign, 
  Megaphone,
  Clock
} from 'lucide-react';

export function RecentActivity() {
  const activities = [
    {
      icon: UserPlus,
      title: "Nouvel étudiant inscrit",
      description: "Marie Dubois - L1 Informatique",
      time: "Il y a 15 min",
      type: "success"
    },
    {
      icon: Edit,
      title: "Notes saisies",
      description: "Mathématiques I - 25 notes ajoutées",
      time: "Il y a 32 min",
      type: "info"
    },
    {
      icon: DollarSign,
      title: "Nouvelle facture",
      description: "Frais de scolarité - €2,500",
      time: "Il y a 1h",
      type: "warning"
    },
    {
      icon: Megaphone,
      title: "Annonce publiée",
      description: "Calendrier des examens finaux",
      time: "Il y a 2h",
      type: "info"
    }
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'success': return 'bg-[#10B981]';
      case 'warning': return 'bg-[#F59E0B]';
      case 'info': return 'bg-[#4F78FF]';
      default: return 'bg-[#64748B]';
    }
  };

  return (
    <Card className="bg-white rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] border-0">
      <CardHeader className="pb-4">
        <CardTitle className="text-foreground text-xl font-semibold flex items-center gap-2">
          <Clock className="w-5 h-5 text-[#4F78FF]" />
          Activité Récente
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {activities.map((activity, index) => (
            <div key={index} className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
              <div className={`p-2.5 rounded-xl shadow-sm ${getTypeColor(activity.type)}`}>
                <activity.icon className="w-4 h-4 text-white" />
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className="text-foreground font-semibold text-sm">{activity.title}</h4>
                <p className="text-[#64748B] text-xs truncate">{activity.description}</p>
                <p className="text-[#64748B] text-xs mt-1">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}