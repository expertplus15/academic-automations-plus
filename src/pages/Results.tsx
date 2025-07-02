import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, Calculator, FileText, Award, TrendingUp, Users } from 'lucide-react';

export default function Results() {
  const features = [
    {
      title: "Interface Matricielle",
      description: "Saisie collaborative type Google Sheets avec édition simultanée",
      icon: BarChart3,
      color: "bg-blue-500",
      status: "En développement"
    },
    {
      title: "Bulletins Express",
      description: "Génération en moins de 5 secondes avec templates personnalisables",
      icon: FileText,
      color: "bg-green-500",
      status: "Bientôt disponible"
    },
    {
      title: "Calculs Avancés",
      description: "ECTS, compensations, moyennes pondérées automatiques",
      icon: Calculator,
      color: "bg-purple-500",
      status: "En développement"
    },
    {
      title: "Analytics Prédictifs",
      description: "IA pour prédiction des taux de réussite et alertes",
      icon: TrendingUp,
      color: "bg-orange-500",
      status: "Planifié"
    },
    {
      title: "Jurys Numériques",
      description: "Sessions de délibération et PV automatiques",
      icon: Award,
      color: "bg-red-500",
      status: "Planifié"
    },
    {
      title: "Relevés Officiels",
      description: "Format ministère avec signatures électroniques",
      icon: Users,
      color: "bg-indigo-500",
      status: "Planifié"
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">Évaluations & Résultats</h1>
          <p className="text-xl text-muted-foreground">Interface matricielle collaborative et bulletins ultra-rapides</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="bg-white rounded-2xl shadow-sm border-0 hover:shadow-lg transition-all duration-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${feature.color}`}>
                    <feature.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{feature.title}</h3>
                    <span className="text-xs text-muted-foreground">{feature.status}</span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-2xl shadow-lg border-0">
          <CardContent className="p-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">🚀 Révolution des Évaluations</h2>
              <p className="text-lg mb-6 text-white/90">
                Interface matricielle collaborative la plus avancée du marché éducatif
              </p>
              <div className="grid grid-cols-3 gap-8 text-center">
                <div>
                  <div className="text-3xl font-bold">{"< 5s"}</div>
                  <div className="text-white/80">Génération bulletins</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">100%</div>
                  <div className="text-white/80">Calculs automatiques</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">∞</div>
                  <div className="text-white/80">Utilisateurs simultanés</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}