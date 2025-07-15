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
  Clock
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCalculationNotifications } from '@/hooks/useCalculationNotifications';

interface NavigationQuickLinksProps {
  currentContext?: 'entry' | 'calculations' | 'results';
  showNotifications?: boolean;
}

export function NavigationQuickLinks({ 
  currentContext, 
  showNotifications = true 
}: NavigationQuickLinksProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { notifications, hasActiveCalculations, getPendingNotifications } = useCalculationNotifications();

  const quickLinks = [
    {
      id: 'entry',
      title: 'Saisie des Notes',
      description: 'Interface matricielle collaborative',
      icon: <Grid className="w-4 h-4" />,
      path: '/results/grade-entry',
      badge: null,
      active: location.pathname === '/results/grade-entry'
    },
    {
      id: 'calculations',
      title: 'Calculs Avancés',
      description: 'Interface administrative complète',
      icon: <Calculator className="w-4 h-4" />,
      path: '/results/calculations',
      badge: hasActiveCalculations ? {
        text: getPendingNotifications().length.toString(),
        variant: 'default' as const
      } : null,
      active: location.pathname === '/results/calculations'
    },
    {
      id: 'system',
      title: 'Système de Notation',
      description: 'Configuration et paramètres',
      icon: <Settings className="w-4 h-4" />,
      path: '/results/grading-system',
      badge: null,
      active: location.pathname === '/results/grading-system'
    },
    {
      id: 'analytics',
      title: 'Analyse & Contrôle',
      description: 'Tableaux de bord et rapports',
      icon: <TrendingUp className="w-4 h-4" />,
      path: '/results/analytics',
      badge: null,
      active: location.pathname === '/results/analytics'
    }
  ];

  const contextualSuggestions = React.useMemo(() => {
    switch (currentContext) {
      case 'entry':
        return [
          { 
            text: 'Recalculer après saisie', 
            path: '/results/calculations',
            icon: <Zap className="w-3 h-3" />
          },
          { 
            text: 'Voir les résultats', 
            path: '/results/analytics',
            icon: <TrendingUp className="w-3 h-3" />
          }
        ];
      case 'calculations':
        return [
          { 
            text: 'Retour à la saisie', 
            path: '/results/grade-entry',
            icon: <Grid className="w-3 h-3" />
          },
          { 
            text: 'Analyser les résultats', 
            path: '/results/analytics',
            icon: <TrendingUp className="w-3 h-3" />
          }
        ];
      case 'results':
        return [
          { 
            text: 'Modifier les notes', 
            path: '/results/grade-entry',
            icon: <Grid className="w-3 h-3" />
          },
          { 
            text: 'Recalculer', 
            path: '/results/calculations',
            icon: <Calculator className="w-3 h-3" />
          }
        ];
      default:
        return [];
    }
  }, [currentContext]);

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
                  onClick={() => navigate(link.path)}
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
                    onClick={() => navigate(suggestion.path)}
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
          {showNotifications && hasActiveCalculations && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Calculs en cours</h3>
              <div className="space-y-1">
                {getPendingNotifications().slice(0, 3).map((notification) => (
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