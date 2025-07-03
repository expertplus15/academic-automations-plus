import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { TreasuryDashboard } from '@/components/finance/TreasuryDashboard';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle, 
  ArrowUpDown,
  Calendar,
  Wallet,
  PieChart,
  CreditCard,
  Users,
  Euro,
  Target,
  Clock,
  Plus
} from 'lucide-react';

export function TreasuryPaymentsHub() {
  const { toast } = useToast();

  const handlePaymentAction = (action: string) => {
    toast({
      title: "Action Paiement",
      description: `Module ${action} ouvert`,
    });
  };

  const paymentMethods = [
    { name: "Cartes Bancaires", amount: "€45,200", count: 127, growth: "+8%" },
    { name: "Virements SEPA", amount: "€89,400", count: 89, growth: "+12%" },
    { name: "Prélèvements", amount: "€156,800", count: 234, growth: "+5%" },
    { name: "Espèces", amount: "€8,900", count: 45, growth: "-2%" },
    { name: "Chèques", amount: "€12,300", count: 23, growth: "-8%" }
  ];

  const recentPayments = [
    {
      id: "PAY-2024-0234",
      student: "Marie Dubois",
      amount: "€2,500",
      method: "Carte bancaire",
      status: "completed",
      date: "2024-03-15"
    },
    {
      id: "PAY-2024-0235", 
      student: "Jean Martin",
      amount: "€1,800",
      method: "Virement",
      status: "pending",
      date: "2024-03-18"
    },
    {
      id: "PAY-2024-0236",
      student: "Sophie Laurent",
      amount: "€3,200",
      method: "Prélèvement",
      status: "failed",
      date: "2024-03-20"
    }
  ];

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-700 border-green-200"><CheckCircle className="w-3 h-3 mr-1" />Terminé</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200"><Clock className="w-3 h-3 mr-1" />En cours</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-700 border-red-200"><AlertTriangle className="w-3 h-3 mr-1" />Échec</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="payments">Hub Paiements</TabsTrigger>
          <TabsTrigger value="predictions">Prédictions IA</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <TreasuryDashboard />
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
          {/* Moyens de paiement */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {paymentMethods.map((method, index) => (
              <Card key={index}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">{method.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{method.amount}</div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm text-muted-foreground">{method.count} transactions</span>
                    <span className={`text-sm flex items-center gap-1 ${
                      method.growth.startsWith('+') ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {method.growth.startsWith('+') ? 
                        <TrendingUp className="w-3 h-3" /> : 
                        <TrendingDown className="w-3 h-3" />
                      }
                      {method.growth}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Actions rapides paiements */}
          <Card>
            <CardHeader>
              <CardTitle>Actions Paiements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Button onClick={() => handlePaymentAction('Encaissement')} className="h-auto p-4 flex flex-col gap-2">
                  <CreditCard className="w-6 h-6" />
                  <span>Encaissement</span>
                </Button>
                <Button onClick={() => handlePaymentAction('Prélèvement')} variant="outline" className="h-auto p-4 flex flex-col gap-2">
                  <ArrowUpDown className="w-6 h-6" />
                  <span>Prélèvement</span>
                </Button>
                <Button onClick={() => handlePaymentAction('Remboursement')} variant="outline" className="h-auto p-4 flex flex-col gap-2">
                  <Target className="w-6 h-6" />
                  <span>Remboursement</span>
                </Button>
                <Button onClick={() => handlePaymentAction('Réconciliation')} variant="outline" className="h-auto p-4 flex flex-col gap-2">
                  <CheckCircle className="w-6 h-6" />
                  <span>Réconciliation</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Paiements récents */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-blue-500" />
                Paiements Récents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentPayments.map((payment, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 rounded-xl border border-border/50 hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-blue-500/10 rounded-lg">
                        <CreditCard className="w-4 h-4 text-blue-500" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{payment.id}</p>
                        <p className="text-sm text-muted-foreground">{payment.student}</p>
                        <p className="text-xs text-muted-foreground">{payment.method}</p>
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <p className="font-semibold text-foreground">{payment.amount}</p>
                      <div className="flex items-center gap-2">
                        {getPaymentStatusBadge(payment.status)}
                        <span className="text-xs text-muted-foreground">
                          {payment.date}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="predictions" className="space-y-4">
          {/* Prédictions avancées */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                  Prédictions Encaissements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>7 prochains jours</span>
                    <span className="font-bold text-green-600">€125,400</span>
                  </div>
                  <Progress value={85} className="h-2" />
                  <div className="text-sm text-muted-foreground">Confiance: 85%</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-orange-500" />
                  Alertes Prédictives
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                    <p className="text-sm font-medium text-orange-700">Risque de retard</p>
                    <p className="text-xs text-orange-600">12 paiements à risque cette semaine</p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm font-medium text-blue-700">Pic d'activité prévu</p>
                    <p className="text-xs text-blue-600">Vendredi: +40% de transactions</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Analytics avancées */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="w-5 h-5 text-purple-500" />
                Analytics Comportementaux
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">78%</div>
                  <div className="text-sm text-muted-foreground">Taux de succès prédictif</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">3.2j</div>
                  <div className="text-sm text-muted-foreground">Délai moyen de paiement</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">92%</div>
                  <div className="text-sm text-muted-foreground">Satisfaction clients</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}