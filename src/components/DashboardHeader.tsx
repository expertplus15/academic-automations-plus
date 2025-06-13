import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Bell, Search, Zap } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
}

export function DashboardHeader({ title, subtitle }: DashboardHeaderProps) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Bonjour";
    if (hour < 18) return "Bon après-midi";
    return "Bonsoir";
  };

  const formatTime = () => {
    return currentTime.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = () => {
    return currentTime.toLocaleDateString('fr-FR', { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <header className="bg-card border-b border-border/50 shadow-sm">
      <div className="flex h-20 items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="hover:bg-sidebar-accent" />
          
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-foreground">{getGreeting()}, Dr. Martin</h1>
              <span className="text-lg text-muted-foreground">👋</span>
            </div>
            <p className="text-sm text-muted-foreground">{formatDate()}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Time Display */}
          <div className="text-right">
            <p className="text-xl font-mono font-bold text-foreground">{formatTime()}</p>
            <p className="text-xs text-muted-foreground">Heure locale</p>
          </div>

          {/* Quick Access Button */}
          <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white">
            <Zap className="w-4 h-4 mr-2" />
            Accès Rapide
          </Button>

          {/* Search */}
          <div className="relative hidden lg:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher..."
              className="pl-10 w-64 h-9"
            />
          </div>

          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="w-4 h-4" />
            <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 py-0.5 min-w-0 h-5">
              3
            </Badge>
          </Button>

          {/* User Profile */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-medium text-foreground">Dr. Martin Dubois</p>
              <p className="text-xs text-muted-foreground">Administrateur</p>
            </div>
            <Avatar>
              <AvatarImage src="/placeholder.svg" alt="Dr. Martin" />
              <AvatarFallback className="bg-blue-500 text-white">MD</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </header>
  );
}