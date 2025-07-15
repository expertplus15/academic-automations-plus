import React from 'react';
import { ModuleLayout } from "@/components/layouts/ModuleLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle, Eye, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DocumentsEvaluationInterface } from '@/components/results/documents/DocumentsEvaluationInterface';

export default function Validation() {
  const navigate = useNavigate();

  return (
    <ModuleLayout 
      title="Validation" 
      subtitle="Consultation et validation des résultats avant export final"
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
              <CheckCircle className="h-5 w-5" />
              Espace de Validation
            </CardTitle>
            <CardDescription>
              Consultez, validez et exportez les résultats finalisés. Interface de contrôle qualité 
              avant la diffusion officielle des documents d'évaluation.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-blue-500" />
                <span>Consultation détaillée</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Validation finale</span>
              </div>
              <div className="flex items-center gap-2">
                <Download className="h-4 w-4 text-purple-500" />
                <span>Export sécurisé</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <DocumentsEvaluationInterface />
      </div>
    </ModuleLayout>
  );
}