import React, { memo } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  MessageSquare, 
  Bell, 
  Users, 
  Megaphone,
  Home
} from 'lucide-react';

export const CommunicationModuleSidebar = memo(function CommunicationModuleSidebar() {
  const location = useLocation();

  const menuItems = [
    {
      title: "Tableau de bord",
      icon: Home,
      path: "/communication",
      isActive: location.pathname === "/communication"
    },
    {
      title: "Messagerie",
      icon: MessageSquare,
      path: "/communication/messaging",
      isActive: location.pathname.startsWith("/communication/messaging")
    },
    {
      title: "Notifications",
      icon: Bell,
      path: "/communication/notifications",
      isActive: location.pathname.startsWith("/communication/notifications")
    },
    {
      title: "Répertoire",
      icon: Users,
      path: "/communication/directory",
      isActive: location.pathname.startsWith("/communication/directory")
    },
    {
      title: "Annonces",
      icon: Megaphone,
      path: "/communication/announcements",
      isActive: location.pathname.startsWith("/communication/announcements")
    }
  ];

  return (
    <div className="w-64 bg-white border-r border-border h-full">
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4F78FF] to-[#8B5CF6] flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-foreground">Communication</h2>
            <p className="text-sm text-muted-foreground">Messages & Notifications</p>
          </div>
        </div>
      </div>
      
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <a
                href={item.path}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  item.isActive
                    ? 'bg-[#4F78FF]/10 text-[#4F78FF] font-medium'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
});