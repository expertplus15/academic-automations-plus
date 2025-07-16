import React from 'react';
import { ModuleLayout } from "@/components/layouts/ModuleLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Palette, Layout, Brush } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SimpleTemplateEditor } from '@/components/results/personalisation/SimpleTemplateEditor';

export default function RefactoredPersonalisation() {
  const navigate = useNavigate();

  return (
    <ModuleLayout 
      title="Personnalisation" 
      subtitle="Studio de création et édition des templates de documents"
      showHeader={true}
    >
      <div className="h-full flex flex-col">
        {/* Header compact */}
        <div className="flex items-center justify-between p-4 border-b bg-card/30">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate("/results")}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
            
            <div className="flex items-center gap-2">
              <Palette className="h-5 w-5 text-primary" />
              <span className="font-semibold">Studio de Personnalisation</span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
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
        </div>

        {/* Éditeur simplifié */}
        <div className="flex-1">
          <SimpleTemplateEditor />
        </div>
      </div>
    </ModuleLayout>
  );
}