import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  FileText, 
  TrendingUp, 
  Users, 
  Zap, 
  Brain,
  Sparkles,
  Wand2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface QuickAction {
  id: string;
  label: string;
  description: string;
  icon: React.ComponentType<any>;
  route?: string;
  priority: 'high' | 'medium' | 'low';
  category: 'create' | 'manage' | 'analyze' | 'ai';
  estimatedTime?: string;
}

export function SmartQuickActions() {
  const navigate = useNavigate();

  const quickActions: QuickAction[] = [
    {
      id: 'new-template',
      label: "Nouveau Template",
      description: "Créer un modèle avec l'IA",
      icon: Plus,
      route: '/documents/templates',
      priority: 'high',
      category: 'create',
      estimatedTime: '3 min'
    },
    {
      id: 'generate-doc',
      label: "Générer Document",
      description: "Création automatique",
      icon: FileText,
      route: '/documents/generator',
      priority: 'high',
      category: 'create',
      estimatedTime: '1 min'
    },
    {
      id: 'ai-optimize',
      label: "Optimisation IA",
      description: "Améliorer les templates existants",
      icon: Brain,
      priority: 'medium',
      category: 'ai',
      estimatedTime: '5 min'
    },
    {
      id: 'smart-analysis',
      label: "Analyse Intelligente",
      description: "Rapports et insights",
      icon: TrendingUp,
      priority: 'medium',
      category: 'analyze',
      estimatedTime: '2 min'
    },
    {
      id: 'bulk-generate',
      label: "Génération en Masse",
      description: "Traitement par lot",
      icon: Zap,
      priority: 'medium',
      category: 'create',
      estimatedTime: '10 min'
    },
    {
      id: 'ai-suggestions',
      label: "Suggestions IA",
      description: "Recommandations personnalisées",
      icon: Sparkles,
      priority: 'low',
      category: 'ai',
      estimatedTime: '1 min'
    }
  ];

  const handleAction = (action: QuickAction) => {
    if (action.route) {
      navigate(action.route);
    } else {
      // Handle other actions
      console.log(`Executing action: ${action.id}`);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500/10 text-red-600 dark:text-red-400';
      case 'medium': return 'bg-orange-500/10 text-orange-600 dark:text-orange-400';
      case 'low': return 'bg-green-500/10 text-green-600 dark:text-green-400';
      default: return 'bg-muted';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'create': return Plus;
      case 'manage': return Users;
      case 'analyze': return TrendingUp;
      case 'ai': return Wand2;
      default: return FileText;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Zap className="w-5 h-5 text-primary" />
          Actions Intelligentes
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {quickActions.map((action) => {
          const CategoryIcon = getCategoryIcon(action.category);
          return (
            <Button
              key={action.id}
              variant="ghost"
              className="w-full justify-start h-auto p-3 hover:bg-accent/50 transition-all duration-200 group"
              onClick={() => handleAction(action)}
            >
              <div className="flex items-start gap-3 w-full">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <action.icon className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 text-left space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">{action.label}</span>
                    {action.estimatedTime && (
                      <Badge variant="outline" className="text-xs h-5">
                        {action.estimatedTime}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {action.description}
                  </p>
                  <div className="flex items-center gap-2">
                    <div className={`px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(action.priority)}`}>
                      {action.priority}
                    </div>
                    <CategoryIcon className="w-3 h-3 text-muted-foreground" />
                  </div>
                </div>
              </div>
            </Button>
          );
        })}
        
        {/* AI Assistant Callout */}
        <div className="mt-4 p-3 bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg border border-primary/20">
          <div className="flex items-center gap-2 mb-2">
            <Brain className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Assistant IA</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Besoin d'aide ? L'IA peut vous suggérer les meilleures actions selon votre contexte.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}