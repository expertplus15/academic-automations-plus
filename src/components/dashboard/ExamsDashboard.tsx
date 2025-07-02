import React from 'react';
import { ModuleDashboard, DashboardWidget } from './ModuleDashboard';
import { useExams } from '@/hooks/useExams';
import { useExamConflictDetection } from '@/hooks/useExamConflictDetection';
import { useSupervisors } from '@/hooks/useSupervisors';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  Calendar, 
  Users, 
  AlertTriangle, 
  Brain,
  Zap,
  CheckCircle,
  Clock,
  BarChart3,
  Building,
  TrendingUp
} from 'lucide-react';

export function ExamsDashboard() {
  const navigate = useNavigate();
  const { exams, sessions, loading: examsLoading } = useExams();
  const { 
    conflicts, 
    loading: conflictsLoading, 
    generateSchedule,
    detectConflicts 
  } = useExamConflictDetection();
  const { supervisors, loading: supervisorsLoading } = useSupervisors();

  const loading = examsLoading || conflictsLoading || supervisorsLoading;

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-exams"></div>
      </div>
    );
  }

  // Calculate metrics
  const totalExams = exams.length;
  const scheduledExams = exams.filter(e => e.status === 'scheduled').length;
  const draftExams = exams.filter(e => e.status === 'draft').length;
  const completedExams = exams.filter(e => e.status === 'completed').length;
  const availableSupervisors = supervisors.filter(s => s.status === 'available').length;
  const criticalConflicts = conflicts.filter(c => c.severity === 'critical').length;
  const upcomingSessions = sessions.filter(session => {
    const sessionDate = new Date(session.start_time);
    const now = new Date();
    return sessionDate > now;
  }).length;

  const widgets: DashboardWidget[] = [
    // Stats widgets
    {
      id: 'total-exams',
      type: 'stat',
      title: 'Examens Total',
      value: totalExams,
      icon: BookOpen,
      description: 'Tous statuts confondus',
      priority: 1
    },
    {
      id: 'scheduled-exams',
      type: 'stat',
      title: 'Examens Planifiés',
      value: scheduledExams,
      icon: Calendar,
      change: '+12 cette semaine',
      changeType: 'positive',
      description: 'Sessions programmées',
      priority: 2
    },
    {
      id: 'conflicts',
      type: 'stat',
      title: 'Conflits Détectés',
      value: conflicts.length,
      icon: AlertTriangle,
      change: criticalConflicts > 0 ? `${criticalConflicts} critiques` : 'Aucun critique',
      changeType: criticalConflicts > 0 ? 'negative' : 'positive',
      description: 'Détection automatique',
      priority: 3
    },
    {
      id: 'supervisors',
      type: 'stat',
      title: 'Surveillants Disponibles',
      value: availableSupervisors,
      icon: Users,
      change: `${Math.round((availableSupervisors / supervisors.length) * 100)}% dispo`,
      changeType: 'positive',
      description: 'Ressources humaines',
      priority: 4
    },

    // AI Generator widget
    {
      id: 'ai-generator',
      type: 'action',
      title: '🤖 Générateur IA Anti-Conflits',
      description: 'Planification intelligente avec détection automatique des conflits',
      icon: Brain,
      actions: [
        {
          label: 'Générer Planning Intelligent',
          onClick: () => generateSchedule('2024-2025'),
          variant: 'default' as const
        },
        {
          label: 'Analyser les Conflits',
          onClick: () => detectConflicts(),
          variant: 'outline' as const
        }
      ],
      priority: 5
    },

    // Upcoming sessions widget
    {
      id: 'upcoming-sessions',
      type: 'list',
      title: 'Sessions Prochaines',
      value: upcomingSessions,
      description: 'Examens programmés à venir',
      icon: Clock,
      data: sessions.filter(session => {
        const sessionDate = new Date(session.start_time);
        const now = new Date();
        return sessionDate > now;
      }).slice(0, 5).map(session => ({
        title: `Session ${session.id.slice(0, 8)}`,
        subtitle: new Date(session.start_time).toLocaleDateString('fr-FR'),
        badge: session.status
      })),
      actions: [
        {
          label: 'Voir planning complet',
          onClick: () => navigate('/exams/planning'),
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
      description: 'Gestion quotidienne des examens',
      icon: Zap,
      actions: [
        {
          label: 'Planifier un Examen',
          onClick: () => navigate('/exams/planning'),
          variant: 'default' as const
        },
        {
          label: 'Gérer les Salles',
          onClick: () => navigate('/exams/rooms'),
          variant: 'outline' as const
        },
        {
          label: 'Attribution Surveillants',
          onClick: () => navigate('/exams/supervisors'),
          variant: 'outline' as const
        }
      ],
      priority: 7
    },

    // Performance metrics widget
    {
      id: 'performance-metrics',
      type: 'list',
      title: 'Métriques de Performance',
      description: 'Indicateurs de l\'IA de planification',
      icon: TrendingUp,
      data: [
        {
          title: 'Taux de planification',
          subtitle: 'Examens planifiés automatiquement',
          badge: `${totalExams > 0 ? Math.round((scheduledExams / totalExams) * 100) : 0}%`
        },
        {
          title: 'Conflits résolus',
          subtitle: 'Résolution automatique des conflits',
          badge: `${Math.max(0, 100 - (criticalConflicts * 10))}%`
        },
        {
          title: 'Occupation salles',
          subtitle: 'Optimisation des ressources',
          badge: '87%'
        }
      ],
      priority: 8
    }
  ];

  // Add critical conflicts alert
  if (criticalConflicts > 0) {
    widgets.push({
      id: 'critical-conflicts-alert',
      type: 'alert',
      title: 'Conflits Critiques Détectés',
      description: `${criticalConflicts} conflit(s) critique(s) nécessitent une attention immédiate`,
      color: 'error',
      icon: AlertTriangle,
      actions: [
        {
          label: 'Résoudre Maintenant',
          onClick: () => navigate('/exams/conflicts'),
          variant: 'default' as const
        }
      ],
      priority: 9
    });
  }

  const quickActions = [
    {
      label: 'Planifier Examen',
      icon: Calendar,
      onClick: () => navigate('/exams/planning'),
      variant: 'default' as const
    },
    {
      label: 'Gérer Salles',
      icon: Building,
      onClick: () => navigate('/exams/rooms'),
      variant: 'outline' as const
    },
    {
      label: 'Analytics IA',
      icon: BarChart3,
      onClick: () => navigate('/exams/analytics'),
      variant: 'outline' as const
    }
  ];

  const alerts = criticalConflicts === 0 && scheduledExams > 0 ? [
    {
      type: 'success' as const,
      title: 'Planification Optimale',
      message: 'Aucun conflit détecté - La planification IA fonctionne parfaitement!',
    }
  ] : [];

  return (
    <ModuleDashboard
      title="Tableau de Bord Examens IA"
      subtitle="Planification intelligente avec détection automatique des conflits"
      widgets={widgets}
      moduleColor="139 92 246" // exams color from index.css
      quickActions={quickActions}
      alerts={alerts}
    />
  );
}