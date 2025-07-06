import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Upload, 
  FileSpreadsheet, 
  Database, 
  Download,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Eye,
  Trash2,
  FileText
} from 'lucide-react';

export function ImportDashboard() {
  const [importHistory, setImportHistory] = useState([
    {
      id: 1,
      fileName: 'notes_l1_math_s1.xlsx',
      importDate: '2024-01-15 14:30',
      records: 245,
      status: 'completed',
      errors: 0,
      warnings: 3
    },
    {
      id: 2,
      fileName: 'resultats_master_2023.csv',
      importDate: '2024-01-12 09:15',
      records: 89,
      status: 'completed',
      errors: 2,
      warnings: 1
    },
    {
      id: 3,
      fileName: 'evaluations_l2_janvier.xlsx',
      importDate: '2024-01-10 16:45',
      records: 156,
      status: 'error',
      errors: 15,
      warnings: 0
    }
  ]);

  const importStats = {
    totalImports: importHistory.length,
    successfulImports: importHistory.filter(h => h.status === 'completed').length,
    totalRecords: importHistory.reduce((sum, h) => sum + h.records, 0),
    totalErrors: importHistory.reduce((sum, h) => sum + h.errors, 0)
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      case 'processing':
        return <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />;
      default:
        return <FileText className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'default';
      case 'error':
        return 'destructive';
      case 'processing':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <Upload className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{importStats.totalImports}</p>
                <p className="text-sm text-muted-foreground">Imports totaux</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">{importStats.successfulImports}</p>
                <p className="text-sm text-muted-foreground">Réussis</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
                <Database className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{importStats.totalRecords}</p>
                <p className="text-sm text-muted-foreground">Enregistrements</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-500/10 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-amber-600">{importStats.totalErrors}</p>
                <p className="text-sm text-muted-foreground">Erreurs</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="import" className="space-y-4">
        <TabsList>
          <TabsTrigger value="import">Nouvel Import</TabsTrigger>
          <TabsTrigger value="history">Historique</TabsTrigger>
          <TabsTrigger value="templates">Modèles</TabsTrigger>
          <TabsTrigger value="mapping">Mapping</TabsTrigger>
        </TabsList>

        <TabsContent value="import" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileSpreadsheet className="w-5 h-5 text-emerald-500" />
                  Import Excel/CSV
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Importez vos notes depuis des fichiers Excel ou CSV avec validation automatique.
                </p>
                <div className="space-y-3">
                  <Button className="w-full">
                    <Upload className="w-4 h-4 mr-2" />
                    Sélectionner un fichier
                  </Button>
                  <div className="text-xs text-muted-foreground">
                    Formats supportés: .xlsx, .xls, .csv (max 10MB)
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5 text-blue-500" />
                  Synchronisation API
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Connectez-vous à d'autres systèmes pour synchroniser automatiquement.
                </p>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full">
                    Configurer API
                  </Button>
                  <div className="text-xs text-muted-foreground">
                    Dernière sync: Jamais
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="w-5 h-5 text-amber-500" />
                  Modèles Standard
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Téléchargez les modèles pré-formatés pour faciliter l'import.
                </p>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full">
                    Télécharger modèles
                  </Button>
                  <div className="text-xs text-muted-foreground">
                    3 modèles disponibles
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Historique des imports</h3>
            <Button variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Actualiser
            </Button>
          </div>
          
          <div className="space-y-3">
            {importHistory.map(import_ => (
              <Card key={import_.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(import_.status)}
                      <div>
                        <p className="font-medium">{import_.fileName}</p>
                        <div className="flex gap-4 text-sm text-muted-foreground">
                          <span>{import_.importDate}</span>
                          <span>{import_.records} enregistrements</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <Badge variant={getStatusColor(import_.status) as any}>
                          {import_.status === 'completed' ? 'Terminé' : 
                           import_.status === 'error' ? 'Erreur' : 'En cours'}
                        </Badge>
                        {import_.errors > 0 && (
                          <div className="text-xs text-red-600 mt-1">
                            {import_.errors} erreur{import_.errors > 1 ? 's' : ''}
                          </div>
                        )}
                        {import_.warnings > 0 && (
                          <div className="text-xs text-amber-600 mt-1">
                            {import_.warnings} avertissement{import_.warnings > 1 ? 's' : ''}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <h3 className="text-lg font-semibold">Modèles d'import</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileSpreadsheet className="w-5 h-5 text-green-600" />
                  Modèle Notes Standard
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Format Excel pour l'import de notes avec validation automatique
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Télécharger
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4 mr-2" />
                    Aperçu
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Database className="w-5 h-5 text-blue-600" />
                  Import Étudiants
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Modèle CSV pour l'import en masse d'étudiants et leurs données
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Télécharger
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4 mr-2" />
                    Aperçu
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="mapping" className="space-y-4">
          <h3 className="text-lg font-semibold">Configuration du mapping</h3>
          
          <Card>
            <CardContent className="p-6">
              <div className="text-center py-8">
                <Database className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">Configuration du mapping</h3>
                <p className="text-muted-foreground mb-4">
                  Configurez la correspondance entre vos fichiers et la base de données
                </p>
                <Button>
                  Configurer le mapping
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}