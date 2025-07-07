import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useExpenses } from '@/hooks/finance/useExpenses';
import { useFinancialCategories } from '@/hooks/finance/useFinancialCategories';
import { 
  Receipt, 
  TrendingUp, 
  TrendingDown, 
  Calendar,
  Target,
  AlertTriangle,
  CheckCircle,
  Clock,
  Building,
  Zap,
  Users,
  BookOpen
} from 'lucide-react';

export function TreasuryExpensesDashboard() {
  const { expenses, loading } = useExpenses();
  const { categories } = useFinancialCategories();
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Mock data avec catégories réelles
  const expensesByCategory = [
    {
      name: "Personnel & Salaires",
      icon: Users,
      amount: 125000,
      count: 45,
      growth: 2,
      dailyAmount: 4200,
      color: "text-blue-500",
      budget: 130000,
      percentage: 78
    },
    {
      name: "Équipements & Infrastructure",
      icon: Building,
      amount: 45000,
      count: 23,
      growth: -8,
      dailyAmount: 1500,
      color: "text-purple-500",
      budget: 50000,
      percentage: 90
    },
    {
      name: "Fournitures Pédagogiques",
      icon: BookOpen,
      amount: 18500,
      count: 67,
      growth: 15,
      dailyAmount: 620,
      color: "text-green-500",
      budget: 25000,
      percentage: 74
    },
    {
      name: "Services & Maintenance",
      icon: Zap,
      amount: 12300,
      count: 34,
      growth: 5,
      dailyAmount: 410,
      color: "text-orange-500",
      budget: 15000,
      percentage: 82
    },
    {
      name: "Frais Généraux",
      icon: Receipt,
      amount: 8900,
      count: 56,
      growth: -3,
      dailyAmount: 300,
      color: "text-gray-500",
      budget: 12000,
      percentage: 74
    }
  ];

  const recentExpenses = [
    {
      id: "EXP-2024-0156",
      supplier: "TechnoSoft Solutions",
      category: "Équipements",
      amount: 3500,
      status: "approved",
      date: "2024-03-20",
      approver: "Dir. Finances"
    },
    {
      id: "EXP-2024-0157",
      supplier: "Papeterie Centrale",
      category: "Fournitures",
      amount: 450,
      status: "pending",
      date: "2024-03-19",
      approver: null
    },
    {
      id: "EXP-2024-0158",
      supplier: "Maintenance Pro",
      category: "Services",
      amount: 1200,
      status: "paid",
      date: "2024-03-18",
      approver: "Dir. Technique"
    },
    {
      id: "EXP-2024-0159",
      supplier: "Formation Expert",
      category: "Personnel",
      amount: 2800,
      status: "rejected",
      date: "2024-03-17",
      approver: "Dir. RH"
    }
  ];

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-blue-100 text-blue-700 border-blue-200"><CheckCircle className="w-3 h-3 mr-1" />Approuvé</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200"><Clock className="w-3 h-3 mr-1" />En attente</Badge>;
      case 'paid':
        return <Badge className="bg-green-100 text-green-700 border-green-200"><CheckCircle className="w-3 h-3 mr-1" />Payé</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-700 border-red-200"><AlertTriangle className="w-3 h-3 mr-1" />Rejeté</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const totalExpenses = expensesByCategory.reduce((sum, cat) => sum + cat.amount, 0);
  const totalBudget = expensesByCategory.reduce((sum, cat) => sum + cat.budget, 0);
  const budgetUsagePercentage = (totalExpenses / totalBudget) * 100;

  return (
    <div className="space-y-6">
      {/* Contrôles et vue d'ensemble */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Calendar className="w-5 h-5 text-muted-foreground" />
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Aujourd'hui</SelectItem>
              <SelectItem value="week">Cette semaine</SelectItem>
              <SelectItem value="month">Ce mois</SelectItem>
              <SelectItem value="quarter">Ce trimestre</SelectItem>
              <SelectItem value="year">Cette année</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Toutes catégories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes catégories</SelectItem>
              <SelectItem value="personnel">Personnel</SelectItem>
              <SelectItem value="equipment">Équipements</SelectItem>
              <SelectItem value="supplies">Fournitures</SelectItem>
              <SelectItem value="services">Services</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="text-right">
          <div className="text-sm text-muted-foreground">Total dépenses - Ce mois</div>
          <div className="text-2xl font-bold text-red-600">{formatAmount(totalExpenses)}</div>
          <div className="text-sm text-muted-foreground">
            Budget utilisé: {budgetUsagePercentage.toFixed(1)}% / {formatAmount(totalBudget)}
          </div>
        </div>
      </div>

      {/* Dépenses par catégorie */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {expensesByCategory.map((category, index) => {
          const IconComponent = category.icon;
          const budgetPercentage = (category.amount / category.budget) * 100;
          
          return (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm font-medium">
                  <IconComponent className={`w-4 h-4 ${category.color}`} />
                  {category.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="text-2xl font-bold">{formatAmount(category.amount)}</div>
                  <div className="text-sm text-muted-foreground">{category.count} dépenses</div>
                </div>
                
                {/* Budget progression */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span>Budget utilisé</span>
                    <span>{budgetPercentage.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        budgetPercentage > 90 ? 'bg-red-500' : 
                        budgetPercentage > 75 ? 'bg-orange-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(budgetPercentage, 100)}%` }}
                    />
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Restant: {formatAmount(category.budget - category.amount)}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Évolution</span>
                  <span className={`text-sm flex items-center gap-1 ${
                    category.growth > 0 ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {category.growth > 0 ? 
                      <TrendingUp className="w-3 h-3" /> : 
                      <TrendingDown className="w-3 h-3" />
                    }
                    {category.growth > 0 ? '+' : ''}{category.growth}%
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Dépenses récentes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-orange-500" />
            Dépenses Récentes
            <Badge className="ml-2">{recentExpenses.length} en cours</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentExpenses.map((expense, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 rounded-lg border border-border/50 hover:bg-accent/30 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-orange-500/10 rounded-lg">
                    <Receipt className="w-4 h-4 text-orange-500" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{expense.id}</p>
                    <p className="text-sm text-muted-foreground">{expense.supplier}</p>
                    <p className="text-xs text-muted-foreground">{expense.category}</p>
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <p className="font-semibold text-foreground">{formatAmount(expense.amount)}</p>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(expense.status)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {expense.date} • {expense.approver || 'En attente'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Alertes budget */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-700">
              <AlertTriangle className="w-5 h-5" />
              Alertes Budget
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Équipements</span>
                <span className="text-sm font-medium text-orange-700">90% utilisé</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Services</span>
                <span className="text-sm font-medium text-orange-700">82% utilisé</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-green-500" />
              Objectifs Mensuels
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Réduction coûts</span>
                <span className="text-sm font-medium text-green-600">-5% atteint</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Efficacité achats</span>
                <span className="text-sm font-medium text-blue-600">+8% ROI</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}