import React from 'react';
import { ModuleLayout } from '@/components/layouts/ModuleLayout';
import { FinanceModuleSidebar } from '@/components/FinanceModuleSidebar';
import { FinancePageHeader } from '@/components/FinancePageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  TrendingDown,
  PieChart,
  Calculator,
  Download 
} from 'lucide-react';

export default function BalanceSheet() {
  const stats = [
    {
      label: "Total Actif",
      value: "€2,450,000",
      change: "+5.2%",
      changeType: "positive" as const
    },
    {
      label: "Total Passif", 
      value: "€2,450,000",
      change: "+5.2%",
      changeType: "positive" as const
    },
    {
      label: "Capitaux Propres",
      value: "€1,800,000",
      change: "+8.1%",
      changeType: "positive" as const
    },
    {
      label: "Ratio d'endettement",
      value: "26.5%",
      change: "-2.1%",
      changeType: "positive" as const
    }
  ];

  // Mock data pour le bilan
  const actifData = {
    immobilise: [
      { name: "Immobilisations incorporelles", current: 125000, previous: 118000 },
      { name: "Immobilisations corporelles", current: 1850000, previous: 1720000 },
      { name: "Immobilisations financières", current: 45000, previous: 45000 }
    ],
    circulant: [
      { name: "Stocks", current: 15000, previous: 12000 },
      { name: "Créances clients", current: 185000, previous: 165000 },
      { name: "Autres créances", current: 35000, previous: 28000 }
    ],
    tresorerie: [
      { name: "Banques", current: 165000, previous: 142000 },
      { name: "Caisse", current: 25000, previous: 18000 }
    ]
  };

  const passifData = {
    capitaux: [
      { name: "Capital social", current: 500000, previous: 500000 },
      { name: "Réserves", current: 1180000, previous: 1050000 },
      { name: "Résultat de l'exercice", current: 120000, previous: 130000 }
    ],
    dettes: [
      { name: "Emprunts long terme", current: 350000, previous: 420000 },
      { name: "Dettes fournisseurs", current: 185000, previous: 165000 },
      { name: "Dettes fiscales", current: 85000, previous: 72000 },
      { name: "Autres dettes", current: 30000, previous: 25000 }
    ]
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

  const BalanceSection = ({ title, data, type }: { title: string; data: any[]; type: 'actif' | 'passif' }) => (
    <Card className="bg-white rounded-2xl shadow-sm border-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PieChart className="w-5 h-5 text-[rgb(245,158,11)]" />
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
                        ? type === 'actif' 
                          ? 'text-green-700 bg-green-50 border-green-200'
                          : 'text-blue-700 bg-blue-50 border-blue-200'
                        : 'text-red-700 bg-red-50 border-red-200'
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

  return (
    <ModuleLayout sidebar={<FinanceModuleSidebar />}>
      <div className="p-8 space-y-8">
        <FinancePageHeader
          title="Bilan Comptable"
          subtitle="État de la situation financière au 31/12/2024"
          stats={stats}
          showCreateButton={false}
          showExportButton={true}
          showBackButton={true}
          backPath="/finance"
        />

        {/* Ratios financiers rapides */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-white rounded-2xl shadow-sm border-0">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Calculator className="w-8 h-8 text-[rgb(245,158,11)]" />
                <div>
                  <p className="text-sm text-muted-foreground">Fonds de roulement</p>
                  <p className="text-lg font-bold text-foreground">€235,000</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white rounded-2xl shadow-sm border-0">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-8 h-8 text-green-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Ratio de liquidité</p>
                  <p className="text-lg font-bold text-foreground">1.85</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white rounded-2xl shadow-sm border-0">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <PieChart className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Autonomie financière</p>
                  <p className="text-lg font-bold text-foreground">73.5%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white rounded-2xl shadow-sm border-0">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Download className="w-8 h-8 text-purple-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Rentabilité</p>
                  <p className="text-lg font-bold text-foreground">4.9%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bilan - Actif et Passif */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* ACTIF */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-[rgb(245,158,11)]" />
              ACTIF
            </h2>
            
            <BalanceSection 
              title="Actif Immobilisé" 
              data={actifData.immobilise}
              type="actif"
            />
            
            <BalanceSection 
              title="Actif Circulant" 
              data={actifData.circulant}
              type="actif"
            />
            
            <BalanceSection 
              title="Trésorerie" 
              data={actifData.tresorerie}
              type="actif"
            />

            {/* Total Actif */}
            <Card className="bg-[rgb(245,158,11)]/10 rounded-2xl shadow-sm border border-[rgb(245,158,11)]/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-foreground">TOTAL ACTIF</h3>
                  <p className="text-2xl font-bold text-[rgb(245,158,11)]">€2,450,000</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* PASSIF */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <TrendingDown className="w-6 h-6 text-[rgb(245,158,11)]" />
              PASSIF
            </h2>
            
            <BalanceSection 
              title="Capitaux Propres" 
              data={passifData.capitaux}
              type="passif"
            />
            
            <BalanceSection 
              title="Dettes" 
              data={passifData.dettes}
              type="passif"
            />

            {/* Total Passif */}
            <Card className="bg-[rgb(245,158,11)]/10 rounded-2xl shadow-sm border border-[rgb(245,158,11)]/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-foreground">TOTAL PASSIF</h3>
                  <p className="text-2xl font-bold text-[rgb(245,158,11)]">€2,450,000</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ModuleLayout>
  );
}