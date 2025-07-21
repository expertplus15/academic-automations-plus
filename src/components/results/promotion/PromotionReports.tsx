import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileText, 
  Download, 
  BarChart3, 
  TrendingUp, 
  Users, 
  GraduationCap,
  Calendar,
  Filter,
  Eye
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export function PromotionReports() {
  const [selectedCampaign, setSelectedCampaign] = useState('');
  const [selectedReportType, setSelectedReportType] = useState('summary');

  const { data: campaigns } = useQuery({
    queryKey: ['promotion-campaigns'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('promotion_campaigns')
        .select(`
          *,
          source_academic_year:academic_years!source_academic_year_id(name),
          target_academic_year:academic_years!target_academic_year_id(name)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const { data: reports } = useQuery({
    queryKey: ['promotion-reports', selectedCampaign],
    queryFn: async () => {
      if (!selectedCampaign) return [];
      
      const { data, error } = await supabase
        .from('promotion_reports')
        .select('*')
        .eq('campaign_id', selectedCampaign)
        .order('generated_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!selectedCampaign
  });

  // Données simulées pour les statistiques
  const mockStatistics = {
    totalStudents: 1247,
    promoted: 1089,
    conditional: 89,
    repeating: 69,
    successRate: 87.3,
    programStats: [
      { name: 'Informatique', total: 320, promoted: 278, rate: 86.9 },
      { name: 'Commerce', total: 280, promoted: 251, rate: 89.6 },
      { name: 'Gestion', total: 390, promoted: 342, rate: 87.7 },
      { name: 'Communication', total: 257, promoted: 218, rate: 84.8 }
    ],
    trends: [
      { year: '2020-2021', rate: 83.2 },
      { year: '2021-2022', rate: 85.1 },
      { year: '2022-2023', rate: 86.4 },
      { year: '2023-2024', rate: 87.3 }
    ]
  };

  const generateReport = (type: string) => {
    // Simuler la génération d'un rapport
    console.log(`Generating ${type} report for campaign ${selectedCampaign}`);
  };

  const exportReport = (format: string) => {
    // Simuler l'export d'un rapport
    console.log(`Exporting report in ${format} format`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Rapports de Promotion</h2>
          <p className="text-muted-foreground">
            Analysez les statistiques et générez des rapports détaillés
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtres
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Campagne</label>
              <Select value={selectedCampaign} onValueChange={setSelectedCampaign}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une campagne" />
                </SelectTrigger>
                <SelectContent>
                  {campaigns?.map((campaign) => (
                    <SelectItem key={campaign.id} value={campaign.id}>
                      {campaign.name} ({campaign.source_academic_year?.name} → {campaign.target_academic_year?.name})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Type de rapport</label>
              <Select value={selectedReportType} onValueChange={setSelectedReportType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="summary">Résumé exécutif</SelectItem>
                  <SelectItem value="detailed">Rapport détaillé</SelectItem>
                  <SelectItem value="statistics">Statistiques</SelectItem>
                  <SelectItem value="exceptions">Cas particuliers</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end gap-2">
              <Button 
                onClick={() => generateReport(selectedReportType)}
                disabled={!selectedCampaign}
              >
                <FileText className="h-4 w-4 mr-2" />
                Générer
              </Button>
              <Button 
                variant="outline"
                onClick={() => exportReport('pdf')}
                disabled={!selectedCampaign}
              >
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="statistics">Statistiques</TabsTrigger>
          <TabsTrigger value="trends">Tendances</TabsTrigger>
          <TabsTrigger value="reports">Rapports générés</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-blue-900">Total Étudiants</CardTitle>
                <Users className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-900">{mockStatistics.totalStudents}</div>
                <p className="text-xs text-blue-600">Dernière campagne</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-green-900">Promus</CardTitle>
                <GraduationCap className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-900">{mockStatistics.promoted}</div>
                <p className="text-xs text-green-600">
                  {Math.round((mockStatistics.promoted / mockStatistics.totalStudents) * 100)}% du total
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-orange-900">Conditionnels</CardTitle>
                <Calendar className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-900">{mockStatistics.conditional}</div>
                <p className="text-xs text-orange-600">
                  {Math.round((mockStatistics.conditional / mockStatistics.totalStudents) * 100)}% du total
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-purple-900">Taux de Réussite</CardTitle>
                <TrendingUp className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-900">{mockStatistics.successRate}%</div>
                <p className="text-xs text-purple-600">+1.2% vs année précédente</p>
              </CardContent>
            </Card>
          </div>

          {/* Program Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>Statistiques par Programme</CardTitle>
              <CardDescription>
                Taux de réussite et répartition par filière
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockStatistics.programStats.map((program) => (
                  <div key={program.name} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{program.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {program.promoted}/{program.total} étudiants
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold">{program.rate}%</div>
                      <Badge variant={program.rate >= 85 ? 'default' : program.rate >= 80 ? 'secondary' : 'destructive'}>
                        {program.rate >= 85 ? 'Excellent' : program.rate >= 80 ? 'Bon' : 'À améliorer'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="statistics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Analyse Détaillée</CardTitle>
              <CardDescription>
                Statistiques approfondies de la dernière campagne
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Répartition des décisions</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span>Promus</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-green-200 rounded">
                          <div 
                            className="h-full bg-green-500 rounded" 
                            style={{ width: `${(mockStatistics.promoted / mockStatistics.totalStudents) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{mockStatistics.promoted}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Conditionnels</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-orange-200 rounded">
                          <div 
                            className="h-full bg-orange-500 rounded" 
                            style={{ width: `${(mockStatistics.conditional / mockStatistics.totalStudents) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{mockStatistics.conditional}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Redoublants</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-red-200 rounded">
                          <div 
                            className="h-full bg-red-500 rounded" 
                            style={{ width: `${(mockStatistics.repeating / mockStatistics.totalStudents) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{mockStatistics.repeating}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Critères d'évaluation</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Moyenne générale ≥ 10</span>
                      <span className="font-medium">89.2%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Taux de présence ≥ 75%</span>
                      <span className="font-medium">94.1%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Crédits ECTS validés</span>
                      <span className="font-medium">87.8%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Validation toutes matières</span>
                      <span className="font-medium">82.3%</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Évolution des Taux de Réussite</CardTitle>
              <CardDescription>
                Tendances sur les 4 dernières années
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockStatistics.trends.map((trend, index) => (
                  <div key={trend.year} className="flex items-center justify-between p-3 border rounded">
                    <span className="font-medium">{trend.year}</span>
                    <div className="flex items-center gap-3">
                      <div className="w-32 h-2 bg-gray-200 rounded">
                        <div 
                          className="h-full bg-violet-500 rounded" 
                          style={{ width: `${trend.rate}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium w-12">{trend.rate}%</span>
                      {index > 0 && (
                        <TrendingUp className="h-4 w-4 text-green-500" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Rapports Générés</CardTitle>
              <CardDescription>
                Historique des rapports de promotion
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reports && reports.length > 0 ? (
                  reports.map((report) => (
                    <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-violet-500" />
                        <div>
                          <h4 className="font-medium">{report.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            Généré le {new Date(report.generated_at).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{report.report_type}</Badge>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          Voir
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-1" />
                          Télécharger
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Aucun rapport généré pour le moment</p>
                    <p className="text-sm">Sélectionnez une campagne et générez votre premier rapport</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}