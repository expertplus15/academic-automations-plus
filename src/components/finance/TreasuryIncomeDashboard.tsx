import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { TreasuryActionHeader } from '@/components/finance/TreasuryActionHeader';
import { NewPaymentModal } from '@/components/finance/modals/NewPaymentModal';
import { usePayments } from '@/hooks/finance/usePayments';
import { useTreasuryPeriod } from '@/hooks/finance/useTreasuryPeriod';
import { useTreasuryData } from '@/hooks/finance/useTreasuryData';
import { useToast } from '@/hooks/use-toast';
import { 
  CreditCard, 
  Banknote, 
  Smartphone, 
  TrendingUp, 
  TrendingDown,
  Euro,
  ArrowUpDown,
  CheckCircle,
  Clock,
  AlertTriangle,
  Search
} from 'lucide-react';

export function TreasuryIncomeDashboard() {
  const { payments, loading } = usePayments();
  const { incomeData } = useTreasuryData();
  const { toast } = useToast();
  const [showNewPaymentModal, setShowNewPaymentModal] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');
  const [methodFilter, setMethodFilter] = useState('all');

  // Utilisation des données depuis useTreasuryData
  const paymentMethodsData = incomeData.paymentMethods;

  const recentTransactions = [
    {
      id: "PAY-2024-0234",
      student: "Marie Dubois",
      amount: 2500,
      method: "Carte bancaire",
      status: "completed",
      timestamp: "14:32"
    },
    {
      id: "PAY-2024-0235", 
      student: "Jean Martin",
      amount: 1800,
      method: "Virement",
      status: "pending",
      timestamp: "13:45"
    },
    {
      id: "PAY-2024-0236",
      student: "Sophie Laurent",
      amount: 3200,
      method: "Prélèvement",
      status: "completed",
      timestamp: "12:15"
    },
    {
      id: "PAY-2024-0237",
      student: "Paul Durand",
      amount: 950,
      method: "Paiement Mobile",
      status: "failed",
      timestamp: "11:20"
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

  const handleExport = (format: string) => {
    toast({
      title: "Export en cours",
      description: `Export ${format} des encaissements en cours...`,
    });
  };

  const handleNewPayment = () => {
    setShowNewPaymentModal(true);
  };

  const filtersComponent = (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="flex-1">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher par étudiant, référence..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>
      <div className="w-48">
        <select 
          value={methodFilter} 
          onChange={(e) => setMethodFilter(e.target.value)}
          className="w-full px-3 py-2 border border-border rounded-md bg-background"
        >
          <option value="all">Tous les modes</option>
          <option value="card">Cartes bancaires</option>
          <option value="transfer">Virements</option>
          <option value="debit">Prélèvements</option>
          <option value="mobile">Paiements mobiles</option>
          <option value="cash">Espèces</option>
        </select>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <TreasuryActionHeader
        title="Encaissements"
        onNewAction={handleNewPayment}
        newActionText="Nouveau Paiement"
        onExport={handleExport}
        filters={filtersComponent}
      />

      <div className="text-right p-4 bg-green-50 rounded-lg border border-green-200">
        <div className="text-sm text-green-700">Total encaissé</div>
        <div className="text-2xl font-bold text-green-600">{formatAmount(incomeData.totalIncome)}</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {paymentMethodsData.map((method, index) => {
          const getIcon = (iconName: string) => {
            switch(iconName) {
              case 'CreditCard': return CreditCard;
              case 'ArrowUpDown': return ArrowUpDown;
              case 'Banknote': return Banknote;
              case 'Smartphone': return Smartphone;
              case 'Euro': return Euro;
              default: return CreditCard;
            }
          };
          const IconComponent = getIcon(method.icon);
          return (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm font-medium">
                  <IconComponent className={`w-4 h-4 ${method.color}`} />
                  {method.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="text-2xl font-bold">{formatAmount(method.amount)}</div>
                  <div className="text-sm text-muted-foreground">{method.count} transactions</div>
                </div>
                
                <div className="p-3 bg-accent/50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Aujourd'hui</span>
                    <span className="font-semibold">{formatAmount(method.dailyAmount)}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Évolution</span>
                  <span className={`text-sm flex items-center gap-1 ${
                    method.growth > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {method.growth > 0 ? 
                      <TrendingUp className="w-3 h-3" /> : 
                      <TrendingDown className="w-3 h-3" />
                    }
                    {method.growth > 0 ? '+' : ''}{method.growth}%
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Transactions en temps réel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-blue-500" />
            Encaissements du Jour
            <Badge className="ml-2">{recentTransactions.length} transactions</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentTransactions.map((transaction, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 rounded-lg border border-border/50 hover:bg-accent/30 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-blue-500/10 rounded-lg">
                    <CreditCard className="w-4 h-4 text-blue-500" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{transaction.id}</p>
                    <p className="text-sm text-muted-foreground">{transaction.student}</p>
                    <p className="text-xs text-muted-foreground">{transaction.method}</p>
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <p className="font-semibold text-foreground">{formatAmount(transaction.amount)}</p>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(transaction.status)}
                    <span className="text-xs text-muted-foreground">
                      {transaction.timestamp}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Synthèse rapide */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">347</div>
              <div className="text-sm text-muted-foreground">Paiements réussis</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">12</div>
              <div className="text-sm text-muted-foreground">En attente</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">3</div>
              <div className="text-sm text-muted-foreground">Échecs</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">96%</div>
              <div className="text-sm text-muted-foreground">Taux de succès</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <NewPaymentModal 
        open={showNewPaymentModal} 
        onOpenChange={setShowNewPaymentModal} 
      />
    </div>
  );
}