import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
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
      color: "bg-blue-500",
      notifications: 12,
      onClick: () => navigate('/academic')
    },
    {
      title: "Gestion Étudiants",
      icon: Users,
      color: "bg-green-500",
      notifications: 3,
      onClick: () => navigate('/students')
    },
    {
      title: "Finance",
      icon: DollarSign,
      color: "bg-orange-500",
      notifications: 7,
      onClick: () => navigate('/finance')
    },
    {
      title: "Ressources Humaines",
      icon: UserCheck,
      color: "bg-purple-500",
      notifications: 2,
      onClick: () => navigate('/hr')
    },
    {
      title: "Communication",
      icon: MessageSquare,
      color: "bg-cyan-500",
      notifications: 15,
      onClick: () => navigate('/communication')
    },
    {
      title: "Documents",
      icon: FileText,
      color: "bg-indigo-500",
      notifications: 4,
      onClick: () => navigate('/documents')
    },
    {
      title: "eLearning",
      icon: BookOpen,
      color: "bg-teal-500",
      notifications: 8,
      onClick: () => navigate('/elearning')
    },
    {
      title: "Examens",
      icon: Calendar,
      color: "bg-red-500",
      notifications: 6,
      onClick: () => navigate('/exams')
    },
    {
      title: "Inventaire",
      icon: Package,
      color: "bg-yellow-500",
      notifications: 1,
      onClick: () => navigate('/inventory')
    },
    {
      title: "Partenariats",
      icon: Handshake,
      color: "bg-pink-500",
      notifications: 5,
      onClick: () => navigate('/partnerships')
    },
    {
      title: "Paramètres",
      icon: Settings,
      color: "bg-gray-500",
      notifications: 0,
      onClick: () => navigate('/settings')
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
      {modules.map((module, index) => (
        <Card 
          key={index}
          className="bg-white/20 border-white/30 backdrop-blur-md hover:bg-white/25 hover:scale-[1.02] transition-all duration-300 cursor-pointer group relative shadow-lg hover:shadow-xl"
          onClick={module.onClick}
        >
          <CardContent className="p-4 text-center">
            {/* Badge de notification */}
            {module.notifications > 0 && (
              <Badge 
                className="absolute -top-1 -right-1 bg-red-500 text-white border-red-600 text-xs min-w-[18px] h-[18px] flex items-center justify-center rounded-full shadow-sm"
              >
                {module.notifications}
              </Badge>
            )}
            
            {/* Icône */}
            <div className={`w-10 h-10 mx-auto mb-2 rounded-lg ${module.color} flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-200`}>
              <module.icon className="w-5 h-5 text-white" />
            </div>
            
            {/* Titre */}
            <h3 className="text-white font-medium text-xs leading-tight group-hover:text-blue-100 transition-colors">
              {module.title}
            </h3>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}