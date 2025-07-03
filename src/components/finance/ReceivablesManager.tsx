import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { 
  AlertTriangle, 
  Clock, 
  CheckCircle, 
  Target,
  TrendingUp,
  Users,
  Euro,
  Calendar
} from 'lucide-react';

export function ReceivablesManager() {
  const { toast } = useToast();

  const handleAction = (studentName: string) => {
    toast({
      title: "Action Lancée",
      description: `Procédure de recouvrement initiée pour ${studentName}`,
    });
  };

  const handleRecommendation = (studentName: string, action: string) => {
    toast({
      title: "Recommandation Appliquée",
      description: `${action} appliquée pour ${studentName}`,
    });
  };
  const receivablesByAge = [
    { range: "0-30j", amount: "€45,200", count: 23, percentage: 38, status: "current" },
    { range: "31-60j", amount: "€28,500", count: 15, percentage: 24, status: "attention" },
    { range: "61-90j", amount: "€19,800", count: 8, percentage: 17, status: "warning" },
    { range: ">90j", amount: "€25,100", count: 12, percentage: 21, status: "critical" }
  ];

  const topDebtors = [
    { name: "Martin Dubois", amount: "€8,500", days: 45, risk: "medium", contact: "Relance envoyée" },
    { name: "Sophie Laurent", amount: "€6,200", days: 78, risk: "high", contact: "Appel prévu" },
    { name: "Jean Moreau", amount: "€4,800", days: 23, risk: "low", contact: "RAS" },
    { name: "Claire Rousseau", amount: "€7,100", days: 92, risk: "critical", contact: "Avocat contacté" }
  ];

  const aiRecommendations = [
    {
      student: "Martin Dubois",
      action: "Relance amiable + plan de paiement",
      priority: "high",
      success_rate: "85%",
      estimated_recovery: "€7,500"
    },
    {
      student: "Sophie Laurent", 
      action: "Contact téléphonique + négociation",
      priority: "critical",
      success_rate: "72%",
      estimated_recovery: "€5,200"
    },
    {
      student: "Jean Moreau",
      action: "Rappel email simple",
      priority: "low", 
      success_rate: "95%",
      estimated_recovery: "€4,800"
    }
  ];

  const recoveryStats = [
    { period: "Cette semaine", recovered: "€12,400", target: "€15,000", rate: 82 },
    { period: "Ce mois", recovered: "€45,200", target: "€50,000", rate: 90 },
    { period: "Ce trimestre", recovered: "€128,500", target: "€140,000", rate: 92 }
  ];

  return (
    <div className="space-y-6">
      {/* Vue d'ensemble par échéances */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {receivablesByAge.map((item, index) => (
          <Card key={index}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center justify-between">
                {item.range}
                <Badge variant={
                  item.status === 'current' ? 'default' :
                  item.status === 'attention' ? 'secondary' :
                  item.status === 'warning' ? 'destructive' : 'destructive'
                }>
                  {item.count}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{item.amount}</div>
              <Progress value={item.percentage} className="mt-2" />
              <span className="text-xs text-muted-foreground">{item.percentage}% du total</span>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="analysis" className="space-y-4">
        <TabsList>
          <TabsTrigger value="analysis">Analyse Détaillée</TabsTrigger>
          <TabsTrigger value="debtors">Top Débiteurs</TabsTrigger>
          <TabsTrigger value="ai-recommendations">Recommandations IA</TabsTrigger>
          <TabsTrigger value="recovery">Suivi Recouvrement</TabsTrigger>
        </TabsList>

        <TabsContent value="analysis" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-500" />
                  Évolution Mensuelle
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>Créances totales</span>
                    <span className="font-bold">€118,600</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-green-600">Recouvrements</span>
                    <span className="font-bold text-green-600">€45,200</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-red-600">Nouvelles créances</span>
                    <span className="font-bold text-red-600">€38,100</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between items-center">
                      <span>Variation</span>
                      <span className="font-bold text-red-600">-€7,100</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-purple-500" />
                  Objectifs de Recouvrement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recoveryStats.map((stat, index) => (
                    <div key={index}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{stat.period}</span>
                        <span>{stat.recovered} / {stat.target}</span>
                      </div>
                      <Progress value={stat.rate} />
                      <div className="text-right text-xs text-muted-foreground mt-1">
                        {stat.rate}% atteint
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="debtors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-orange-500" />
                Débiteurs Prioritaires
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topDebtors.map((debtor, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium">{debtor.name}</div>
                      <div className="text-sm text-muted-foreground">{debtor.contact}</div>
                    </div>
                    <div className="text-center px-4">
                      <div className="font-bold">{debtor.amount}</div>
                      <div className="text-xs text-muted-foreground">{debtor.days} jours</div>
                    </div>
                    <div className="text-center">
                      <Badge variant={
                        debtor.risk === 'low' ? 'default' :
                        debtor.risk === 'medium' ? 'secondary' :
                        debtor.risk === 'high' ? 'destructive' : 'destructive'
                      }>
                        {debtor.risk}
                      </Badge>
                    </div>
                    <Button size="sm" className="ml-4" onClick={() => handleAction(debtor.name)}>
                      Action
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai-recommendations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-green-500" />
                Recommandations Intelligence Artificielle
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {aiRecommendations.map((rec, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="font-medium">{rec.student}</div>
                        <div className="text-sm text-muted-foreground">{rec.action}</div>
                      </div>
                      <Badge variant={
                        rec.priority === 'critical' ? 'destructive' :
                        rec.priority === 'high' ? 'default' : 'secondary'
                      }>
                        {rec.priority}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Taux de succès:</span>
                        <span className="ml-2 font-medium text-green-600">{rec.success_rate}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Recouvrement estimé:</span>
                        <span className="ml-2 font-medium">{rec.estimated_recovery}</span>
                      </div>
                    </div>
                    <Button size="sm" className="mt-3 w-full" onClick={() => handleRecommendation(rec.student, rec.action)}>
                      Appliquer la Recommandation
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recovery" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  Actions Automatiques
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Relances envoyées:</span>
                    <span className="font-medium">47</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Appels programmés:</span>
                    <span className="font-medium">12</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Plans proposés:</span>
                    <span className="font-medium">8</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-500" />
                  Échéances Prochaines
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Aujourd'hui:</span>
                    <span className="font-medium">€3,200</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cette semaine:</span>
                    <span className="font-medium">€8,500</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Ce mois:</span>
                    <span className="font-medium">€24,100</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Euro className="w-5 h-5 text-purple-500" />
                  Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Taux de recouvrement:</span>
                    <span className="font-medium text-green-600">89%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Délai moyen:</span>
                    <span className="font-medium">12j</span>
                  </div>
                  <div className="flex justify-between">
                    <span>ROI recouvrement:</span>
                    <span className="font-medium text-green-600">340%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}