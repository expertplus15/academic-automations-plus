import React from 'react';
import { Users, Bell, User, ChevronDown, LogOut, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';
import { useAcademicYearContext } from '@/contexts/AcademicYearContext';
import { useNavigate } from 'react-router-dom';

export function StudentsPageHeader() {
  const { user, profile, signOut } = useAuth();
  const { selectedAcademicYear, setSelectedAcademicYear, academicYears } = useAcademicYearContext();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Erreur de déconnexion:', error);
    }
  };

  const getRoleDisplay = (role?: string) => {
    if (!role) return 'Utilisateur ExpertPlus';
    
    const roleMap: Record<string, string> = {
      'admin': 'Administrateur Expert',
      'teacher': 'Enseignant Expert', 
      'student': 'Étudiant Expert',
      'hr': 'RH Expert',
      'finance': 'Finance Expert'
    };
    
    return roleMap[role] || `${role} ExpertPlus`;
  };

  const getUserInitials = () => {
    if (profile?.full_name) {
      return profile.full_name.split(' ').map(n => n[0]).join('').toUpperCase();
    }
    if (user?.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
    return 'EX';
  };
  
  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6">
      {/* Left side - Logo and title */}
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-[#10b981] rounded-full flex items-center justify-center">
          <Users className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-lg font-semibold text-foreground">Students+</h1>
          <p className="text-sm text-muted-foreground">Gestion Intelligente des Étudiants</p>
        </div>
      </div>

      {/* Center - Academic year selector */}
      <div className="flex items-center gap-2 bg-muted px-4 py-2 rounded-lg">
        <span className="text-sm font-medium text-foreground">Année académique:</span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-auto p-1 text-sm font-medium">
              {selectedAcademicYear?.name || 'Sélectionner...'} <ChevronDown className="w-4 h-4 ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-background border border-border">
            {academicYears.length > 0 ? (
              academicYears.map((year) => (
                <DropdownMenuItem 
                  key={year.id}
                  onClick={() => setSelectedAcademicYear(year)}
                  className="cursor-pointer hover:bg-muted"
                >
                  <div className="flex items-center justify-between w-full">
                    <span>{year.name}</span>
                    {year.is_current && (
                      <Badge variant="secondary" className="text-xs ml-2">Actuelle</Badge>
                    )}
                  </div>
                </DropdownMenuItem>
              ))
            ) : (
              <DropdownMenuItem disabled>
                Aucune année académique disponible
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Right side - Navigation and user */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="relative hover:bg-muted transition-colors">
              <Bell className="w-5 h-5" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 text-xs bg-destructive text-destructive-foreground p-0 flex items-center justify-center">
                0
              </Badge>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 bg-background border border-border">
            <DropdownMenuLabel>Notifications étudiants</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="p-3 hover:bg-muted transition-colors">
              <div className="flex flex-col gap-1">
                <p className="text-sm font-medium">24 nouvelles inscriptions</p>
                <p className="text-xs text-muted-foreground">En attente de validation</p>
                <p className="text-xs text-muted-foreground">Il y a 2 min</p>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem className="p-3 hover:bg-muted transition-colors">
              <div className="flex flex-col gap-1">
                <p className="text-sm font-medium">12 documents manquants</p>
                <p className="text-xs text-muted-foreground">Rappel automatique envoyé</p>
                <p className="text-xs text-muted-foreground">Il y a 30 min</p>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem className="p-3 hover:bg-muted transition-colors">
              <div className="flex flex-col gap-1">
                <p className="text-sm font-medium">Alerte performance</p>
                <p className="text-xs text-muted-foreground">3 étudiants en difficulté détectés</p>
                <p className="text-xs text-muted-foreground">Il y a 1h</p>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User profile menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-3 p-2 hover:bg-muted transition-colors rounded-lg">
              <div className="flex flex-col text-right mr-1">
                <span className="text-sm font-medium text-foreground">
                  {profile?.full_name || user?.email || 'Utilisateur ExpertPlus'}
                </span>
                <span className="text-xs text-muted-foreground">
                  {getRoleDisplay(profile?.role)}
                </span>
              </div>
              <Avatar className="w-8 h-8">
                <AvatarImage src={profile?.avatar_url} alt={profile?.full_name || user?.email} />
                <AvatarFallback className="bg-[#10b981] text-white text-sm">
                  {getUserInitials()}
                </AvatarFallback>
              </Avatar>
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-background border border-border">
            <DropdownMenuLabel>Mon profil ExpertPlus</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => navigate('/profile')} 
              className="hover:bg-muted transition-colors"
            >
              <User className="mr-2 h-4 w-4" />
              Profil
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => navigate('/settings')} 
              className="hover:bg-muted transition-colors"
            >
              <Settings className="mr-2 h-4 w-4" />
              Paramètres
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={handleLogout} 
              className="text-destructive hover:bg-destructive/10 hover:text-destructive transition-colors"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Déconnexion
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}