
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Bell, Search, LogOut, User, Settings, MessageSquare, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";

interface DashboardHeaderProps {
  title?: string;
  subtitle?: string;
}

export function DashboardHeader({ title, subtitle }: DashboardHeaderProps) {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const now = new Date();
  const timeString = now.toLocaleTimeString('fr-FR', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false 
  });
  const dateString = now.toLocaleDateString('fr-FR', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Erreur de déconnexion:', error);
    }
  };

  return (
    <header className="bg-white border-b border-border/20 px-8 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        {/* Left side - Time, Date and Search */}
        <div className="flex items-center gap-6">
          <div className="text-left">
            {title ? (
              <>
                <p className="text-xl font-bold text-foreground">{title}</p>
                {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
              </>
            ) : (
              <>
                <p className="text-xl font-bold text-foreground">{timeString}</p>
                <p className="text-sm text-muted-foreground capitalize">{dateString}</p>
              </>
            )}
          </div>
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              placeholder="Rechercher..."
              className="pl-10 w-80 h-10 bg-background/50 border-border/50 text-foreground focus:border-primary transition-all duration-200 rounded-xl"
            />
          </div>
        </div>

        {/* Right side - Notifications and Profile */}
        <div className="flex items-center gap-4">
          {/* Messages */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="relative p-2 hover:bg-accent/50 transition-colors rounded-xl">
                <MessageSquare className="w-5 h-5 text-muted-foreground" />
                <Badge className="absolute -top-1 -right-1 bg-[#4F78FF] text-white text-xs px-1.5 py-0.5 min-w-0 h-5 rounded-full">
                  3
                </Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 rounded-xl shadow-lg">
              <DropdownMenuLabel>Messages récents</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="p-3 hover:bg-accent/50 transition-colors">
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-medium">Nouveau message de Jean Dupont</p>
                  <p className="text-xs text-muted-foreground">Question sur les notes de mathématiques</p>
                  <p className="text-xs text-muted-foreground">Il y a 5 min</p>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="relative p-2 hover:bg-accent/50 transition-colors rounded-xl">
                <Bell className="w-5 h-5 text-muted-foreground" />
                <Badge className="absolute -top-1 -right-1 bg-[#EF4444] text-white text-xs px-1.5 py-0.5 min-w-0 h-5 rounded-full">
                  5
                </Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 rounded-xl shadow-lg">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="p-3 hover:bg-accent/50 transition-colors">
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-medium">Nouveau conflit d'emploi du temps</p>
                  <p className="text-xs text-muted-foreground">Salle 101 réservée deux fois</p>
                  <p className="text-xs text-muted-foreground">Il y a 10 min</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem className="p-3 hover:bg-accent/50 transition-colors">
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-medium">12 nouvelles inscriptions</p>
                  <p className="text-xs text-muted-foreground">En attente de validation</p>
                  <p className="text-xs text-muted-foreground">Il y a 1h</p>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Profile Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-3 p-2 hover:bg-accent/50 transition-all duration-200 rounded-xl">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={profile?.avatar_url} alt={profile?.full_name || user?.email} />
                  <AvatarFallback className="bg-[#4F78FF] text-white text-sm">
                    {profile?.full_name?.[0] || user?.email?.[0] || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="text-left hidden md:block">
                  <p className="text-sm font-medium text-foreground">
                    {profile?.full_name || user?.email}
                  </p>
                  <p className="text-xs text-muted-foreground capitalize">
                    {profile?.role || 'Utilisateur'}
                  </p>
                </div>
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 rounded-xl shadow-lg">
              <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/profile')} className="hover:bg-accent/50 transition-colors rounded-lg">
                <User className="mr-2 h-4 w-4" />
                Profil
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/settings')} className="hover:bg-accent/50 transition-colors rounded-lg">
                <Settings className="mr-2 h-4 w-4" />
                Paramètres
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors rounded-lg">
                <LogOut className="mr-2 h-4 w-4" />
                Déconnexion
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
