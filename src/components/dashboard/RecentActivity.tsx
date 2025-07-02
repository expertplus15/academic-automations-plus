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
      case 'success': return 'bg-green-500/20 text-green-100 border-green-400/30';
      case 'warning': return 'bg-orange-500/20 text-orange-100 border-orange-400/30';
      case 'info': return 'bg-blue-500/20 text-blue-100 border-blue-400/30';
      default: return 'bg-gray-500/20 text-gray-100 border-gray-400/30';
    }
  };

  return (
    <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-white text-xl flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Activité Récente
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-start gap-4 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
            <div className={`p-2 rounded-lg ${getTypeColor(activity.type)}`}>
              <activity.icon className="w-4 h-4" />
            </div>
            
            <div className="flex-1 min-w-0">
              <h4 className="text-white font-medium">{activity.title}</h4>
              <p className="text-blue-100 text-sm">{activity.description}</p>
            </div>
            
            <Badge 
              variant="outline" 
              className="bg-white/10 border-white/20 text-blue-200 text-xs"
            >
              {activity.time}
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}