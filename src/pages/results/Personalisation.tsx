import React from 'react';
import { ModuleLayout } from "@/components/layouts/ModuleLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Palette, Layout, Brush } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AdvancedTemplateStudio } from '@/components/results/personalisation/AdvancedTemplateStudio';

export default function Personalisation() {
  const navigate = useNavigate();

  return (
    <ModuleLayout 
      title="Personnalisation" 
      subtitle="Studio de création et édition des templates de documents"
      showHeader={true}
    >
      <div className="p-6 animate-fade-in">
        {/* Header avec navigation */}
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="outline" 
            onClick={() => navigate("/results")}
            className="w-fit hover-scale"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour au tableau de bord
          </Button>
        </div>

        {/* Description du module */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Studio de Personnalisation
            </CardTitle>
            <CardDescription>
              Créez et personnalisez vos templates de documents avec un éditeur avancé. 
              Concevez des modèles uniques adaptés à votre identité institutionnelle.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Brush className="h-4 w-4 text-blue-500" />
                <span>Édition créative</span>
              </div>
              <div className="flex items-center gap-2">
                <Layout className="h-4 w-4 text-green-500" />
                <span>Templates personnalisés</span>
              </div>
              <div className="flex items-center gap-2">
                <Palette className="h-4 w-4 text-purple-500" />
                <span>Design sur mesure</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <AdvancedTemplateStudio />
      </div>
    </ModuleLayout>
  );
}