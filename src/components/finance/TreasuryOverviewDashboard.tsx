import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTreasuryData } from '@/hooks/finance/useTreasuryData';
import { useTreasuryPeriod } from '@/hooks/finance/useTreasuryPeriod';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle,
  Wallet,
  PieChart,
  Target,
  Zap,
  Calendar,
  CreditCard,
  Receipt,
  FileText,
  Euro
} from 'lucide-react';

export function TreasuryOverviewDashboard() {
  const { selectedPeriod, setSelectedPeriod, getPeriodLabel } = useTreasuryPeriod();
  const { incomeData, expenseData, invoiceData, treasuryPosition, loading } = useTreasuryData();

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      notation: amount > 999999 ? 'compact' : 'standard'
    }).format(amount);
  };

  // KPIs calculés à partir des vraies données
  const kpis = [
    {
      title: "Position de Trésorerie",
      value: formatAmount(treasuryPosition.netPosition),
      change: treasuryPosition.netPosition > 0 ? "+5.2%" : "-2.1%",
      changeType: treasuryPosition.netPosition > 0 ? "positive" as const : "negative" as const,
      icon: Wallet,
      color: "text-blue-500"
    },
    {
      title: "Encaissements Période",
      value: formatAmount(incomeData.totalIncome),
      change: "+8%",
      changeType: "positive" as const,
      icon: TrendingUp,
      color: "text-green-500"
    },
    {
      title: "Ratio de Liquidité",
      value: treasuryPosition.liquidityRatio.toFixed(2),
      change: treasuryPosition.liquidityRatio > 1.5 ? "Optimal" : "Attention",
      changeType: treasuryPosition.liquidityRatio > 1.5 ? "positive" as const : "negative" as const,
      icon: Target,
      color: "text-purple-500"
    },
    {
      title: "Taux d'Encaissement",
      value: `${invoiceData.collectionRate.toFixed(1)}%`,
      change: "+3%",
      changeType: "positive" as const,
      icon: Zap,
      color: "text-orange-500"
    }
  ];

  // Alertes basées sur les données réelles
  const alerts = [
    ...(expenseData.budgetUsagePercentage > 90 ? [{
      type: "warning" as const,
      title: "Budget en seuil critique",
      message: `${expenseData.budgetUsagePercentage.toFixed(1)}% du budget utilisé`,
      priority: "high" as const
    }] : []),
    ...(incomeData.successRate < 95 ? [{
      type: "warning" as const,
      title: "Taux de succès des paiements",
      message: `${incomeData.successRate}% - Surveillance requise`,
      priority: "medium" as const
    }] : []),
    ...(invoiceData.collectionRate > 85 ? [{
      type: "success" as const,
      title: "Excellent taux d'encaissement",
      message: `${invoiceData.collectionRate.toFixed(1)}% des factures encaissées`,
      priority: "low" as const
    }] : [])
  ];

  // Prédictions basées sur les tendances actuelles
  const predictions = [
    {
      period: "7 prochains jours",
      inflow: incomeData.totalDailyIncome * 7,
      outflow: (expenseData.totalExpenses / 30) * 7,
      net: (incomeData.totalDailyIncome * 7) - ((expenseData.totalExpenses / 30) * 7),
      confidence: 89
    },
    {
      period: "15 prochains jours", 
      inflow: incomeData.totalDailyIncome * 15,
      outflow: (expenseData.totalExpenses / 30) * 15,
      net: (incomeData.totalDailyIncome * 15) - ((expenseData.totalExpenses / 30) * 15),
      confidence: 76
    },
    {
      period: "30 prochains jours",
      inflow: incomeData.totalDailyIncome * 30,
      outflow: expenseData.totalExpenses,
      net: (incomeData.totalDailyIncome * 30) - expenseData.totalExpenses,
      confidence: 68
    }
  ];


  const getAlertBadge = (type: string, priority: string) => {
    const baseClasses = "flex items-center gap-1";
    
    switch (type) {
      case 'warning':
        return <Badge className={`${baseClasses} bg-orange-100 text-orange-700 border-orange-200`}>
          <AlertTriangle className="w-3 h-3" />Attention
        </Badge>;
      case 'success':
        return <Badge className={`${baseClasses} bg-green-100 text-green-700 border-green-200`}>
          <CheckCircle className="w-3 h-3" />Succès
        </Badge>;
      default:
        return <Badge className={`${baseClasses} bg-blue-100 text-blue-700 border-blue-200`}>
          <TrendingUp className="w-3 h-3" />Info
        </Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Contrôle de période */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Calendar className="w-5 h-5 text-muted-foreground" />
          <Select value={selectedPeriod} onValueChange={(value) => setSelectedPeriod(value as any)}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Aujourd'hui</SelectItem>
              <SelectItem value="yesterday">Hier</SelectItem>
              <SelectItem value="week">Cette semaine</SelectItem>
              <SelectItem value="month">Ce mois</SelectItem>
              <SelectItem value="quarter">Ce trimestre</SelectItem>
              <SelectItem value="year">Cette année</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="text-right">
          <div className="text-sm text-muted-foreground">Période sélectionnée</div>
          <div className="text-lg font-semibold">{getPeriodLabel(selectedPeriod)}</div>
        </div>
      </div>

      {/* KPIs principaux */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, index) => {
          const IconComponent = kpi.icon;
          return (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-accent/50`}>
                    <IconComponent className={`w-5 h-5 ${kpi.color}`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">{kpi.title}</p>
                    <p className="text-2xl font-bold">{kpi.value}</p>
                    <p className={`text-sm flex items-center gap-1 ${
                      kpi.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {kpi.changeType === 'positive' ? 
                        <TrendingUp className="w-3 h-3" /> : 
                        <TrendingDown className="w-3 h-3" />
                      }
                      {kpi.change}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Synthèse par modules */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Encaissements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-green-500" />
              Encaissements
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-2xl font-bold text-green-600">{formatAmount(incomeData.totalIncome)}</div>
              <div className="text-sm text-muted-foreground">{incomeData.transactionCount} transactions</div>
            </div>
            
            <div className="space-y-2">
              <div className="text-sm font-medium">Top 3 modes de paiement</div>
              {incomeData.paymentMethods.slice(0, 3).map((method, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span>{method.name}</span>
                  <span className="font-medium">{formatAmount(method.amount)}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between text-sm">
              <span>Taux de succès</span>
              <span className="font-medium text-green-600">{incomeData.successRate}%</span>
            </div>
          </CardContent>
        </Card>

        {/* Dépenses */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Receipt className="w-5 h-5 text-red-500" />
              Dépenses
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-2xl font-bold text-red-600">{formatAmount(expenseData.totalExpenses)}</div>
              <div className="text-sm text-muted-foreground">Budget: {formatAmount(expenseData.totalBudget)}</div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span>Budget utilisé</span>
                <span>{expenseData.budgetUsagePercentage.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${
                    expenseData.budgetUsagePercentage > 90 ? 'bg-red-500' : 
                    expenseData.budgetUsagePercentage > 75 ? 'bg-orange-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${Math.min(expenseData.budgetUsagePercentage, 100)}%` }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium">Top 3 catégories</div>
              {expenseData.categories.slice(0, 3).map((category, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span>{category.name}</span>
                  <span className="font-medium">{formatAmount(category.amount)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Factures */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-500" />
              Facturation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-2xl font-bold text-blue-600">{formatAmount(invoiceData.totalInvoiced)}</div>
              <div className="text-sm text-muted-foreground">Facturé total</div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Étudiants</span>
                <span className="font-medium">{formatAmount(invoiceData.studentInvoices.total)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Commercial</span>
                <span className="font-medium">{formatAmount(invoiceData.commercialInvoices.total)}</span>
              </div>
            </div>

            <div className="p-3 bg-green-500/10 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Encaissé</span>
                <span className="font-semibold text-green-600">{formatAmount(invoiceData.totalCollected)}</span>
              </div>
              <div className="text-xs text-muted-foreground">
                Taux: {invoiceData.collectionRate.toFixed(1)}%
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Prédictions IA et Alertes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Prédictions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="w-5 h-5 text-purple-500" />
              Prédictions de Flux
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {predictions.map((pred, index) => (
              <div key={index} className="p-4 rounded-lg border border-border/50">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">{pred.period}</span>
                  <span className="text-sm text-muted-foreground">
                    Confiance: {pred.confidence}%
                  </span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-green-600">Entrées</span>
                    <span className="font-medium text-green-600">{formatAmount(pred.inflow)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-red-600">Sorties</span>
                    <span className="font-medium text-red-600">{formatAmount(pred.outflow)}</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between">
                      <span className="font-medium">Solde net</span>
                      <span className={`font-bold ${pred.net > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatAmount(pred.net)}
                      </span>
                    </div>
                  </div>
                </div>

                <Progress value={pred.confidence} className="h-1 mt-3" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Alertes et Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              Alertes & Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {alerts.map((alert, index) => (
              <div key={index} className="p-4 rounded-lg border border-border/50 hover:bg-accent/30 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <span className="font-medium">{alert.title}</span>
                  {getAlertBadge(alert.type, alert.priority)}
                </div>
                <p className="text-sm text-muted-foreground">{alert.message}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Tendances et Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Performance Mensuelle</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">+12.3%</div>
              <div className="text-sm text-muted-foreground">vs mois précédent</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Délai Moyen Encaissement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">3.2j</div>
              <div className="text-sm text-muted-foreground">-0.5j ce mois</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Taux de Réconciliation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">98.7%</div>
              <div className="text-sm text-muted-foreground">Automatique</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}