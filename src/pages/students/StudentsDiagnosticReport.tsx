import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Clock,
  Search,
  Shield,
  Database,
  BarChart3,
  RefreshCw,
  Download,
  Eye,
  Users
} from 'lucide-react';
import { runStudentsDiagnostic } from '@/scripts/studentsCompleteDiagnostic';

interface DiagnosticResult {
  module: string;
  version: string;
  testDate: string;
  summary: {
    healthScore: number;
    status: 'EXCELLENT' | 'GOOD' | 'PARTIAL' | 'CRITICAL';
    criticalIssues: number;
    mysteryBadge: string;
  };
  results: {
    working: string[];
    broken: string[];
    missing: string[];
  };
  dataIntegrity: {
    totalStudents: number;
    activeStudents: number;
    orphanRecords: number;
    missingPhotos: number;
    duplicateEmails: number;
    invalidStatuses: number;
  };
  performance: {
    dashboard: string;
    search: string;
    cardGen: string;
    bulkExport: string;
  };
  security: {
    rglCompliant: boolean;
    photosEncrypted: boolean;
    accessLogged: boolean;
    anonymizable: boolean;
  };
  badgeInvestigation: {
    possibleSources: Array<{
      source: string;
      count: number;
      description: string;
    }>;
    conclusion: string;
  };
  routes: Array<{
    path: string;
    status: 'OK' | 'ERROR' | 'MISSING';
    description: string;
    performance?: number;
  }>;
  nextSteps: string[];
}

export default function StudentsDiagnosticReport() {
  const [diagnostic, setDiagnostic] = useState<DiagnosticResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runDiagnostic = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await runStudentsDiagnostic();
      setDiagnostic(result);
    } catch (err) {
      setError(`Erreur lors du diagnostic: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runDiagnostic();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'EXCELLENT': return 'bg-green-500';
      case 'GOOD': return 'bg-blue-500';
      case 'PARTIAL': return 'bg-yellow-500';
      case 'CRITICAL': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'OK': return 'default';
      case 'ERROR': return 'destructive';
      case 'MISSING': return 'secondary';
      default: return 'outline';
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-500" />
            <h3 className="text-lg font-semibold mb-2">Diagnostic en cours...</h3>
            <p className="text-muted-foreground">Analyse complète du module Gestion Étudiants</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <XCircle className="h-5 w-5" />
              Erreur de Diagnostic
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={runDiagnostic} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Réessayer
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!diagnostic) return null;

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            🎓 Diagnostic Module Étudiants
          </h1>
          <p className="text-muted-foreground">
            {diagnostic.module} v{diagnostic.version} • Testé le {diagnostic.testDate}
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={runDiagnostic} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualiser
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Score de Santé</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{diagnostic.summary.healthScore}/100</div>
            <Progress value={diagnostic.summary.healthScore} className="mt-2" />
            <Badge 
              className={`mt-2 ${getStatusColor(diagnostic.summary.status)} text-white`}
            >
              {diagnostic.summary.status}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Issues Critiques</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {diagnostic.summary.criticalIssues}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Nécessitent attention immédiate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Mystère Badge "3"</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm font-medium">
              {diagnostic.summary.mysteryBadge}
            </div>
            <Badge variant={diagnostic.summary.mysteryBadge.includes('Résolu') ? 'default' : 'destructive'} className="mt-1">
              {diagnostic.summary.mysteryBadge.includes('Résolu') ? 'RÉSOLU' : 'NON RÉSOLU'}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Étudiants Actifs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {diagnostic.dataIntegrity.activeStudents}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              / {diagnostic.dataIntegrity.totalStudents} total
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Badge Investigation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            🔍 Investigation Badge "3"
          </CardTitle>
          <CardDescription>
            Analyse approfondie des sources possibles du mystérieux badge
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {diagnostic.badgeInvestigation.possibleSources.map((source, index) => (
              <Card key={index} className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{source.source}</h4>
                  <Badge variant={source.count === 3 ? 'default' : 'secondary'}>
                    {source.count}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{source.description}</p>
              </Card>
            ))}
          </div>
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-medium text-blue-900 mb-1">Conclusion</h4>
            <p className="text-blue-800">{diagnostic.badgeInvestigation.conclusion}</p>
          </div>
        </CardContent>
      </Card>

      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Working Features */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-5 w-5" />
              Fonctionnel ({diagnostic.results.working.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {diagnostic.results.working.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">{item}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Broken Features */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <XCircle className="h-5 w-5" />
              Cassé ({diagnostic.results.broken.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {diagnostic.results.broken.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-red-500" />
                  <span className="text-sm">{item}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Missing Features */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-600">
              <AlertTriangle className="h-5 w-5" />
              Manquant ({diagnostic.results.missing.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {diagnostic.results.missing.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm">{item}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Data Integrity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Intégrité des Données
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span>Total Étudiants</span>
              <Badge variant="outline">{diagnostic.dataIntegrity.totalStudents}</Badge>
            </div>
            <div className="flex justify-between">
              <span>Étudiants Actifs</span>
              <Badge variant="outline">{diagnostic.dataIntegrity.activeStudents}</Badge>
            </div>
            <div className="flex justify-between">
              <span>Emails Dupliqués</span>
              <Badge variant={diagnostic.dataIntegrity.duplicateEmails > 0 ? 'destructive' : 'default'}>
                {diagnostic.dataIntegrity.duplicateEmails}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span>Enregistrements Orphelins</span>
              <Badge variant={diagnostic.dataIntegrity.orphanRecords > 0 ? 'destructive' : 'default'}>
                {diagnostic.dataIntegrity.orphanRecords}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span>Statuts Invalides</span>
              <Badge variant={diagnostic.dataIntegrity.invalidStatuses > 0 ? 'destructive' : 'default'}>
                {diagnostic.dataIntegrity.invalidStatuses}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span>Chargement Dashboard</span>
              <Badge variant="outline">{diagnostic.performance.dashboard}</Badge>
            </div>
            <div className="flex justify-between">
              <span>Recherche Étudiant</span>
              <Badge variant="outline">{diagnostic.performance.search}</Badge>
            </div>
            <div className="flex justify-between">
              <span>Génération Carte</span>
              <Badge variant="outline">{diagnostic.performance.cardGen}</Badge>
            </div>
            <div className="flex justify-between">
              <span>Export en Masse</span>
              <Badge variant="outline">{diagnostic.performance.bulkExport}</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Routes Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            État des Routes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {diagnostic.routes.map((route, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="font-medium text-sm">{route.path}</div>
                  <div className="text-xs text-muted-foreground">{route.description}</div>
                </div>
                <Badge variant={getStatusBadgeVariant(route.status)}>
                  {route.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Audit Sécurité
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl mb-1">
                {diagnostic.security.rglCompliant ? '✅' : '❌'}
              </div>
              <div className="text-sm">RGPD</div>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-1">
                {diagnostic.security.photosEncrypted ? '✅' : '❌'}
              </div>
              <div className="text-sm">Photos Chiffrées</div>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-1">
                {diagnostic.security.accessLogged ? '✅' : '❌'}
              </div>
              <div className="text-sm">Logs Accès</div>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-1">
                {diagnostic.security.anonymizable ? '✅' : '❌'}
              </div>
              <div className="text-sm">Anonymisation</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Prochaines Étapes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {diagnostic.nextSteps.map((step, index) => (
              <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                  {index + 1}
                </div>
                <div className="text-sm">{step}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}