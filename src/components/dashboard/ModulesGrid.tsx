import React from 'react';
import { useNavigate } from 'react-router-dom';
import { StatusBadge } from '@/components/ui/status-badge';
import { useTransportAlerts } from '@/hooks/useTransportAlerts';
import { useAccommodationStatus } from '@/hooks/useAccommodationStatus';
import { useHRModule } from '@/hooks/useHRModule';
import { useExamsData } from '@/hooks/useExamsData';
import { formatNotificationCount } from '@/utils/pluralization';
import { 
  GraduationCap, 
  Users, 
  DollarSign, 
  UserCheck, 
  BookOpen,
  Calendar,
  Settings,
  Package,
  MessageSquare,
  Heart,
  BarChart3,
  FileText,
  AlertTriangle
} from 'lucide-react';

export function ModulesGrid() {
  const navigate = useNavigate();
  
  // Get real-time data for critical modules
  const { stats: transportStats } = useTransportAlerts();
  const { stats: accommodationStats } = useAccommodationStatus();
  const { stats: hrStats } = useHRModule();
  const { stats: examStats } = useExamsData();

  const getModuleNotifications = (moduleTitle: string) => {
    switch (moduleTitle) {
      case "Services aux Étudiants":
        return {
          count: transportStats.alertsCount,
          variant: transportStats.alertsCount > 0 ? "critical" as const : "success" as const,
          showAlert: transportStats.alertsCount > 0
        };
      case "Examens & Organisation":
        return {
          count: examStats.conflictsCount,
          variant: examStats.conflictsCount > 0 ? "warning" as const : "success" as const,
          showAlert: examStats.conflictsCount > 0
        };
      case "Ressources Humaines":
        return {
          count: hrStats.hasData ? 0 : 1,
          variant: hrStats.hasData ? "success" as const : "warning" as const,
          showAlert: !hrStats.hasData
        };
      default:
        return {
          count: Math.floor(Math.random() * 5), // Mock notifications for other modules
          variant: "info" as const,
          showAlert: false
        };
    }
  };

  const modules = [
    {
      title: "Académique & Pédagogie",
      subtitle: "Programmes, emplois du temps IA",
      icon: GraduationCap,
      color: "bg-academic",
      onClick: () => navigate('/academic')
    },
    {
      title: "Gestion Étudiants",
      subtitle: "Inscription < 30s, suivi temps réel",
      icon: Users,
      color: "bg-students",
      onClick: () => navigate('/students')
    },
    {
      title: "Examens & Organisation",
      subtitle: "Planification IA anti-conflits",
      icon: Calendar,
      color: "bg-exams",
      onClick: () => navigate('/exams')
    },
    {
      title: "Évaluations & Résultats",
      subtitle: "Bulletins < 5s, interface matricielle",
      icon: BarChart3,
      color: "bg-results",
      onClick: () => navigate('/results')
    },
    {
      title: "Finance & Comptabilité",
      subtitle: "Facturation instantanée",
      icon: DollarSign,
      color: "bg-finance",
      onClick: () => navigate('/finance')
    },
    {
      title: "eLearning Numérique",
      subtitle: "SCORM/xAPI, authoring no-code",
      icon: BookOpen,
      color: "bg-elearning",
      onClick: () => navigate('/elearning')
    },
    {
      title: "Ressources Humaines",
      subtitle: "Référentiel maître enseignants",
      icon: UserCheck,
      color: "bg-hr",
      onClick: () => navigate('/hr')
    },
    {
      title: "Ressources & Patrimoine",
      subtitle: "QR codes, maintenance prédictive",
      icon: Package,
      color: "bg-resources",
      onClick: () => navigate('/resources')
    },
    {
      title: "Communication",
      subtitle: "Messages, notifications, répertoire",
      icon: MessageSquare,
      color: "bg-communication",
      onClick: () => navigate('/communication')
    },
    {
      title: "Paramètres & Config",
      subtitle: "Centre de contrôle plateforme",
      icon: Settings,
      color: "bg-settings",
      onClick: () => navigate('/settings')
    },
    {
      title: "Services aux Étudiants",
      subtitle: "Transport, restauration, santé",
      icon: Heart,
      color: "bg-services",
      onClick: () => navigate('/services')
    },
    {
      title: "Gestion Documentaire",
      subtitle: "Templates, archives, signatures",
      icon: FileText,
      color: "bg-academic",
      onClick: () => navigate('/documents')
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {modules.map((module, index) => {
        const notifications = getModuleNotifications(module.title);
        
        return (
          <div 
            key={index}
            className="flex flex-col items-center cursor-pointer group relative p-4 rounded-2xl hover:bg-white/50 transition-all duration-200"
            onClick={module.onClick}
          >
            {/* Badge de notification intelligent */}
            {notifications.count > 0 && (
              <div className="absolute -top-2 -right-2 z-10">
                <StatusBadge
                  variant={notifications.variant}
                  size="sm"
                  icon={notifications.showAlert ? <AlertTriangle className="w-3 h-3" /> : undefined}
                  className="min-w-[20px] h-5 rounded-full shadow-sm text-xs"
                >
                  {formatNotificationCount(notifications.count)}
                </StatusBadge>
              </div>
            )}
            
            {/* Icône */}
            <div className={`w-16 h-16 mb-3 rounded-2xl ${module.color} flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 group-hover:scale-105`}>
              <module.icon className="w-8 h-8 text-white" />
            </div>
            
            {/* Titre */}
            <h3 className="text-foreground font-semibold text-sm text-center group-hover:text-academic transition-colors mb-1">
              {module.title}
            </h3>
            
            {/* Sous-titre */}
            <p className="text-muted-foreground text-xs text-center leading-tight">
              {module.subtitle}
            </p>
          </div>
        );
      })}
    </div>
  );
}