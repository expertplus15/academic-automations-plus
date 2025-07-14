import React from 'react';
import { RealTimeMetrics } from './RealTimeMetrics';
import { SmartQuickActions } from './SmartQuickActions';
import { ActivityFeed } from './ActivityFeed';
import { IntelligentModuleGrid } from './IntelligentModuleGrid';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, TrendingUp, Users, Clock } from 'lucide-react';

export function IntelligentDashboard() {
  return (
    <div className="space-y-6">
      {/* Hero Section with Real-time Overview */}
      <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl p-6 border border-border/50">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Hub Documentaire Intelligent</h1>
              <p className="text-muted-foreground">Tableau de bord centralisé avec intelligence artificielle</p>
            </div>
          </div>
          <Badge variant="outline" className="bg-accent/20">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
            Temps réel
          </Badge>
        </div>
        
        <RealTimeMetrics />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        
        {/* Primary Content - 3 columns */}
        <div className="xl:col-span-3 space-y-6">
          
          {/* Intelligent Suggestions Bar */}
          <Card className="border-accent/20 bg-card/50">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingUp className="w-5 h-5 text-accent" />
                Suggestions Intelligentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3 flex-wrap">
                <Badge variant="secondary" className="cursor-pointer hover:bg-accent/20 transition-colors">
                  📊 Générer rapport mensuel
                </Badge>
                <Badge variant="secondary" className="cursor-pointer hover:bg-accent/20 transition-colors">
                  📋 Créer template bulletin
                </Badge>
                <Badge variant="secondary" className="cursor-pointer hover:bg-accent/20 transition-colors">
                  ⚡ Optimiser workflow
                </Badge>
                <Badge variant="outline" className="cursor-pointer hover:bg-muted/50 transition-colors">
                  🔍 Analyser usage templates
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Intelligent Module Grid */}
          <IntelligentModuleGrid />
          
          {/* Smart Analytics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Analyse Intelligente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">+23%</div>
                  <div className="text-sm text-muted-foreground">Productivité ce mois</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">-45%</div>
                  <div className="text-sm text-muted-foreground">Temps de traitement</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">98.5%</div>
                  <div className="text-sm text-muted-foreground">Taux de satisfaction</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - 1 column */}
        <div className="space-y-6">
          <SmartQuickActions />
          <ActivityFeed />
          
          {/* Smart System Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Clock className="w-5 h-5 text-primary" />
                État du Système
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Services actifs</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="text-sm font-medium">8/8</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">IA Assistant</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-sm font-medium">En ligne</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Charge système</span>
                <span className="text-sm font-medium text-green-600">Optimal</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Dernière sauvegarde</span>
                <span className="text-sm font-medium">Il y a 2min</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}