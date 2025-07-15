import React from 'react';
import { ModuleLayout } from "@/components/layouts/ModuleLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GradingSystemConfig } from '@/components/results/GradingSystemConfig';

export default function GradingSystem() {
  const navigate = useNavigate();

  return (
    <ModuleLayout 
      title="Système de Notation" 
      subtitle="Configuration et gestion du système de notation"
      showHeader={true}
    >
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => navigate('/results')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour
          </Button>
        </div>

        <GradingSystemConfig />
      </div>
    </ModuleLayout>
  );
}