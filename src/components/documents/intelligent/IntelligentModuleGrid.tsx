import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  Layout, 
  Archive,
  FileSignature, 
  Search,
  Settings,
  Bell,
  Send,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Zap,
  Brain,
  Users,
  BarChart3
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface DocumentModule {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  route: string;
  color: string;
  bgGradient: string;
  stats: {
    primary: string;
    secondary: string;
  };
  status: 'active' | 'maintenance' | 'new';
  alerts: number;
  aiFeatures?: string[];
  priority: 'high' | 'medium' | 'low';
}

export function IntelligentModuleGrid() {
  const navigate = useNavigate();
  const [hoveredModule, setHoveredModule] = useState<string | null>(null);

  const modules: DocumentModule[] = [
    {
      id: 'generator',
      title: "Générateur Intelligent",
      description: "Création automatique avec IA avancée",
      icon: FileText,
      route: '/documents/generator',
      color: "text-emerald-600",
      bgGradient: "from-emerald-500/10 to-green-500/10",
      stats: { primary: "234 docs", secondary: "Ce mois" },
      status: 'active',
      alerts: 0,
      aiFeatures: ["Génération IA", "Auto-validation", "Optimisation"],
      priority: 'high'
    },
    {
      id: 'templates',
      title: "Templates Avancés",
      description: "Gestion intelligente des modèles",
      icon: Layout,
      route: '/documents/templates',
      color: "text-blue-600",
      bgGradient: "from-blue-500/10 to-cyan-500/10",
      stats: { primary: "45 modèles", secondary: "12 catégories" },
      status: 'active',
      alerts: 1,
      aiFeatures: ["Template IA", "Auto-amélioration", "Suggestions"],
      priority: 'high'
    },
    {
      id: 'archives',
      title: "Archives Intelligentes",
      description: "Stockage et recherche IA",
      icon: Archive,
      route: '/documents/archives',
      color: "text-purple-600",
      bgGradient: "from-purple-500/10 to-pink-500/10",
      stats: { primary: "15,678 docs", secondary: "98% disponibilité" },
      status: 'active',
      alerts: 0,
      aiFeatures: ["Recherche IA", "Classification auto", "Indexation"],
      priority: 'medium'
    },
    {
      id: 'signatures',
      title: "Signatures Numériques",
      description: "Validation et workflow intelligent",
      icon: FileSignature,
      route: '/documents/signatures',
      color: "text-orange-600",
      bgGradient: "from-orange-500/10 to-red-500/10",
      stats: { primary: "156 en attente", secondary: "Workflow actif" },
      status: 'maintenance',
      alerts: 2,
      aiFeatures: ["Validation IA", "Workflow auto", "Anti-fraude"],
      priority: 'medium'
    },
    {
      id: 'search',
      title: "Recherche Avancée",
      description: "Moteur de recherche IA",
      icon: Search,
      route: '/documents/search',
      color: "text-teal-600",
      bgGradient: "from-teal-500/10 to-cyan-500/10",
      stats: { primary: "1,234 requêtes", secondary: "99% précision" },
      status: 'new',
      alerts: 0,
      aiFeatures: ["NLP Search", "Analyse sémantique", "Auto-complete"],
      priority: 'low'
    },
    {
      id: 'analytics',
      title: "Analytics & BI",
      description: "Intelligence d'affaires documentaire",
      icon: BarChart3,
      route: '/documents/analytics',
      color: "text-indigo-600",
      bgGradient: "from-indigo-500/10 to-purple-500/10",
      stats: { primary: "23% gain", secondary: "Productivité" },
      status: 'new',
      alerts: 0,
      aiFeatures: ["Prédictions IA", "Insights auto", "Optimisation"],
      priority: 'medium'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500/20 text-green-600 border-green-500/30">Actif</Badge>;
      case 'maintenance':
        return <Badge className="bg-orange-500/20 text-orange-600 border-orange-500/30">Maintenance</Badge>;
      case 'new':
        return <Badge className="bg-blue-500/20 text-blue-600 border-blue-500/30">Nouveau</Badge>;
      default:
        return null;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'maintenance': return <AlertCircle className="w-4 h-4 text-orange-500" />;
      case 'new': return <Zap className="w-4 h-4 text-blue-500" />;
      default: return null;
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Modules Documentaires</h2>
          <p className="text-sm text-muted-foreground">Hub intelligent avec IA intégrée</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-accent/20">
            <Brain className="w-3 h-3 mr-1" />
            IA Active
          </Badge>
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Personnaliser
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((module) => (
          <Card 
            key={module.id} 
            className={`
              group cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02] 
              border-border/50 bg-gradient-to-br ${module.bgGradient} backdrop-blur-sm
              ${hoveredModule === module.id ? 'ring-2 ring-primary/20' : ''}
            `}
            onMouseEnter={() => setHoveredModule(module.id)}
            onMouseLeave={() => setHoveredModule(null)}
            onClick={() => navigate(module.route)}
          >
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl bg-gradient-to-br from-background to-background/80 border border-border/50 shadow-sm`}>
                    <module.icon className={`w-5 h-5 ${module.color}`} />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                      {module.title}
                    </h3>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {module.alerts > 0 && (
                    <Badge className="bg-red-500/20 text-red-600 text-xs h-5 w-5 p-0 flex items-center justify-center">
                      {module.alerts}
                    </Badge>
                  )}
                  {getStatusIcon(module.status)}
                </div>
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground leading-relaxed">
                {module.description}
              </p>
              
              {/* Stats */}
              <div className="flex justify-between items-center p-3 bg-background/50 rounded-lg border border-border/30">
                <div>
                  <div className={`text-lg font-bold ${module.color}`}>
                    {module.stats.primary}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {module.stats.secondary}
                  </div>
                </div>
                {getStatusBadge(module.status)}
              </div>
              
              {/* AI Features */}
              {module.aiFeatures && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Brain className="w-3 h-3 text-primary" />
                    <span className="text-xs font-medium text-primary">Fonctions IA</span>
                  </div>
                  <div className="flex gap-1 flex-wrap">
                    {module.aiFeatures.map((feature, index) => (
                      <Badge 
                        key={index} 
                        variant="outline" 
                        className="text-xs px-2 py-0.5 bg-primary/5 text-primary/80 border-primary/20"
                      >
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Action Button */}
              <Button 
                className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all"
                variant="outline"
              >
                Accéder au module
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}