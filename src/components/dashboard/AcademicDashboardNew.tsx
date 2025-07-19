import React from 'react';
import { ModuleDashboard, DashboardWidget } from './ModuleDashboard';
import { usePrograms } from '@/hooks/usePrograms';
import { useSubjects } from '@/hooks/useSubjects';
import { useDepartments } from '@/hooks/academic/useAcademicData';
import { useNavigate } from 'react-router-dom';
import { 
  GraduationCap, 
  BookOpen, 
  Building, 
  Users, 
  Calendar,
  Plus,
  AlertTriangle,
  TrendingUp,
  Settings,
  BarChart3
} from 'lucide-react';

export function AcademicDashboardNew() {
  const navigate = useNavigate();
  const { programs, loading: programsLoading } = usePrograms();
  const { subjects, loading: subjectsLoading } = useSubjects();
  const { data: departments } = useDepartments();

  const loading = programsLoading || subjectsLoading;

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-academic"></div>
      </div>
    );
  }

  const widgets: DashboardWidget[] = [
    // Stats widgets
    {
      id: 'programs',
      type: 'stat',
      title: 'Programmes Actifs',
      value: programs?.length || 0,
      icon: GraduationCap,
      change: '+2 ce mois',
      changeType: 'positive',
      description: 'Programmes disponibles',
      priority: 1
    },
    {
      id: 'subjects',
      type: 'stat',
      title: 'Matières Disponibles',
      value: subjects?.length || 0,
      icon: BookOpen,
      change: '+15 ce semestre',
      changeType: 'positive',
      description: 'Cours configurés',
      priority: 2
    },
    {
      id: 'departments',
      type: 'stat',
      title: 'Départements',
      value: departments?.length || 0,
      icon: Building,
      change: 'Stable',
      changeType: 'neutral',
      description: 'Structures organisées',
      priority: 3
    },
    {
      id: 'classes',
      type: 'stat',
      title: 'Classes Actives',
      value: 47,
      icon: Users,
      change: '+8 ce mois',
      changeType: 'positive',
      description: 'Groupes d\'étudiants',
      priority: 4
    },

    // Recent programs widget
    {
      id: 'recent-programs',
      type: 'list',
      title: 'Programmes Récents',
      value: programs?.slice(0, 5).length,
      description: 'Derniers programmes créés',
      icon: GraduationCap,
      data: programs?.slice(0, 5).map(program => ({
        title: program.name,
        subtitle: program.code,
        badge: `${program.duration_years} ans`
      })) || [],
      actions: [
        {
          label: 'Voir tous les programmes',
          onClick: () => navigate('/academic/programs'),
          variant: 'outline' as const
        }
      ],
      priority: 5
    },

    // Recent subjects widget
    {
      id: 'recent-subjects',
      type: 'list',
      title: 'Matières Récentes',
      value: subjects?.slice(0, 5).length,
      description: 'Dernières matières ajoutées',
      icon: BookOpen,
      data: subjects?.slice(0, 5).map(subject => ({
        title: subject.name,
        subtitle: subject.code,
        badge: `${subject.credits_ects} ECTS`
      })) || [],
      actions: [
        {
          label: 'Voir toutes les matières',
          onClick: () => navigate('/academic/subjects'),
          variant: 'outline' as const
        }
      ],
      priority: 6
    },

    // Quick actions widget
    {
      id: 'quick-actions',
      type: 'action',
      title: 'Actions Rapides',
      description: 'Gestion académique quotidienne',
      icon: Plus,
      actions: [
        {
          label: 'Créer un Programme',
          onClick: () => navigate('/academic/programs'),
          variant: 'default' as const
        },
        {
          label: 'Ajouter une Matière',
          onClick: () => navigate('/academic/subjects'),
          variant: 'outline' as const
        },
        {
          label: 'Gérer les Emplois du Temps',
          onClick: () => navigate('/academic/timetables'),
          variant: 'outline' as const
        }
      ],
      priority: 7
    },

    // Calendar integration widget
    {
      id: 'calendar-widget',
      type: 'action',
      title: 'Calendrier Académique',
      description: 'Planification et événements',
      icon: Calendar,
      actions: [
        {
          label: 'Voir le Calendrier',
          onClick: () => navigate('/academic/calendar'),
          variant: 'default' as const
        },
        {
          label: 'Générer Emploi du Temps IA',
          onClick: () => navigate('/academic/smart-timetables'),
          variant: 'outline' as const
        }
      ],
      priority: 8
    }
  ];

  // Add conflict alert if needed
  const conflictAlert = {
    id: 'schedule-conflicts',
    type: 'alert' as const,
    title: 'Conflits d\'Emploi du Temps',
    description: '3 conflits détectés dans la planification de cette semaine',
    color: 'warning' as const,
    icon: AlertTriangle,
    actions: [
      {
        label: 'Résoudre',
        onClick: () => navigate('/academic/timetables'),
        variant: 'default' as const
      }
    ],
    priority: 9
  };

  // Add alert if there are potential conflicts
  if (Math.random() > 0.7) { // Simulated conflict detection
    widgets.push(conflictAlert);
  }

  const quickActions = [
    {
      label: 'Nouveau Programme',
      icon: Plus,
      onClick: () => navigate('/academic/programs'),
      variant: 'default' as const
    },
    {
      label: 'Emplois du Temps',
      icon: Calendar,
      onClick: () => navigate('/academic/timetables'),
      variant: 'outline' as const
    },
    {
      label: 'Analytics',
      icon: BarChart3,
      onClick: () => navigate('/academic/analytics'),
      variant: 'outline' as const
    }
  ];

  const alerts = [];

  return (
    <ModuleDashboard
      title="Tableau de Bord Académique"
      subtitle="Gestion intelligente des programmes et planification"
      widgets={widgets}
      moduleColor="79 127 255" // academic color from index.css
      quickActions={quickActions}
      alerts={alerts}
    />
  );
}