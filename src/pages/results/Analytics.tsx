import { ModuleLayout } from "@/components/layouts/ModuleLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, BarChart3, PieChart, Clock } from "lucide-react";

export default function Analytics() {
  return (
    <ModuleLayout 
      title="Analytics & Insights" 
      subtitle="Analyse des performances et insights pédagogiques"
      showHeader={true}
    >
      <div className="p-6">
        <Tabs defaultValue="performance" className="space-y-6">
          <TabsList className="grid grid-cols-3 w-full max-w-lg">
            <TabsTrigger value="performance" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Performance
            </TabsTrigger>
            <TabsTrigger value="statistics" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Statistiques
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Historique
            </TabsTrigger>
          </TabsList>

          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Moyenne Générale</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">14.2</div>
                  <p className="text-xs text-muted-foreground">+0.3 vs mois dernier</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Taux de Réussite</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">87%</div>
                  <p className="text-xs text-muted-foreground">+2% vs mois dernier</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Notes Saisies</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,247</div>
                  <p className="text-xs text-muted-foreground">Ce mois-ci</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Bulletins Générés</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">156</div>
                  <p className="text-xs text-muted-foreground">Cette semaine</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-violet-500" />
                    Évolution des Moyennes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                    Graphique d'évolution des moyennes
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="w-5 h-5 text-blue-500" />
                    Répartition par Mention
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                    Graphique de répartition par mention
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="statistics" className="space-y-6">
            <h3 className="text-lg font-semibold">Statistiques Détaillées</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Par Matière</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Mathématiques</span>
                      <span className="font-medium">13.8</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Physique</span>
                      <span className="font-medium">14.2</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Chimie</span>
                      <span className="font-medium">14.6</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Par Niveau</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Licence 1</span>
                      <span className="font-medium">13.2</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Licence 2</span>
                      <span className="font-medium">14.1</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Licence 3</span>
                      <span className="font-medium">14.8</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <h3 className="text-lg font-semibold">Historique & Audit</h3>
            
            <Card>
              <CardHeader>
                <CardTitle>Activités Récentes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Notes saisies - Mathématiques L1</span>
                    </div>
                    <span className="text-xs text-muted-foreground">Il y a 5 min</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm">Bulletin généré - Jean Dupont</span>
                    </div>
                    <span className="text-xs text-muted-foreground">Il y a 15 min</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span className="text-sm">Validation effectuée - Physique L2</span>
                    </div>
                    <span className="text-xs text-muted-foreground">Il y a 30 min</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ModuleLayout>
  );
}