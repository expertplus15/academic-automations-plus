import React, { useState } from 'react';
import { ModuleLayout } from '@/components/layouts/ModuleLayout';
import { ElearningModuleSidebar } from '@/components/ElearningModuleSidebar';
import { ElearningPageHeader } from "@/components/ElearningPageHeader";
import { AnalyticsCharts } from '@/components/elearning/AnalyticsCharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { 
  Download, 
  RefreshCw,
  Calendar,
  Filter
} from 'lucide-react';

export default function Analytics() {
  const [timeRange, setTimeRange] = useState('7d');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simuler un refresh
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const handleExport = () => {
    // Simuler un export
    console.log('Export analytics data');
  };

  return (
    <ModuleLayout sidebar={<ElearningModuleSidebar />}>
      <div className="p-8 space-y-8">
        <ElearningPageHeader 
          title="Analytics d'engagement" 
          subtitle="Insights et métriques d'engagement des étudiants" 
        />
        
        {/* Contrôles */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Période :</span>
                </div>
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="24h">Dernières 24h</SelectItem>
                    <SelectItem value="7d">7 derniers jours</SelectItem>
                    <SelectItem value="30d">30 derniers jours</SelectItem>
                    <SelectItem value="90d">3 derniers mois</SelectItem>
                    <SelectItem value="1y">Dernière année</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                  Actualiser
                </Button>
                <Button variant="outline" onClick={handleExport}>
                  <Download className="w-4 h-4 mr-2" />
                  Exporter
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Graphiques et analytics */}
        <AnalyticsCharts timeRange={timeRange} />
      </div>
    </ModuleLayout>
  );
}