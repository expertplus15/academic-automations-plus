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
      color: "bg-academic",
      href: "/academic/grades"
    },
    {
      title: "Planning des Cours",
      description: "Emplois du temps et horaires",
      icon: Calendar,
      stats: "5 conflits détectés",
      color: "bg-exams",
      href: "/academic/timetables"
    },
    {
      title: "Gestion des Étudiants",
      description: "Inscriptions et profils",
      icon: Users,
      stats: "12 nouvelles demandes",
      color: "bg-students",
      href: "/students"
    },
    {
      title: "Bulletins de Notes",
      description: "Génération des bulletins",
      icon: FileText,
      stats: "45 bulletins prêts",
      color: "bg-finance",
      href: "/results/transcripts"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-foreground">Actions Académiques Rapides</h2>
        <Button 
          variant="ghost" 
          className="text-muted-foreground hover:text-foreground hover:bg-white/20 rounded-xl"
        >
          Module Principal →
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickActions.map((action, index) => (
          <Card 
            key={index} 
            className="bg-white rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] border-0 hover:shadow-[0_4px_16px_rgba(0,0,0,0.12)] transition-all duration-200 cursor-pointer group"
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl ${action.color} shadow-sm`}>
                  <action.icon className="w-6 h-6 text-white" />
                </div>
                <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-academic transition-colors" />
              </div>
              
              <h3 className="text-foreground font-semibold mb-2">{action.title}</h3>
              <p className="text-muted-foreground text-sm mb-3">{action.description}</p>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-students"></div>
                <p className="text-muted-foreground text-xs">{action.stats}</p>
              </div>
              
              <Button 
                className="w-full bg-foreground hover:bg-foreground/90 text-background rounded-xl font-semibold py-2.5 transition-all duration-200"
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