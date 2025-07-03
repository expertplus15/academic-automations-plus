import { ModuleLayout } from "@/components/layouts/ModuleLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, Lightbulb, TrendingDown, TrendingUp, AlertCircle, Zap } from "lucide-react";

export default function Insights() {
  return (
    <ModuleLayout 
      title="Insights Pédagogiques" 
      subtitle="Intelligence artificielle et prédictions pour l'accompagnement des étudiants"
      showHeader={true}
    >
      <div className="p-6 space-y-6">
        {/* AI Insights Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Brain className="w-4 h-4 text-purple-500" />
                Prédictions IA
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">23</div>
              <p className="text-xs text-muted-foreground">étudiants à risque</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-500" />
                Recommandations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-600">47</div>
              <p className="text-xs text-muted-foreground">actions suggérées</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Zap className="w-4 h-4 text-emerald-500" />
                Précision
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-600">94.2%</div>
              <p className="text-xs text-muted-foreground">modèle IA</p>
            </CardContent>
          </Card>
        </div>

        {/* Risk Predictions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              Étudiants à Risque
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg bg-red-50 border-red-200">
                <div>
                  <p className="font-medium">Marie Dupont - L3 Commerce</p>
                  <p className="text-sm text-muted-foreground">Baisse constante depuis 3 mois</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="destructive">Risque élevé (87%)</Badge>
                  <Button size="sm">Intervenir</Button>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg bg-orange-50 border-orange-200">
                <div>
                  <p className="font-medium">Paul Martin - Master 1</p>
                  <p className="text-sm text-muted-foreground">Absences répétées en maths</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">Risque modéré (64%)</Badge>
                  <Button size="sm" variant="outline">Surveiller</Button>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg bg-yellow-50 border-yellow-200">
                <div>
                  <p className="font-medium">Sophie Bernard - BTS</p>
                  <p className="text-sm text-muted-foreground">Difficultés émergentes</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Risque faible (32%)</Badge>
                  <Button size="sm" variant="outline">Accompagner</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Performance Trends */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-500" />
                Tendances Positives
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                  <p className="font-medium text-emerald-800">Master Management</p>
                  <p className="text-sm text-emerald-600">+15% de réussite sur le semestre</p>
                </div>
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                  <p className="font-medium text-emerald-800">Mathématiques L2</p>
                  <p className="text-sm text-emerald-600">Amélioration significative des moyennes</p>
                </div>
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                  <p className="font-medium text-emerald-800">Cours d'Anglais</p>
                  <p className="text-sm text-emerald-600">Participation en hausse de 23%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingDown className="w-5 h-5 text-red-500" />
                Points d'Attention
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="font-medium text-red-800">Économie BTS</p>
                  <p className="text-sm text-red-600">Taux d'échec en augmentation</p>
                </div>
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="font-medium text-red-800">Informatique L3</p>
                  <p className="text-sm text-red-600">Absentéisme problématique</p>
                </div>
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="font-medium text-red-800">Projet fin d'études</p>
                  <p className="text-sm text-red-600">Retards dans les rendus</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-amber-500" />
              Recommandations IA
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 border rounded-lg">
                <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
                <div className="flex-1">
                  <p className="font-medium">Renforcer le suivi en Économie</p>
                  <p className="text-sm text-muted-foreground mb-2">
                    Mettre en place des séances de tutorat pour les étudiants BTS identifiés comme fragiles.
                  </p>
                  <Button size="sm">Planifier tutorat</Button>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 border rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <div className="flex-1">
                  <p className="font-medium">Optimiser les créneaux de cours</p>
                  <p className="text-sm text-muted-foreground mb-2">
                    Déplacer les cours d'informatique L3 en matinée pour réduire l'absentéisme.
                  </p>
                  <Button size="sm" variant="outline">Voir planning</Button>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 border rounded-lg">
                <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                <div className="flex-1">
                  <p className="font-medium">Reproduire les bonnes pratiques</p>
                  <p className="text-sm text-muted-foreground mb-2">
                    Appliquer la méthode pédagogique du Master Management aux autres formations.
                  </p>
                  <Button size="sm" variant="outline">Analyser méthode</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ModuleLayout>
  );
}