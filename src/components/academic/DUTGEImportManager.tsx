
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Download, Upload, CheckCircle, AlertCircle, Users, BookOpen } from 'lucide-react';
import { FileService } from '@/services/FileService';
import { useToast } from '@/hooks/use-toast';

interface ImportStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'active' | 'completed' | 'error';
  details?: string;
}

export function DUTGEImportManager() {
  const [importSteps, setImportSteps] = useState<ImportStep[]>([
    {
      id: 'prepare',
      title: 'Préparation des données',
      description: 'Télécharger le template et préparer vos fichiers Excel',
      status: 'pending'
    },
    {
      id: 'verify',
      title: 'Vérification des prérequis',
      description: 'Vérifier que les étudiants et matières DUTGE existent',
      status: 'pending'
    },
    {
      id: 'import',
      title: 'Import des notes',
      description: 'Importer les fichiers Excel avec validation',
      status: 'pending'
    },
    {
      id: 'validate',
      title: 'Validation des données',
      description: 'Contrôler les notes importées via la vue matricielle',
      status: 'pending'
    },
    {
      id: 'publish',
      title: 'Publication des résultats',
      description: 'Publier les notes pour les rendre visibles aux étudiants',
      status: 'pending'
    }
  ]);

  const [currentStep, setCurrentStep] = useState(0);
  const [importProgress, setImportProgress] = useState(0);
  const [importing, setImporting] = useState(false);
  const { toast } = useToast();

  const updateStepStatus = (stepId: string, status: ImportStep['status'], details?: string) => {
    setImportSteps(prev => prev.map(step => 
      step.id === stepId ? { ...step, status, details } : step
    ));
  };

  const handleDownloadTemplate = async () => {
    try {
      updateStepStatus('prepare', 'active');
      const templateUrl = await FileService.downloadTemplate('grades');
      const link = document.createElement('a');
      link.href = templateUrl;
      link.download = 'template_notes_dutge.csv';
      link.click();
      URL.revokeObjectURL(templateUrl);
      
      updateStepStatus('prepare', 'completed', 'Template téléchargé avec succès');
      setCurrentStep(1);
      
      toast({
        title: "Template téléchargé",
        description: "Utilisez ce template pour préparer vos fichiers de notes DUTGE",
      });
    } catch (error) {
      updateStepStatus('prepare', 'error', 'Erreur lors du téléchargement du template');
      toast({
        title: "Erreur",
        description: "Impossible de télécharger le template",
        variant: "destructive",
      });
    }
  };

  const handleVerifyPrerequisites = async () => {
    try {
      updateStepStatus('verify', 'active');
      setImportProgress(20);
      
      // Simulation de la vérification des prérequis
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      updateStepStatus('verify', 'completed', 'Étudiants et matières DUTGE vérifiés');
      setCurrentStep(2);
      setImportProgress(40);
      
      toast({
        title: "Vérification terminée",
        description: "Les prérequis sont satisfaits pour l'import DUTGE",
      });
    } catch (error) {
      updateStepStatus('verify', 'error', 'Erreur lors de la vérification des prérequis');
    }
  };

  const handleFileImport = async (file: File) => {
    if (!file) return;

    try {
      setImporting(true);
      updateStepStatus('import', 'active');
      setImportProgress(60);

      const result = await FileService.uploadFile(file, 'grades');
      
      if (result.success) {
        updateStepStatus('import', 'completed', 
          `${result.processedData?.records || 0} notes importées avec succès`
        );
        setCurrentStep(3);
        setImportProgress(80);
        
        toast({
          title: "Import réussi",
          description: `${result.processedData?.records || 0} notes DUTGE importées`,
        });
      } else {
        updateStepStatus('import', 'error', result.error || 'Erreur lors de l\'import');
        toast({
          title: "Erreur d'import",
          description: result.error || 'Impossible d\'importer le fichier',
          variant: "destructive",
        });
      }
    } catch (error) {
      updateStepStatus('import', 'error', 'Erreur lors de l\'import du fichier');
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'import",
        variant: "destructive",
      });
    } finally {
      setImporting(false);
    }
  };

  const handleValidateData = () => {
    updateStepStatus('validate', 'active');
    // Rediriger vers la page de saisie matricielle
    window.location.href = '/results/grade-entry';
  };

  const getStepIcon = (status: ImportStep['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'active':
        return <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />;
      default:
        return <div className="w-5 h-5 border-2 border-gray-300 rounded-full" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Import des Notes DUTGE
          </CardTitle>
          <CardDescription>
            Assistant d'import spécialisé pour les notes des étudiants DUTGE avec validation automatique
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span>Progression globale</span>
              <span>{importProgress}%</span>
            </div>
            <Progress value={importProgress} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Import Steps */}
      <div className="space-y-4">
        {importSteps.map((step, index) => (
          <Card key={step.id} className={`border-l-4 ${
            step.status === 'completed' ? 'border-l-green-500' :
            step.status === 'active' ? 'border-l-blue-500' :
            step.status === 'error' ? 'border-l-red-500' :
            'border-l-gray-300'
          }`}>
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                  {getStepIcon(step.status)}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">{step.title}</h3>
                  <p className="text-muted-foreground mb-3">{step.description}</p>
                  
                  {step.details && (
                    <Alert className="mb-3">
                      <AlertDescription>{step.details}</AlertDescription>
                    </Alert>
                  )}

                  {/* Step Actions */}
                  {step.id === 'prepare' && step.status === 'pending' && (
                    <Button onClick={handleDownloadTemplate} className="flex items-center gap-2">
                      <Download className="w-4 h-4" />
                      Télécharger le template DUTGE
                    </Button>
                  )}

                  {step.id === 'verify' && step.status === 'pending' && currentStep >= 1 && (
                    <Button onClick={handleVerifyPrerequisites} className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      Vérifier les prérequis DUTGE
                    </Button>
                  )}

                  {step.id === 'import' && step.status === 'pending' && currentStep >= 2 && (
                    <div className="space-y-2">
                      <input
                        type="file"
                        accept=".xlsx,.xls,.csv"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileImport(file);
                        }}
                        className="hidden"
                        id="dutge-file-input"
                      />
                      <Button 
                        onClick={() => document.getElementById('dutge-file-input')?.click()}
                        disabled={importing}
                        className="flex items-center gap-2"
                      >
                        <Upload className="w-4 h-4" />
                        {importing ? 'Import en cours...' : 'Importer le fichier DUTGE'}
                      </Button>
                    </div>
                  )}

                  {step.id === 'validate' && step.status === 'pending' && currentStep >= 3 && (
                    <Button onClick={handleValidateData} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      Valider les données importées
                    </Button>
                  )}

                  {step.id === 'publish' && step.status === 'pending' && currentStep >= 4 && (
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        Une fois la validation terminée, revenez ici pour publier les résultats DUTGE.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* DUTGE Specific Information */}
      <Card>
        <CardHeader>
          <CardTitle>Informations spécifiques DUTGE</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold mb-2">Format attendu :</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Matricule étudiant (ex: DUTGE001)</li>
                <li>• Code matière (ex: COMPTA401, GEST402)</li>
                <li>• CC1, CC2, TD, Examen Final</li>
                <li>• Format Excel (.xlsx) ou CSV</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Validation automatique :</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Vérification des matricules</li>
                <li>• Validation des codes matières</li>
                <li>• Contrôle des notes (0-20)</li>
                <li>• Calcul automatique des moyennes</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
