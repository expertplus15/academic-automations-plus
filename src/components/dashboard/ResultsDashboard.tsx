import React from 'react';
import { ModuleDashboard, DashboardWidget } from './ModuleDashboard';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart3, 
  Calculator, 
  FileText, 
  Award, 
  TrendingUp, 
  Grid,
  Zap,
  Clock,
  Users,
  CheckCircle,
  Sparkles
} from 'lucide-react';

export function ResultsDashboard() {
  const navigate = useNavigate();

  // Simulated data - replace with real hooks when available
  const stats = {
    totalGrades: 2847,
    generatedReports: 156,
    averageGenerationTime: 3.2,
    matrixSessions: 12,
    autoCalculations: 98.5,
    pendingGrades: 23
  };

  const widgets: DashboardWidget[] = [
    // Stats widgets
    {
      id: 'total-grades',
      type: 'stat',
      title: 'Notes Saisies',
      value: stats.totalGrades,
      icon: BarChart3,
      change: '+247 cette semaine',
      changeType: 'positive',
      description: 'Interface matricielle',
      priority: 1
    },
    {
      id: 'generated-reports',
      type: 'stat',
      title: 'Bulletins Générés',
      value: stats.generatedReports,
      icon: FileText,
      change: `< ${stats.averageGenerationTime}s en moyenne`,
      changeType: 'positive',
      description: 'Génération ultra-rapide',
      priority: 2
    },
    {
      id: 'auto-calculations',
      type: 'stat',
      title: 'Calculs Automatiques',
      value: `${stats.autoCalculations}%`,
      icon: Calculator,
      change: '100% fiabilité',
      changeType: 'positive',
      description: 'ECTS, moyennes, compensations',
      priority: 3
    },
    {
      id: 'matrix-sessions',
      type: 'stat',
      title: 'Sessions Matricielles',
      value: stats.matrixSessions,
      icon: Grid,
      change: '+3 actives maintenant',
      changeType: 'positive',
      description: 'Édition collaborative',
      priority: 4
    },

    // Matrix interface widget
    {
      id: 'matrix-interface',
      type: 'action',
      title: '⚡ Interface Matricielle Express',
      description: 'Saisie collaborative type Google Sheets - Édition simultanée',
      icon: Sparkles,
      actions: [
        {
          label: 'Ouvrir Interface Matricielle',
          onClick: () => navigate('/results/matrix'),
          variant: 'default' as const
        },
        {
          label: 'Nouvelle Session',
          onClick: () => navigate('/results/matrix?new=true'),
          variant: 'outline' as const
        }
      ],
      priority: 5
    },

    // Quick generation widget
    {
      id: 'quick-generation',
      type: 'action',
      title: '🚀 Génération Express',
      description: 'Bulletins personnalisables en moins de 5 secondes',
      icon: Zap,
      actions: [
        {
          label: 'Générer Bulletins',
          onClick: () => navigate('/results/reports'),
          variant: 'default' as const
        },
        {
          label: 'Templates Personnalisés',
          onClick: () => navigate('/results/templates'),
          variant: 'outline' as const
        }
      ],
      priority: 6
    },

    // Recent activities widget
    {
      id: 'recent-activities',
      type: 'list',
      title: 'Activités Récentes',
      value: 8,
      description: 'Dernières actions dans le module',
      icon: Clock,
      data: [
        {
          title: 'Session matricielle "Math L1"',
          subtitle: '3 utilisateurs connectés - Il y a 5 min',
          badge: 'Active'
        },
        {
          title: 'Bulletins L2 Informatique',
          subtitle: '42 bulletins générés en 2.1s',
          badge: 'Terminé'
        },
        {
          title: 'Calculs ECTS automatiques',
          subtitle: 'Moyennes recalculées pour 156 étudiants',
          badge: 'Mis à jour'
        },
        {
          title: 'Import notes Excel',
          subtitle: 'Math L3 - 89 notes importées',
          badge: 'Importé'
        }
      ],
      actions: [
        {
          label: 'Voir historique complet',
          onClick: () => navigate('/results/history'),
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
      description: 'Indicateurs temps réel du système',
      icon: TrendingUp,
      data: [
        {
          title: 'Temps de génération moyen',
          subtitle: 'Bulletins personnalisables',
          badge: `${stats.averageGenerationTime}s`
        },
        {
          title: 'Utilisateurs simultanés',
          subtitle: 'Interface matricielle',
          badge: '∞'
        },
        {
          title: 'Fiabilité des calculs',
          subtitle: 'Moyennes et ECTS',
          badge: '100%'
        },
        {
          title: 'Taux de satisfaction',
          subtitle: 'Enseignants utilisant l\'interface',
          badge: '97%'
        }
      ],
      priority: 8
    },

    // Quick actions widget
    {
      id: 'quick-actions',
      type: 'action',
      title: 'Actions Rapides',
      description: 'Gestion quotidienne des évaluations',
      icon: CheckCircle,
      actions: [
        {
          label: 'Saisie Notes Rapide',
          onClick: () => navigate('/results/matrix'),
          variant: 'default' as const
        },
        {
          label: 'Calculs Automatiques',
          onClick: () => navigate('/results/calculations'),
          variant: 'outline' as const
        },
        {
          label: 'Relevés Standards',
          onClick: () => navigate('/results/transcripts'),
          variant: 'outline' as const
        }
      ],
      priority: 9
    }
  ];

  // Add pending grades alert if any
  if (stats.pendingGrades > 0) {
    widgets.push({
      id: 'pending-grades-alert',
      type: 'alert',
      title: 'Notes en Attente',
      description: `${stats.pendingGrades} notes en attente de validation`,
      color: 'warning',
      icon: Clock,
      actions: [
        {
          label: 'Valider Maintenant',
          onClick: () => navigate('/results/pending'),
          variant: 'default' as const
        }
      ],
      priority: 10
    });
  }

  const quickActions = [
    {
      label: 'Interface Matricielle',
      icon: Grid,
      onClick: () => navigate('/results/matrix'),
      variant: 'default' as const
    },
    {
      label: 'Générer Bulletins',
      icon: FileText,
      onClick: () => navigate('/results/reports'),
      variant: 'outline' as const
    },
    {
      label: 'Analytics',
      icon: TrendingUp,
      onClick: () => navigate('/results/analytics'),
      variant: 'outline' as const
    }
  ];

  const alerts = stats.averageGenerationTime < 5 ? [
    {
      type: 'success' as const,
      title: 'Performance Exceptionnelle',
      message: `Génération de bulletins en ${stats.averageGenerationTime}s - Objectif < 5s atteint!`,
    }
  ] : [];

  return (
    <ModuleDashboard
      title="Tableau de Bord Évaluations"
      subtitle="Interface matricielle collaborative et génération ultra-rapide"
      widgets={widgets}
      moduleColor="139 92 246" // results color from index.css
      quickActions={quickActions}
      alerts={alerts}
    />
  );
}