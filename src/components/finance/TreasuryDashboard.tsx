import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle, 
  ArrowUpDown,
  Calendar,
  Wallet,
  PieChart
} from 'lucide-react';

export function TreasuryDashboard() {
  const { toast } = useToast();

  const handleVirement = () => {
    toast({
      title: "Module Virement",
      description: "Interface de virement bancaire ouverte",
    });
  };

  const handlePlanifier = () => {
    toast({
      title: "Planification",
      description: "Calendrier des échéances et prévisions ouvert",
    });
  };

  const handleAnalyse = () => {
    toast({
      title: "Analyse Trésorerie",
      description: "Rapport d'analyse détaillé généré",
    });
  };

  const handlePlacement = () => {
    toast({
      title: "Gestion Placements",
      description: "Module de gestion des placements financiers ouvert",
    });
  };
  const accounts = [
    { name: "Compte Principal BNP", balance: "€1,240,000", trend: "+5.2%", status: "healthy" },
    { name: "Compte Épargne", balance: "€580,000", trend: "+1.8%", status: "stable" },
    { name: "Compte Projet", balance: "€125,000", trend: "-2.1%", status: "warning" },
    { name: "Livret A", balance: "€50,000", trend: "+0.8%", status: "stable" }
  ];

  const predictions = [
    { period: "J+7", inflow: "€450K", outflow: "€380K", net: "€70K", confidence: 95 },
    { period: "J+30", inflow: "€1.2M", outflow: "€980K", net: "€220K", confidence: 88 },
    { period: "J+90", inflow: "€3.5M", outflow: "€2.8M", net: "€700K", confidence: 75 }
  ];

  const alerts = [
    { type: "info", message: "Échéance importante dans 3 jours - €125K", priority: "medium" },
    { type: "success", message: "Virement programmé confirmé - €80K", priority: "low" },
    { type: "warning", message: "Seuil de sécurité approché sur Compte Projet", priority: "high" }
  ];

  return (
    <div className="space-y-6">
      {/* Vue consolidée des comptes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {accounts.map((account, index) => (
          <Card key={index}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">{account.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{account.balance}</div>
              <div className="flex items-center justify-between mt-2">
                <span className={`text-sm flex items-center gap-1 ${
                  account.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'
                }`}>
                  {account.trend.startsWith('+') ? 
                    <TrendingUp className="w-3 h-3" /> : 
                    <TrendingDown className="w-3 h-3" />
                  }
                  {account.trend}
                </span>
                <Badge variant={
                  account.status === 'healthy' ? 'default' :
                  account.status === 'warning' ? 'destructive' : 'secondary'
                }>
                  {account.status}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Prédictions IA */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            Prédictions Trésorerie IA
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {predictions.map((pred, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{pred.period}</span>
                  <Badge variant="outline">Conf. {pred.confidence}%</Badge>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-green-600">Entrées:</span>
                    <span className="font-medium">{pred.inflow}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-red-600">Sorties:</span>
                    <span className="font-medium">{pred.outflow}</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between font-semibold">
                      <span>Net:</span>
                      <span className={pred.net.startsWith('€-') ? 'text-red-600' : 'text-green-600'}>
                        {pred.net}
                      </span>
                    </div>
                  </div>
                </div>
                <Progress value={pred.confidence} className="mt-3" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Alertes et notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            Alertes Trésorerie
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {alerts.map((alert, index) => (
              <div key={index} className={`p-3 rounded-lg border-l-4 ${
                alert.type === 'warning' ? 'border-l-orange-500 bg-orange-50' :
                alert.type === 'success' ? 'border-l-green-500 bg-green-50' :
                'border-l-blue-500 bg-blue-50'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="text-sm">{alert.message}</span>
                  <Badge variant={
                    alert.priority === 'high' ? 'destructive' :
                    alert.priority === 'medium' ? 'default' : 'secondary'
                  }>
                    {alert.priority}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Actions rapides */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Button onClick={handleVirement} className="h-auto p-4 flex flex-col gap-2">
          <ArrowUpDown className="w-6 h-6" />
          <span>Virement</span>
        </Button>
        <Button onClick={handlePlanifier} variant="outline" className="h-auto p-4 flex flex-col gap-2">
          <Calendar className="w-6 h-6" />
          <span>Planifier</span>
        </Button>
        <Button onClick={handleAnalyse} variant="outline" className="h-auto p-4 flex flex-col gap-2">
          <PieChart className="w-6 h-6" />
          <span>Analyse</span>
        </Button>
        <Button onClick={handlePlacement} variant="outline" className="h-auto p-4 flex flex-col gap-2">
          <Wallet className="w-6 h-6" />
          <span>Placement</span>
        </Button>
      </div>
    </div>
  );
}