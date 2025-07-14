import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Plus, Sparkles } from 'lucide-react';

interface TemplateChoiceSelectorProps {
  onPersonalizeModel: () => void;
  onCreateFromScratch: () => void;
  onManageExisting?: () => void;
}

export function TemplateChoiceSelector({ onPersonalizeModel, onCreateFromScratch, onManageExisting }: TemplateChoiceSelectorProps) {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Templates de Documents</h1>
        <p className="text-muted-foreground text-lg">
          Choisissez votre approche pour créer un template
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Option 1: Personnaliser un modèle */}
        <Card className="hover:shadow-lg transition-all duration-200 hover-scale border-2 hover:border-primary/50">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-4">
              <FileText className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-xl">📋 Personnaliser un Modèle</CardTitle>
            <CardDescription className="text-base">
              Choisir parmi nos templates prêts à l'emploi
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-muted-foreground space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span>Templates prédéfinis (relevés, bulletins, attestations)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span>Édition rapide des sections existantes</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span>Variables pré-configurées</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span>Mise en forme professionnelle</span>
              </div>
            </div>
            
            <Button 
              onClick={onPersonalizeModel}
              className="w-full mt-6 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
              size="lg"
            >
              Commencer avec un modèle
            </Button>
          </CardContent>
        </Card>

        {/* Option 2: Créer de zéro */}
        <Card className="hover:shadow-lg transition-all duration-200 hover-scale border-2 hover:border-primary/50">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mb-4">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-xl">✨ Créer de Zéro</CardTitle>
            <CardDescription className="text-base">
              Créer un template entièrement personnalisé
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-muted-foreground space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                <span>Contrôle total sur la structure</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                <span>Éditeur par sections modulaires</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                <span>Bibliothèque de composants</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                <span>Design entièrement personnalisable</span>
              </div>
            </div>
            
            <Button 
              onClick={onCreateFromScratch}
              variant="outline"
              className="w-full mt-6 border-2 border-purple-500 text-purple-600 hover:bg-purple-50"
              size="lg"
            >
              <Plus className="h-4 w-4 mr-2" />
              Créer de zéro
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="text-center mt-8 space-y-4">
        <p className="text-sm text-muted-foreground">
          💡 Vous pourrez toujours basculer entre les deux modes pendant l'édition
        </p>
        
        <div className="border-t pt-4">
          <p className="text-sm text-muted-foreground mb-3">
            Vous avez déjà des templates ?
          </p>
          {onManageExisting && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={onManageExisting}
              className="text-xs"
            >
              📁 Gérer mes templates existants
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}