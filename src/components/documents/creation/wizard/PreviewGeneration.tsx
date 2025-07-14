import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Eye, Download, FileText, CheckCircle, AlertTriangle, Users, Settings } from 'lucide-react';

interface PreviewGenerationProps {
  data: any;
  onDataChange: (data: any) => void;
}

export function PreviewGeneration({ data, onDataChange }: PreviewGenerationProps) {
  const [previewHtml, setPreviewHtml] = useState<string>('');
  const [isGeneratingPreview, setIsGeneratingPreview] = useState(false);
  const [validationResults, setValidationResults] = useState<any>(null);

  useEffect(() => {
    if (data.template && data.students?.length > 0) {
      generatePreview();
      validateData();
    }
  }, [data.template, data.students]);

  const generatePreview = async () => {
    setIsGeneratingPreview(true);
    try {
      // Simuler un aperçu - en production, appeler l'API de prévisualisation
      const mockPreview = generateMockPreview();
      setPreviewHtml(mockPreview);
    } catch (error) {
      console.error('Erreur lors de la génération de l\'aperçu:', error);
    } finally {
      setIsGeneratingPreview(false);
    }
  };

  const generateMockPreview = () => {
    if (!data.template || !data.students?.length) return '';

    const student = data.students[0]; // Premier étudiant pour l'aperçu
    const templateName = data.template.name;
    
    return `
      <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #2563eb; margin-bottom: 10px;">${templateName}</h1>
          <p style="color: #6b7280;">Aperçu du document généré</p>
        </div>
        
        <div style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
          <h2 style="color: #374151; margin-bottom: 15px;">Informations de l'étudiant</h2>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
            <div>
              <strong>Nom complet:</strong> [NOM_ETUDIANT]
            </div>
            <div>
              <strong>Numéro étudiant:</strong> [NUMERO_ETUDIANT]
            </div>
            <div>
              <strong>Programme:</strong> [PROGRAMME]
            </div>
            <div>
              <strong>Niveau:</strong> [NIVEAU_ACADEMIQUE]
            </div>
          </div>
        </div>

        <div style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
          <h2 style="color: #374151; margin-bottom: 15px;">Contenu du document</h2>
          <p style="line-height: 1.6; color: #4b5563;">
            Ce document a été généré automatiquement le [DATE_GENERATION] 
            pour l'année académique [ANNEE_ACADEMIQUE].
          </p>
          <p style="line-height: 1.6; color: #4b5563;">
            Les informations présentées dans ce document sont certifiées conformes 
            aux données académiques officielles de l'établissement.
          </p>
        </div>

        <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 12px;">
            Document généré automatiquement - ${new Date().toLocaleDateString('fr-FR')}
          </p>
        </div>
      </div>
    `;
  };

  const validateData = () => {
    const results = {
      isValid: true,
      warnings: [] as string[],
      errors: [] as string[],
      summary: {
        studentsCount: data.students?.length || 0,
        templateSelected: !!data.template,
        parametersSet: !!data.parameters?.academicYear,
      }
    };

    // Validations
    if (!data.template) {
      results.errors.push('Aucun template sélectionné');
      results.isValid = false;
    }

    if (!data.students || data.students.length === 0) {
      results.errors.push('Aucun étudiant sélectionné');
      results.isValid = false;
    }

    if (!data.parameters?.academicYear) {
      results.warnings.push('Année académique non spécifiée');
    }

    if (data.students?.length > 100) {
      results.warnings.push('Génération en masse - temps de traitement plus long prévu');
    }

    setValidationResults(results);
  };

  const handleDownloadPreview = () => {
    const blob = new Blob([previewHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'apercu-document.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Résumé de la configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-base">
            <Settings className="w-4 h-4 mr-2" />
            Résumé de la configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Template</label>
              <div className="flex items-center space-x-2">
                {data.template ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">{data.template.name}</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-4 h-4 text-orange-500" />
                    <span className="text-sm text-muted-foreground">Non sélectionné</span>
                  </>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Étudiants</label>
              <div className="flex items-center space-x-2">
                {data.students?.length > 0 ? (
                  <>
                    <Users className="w-4 h-4 text-blue-500" />
                    <span className="text-sm">{data.students.length} sélectionné(s)</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-4 h-4 text-orange-500" />
                    <span className="text-sm text-muted-foreground">Aucun sélectionné</span>
                  </>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Paramètres</label>
              <div className="flex items-center space-x-2">
                {data.parameters?.academicYear ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">{data.parameters.academicYear}</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-4 h-4 text-orange-500" />
                    <span className="text-sm text-muted-foreground">Non configurés</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Validation et warnings */}
      {validationResults && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-base">
              {validationResults.isValid ? (
                <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
              ) : (
                <AlertTriangle className="w-4 h-4 mr-2 text-red-500" />
              )}
              Validation de la configuration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {validationResults.errors.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium text-red-600">Erreurs à corriger :</h4>
                  {validationResults.errors.map((error: string, index: number) => (
                    <div key={index} className="flex items-center space-x-2 text-sm text-red-600">
                      <AlertTriangle className="w-3 h-3" />
                      <span>{error}</span>
                    </div>
                  ))}
                </div>
              )}

              {validationResults.warnings.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium text-orange-600">Avertissements :</h4>
                  {validationResults.warnings.map((warning: string, index: number) => (
                    <div key={index} className="flex items-center space-x-2 text-sm text-orange-600">
                      <AlertTriangle className="w-3 h-3" />
                      <span>{warning}</span>
                    </div>
                  ))}
                </div>
              )}

              {validationResults.isValid && validationResults.warnings.length === 0 && (
                <div className="flex items-center space-x-2 text-sm text-green-600">
                  <CheckCircle className="w-3 h-3" />
                  <span>Configuration valide, prêt pour la génération</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Aperçu du document */}
      <Tabs defaultValue="preview" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="preview">Aperçu du document</TabsTrigger>
          <TabsTrigger value="details">Détails de génération</TabsTrigger>
        </TabsList>

        <TabsContent value="preview">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center text-base">
                  <Eye className="w-4 h-4 mr-2" />
                  Aperçu du document
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={generatePreview}
                    disabled={isGeneratingPreview || !data.template || !data.students?.length}
                  >
                    {isGeneratingPreview ? 'Génération...' : 'Actualiser'}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleDownloadPreview}
                    disabled={!previewHtml}
                  >
                    <Download className="w-4 h-4 mr-1" />
                    Télécharger
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isGeneratingPreview ? (
                <div className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="text-sm text-muted-foreground mt-2">Génération de l'aperçu...</p>
                  </div>
                </div>
              ) : previewHtml ? (
                <ScrollArea className="h-96 w-full border rounded-md">
                  <div 
                    dangerouslySetInnerHTML={{ __html: previewHtml }}
                    className="p-4"
                  />
                </ScrollArea>
              ) : (
                <div className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <h4 className="font-medium mb-2">Aucun aperçu disponible</h4>
                    <p className="text-sm text-muted-foreground">
                      Sélectionnez un template et des étudiants pour voir l'aperçu
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>Détails de la génération</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Estimation du temps de traitement</h4>
                  <div className="flex items-center space-x-4">
                    <Badge variant="outline">
                      ~{Math.max(1, Math.ceil((data.students?.length || 0) / 10))} minute(s)
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      Basé sur {data.students?.length || 0} étudiant(s)
                    </span>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Format de sortie</h4>
                  <div className="flex items-center space-x-2">
                    <Badge>PDF</Badge>
                    <span className="text-sm text-muted-foreground">
                      Un fichier PDF par étudiant
                    </span>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Variables utilisées</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>• Nom de l'étudiant</div>
                    <div>• Numéro étudiant</div>
                    <div>• Programme d'études</div>
                    <div>• Niveau académique</div>
                    <div>• Date de génération</div>
                    <div>• Année académique</div>
                  </div>
                </div>

                {data.template?.requires_approval && (
                  <div>
                    <h4 className="font-medium mb-2">Processus d'approbation</h4>
                    <div className="text-sm text-muted-foreground">
                      Ce template nécessite une approbation avant génération finale.
                      Les documents seront mis en attente d'approbation.
                    </div>
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