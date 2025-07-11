import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { useAcademicStats } from '@/hooks/academic/useAcademicStats';
import { 
  GraduationCap, 
  School, 
  BarChart3, 
  Users, 
  BookOpen, 
  Building, 
  Calendar,
  MapPin
} from 'lucide-react';

export function AcademicModuleCards() {
  const navigate = useNavigate();
  const { stats, loading } = useAcademicStats();

  const moduleCards = [
    {
      title: 'Programmes',
      subtitle: loading ? 'Chargement...' : `${stats.programs} programmes`,
      icon: GraduationCap,
      color: 'bg-violet-500',
      route: '/academic/programs',
      badge: null
    },
    {
      title: 'Filières',
      subtitle: loading ? 'Chargement...' : `${stats.specializations} filières`,
      icon: School,
      color: 'bg-teal-500',
      route: '/academic/pathways',
      badge: null
    },
    {
      title: 'Niveaux d\'Études',
      subtitle: loading ? 'Chargement...' : `${stats.levels} niveaux`,
      icon: BarChart3,
      color: 'bg-orange-500',
      route: '/academic/levels',
      badge: null
    },
    {
      title: 'Classes',
      subtitle: loading ? 'Chargement...' : `${stats.classes} classes`,
      icon: Users,
      color: 'bg-academic',
      route: '/academic/groups',
      badge: 'Nouveau'
    },
    {
      title: 'Cours',
      subtitle: loading ? 'Chargement...' : `${stats.subjects} matières`,
      icon: BookOpen,
      color: 'bg-teal-500',
      route: '/academic/subjects',
      badge: null
    },
    {
      title: 'Infrastructures',
      subtitle: 'Salles & équipements',
      icon: Building,
      color: 'bg-orange-500',
      route: '/academic/infrastructure',
      badge: null
    },
    {
      title: 'Emploi du Temps',
      subtitle: 'Planning intelligent',
      icon: Calendar,
      color: 'bg-academic',
      route: '/academic/timetables',
      badge: 'Actif'
    },
    {
      title: 'Départements',
      subtitle: loading ? 'Chargement...' : `${stats.departments} départements`,
      icon: MapPin,
      color: 'bg-violet-500',
      route: '/academic/departments',
      badge: null
    }
  ];

  return (
    <div className="grid grid-cols-4 gap-6 mx-6 mt-6 mb-8">
      {moduleCards.map((card, index) => {
        const Icon = card.icon;
        return (
          <Card 
            key={index} 
            className="cursor-pointer hover:shadow-lg transition-all duration-200 border-border/40 hover:border-border"
            onClick={() => navigate(card.route)}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl ${card.color}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                {card.badge && (
                  <Badge variant="secondary" className="text-xs">
                    {card.badge}
                  </Badge>
                )}
              </div>
              
              <div>
                <h3 className="font-semibold text-foreground mb-1">
                  {card.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {card.subtitle}
                </p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}