import React from 'react';
import { ModuleCard } from '@/components/ModuleCard';
import { MessageSquare, Bell, Users, Megaphone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function CommunicationModuleCards() {
  const navigate = useNavigate();

  const modules = [
    {
      title: "Messagerie",
      description: "Chat en temps réel et messages privés",
      icon: MessageSquare,
      color: "primary",
      stats: [
        { label: "Messages aujourd'hui", value: "124" },
        { label: "Conversations actives", value: "18" }
      ],
      actions: [
        { 
          label: "Nouveau message", 
          onClick: () => navigate('/communication/messaging'),
          variant: "default" as const
        },
        { 
          label: "Voir tout", 
          onClick: () => navigate('/communication/messaging'),
          variant: "outline" as const
        }
      ]
    },
    {
      title: "Notifications",
      description: "Centre de notifications et alertes",
      icon: Bell,
      color: "green",
      stats: [
        { label: "Non lues", value: "8" },
        { label: "Cette semaine", value: "45" }
      ],
      actions: [
        { 
          label: "Créer notification", 
          onClick: () => navigate('/communication/notifications'),
          variant: "default" as const
        },
        { 
          label: "Gérer", 
          onClick: () => navigate('/communication/notifications'),
          variant: "outline" as const
        }
      ]
    },
    {
      title: "Répertoire",
      description: "Contacts étudiants et enseignants",
      icon: Users,
      color: "purple",
      stats: [
        { label: "Étudiants", value: "2,847" },
        { label: "Enseignants", value: "156" }
      ],
      actions: [
        { 
          label: "Rechercher", 
          onClick: () => navigate('/communication/directory'),
          variant: "default" as const
        },
        { 
          label: "Exporter", 
          onClick: () => {},
          variant: "outline" as const
        }
      ]
    },
    {
      title: "Annonces",
      description: "Annonces institutionnelles et informations",
      icon: Megaphone,
      color: "orange",
      stats: [
        { label: "Publiées", value: "12" },
        { label: "En attente", value: "3" }
      ],
      actions: [
        { 
          label: "Nouvelle annonce", 
          onClick: () => navigate('/communication/announcements'),
          variant: "default" as const
        },
        { 
          label: "Gérer", 
          onClick: () => navigate('/communication/announcements'),
          variant: "outline" as const
        }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Modules Communication</h2>
        <p className="text-muted-foreground">4 modules disponibles</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {modules.map((module, index) => (
          <div
            key={index}
            className="group relative"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <ModuleCard
              title={module.title}
              description={module.description}
              icon={module.icon}
              color={module.color}
              stats={module.stats}
              actions={module.actions}
            />
          </div>
        ))}
      </div>
    </div>
  );
}