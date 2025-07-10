import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useDocumentValidation, QualityReport } from '@/hooks/useDocumentValidation';
import { useDocumentTemplates } from '@/hooks/useDocumentTemplates';
import { 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  BarChart, 
  RefreshCw, 
  Download, 
  TrendingUp,
  TrendingDown,
  Minus
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export function ValidationDashboard() {
  const { loading, error, getQualityReport } = useDocumentValidation();
  const { templates } = useDocumentTemplates();
  
  const [report, setReport] = useState<QualityReport | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d'>('30d');

  const loadReport = async () => {
    try {
      const filters: any = {};
      
      if (selectedTemplate) {
        filters.template_id = selectedTemplate;
      }
      
      const now = new Date();
      const daysBack = dateRange === '7d' ? 7 : dateRange === '30d' ? 30 : 90;
      const startDate = new Date(now.getTime() - daysBack * 24 * 60 * 60 * 1000);
      
      filters.date_from = startDate.toISOString().split('T')[0];
      filters.date_to = now.toISOString().split('T')[0];

      const reportData = await getQualityReport(filters);
      setReport(reportData);
    } catch (err) {
      console.error('Erreur lors du chargement du rapport:', err);
    }
  };

  useEffect(() => {
    loadReport();
  }, [selectedTemplate, dateRange]);

  const getValidationRateColor = (rate: number) => {
    if (rate >= 95) return 'text-green-600';
    if (rate >= 85) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getValidationRateIcon = (rate: number) => {
    if (rate >= 95) return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (rate >= 85) return <Minus className="w-4 h-4 text-yellow-600" />;
    return <TrendingDown className="w-4 h-4 text-red-600" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Tableau de Bord de Validation</h2>
          <p className="text-muted-foreground">Contrôle qualité et validation des documents</p>
        </div>
        <Button onClick={loadReport} disabled={loading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Actualiser
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filtres du rapport</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Modèle</label>
              <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                <SelectTrigger>
                  <SelectValue placeholder="Tous les modèles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tous les modèles</SelectItem>
                  {templates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Période</label>
              <Select value={dateRange} onValueChange={(value) => setDateRange(value as any)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">7 derniers jours</SelectItem>
                  <SelectItem value="30d">30 derniers jours</SelectItem>
                  <SelectItem value="90d">90 derniers jours</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {error && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded">
          {error}
        </div>
      )}

      {report && (
        <>
          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Documents traités
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{report.document_count.toLocaleString()}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                  Taux de validation
                  {getValidationRateIcon(report.validation_rate)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${getValidationRateColor(report.validation_rate)}`}>
                  {report.validation_rate.toFixed(1)}%
                </div>
                <Progress value={report.validation_rate} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Types d'erreurs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{report.common_errors.length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Rapport généré
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm font-medium">
                  {format(new Date(report.generated_at), 'dd MMM yyyy HH:mm', { locale: fr })}
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="errors" className="space-y-4">
            <TabsList>
              <TabsTrigger value="errors">Erreurs communes</TabsTrigger>
              <TabsTrigger value="templates">Qualité par modèle</TabsTrigger>
            </TabsList>

            <TabsContent value="errors" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <AlertTriangle className="w-5 h-5 mr-2" />
                    Erreurs les plus fréquentes
                  </CardTitle>
                  <CardDescription>
                    Analyse des erreurs de validation détectées
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {report.common_errors.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-500" />
                      <p>Aucune erreur détectée</p>
                      <p className="text-sm">Excellente qualité des données !</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {report.common_errors.map((error, index) => (
                        <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <XCircle className="w-5 h-5 text-red-500" />
                            <div>
                              <h3 className="font-medium">{error.error_type}</h3>
                              <p className="text-sm text-muted-foreground">
                                {error.count} occurrences ({error.percentage.toFixed(1)}%)
                              </p>
                            </div>
                          </div>
                          <div className="w-32">
                            <Progress value={error.percentage} className="h-2" />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="templates" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart className="w-5 h-5 mr-2" />
                    Qualité par modèle de document
                  </CardTitle>
                  <CardDescription>
                    Taux de succès et erreurs par modèle
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {report.template_quality.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <BarChart className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Aucune donnée disponible</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {report.template_quality.map((template, index) => (
                        <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex-1">
                            <h3 className="font-medium">{template.template_name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {template.error_count} erreurs détectées
                            </p>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="text-right">
                              <div className={`font-medium ${getValidationRateColor(template.success_rate)}`}>
                                {template.success_rate.toFixed(1)}%
                              </div>
                              <div className="w-24">
                                <Progress value={template.success_rate} className="h-2" />
                              </div>
                            </div>
                            <Badge 
                              variant={template.success_rate >= 95 ? "default" : 
                                      template.success_rate >= 85 ? "secondary" : "destructive"}
                            >
                              {template.success_rate >= 95 ? "Excellent" : 
                               template.success_rate >= 85 ? "Bon" : "À améliorer"}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Export Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-2">
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Exporter en PDF
                </Button>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Exporter en Excel
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}