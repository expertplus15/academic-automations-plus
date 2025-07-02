import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { 
  GraduationCap, 
  Users, 
  DollarSign, 
  UserCheck, 
  BookOpen,
  Calendar,
  Settings,
  Package,
  Handshake,
  Heart,
  BarChart3,
  Shield
} from 'lucide-react';

export function ModulesGrid() {
  const navigate = useNavigate();

  const modules = [
    {
      title: "Académique & Pédagogie",
      subtitle: "Programmes, emplois du temps IA",
      icon: GraduationCap,
      color: "bg-[#4F78FF]",
      notifications: 12,
      onClick: () => navigate('/academic')
    },
    {
      title: "Gestion Étudiants",
      subtitle: "Inscription < 30s, suivi temps réel",
      icon: Users,
      color: "bg-[#10B981]",
      notifications: 3,
      onClick: () => navigate('/students')
    },
    {
      title: "Examens & Organisation",
      subtitle: "Planification IA anti-conflits",
      icon: Calendar,
      color: "bg-[#EF4444]",
      notifications: 6,
      onClick: () => navigate('/exams')
    },
    {
      title: "Évaluations & Résultats",
      subtitle: "Bulletins < 5s, interface matricielle",
      icon: BarChart3,
      color: "bg-[#8B5CF6]",
      notifications: 8,
      onClick: () => navigate('/results')
    },
    {
      title: "Finance & Comptabilité",
      subtitle: "Facturation instantanée",
      icon: DollarSign,
      color: "bg-[#F59E0B]",
      notifications: 7,
      onClick: () => navigate('/finance')
    },
    {
      title: "eLearning Numérique",
      subtitle: "SCORM/xAPI, authoring no-code",
      icon: BookOpen,
      color: "bg-[#4F78FF]",
      notifications: 8,
      onClick: () => navigate('/elearning')
    },
    {
      title: "Ressources Humaines",
      subtitle: "Référentiel maître enseignants",
      icon: UserCheck,
      color: "bg-[#8B5CF6]",
      notifications: 2,
      onClick: () => navigate('/hr')
    },
    {
      title: "Ressources & Patrimoine",
      subtitle: "QR codes, maintenance prédictive",
      icon: Package,
      color: "bg-[#F59E0B]",
      notifications: 1,
      onClick: () => navigate('/resources')
    },
    {
      title: "Relations & Partenariats",
      subtitle: "CRM éducatif, stages, alumni",
      icon: Handshake,
      color: "bg-[#8B5CF6]",
      notifications: 5,
      onClick: () => navigate('/partnerships')
    },
    {
      title: "Paramètres & Config",
      subtitle: "Centre de contrôle plateforme",
      icon: Settings,
      color: "bg-[#64748B]",
      notifications: 0,
      onClick: () => navigate('/settings')
    },
    {
      title: "Services aux Étudiants",
      subtitle: "Transport, restauration, logement",
      icon: Heart,
      color: "bg-[#10B981]",
      notifications: 2,
      onClick: () => navigate('/services')
    },
    {
      title: "Santé & Bien-être",
      subtitle: "Dossiers médicaux, urgences",
      icon: Shield,
      color: "bg-[#EF4444]",
      notifications: 1,
      onClick: () => navigate('/health')
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {modules.map((module, index) => (
        <div 
          key={index}
          className="flex flex-col items-center cursor-pointer group relative p-4 rounded-2xl hover:bg-white/50 transition-all duration-200"
          onClick={module.onClick}
        >
          {/* Badge de notification */}
          {module.notifications > 0 && (
            <Badge 
              className="absolute -top-2 -right-2 bg-[#EF4444] text-white border-0 text-xs min-w-[20px] h-5 flex items-center justify-center rounded-full shadow-sm z-10"
            >
              {module.notifications}
            </Badge>
          )}
          
          {/* Icône */}
          <div className={`w-16 h-16 mb-3 rounded-2xl ${module.color} flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 group-hover:scale-105`}>
            <module.icon className="w-8 h-8 text-white" />
          </div>
          
          {/* Titre */}
          <h3 className="text-foreground font-semibold text-sm text-center group-hover:text-[#4F78FF] transition-colors mb-1">
            {module.title}
          </h3>
          
          {/* Sous-titre */}
          <p className="text-muted-foreground text-xs text-center leading-tight">
            {module.subtitle}
          </p>
        </div>
      ))}
    </div>
  );
}