import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
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
  BarChart3,
  Package
} from 'lucide-react';

export function ModulesGrid() {
  const navigate = useNavigate();

  const modules = [
    {
      title: "Académique",
      icon: GraduationCap,
      color: "bg-[#4F78FF]",
      notifications: 12,
      onClick: () => navigate('/academic')
    },
    {
      title: "Gestion Étudiants",
      icon: Users,
      color: "bg-[#10B981]",
      notifications: 3,
      onClick: () => navigate('/students')
    },
    {
      title: "Finance",
      icon: DollarSign,
      color: "bg-[#F59E0B]",
      notifications: 7,
      onClick: () => navigate('/finance')
    },
    {
      title: "Ressources Humaines",
      icon: UserCheck,
      color: "bg-[#8B5CF6]",
      notifications: 2,
      onClick: () => navigate('/hr')
    },
    {
      title: "Communication",
      icon: MessageSquare,
      color: "bg-[#4F78FF]",
      notifications: 15,
      onClick: () => navigate('/communication')
    },
    {
      title: "Documents",
      icon: FileText,
      color: "bg-[#8B5CF6]",
      notifications: 4,
      onClick: () => navigate('/documents')
    },
    {
      title: "eLearning",
      icon: BookOpen,
      color: "bg-[#4F78FF]",
      notifications: 8,
      onClick: () => navigate('/elearning')
    },
    {
      title: "Examens",
      icon: Calendar,
      color: "bg-[#EF4444]",
      notifications: 6,
      onClick: () => navigate('/exams')
    },
    {
      title: "Inventaire",
      icon: Package,
      color: "bg-[#F59E0B]",
      notifications: 1,
      onClick: () => navigate('/inventory')
    },
    {
      title: "Partenariats",
      icon: Handshake,
      color: "bg-[#8B5CF6]",
      notifications: 5,
      onClick: () => navigate('/partnerships')
    },
    {
      title: "Paramètres",
      icon: Settings,
      color: "bg-[#64748B]",
      notifications: 0,
      onClick: () => navigate('/settings')
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
      {modules.map((module, index) => (
        <div 
          key={index}
          className="flex flex-col items-center cursor-pointer group relative"
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
          <div className={`w-20 h-20 mb-4 rounded-3xl ${module.color} flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 group-hover:scale-105`}>
            <module.icon className="w-10 h-10 text-white" />
          </div>
          
          {/* Titre */}
          <h3 className="text-foreground font-semibold text-sm text-center group-hover:text-[#4F78FF] transition-colors">
            {module.title}
          </h3>
        </div>
      ))}
    </div>
  );
}