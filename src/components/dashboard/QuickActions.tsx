import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  GraduationCap, 
  Calendar, 
  Users, 
  FileText,
  ArrowRight
} from 'lucide-react';

export function QuickActions() {
  const quickActions = [
    {
      title: "Gestion des Notes",
      description: "Saisir et consulter les notes",
      icon: GraduationCap,
      stats: "234 notes à saisir",
      color: "bg-blue-500",
      href: "/academic/grades"
    },
    {
      title: "Planning des Cours",
      description: "Emplois du temps et horaires",
      icon: Calendar,
      stats: "5 conflits détectés",
      color: "bg-purple-500",
      href: "/academic/timetables"
    },
    {
      title: "Gestion des Étudiants",
      description: "Inscriptions et profils",
      icon: Users,
      stats: "12 nouvelles demandes",
      color: "bg-green-500",
      href: "/students"
    },
    {
      title: "Bulletins de Notes",
      description: "Génération des bulletins",
      icon: FileText,
      stats: "45 bulletins prêts",
      color: "bg-orange-500",
      href: "/results/transcripts"
    }
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-white">Actions Académiques Rapides</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickActions.map((action, index) => (
          <Card 
            key={index} 
            className="bg-white/10 border-white/20 backdrop-blur-sm hover:bg-white/15 transition-all duration-200 cursor-pointer group"
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg ${action.color}`}>
                  <action.icon className="w-6 h-6 text-white" />
                </div>
                <ArrowRight className="w-5 h-5 text-white/50 group-hover:text-white transition-colors" />
              </div>
              
              <h3 className="text-white font-semibold mb-2">{action.title}</h3>
              <p className="text-blue-100 text-sm mb-3">{action.description}</p>
              <p className="text-blue-200 text-xs">{action.stats}</p>
              
              <Button 
                variant="secondary" 
                size="sm" 
                className="w-full mt-4 bg-white/20 border-white/30 text-white hover:bg-white/30"
              >
                Accéder
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}