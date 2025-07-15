import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function GradeEntryHeader() {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => navigate("/results")}
          className="hover-scale"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour
        </Button>
        <h1 className="text-lg font-semibold">Saisie des Notes</h1>
      </div>
    </div>
  );
}