import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Bell, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export function DashboardHeader() {
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

  return (
    <header className="bg-card border-b border-border/20 px-8 py-4">
      <div className="flex items-center justify-between">
        {/* Left side - Time, Date and Search */}
        <div className="flex items-center gap-6">
          <div className="text-left">
            <p className="text-xl font-bold text-foreground">{timeString}</p>
            <p className="text-sm text-muted-foreground">{dateString}</p>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher..."
              className="pl-10 w-80 h-10 bg-background/50 border-border/50 text-foreground"
            />
          </div>
        </div>

        {/* Right side - Notifications and Profile */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative p-2">
            <Bell className="w-5 h-5 text-muted-foreground" />
            <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 min-w-0 h-5">
              3
            </Badge>
          </Button>
          
          <Button variant="ghost" size="sm" className="relative p-2">
            <Bell className="w-5 h-5 text-muted-foreground" />
            <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 min-w-0 h-5">
              5
            </Badge>
          </Button>

          {/* User Profile */}
          <div className="flex items-center gap-3">
            <Avatar className="w-8 h-8">
              <AvatarImage src="/placeholder.svg" alt="John Doe" />
              <AvatarFallback className="bg-purple-500 text-white text-sm">JD</AvatarFallback>
            </Avatar>
            <div className="text-left">
              <p className="text-sm font-medium text-foreground">John Doe</p>
              <p className="text-xs text-muted-foreground">Admin</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}