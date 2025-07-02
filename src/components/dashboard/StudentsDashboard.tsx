import React from 'react';
import { ModuleDashboard, DashboardWidget } from './ModuleDashboard';
import { useStudentsDashboard } from '@/hooks/useStudentsDashboard';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  UserPlus, 
  CheckCircle, 
  TrendingUp, 
  Clock, 
  Download,
  Eye,
  AlertCircle,
  BarChart3
} from 'lucide-react';

export function StudentsDashboard() {
  const navigate = useNavigate();
  const { stats, recentEnrollments, programDistribution, loading, error, refreshData } = useStudentsDashboard();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-students"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <AlertCircle className="w-8 h-8 text-destructive mx-auto mb-2" />
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  const widgets: DashboardWidget[] = [
    // Stats widgets
    {
      id: 'total-students',
      type: 'stat',
      title: 'Total Étudiants',
      value: stats.totalStudents,
      icon: Users,
      description: 'Étudiants inscrits',
      priority: 1
    },
    {
      id: 'new-this-month',
      type: 'stat',
      title: 'Nouveaux (ce mois)',
      value: stats.newThisMonth,
      icon: UserPlus,
      change: '+12%',
      changeType: 'positive',
      description: 'Inscriptions récentes',
      priority: 2
    },
    {
      id: 'active-students',
      type: 'stat',
      title: 'Étudiants Actifs',
      value: stats.activeStudents,
      icon: CheckCircle,
      change: '+5%',
      changeType: 'positive',
      description: 'Statut actif',
      priority: 3
    },
    {
      id: 'retention-rate',
      type: 'stat',
      title: 'Taux de Rétention',
      value: `${stats.retentionRate}%`,
      icon: TrendingUp,
      change: '+2.1%',
      changeType: 'positive',
      description: 'Performance académique',
      priority: 4
    },

    // List widget for recent enrollments
    {
      id: 'recent-enrollments',
      type: 'list',
      title: 'Inscriptions Récentes',
      value: recentEnrollments.length,
      description: `Dernières inscriptions en temps réel`,
      icon: Clock,
      data: recentEnrollments.map(enrollment => ({
        title: enrollment.full_name,
        subtitle: `${enrollment.student_number} - ${enrollment.program_name}`,
        badge: enrollment.status === 'active' ? 'Actif' : 'En cours'
      })),
      actions: [
        {
          label: 'Voir tous les profils',
          onClick: () => navigate('/students/profiles'),
          variant: 'outline' as const
        }
      ],
      priority: 5
    },

    // Program distribution widget
    {
      id: 'program-distribution',
      type: 'list',
      title: 'Répartition par Programme',
      value: programDistribution.length,
      description: `Distribution des ${stats.activeStudents} étudiants actifs`,
      icon: BarChart3,
      data: programDistribution.map(program => ({
        title: program.program_name,
        subtitle: `${program.student_count} étudiants`,
        badge: `${program.percentage}%`
      })),
      priority: 6
    },

    // Quick actions widget
    {
      id: 'quick-actions',
      type: 'action',
      title: 'Actions Rapides',
      description: 'Gestion quotidienne des étudiants',
      icon: UserPlus,
      actions: [
        {
          label: 'Nouvelle Inscription Express',
          onClick: () => navigate('/students/registration'),
          variant: 'default' as const
        },
        {
          label: 'Import en Masse',
          onClick: () => {},
          variant: 'outline' as const
        },
        {
          label: 'Consulter Profils',
          onClick: () => navigate('/students/profiles'),
          variant: 'outline' as const
        }
      ],
      priority: 7
    },

    // Performance alert if enrollment time is high
    ...(stats.averageEnrollmentTime > 25 ? [{
      id: 'performance-alert',
      type: 'alert' as const,
      title: 'Performance d\'Inscription',
      description: `Temps moyen actuel: ${stats.averageEnrollmentTime}s (objectif: <30s)`,
      color: 'warning' as const,
      icon: AlertCircle,
      actions: [
        {
          label: 'Optimiser',
          onClick: () => {},
          variant: 'default' as const
        }
      ],
      priority: 8
    }] : [])
  ];

  const quickActions = [
    {
      label: 'Nouvelle Inscription',
      icon: UserPlus,
      onClick: () => navigate('/students/registration'),
      variant: 'default' as const
    },
    {
      label: 'Export Données',
      icon: Download,
      onClick: () => {},
      variant: 'outline' as const
    },
    {
      label: 'Vue d\'ensemble',
      icon: Eye,
      onClick: () => navigate('/students/tracking'),
      variant: 'outline' as const
    }
  ];

  const alerts = stats.averageEnrollmentTime < 15 ? [
    {
      type: 'success' as const,
      title: 'Performance Excellente',
      message: `Temps d'inscription moyen: ${stats.averageEnrollmentTime}s - Objectif dépassé!`,
      action: refreshData
    }
  ] : [];

  return (
    <ModuleDashboard
      title="Tableau de Bord Étudiants"
      subtitle="Gestion intelligente des inscriptions et suivi en temps réel"
      widgets={widgets}
      moduleColor="16 185 129" // students color from index.css
      quickActions={quickActions}
      alerts={alerts}
    />
  );
}