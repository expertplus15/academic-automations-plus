import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  GraduationCap, 
  Users, 
  Calendar, 
  FileText,
  BarChart3,
  Shield,
  Zap,
  ArrowRight,
  LogIn,
  UserPlus
} from 'lucide-react';

const Index = () => {
  const features = [
    {
      icon: Users,
      title: "Gestion Étudiants",
      description: "Inscription automatisée < 30s, profils complets et suivi en temps réel",
      color: "bg-students",
      badge: "Signature",
      href: "/students"
    },
    {
      icon: GraduationCap,
      title: "Module Académique", 
      description: "Programmes, matières, emplois du temps intelligents avec IA",
      color: "bg-primary",
      badge: "IA Intégrée",
      href: "/academic"
    },
    {
      icon: Calendar,
      title: "Examens & Planning",
      description: "Planification automatique des examens et gestion des conflits",
      color: "bg-secondary",
      badge: "Auto",
      href: "/exams"
    },
    {
      icon: BarChart3,
      title: "Analytics Avancées",
      description: "Tableaux de bord interactifs et rapports personnalisés",
      color: "bg-accent",
      badge: "Pro",
      href: "/results"
    },
    {
      icon: FileText,
      title: "Documents Intelligents",
      description: "Génération automatique de certificats et attestations",
      color: "bg-muted",
      badge: "Smart",
      href: "/documents"
    },
    {
      icon: Shield,
      title: "Sécurité Renforcée",
      description: "Authentification avancée et contrôle d'accès granulaire",
      color: "bg-destructive",
      badge: "Sécurisé",
      href: "/settings"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center space-y-8">
            <div className="flex items-center justify-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/60 rounded-2xl flex items-center justify-center shadow-lg">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
            </div>
            
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Academic Automations+
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
                La plateforme de gestion académique la plus avancée. 
                Automatisation intelligente, insights temps réel, gestion complète.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Badge variant="secondary" className="text-sm px-4 py-2">
                <Zap className="w-4 h-4 mr-2" />
                Inscription &lt; 30 secondes
              </Badge>
              <Badge variant="outline" className="text-sm px-4 py-2">
                IA Intégrée
              </Badge>
              <Badge variant="outline" className="text-sm px-4 py-2">
                Temps Réel
              </Badge>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
              <Button size="lg" asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Link to="/login">
                  <LogIn className="w-5 h-5 mr-2" />
                  Se Connecter
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/signup">
                  <UserPlus className="w-5 h-5 mr-2" />
                  Créer un Compte
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Modules Intégrés
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Une suite complète d'outils pour moderniser votre gestion académique
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${feature.color} shadow-lg`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {feature.badge}
                  </Badge>
                </div>
                <CardTitle className="text-xl group-hover:text-primary transition-colors">
                  {feature.title}
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  {feature.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="ghost" className="w-full justify-between group-hover:bg-primary/5" asChild>
                  <Link to={feature.href}>
                    Découvrir
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary/5 border-t">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Prêt à transformer votre gestion académique ?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Rejoignez les établissements qui ont choisi l'excellence avec Academic Automations+
          </p>
          <Button size="lg" asChild className="bg-primary hover:bg-primary/90">
            <Link to="/signup">
              Commencer Maintenant
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
