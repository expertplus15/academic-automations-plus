import React from 'react';
import { ModuleLayout } from "@/components/layouts/ModuleLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, Plus, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DocumentTypesManager } from '@/components/results/documentation/DocumentTypesManager';

export default function Documentation() {
  const navigate = useNavigate();

  return (
    <ModuleLayout 
      title="Documentation" 
      subtitle="Création et gestion des types de documents d'évaluation"
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
              <FileText className="h-5 w-5" />
              Espace Documentaire
            </CardTitle>
            <CardDescription>
              Créez et configurez les différents types de documents d'évaluation : bulletins, relevés,
              attestations et certificats selon vos besoins institutionnels.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Plus className="h-4 w-4 text-blue-500" />
                <span>Création de types</span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-green-500" />
                <span>Gestion documentaire</span>
              </div>
              <div className="flex items-center gap-2">
                <Settings className="h-4 w-4 text-purple-500" />
                <span>Configuration avancée</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <DocumentTypesManager />
      </div>
    </ModuleLayout>
  );
}