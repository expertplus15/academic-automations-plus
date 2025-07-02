import React from 'react';
import { ModuleLayout } from '@/components/layouts/ModuleLayout';
import { FinanceModuleSidebar } from '@/components/FinanceModuleSidebar';
import { FinancePageHeader } from '@/components/FinancePageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  Calculator,
  Target
} from 'lucide-react';

export default function IncomeStatement() {
  const stats = [
    {
      label: "Chiffre d'affaires",
      value: "€3,250,000",
      change: "+12.3%",
      changeType: "positive" as const
    },
    {
      label: "Résultat net",
      value: "€120,000",
      change: "-7.8%", 
      changeType: "negative" as const
    },
    {
      label: "Marge brute",
      value: "78.5%",
      change: "+1.2%",
      changeType: "positive" as const
    },
    {
      label: "EBITDA",
      value: "€385,000",
      change: "+15.6%",
      changeType: "positive" as const
    }
  ];

  // Mock data pour le compte de résultat
  const incomeData = {
    produits: [
      { name: "Frais de scolarité", current: 2850000, previous: 2520000 },
      { name: "Formations continues", current: 285000, previous: 245000 },
      { name: "Subventions publiques", current: 95000, previous: 88000 },
      { name: "Autres produits", current: 20000, previous: 15000 }
    ],
    charges: {
      exploitation: [
        { name: "Salaires et charges", current: 1950000, previous: 1820000 },
        { name: "Fournitures et services", current: 325000, previous: 295000 },
        { name: "Charges énergétiques", current: 185000, previous: 165000 },
        { name: "Maintenance et équipements", current: 125000, previous: 118000 },
        { name: "Assurances", current: 45000, previous: 42000 },
        { name: "Autres charges", current: 85000, previous: 78000 }
      ],
      financieres: [
        { name: "Intérêts d'emprunts", current: 25000, previous: 32000 },
        { name: "Charges financières diverses", current: 8000, previous: 6000 }
      ],
      exceptionnelles: [
        { name: "Charges exceptionnelles", current: 12000, previous: 5000 }
      ]
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const calculateVariation = (current: number, previous: number) => {
    const variation = ((current - previous) / previous) * 100;
    return {
      percentage: variation,
      isPositive: variation > 0
    };
  };

  const calculateTotal = (items: any[]) => {
    return items.reduce((sum, item) => sum + item.current, 0);
  };

  const totalProduits = calculateTotal(incomeData.produits);
  const totalChargesExploitation = calculateTotal(incomeData.charges.exploitation);
  const totalChargesFinancieres = calculateTotal(incomeData.charges.financieres);
  const totalChargesExceptionnelles = calculateTotal(incomeData.charges.exceptionnelles);
  
  const resultatExploitation = totalProduits - totalChargesExploitation;
  const resultatFinancier = -totalChargesFinancieres;
  const resultatExceptionnel = -totalChargesExceptionnelles;
  const resultatNet = resultatExploitation + resultatFinancier + resultatExceptionnel;

  const IncomeSection = ({ title, data, isPositive = true }: { title: string; data: any[]; isPositive?: boolean }) => (
    <Card className="bg-white rounded-2xl shadow-sm border-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {isPositive ? <TrendingUp className="w-5 h-5 text-green-600" /> : <TrendingDown className="w-5 h-5 text-red-600" />}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {data.map((item, index) => {
            const variation = calculateVariation(item.current, item.previous);
            return (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-accent/20">
                <div className="flex-1">
                  <p className="font-medium text-foreground">{item.name}</p>
                  <p className="text-sm text-muted-foreground">
                    N-1: {formatCurrency(item.previous)}
                  </p>
                </div>
                <div className="text-right space-y-1">
                  <p className="font-semibold text-lg">{formatCurrency(item.current)}</p>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${
                      variation.isPositive 
                        ? isPositive
                          ? 'text-green-700 bg-green-50 border-green-200'
                          : 'text-red-700 bg-red-50 border-red-200'
                        : isPositive
                          ? 'text-red-700 bg-red-50 border-red-200'  
                          : 'text-green-700 bg-green-50 border-green-200'
                    }`}
                  >
                    {variation.isPositive ? '+' : ''}{variation.percentage.toFixed(1)}%
                    {variation.isPositive ? <TrendingUp className="w-3 h-3 ml-1" /> : <TrendingDown className="w-3 h-3 ml-1" />}
                  </Badge>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );

  const ResultLine = ({ label, amount, isTotal = false, isPositive = true }: any) => (
    <Card className={`rounded-2xl shadow-sm border-0 ${isTotal ? 'bg-[rgb(245,158,11)]/10 border border-[rgb(245,158,11)]/20' : 'bg-white'}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <h3 className={`${isTotal ? 'text-lg' : 'text-base'} font-bold text-foreground flex items-center gap-2`}>
            {isTotal && <Target className="w-5 h-5 text-[rgb(245,158,11)]" />}
            {label}
          </h3>
          <p className={`${isTotal ? 'text-xl' : 'text-lg'} font-bold ${
            isPositive ? 'text-green-600' : 'text-red-600'
          } ${isTotal ? 'text-[rgb(245,158,11)]' : ''}`}>
            {formatCurrency(amount)}
          </p>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <ModuleLayout sidebar={<FinanceModuleSidebar />}>
      <div className="p-8 space-y-8">
        <FinancePageHeader
          title="Compte de Résultat"
          subtitle="Performance financière pour l'exercice 2024"
          stats={stats}
          showCreateButton={false}
          showExportButton={true}
          showBackButton={true}
          backPath="/finance"
        />

        {/* Indicateurs de performance */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-white rounded-2xl shadow-sm border-0">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <DollarSign className="w-8 h-8 text-green-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Marge d'exploitation</p>
                  <p className="text-lg font-bold text-foreground">11.8%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white rounded-2xl shadow-sm border-0">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Calculator className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Charges/CA</p>
                  <p className="text-lg font-bold text-foreground">81.2%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white rounded-2xl shadow-sm border-0">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-8 h-8 text-purple-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Croissance CA</p>
                  <p className="text-lg font-bold text-foreground">+12.3%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white rounded-2xl shadow-sm border-0">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Target className="w-8 h-8 text-[rgb(245,158,11)]" />
                <div>
                  <p className="text-sm text-muted-foreground">ROI</p>
                  <p className="text-lg font-bold text-foreground">6.7%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Compte de résultat détaillé */}
        <div className="space-y-6">
          {/* Produits */}
          <IncomeSection 
            title="Produits d'Exploitation" 
            data={incomeData.produits}
            isPositive={true}
          />

          <ResultLine 
            label="TOTAL PRODUITS" 
            amount={totalProduits}
            isTotal={true}
            isPositive={true}
          />

          {/* Charges d'exploitation */}
          <IncomeSection 
            title="Charges d'Exploitation" 
            data={incomeData.charges.exploitation}
            isPositive={false}
          />

          <ResultLine 
            label="RÉSULTAT D'EXPLOITATION" 
            amount={resultatExploitation}
            isTotal={true}
            isPositive={resultatExploitation > 0}
          />

          {/* Charges financières */}
          <IncomeSection 
            title="Charges Financières" 
            data={incomeData.charges.financieres}
            isPositive={false}
          />

          <ResultLine 
            label="RÉSULTAT FINANCIER" 
            amount={resultatFinancier}
            isPositive={resultatFinancier > 0}
          />

          {/* Charges exceptionnelles */}
          <IncomeSection 
            title="Charges Exceptionnelles" 
            data={incomeData.charges.exceptionnelles}
            isPositive={false}
          />

          <ResultLine 
            label="RÉSULTAT EXCEPTIONNEL" 
            amount={resultatExceptionnel}
            isPositive={resultatExceptionnel > 0}
          />

          {/* Résultat net */}
          <ResultLine 
            label="RÉSULTAT NET" 
            amount={resultatNet}
            isTotal={true}
            isPositive={resultatNet > 0}
          />
        </div>
      </div>
    </ModuleLayout>
  );
}