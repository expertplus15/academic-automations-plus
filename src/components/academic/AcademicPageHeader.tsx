import React from 'react';
import { GraduationCap, Bell, User, ChevronDown, ArrowLeft, Eye, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export function AcademicPageHeader() {
  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6">
      {/* Left side - Logo and title */}
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-academic rounded-full flex items-center justify-center">
          <GraduationCap className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-lg font-semibold text-foreground">Academic+</h1>
          <p className="text-sm text-muted-foreground">Plateforme de Gestion Éducative</p>
        </div>
      </div>

      {/* Center - Academic year selector */}
      <div className="flex items-center gap-2 bg-muted px-4 py-2 rounded-lg">
        <span className="text-sm font-medium text-foreground">Année académique:</span>
        <Button variant="ghost" size="sm" className="h-auto p-1 text-sm font-medium">
          2024-2025 <ChevronDown className="w-4 h-4 ml-1" />
        </Button>
      </div>

      {/* Right side - Navigation and user */}
      <div className="flex items-center gap-4">
        {/* Navigation buttons */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
          <Button variant="ghost" size="sm">
            <Eye className="w-4 h-4 mr-2" />
            Vue
          </Button>
          <Button variant="ghost" size="sm">
            <BarChart3 className="w-4 h-4 mr-2" />
            Stats
          </Button>
        </div>

        {/* Notifications */}
        <div className="relative">
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="w-5 h-5" />
            <Badge className="absolute -top-1 -right-1 h-5 w-5 text-xs bg-destructive text-destructive-foreground p-0 flex items-center justify-center">
              3
            </Badge>
          </Button>
        </div>

        {/* User profile */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-academic rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-white">JD</span>
          </div>
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        </div>
      </div>
    </header>
  );
}