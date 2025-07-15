import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  ArrowRight, 
  Calculator, 
  Grid, 
  Settings, 
  TrendingUp,
  Zap,
  Clock,
  BarChart3,
  FileText
} from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useCalculationContext } from '@/contexts/CalculationContext';

interface NavigationQuickLinksProps {
  currentContext?: 'entry' | 'calculations' | 'results';
  showNotifications?: boolean;
}

export function NavigationQuickLinks({ 
  currentContext, 
  showNotifications = true 
}: NavigationQuickLinksProps) {
  const location = useLocation();
  const { 
    state, 
    notifications,
    navigateToCalculations,
    navigateToEntry,
    navigateToResults,
    executeCalculationWithNavigation
  } = useCalculationContext();

  const quickLinks = [
    {
      id: 'entry',
      title: 'Saisie des Notes',
      description: 'Interface matricielle collaborative',
      icon: <Grid className="w-4 h-4" />,
      action: navigateToEntry,
      badge: null,
      active: location.pathname === '/results/grade-entry'
    },
    {
      id: 'calculations',
      title: 'Calculs Avancés',
      description: 'Interface administrative complète',
      icon: <Calculator className="w-4 h-4" />,
      action: () => navigateToCalculations(),
      badge: notifications.hasActiveCalculations ? {
        text: notifications.getPendingNotifications().length.toString(),
        variant: 'default' as const
      } : null,
      active: location.pathname === '/results/calculations'
    },
    {
      id: 'analytics',
      title: 'Analyses & Rapports',
      description: 'Tableaux de bord et statistiques',
      icon: <BarChart3 className="w-4 h-4" />,
      action: navigateToResults,
      badge: null,
      active: location.pathname.includes('/results/analytics')
    },
    {
      id: 'documents',
      title: 'Documents & Export',
      description: 'Relevés, attestations et rapports',
      icon: <FileText className="w-4 h-4" />,
      action: () => navigateToResults(),
      badge: null,
      active: location.pathname.includes('/results/documents')
    }
  ];

  const contextualSuggestions = React.useMemo(() => {
    const detectedContext = currentContext || state.currentContext;
    
    switch (detectedContext) {
      case 'entry':
        return [
          { 
            text: 'Recalculer automatiquement', 
            action: () => navigateToCalculations('auto'),
            icon: <Zap className="w-3 h-3" />
          },
          { 
            text: 'Voir les analyses', 
            action: navigateToResults,
            icon: <TrendingUp className="w-3 h-3" />
          }
        ];
      case 'calculations':
        return [
          { 
            text: 'Retour à la saisie', 
            action: navigateToEntry,
            icon: <Grid className="w-3 h-3" />
          },
          { 
            text: 'Analyser les résultats', 
            action: navigateToResults,
            icon: <BarChart3 className="w-3 h-3" />
          }
        ];
      case 'results':
        return [
          { 
            text: 'Modifier les notes', 
            action: navigateToEntry,
            icon: <Grid className="w-3 h-3" />
          },
          { 
            text: 'Recalculer données', 
            action: () => navigateToCalculations('auto'),
            icon: <Calculator className="w-3 h-3" />
          }
        ];
      default:
        return [];
    }
  }, [currentContext, state.currentContext, navigateToCalculations, navigateToEntry, navigateToResults]);

  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Navigation principale */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-3">Navigation rapide</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
              {quickLinks.map((link) => (
                <Button
                  key={link.id}
                  variant={link.active ? "default" : "ghost"}
                  size="sm"
                  onClick={link.action}
                  className="justify-start h-auto p-3"
                >
                  <div className="flex items-center gap-2 w-full">
                    {link.icon}
                    <div className="flex-1 text-left">
                      <div className="font-medium text-xs">{link.title}</div>
                      <div className="text-xs text-muted-foreground">{link.description}</div>
                    </div>
                    {link.badge && (
                      <Badge variant={link.badge.variant} className="text-xs">
                        {link.badge.text}
                      </Badge>
                    )}
                  </div>
                </Button>
              ))}
            </div>
          </div>

          {/* Suggestions contextuelles */}
          {contextualSuggestions.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Actions suggérées</h3>
              <div className="flex gap-2 flex-wrap">
                {contextualSuggestions.map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={suggestion.action}
                    className="gap-1 text-xs"
                  >
                    {suggestion.icon}
                    {suggestion.text}
                    <ArrowRight className="w-3 h-3" />
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Notifications de calculs actifs */}
          {showNotifications && notifications.hasActiveCalculations && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Calculs en cours</h3>
              <div className="space-y-1">
                {notifications.getPendingNotifications().slice(0, 3).map((notification) => (
                  <div key={notification.id} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3 animate-pulse" />
                    <span>{notification.message}</span>
                    {notification.progress && (
                      <Badge variant="outline" className="text-xs">
                        {notification.progress}%
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}