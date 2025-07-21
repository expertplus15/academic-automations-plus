import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Calculator, Award, Scale, Save, Plus, Edit2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { DEFAULT_GRADING_CONFIG, GradingConfig } from '@/lib/gradingEngine';
import { ResultsQuickActions } from '@/components/results/ResultsQuickActions';

export function GradingSystemConfig() {
  const [config, setConfig] = useState<GradingConfig>(DEFAULT_GRADING_CONFIG);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSaveConfig = async () => {
    setLoading(true);
    try {
      // TODO: Save to database
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Configuration sauvegardée",
        description: "Les paramètres de notation ont été mis à jour avec succès",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder la configuration",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      {/* Quick Actions */}
      <ResultsQuickActions
        onRefresh={() => window.location.reload()}
        onSettings={() => console.log('Settings')}
        pendingActions={0}
      />

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Général
          </TabsTrigger>
          <TabsTrigger value="weighting" className="flex items-center gap-2">
            <Scale className="w-4 h-4" />
            Pondération
          </TabsTrigger>
          <TabsTrigger value="formulas" className="flex items-center gap-2">
            <Calculator className="w-4 h-4" />
            Formules
          </TabsTrigger>
          <TabsTrigger value="mentions" className="flex items-center gap-2">
            <Award className="w-4 h-4" />
            Mentions
          </TabsTrigger>
          <TabsTrigger value="compensation">
            Compensation
          </TabsTrigger>
        </TabsList>

        {/* General Parameters */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres Généraux</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="scale">Barème par Défaut</Label>
                  <Input
                    id="scale"
                    type="number"
                    value={config.parametresGeneraux.baremeDefaut}
                    onChange={(e) => setConfig({
                      ...config,
                      parametresGeneraux: {
                        ...config.parametresGeneraux,
                        baremeDefaut: Number(e.target.value)
                      }
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="passing">Note Minimale de Passage</Label>
                  <Input
                    id="passing"
                    type="number"
                    value={config.parametresGeneraux.noteMinimalePassage}
                    onChange={(e) => setConfig({
                      ...config,
                      parametresGeneraux: {
                        ...config.parametresGeneraux,
                        noteMinimalePassage: Number(e.target.value)
                      }
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="decimals">Nombre de Décimales</Label>
                  <Select
                    value={config.parametresGeneraux.nombreDecimales.toString()}
                    onValueChange={(value) => setConfig({
                      ...config,
                      parametresGeneraux: {
                        ...config.parametresGeneraux,
                        nombreDecimales: Number(value)
                      }
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">0</SelectItem>
                      <SelectItem value="1">1</SelectItem>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="3">3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rounding">Méthode d'Arrondi</Label>
                  <Select
                    value={config.parametresGeneraux.methodeArrondi}
                    onValueChange={(value: 'mathematical' | 'up' | 'down') => setConfig({
                      ...config,
                      parametresGeneraux: {
                        ...config.parametresGeneraux,
                        methodeArrondi: value
                      }
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mathematical">Mathématique</SelectItem>
                      <SelectItem value="up">Supérieur</SelectItem>
                      <SelectItem value="down">Inférieur</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Weighting Rules */}
        <TabsContent value="weighting">
          <Card>
            <CardHeader>
              <CardTitle>Règles de Pondération</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-3">Pondération par Défaut</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Contrôle Continu (%)</Label>
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        value={config.ponderation.defaut.cc * 100}
                        onChange={(e) => setConfig({
                          ...config,
                          ponderation: {
                            ...config.ponderation,
                            defaut: {
                              ...config.ponderation.defaut,
                              cc: Number(e.target.value) / 100
                            }
                          }
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Examen (%)</Label>
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        value={config.ponderation.defaut.examen * 100}
                        onChange={(e) => setConfig({
                          ...config,
                          ponderation: {
                            ...config.ponderation,
                            defaut: {
                              ...config.ponderation.defaut,
                              examen: Number(e.target.value) / 100
                            }
                          }
                        })}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Pondération par Type de Matière</h4>
                  <div className="space-y-4">
                    {Object.entries(config.ponderation.parTypeMatiere).map(([type, weights]) => (
                      <div key={type} className="p-4 border border-border rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <Badge variant="outline" className="capitalize">{type}</Badge>
                          <Button variant="ghost" size="sm">
                            <Edit2 className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>CC (%)</Label>
                            <Input
                              type="number"
                              value={weights.cc * 100}
                              onChange={(e) => setConfig({
                                ...config,
                                ponderation: {
                                  ...config.ponderation,
                                  parTypeMatiere: {
                                    ...config.ponderation.parTypeMatiere,
                                    [type]: {
                                      ...weights,
                                      cc: Number(e.target.value) / 100
                                    }
                                  }
                                }
                              })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Examen (%)</Label>
                            <Input
                              type="number"
                              value={weights.examen * 100}
                              onChange={(e) => setConfig({
                                ...config,
                                ponderation: {
                                  ...config.ponderation,
                                  parTypeMatiere: {
                                    ...config.ponderation.parTypeMatiere,
                                    [type]: {
                                      ...weights,
                                      examen: Number(e.target.value) / 100
                                    }
                                  }
                                }
                              })}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    <Button variant="outline" size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Ajouter Type de Matière
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Formulas */}
        <TabsContent value="formulas">
          <Card>
            <CardHeader>
              <CardTitle>Formules de Calcul</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-medium mb-2">Moyenne de Matière</h4>
                <code className="text-sm text-muted-foreground">
                  (CC × pondération_CC) + (Examen × pondération_Examen)
                </code>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-medium mb-2">Total Pondéré</h4>
                <code className="text-sm text-muted-foreground">
                  moyenne_matière × coefficient
                </code>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-medium mb-2">Moyenne Générale</h4>
                <code className="text-sm text-muted-foreground">
                  Σ(total_pondéré) / Σ(coefficients)
                </code>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Mentions */}
        <TabsContent value="mentions">
          <Card>
            <CardHeader>
              <CardTitle>Barème des Mentions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {config.mentions.map((mention, index) => (
                <div key={index} className="flex items-center gap-4 p-4 border border-border rounded-lg">
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: mention.couleur }}
                  />
                  <div className="flex-1">
                    <Input
                      value={mention.label}
                      onChange={(e) => {
                        const newMentions = [...config.mentions];
                        newMentions[index] = { ...mention, label: e.target.value };
                        setConfig({ ...config, mentions: newMentions });
                      }}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      className="w-20"
                      value={mention.min}
                      onChange={(e) => {
                        const newMentions = [...config.mentions];
                        newMentions[index] = { ...mention, min: Number(e.target.value) };
                        setConfig({ ...config, mentions: newMentions });
                      }}
                    />
                    <span className="text-muted-foreground">à</span>
                    <Input
                      type="number"
                      className="w-20"
                      value={mention.max}
                      onChange={(e) => {
                        const newMentions = [...config.mentions];
                        newMentions[index] = { ...mention, max: Number(e.target.value) };
                        setConfig({ ...config, mentions: newMentions });
                      }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Compensation */}
        <TabsContent value="compensation">
          <Card>
            <CardHeader>
              <CardTitle>Règles de Compensation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="compensation-active"
                    checked={config.compensation.active}
                    onChange={(e) => setConfig({
                      ...config,
                      compensation: {
                        ...config.compensation,
                        active: e.target.checked
                      }
                    })}
                  />
                  <Label htmlFor="compensation-active">Activer la compensation</Label>
                </div>
                
                {config.compensation.active && (
                  <>
                    <div className="space-y-2">
                      <Label>Note Minimale Compensable</Label>
                      <Input
                        type="number"
                        value={config.compensation.noteMinimaleCompensable}
                        onChange={(e) => setConfig({
                          ...config,
                          compensation: {
                            ...config.compensation,
                            noteMinimaleCompensable: Number(e.target.value)
                          }
                        })}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Type de Compensation</Label>
                      <Select
                        value={config.compensation.type}
                        onValueChange={(value: 'intra-semestre' | 'inter-semestre' | 'annuelle') => setConfig({
                          ...config,
                          compensation: {
                            ...config.compensation,
                            type: value
                          }
                        })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="intra-semestre">Intra-semestre</SelectItem>
                          <SelectItem value="inter-semestre">Inter-semestre</SelectItem>
                          <SelectItem value="annuelle">Annuelle</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}