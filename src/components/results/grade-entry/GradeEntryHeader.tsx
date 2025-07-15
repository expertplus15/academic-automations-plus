import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function GradeEntryHeader() {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => navigate("/results")}
          className="hover-scale text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour
        </Button>
        <div className="h-6 w-px bg-border" />
        <div>
          <h1 className="text-xl font-semibold text-foreground">Saisie des Notes</h1>
          <p className="text-sm text-muted-foreground mt-1">Gestion matricielle et manuelle des évaluations</p>
        </div>
      </div>
    </div>
  );
}