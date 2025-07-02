import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ModuleCard } from '@/components/ModuleCard';
import { 
  GraduationCap, 
  Users, 
  DollarSign, 
  UserCheck, 
  MessageSquare,
  BookOpen,
  Calendar,
  Settings,
  FileText,
  Heart,
  Handshake,
  Car,
  BarChart3
} from 'lucide-react';

export function ModulesGrid() {
  const navigate = useNavigate();

  const modules = [
    {
      title: "Module Académique",
      description: "Gestion des programmes, emplois du temps et évaluations",
      icon: GraduationCap,
      color: "primary",
      stats: [
        { label: "Programmes", value: "12" },
        { label: "Matières", value: "45" }
      ],
      actions: [
        { 
          label: "Accéder", 
          onClick: () => navigate('/academic'),
          variant: "default" as const
        }
      ]
    },
    {
      title: "Gestion Étudiants",
      description: "Inscription, suivi et communication avec les étudiants",
      icon: Users,
      color: "secondary",
      stats: [
        { label: "Étudiants", value: "1,247" },
        { label: "Alertes", value: "3" }
      ],
      actions: [
        { 
          label: "Accéder", 
          onClick: () => navigate('/students'),
          variant: "default" as const
        }
      ]
    },
    {
      title: "Finances",
      description: "Comptabilité, facturation et gestion budgétaire",
      icon: DollarSign,
      color: "accent",
      stats: [
        { label: "Factures", value: "156" },
        { label: "En attente", value: "23" }
      ],
      actions: [
        { 
          label: "Accéder", 
          onClick: () => navigate('/finance'),
          variant: "default" as const
        }
      ]
    },
    {
      title: "Ressources Humaines",
      description: "Gestion du personnel et des enseignants",
      icon: UserCheck,
      color: "muted",
      stats: [
        { label: "Enseignants", value: "89" },
        { label: "Personnel", value: "34" }
      ],
      actions: [
        { 
          label: "Accéder", 
          onClick: () => navigate('/hr'),
          variant: "default" as const
        }
      ]
    },
    {
      title: "E-Learning",
      description: "Plateforme d'apprentissage en ligne",
      icon: BookOpen,
      color: "primary",
      stats: [
        { label: "Cours", value: "67" },
        { label: "Actifs", value: "892" }
      ],
      actions: [
        { 
          label: "Accéder", 
          onClick: () => navigate('/elearning'),
          variant: "default" as const
        }
      ]
    },
    {
      title: "Examens",
      description: "Planification et gestion des examens",
      icon: Calendar,
      color: "destructive",
      stats: [
        { label: "Programmés", value: "24" },
        { label: "Cette semaine", value: "5" }
      ],
      actions: [
        { 
          label: "Accéder", 
          onClick: () => navigate('/exams'),
          variant: "default" as const
        }
      ]
    },
    {
      title: "Résultats",
      description: "Notes, bulletins et transcriptions",
      icon: BarChart3,
      color: "secondary",
      stats: [
        { label: "Notes saisies", value: "234" },
        { label: "À publier", value: "12" }
      ],
      actions: [
        { 
          label: "Accéder", 
          onClick: () => navigate('/results'),
          variant: "default" as const
        }
      ]
    },
    {
      title: "Services",
      description: "Transport, restauration et hébergement",
      icon: Car,
      color: "accent",
      stats: [
        { label: "Demandes", value: "45" },
        { label: "En cours", value: "12" }
      ],
      actions: [
        { 
          label: "Accéder", 
          onClick: () => navigate('/services'),
          variant: "default" as const
        }
      ]
    },
    {
      title: "Santé",
      description: "Suivi médical et bien-être étudiant",
      icon: Heart,
      color: "destructive",
      stats: [
        { label: "Consultations", value: "78" },
        { label: "Urgences", value: "2" }
      ],
      actions: [
        { 
          label: "Accéder", 
          onClick: () => navigate('/health'),
          variant: "default" as const
        }
      ]
    },
    {
      title: "Partenariats",
      description: "Relations entreprises et stages",
      icon: Handshake,
      color: "muted",
      stats: [
        { label: "Partenaires", value: "156" },
        { label: "Stages", value: "89" }
      ],
      actions: [
        { 
          label: "Accéder", 
          onClick: () => navigate('/partnerships'),
          variant: "default" as const
        }
      ]
    },
    {
      title: "Ressources",
      description: "Matériel, équipements et infrastructures",
      icon: FileText,
      color: "primary",
      stats: [
        { label: "Équipements", value: "1,245" },
        { label: "Réservations", value: "34" }
      ],
      actions: [
        { 
          label: "Accéder", 
          onClick: () => navigate('/resources'),
          variant: "default" as const
        }
      ]
    },
    {
      title: "Paramètres",
      description: "Configuration système et utilisateurs",
      icon: Settings,
      color: "secondary",
      stats: [
        { label: "Utilisateurs", value: "234" },
        { label: "Intégrations", value: "8" }
      ],
      actions: [
        { 
          label: "Accéder", 
          onClick: () => navigate('/settings'),
          variant: "default" as const
        }
      ]
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {modules.map((module, index) => (
        <ModuleCard
          key={index}
          title={module.title}
          description={module.description}
          icon={module.icon}
          color={module.color}
          stats={module.stats}
          actions={module.actions}
        />
      ))}
    </div>
  );
}