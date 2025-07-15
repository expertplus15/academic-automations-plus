import React from 'react';
import { ModuleLayout } from "@/components/layouts/ModuleLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BatchValidation } from '@/components/results/validation/BatchValidation';

export default function BatchValidationPage() {
  const navigate = useNavigate();

  return (
    <ModuleLayout 
      title="Validation par Lot" 
      subtitle="Traitement groupé des validations en attente"
      showHeader={true}
    >
      <div className="p-6 animate-fade-in">
        {/* Header avec navigation */}
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="outline" 
            onClick={() => navigate("/results/validation")}
            className="w-fit hover-scale"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour à la validation
          </Button>
        </div>

        <BatchValidation />
      </div>
    </ModuleLayout>
  );
}