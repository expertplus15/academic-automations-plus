import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Download, 
  Upload,
  Mail,
  FileText,
  UserCheck,
  UserX,
  Trash2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface StudentsBulkActionsProps {
  selectedStudents: string[];
  onClearSelection: () => void;
  onRefresh: () => void;
}

export function StudentsBulkActions({ 
  selectedStudents, 
  onClearSelection, 
  onRefresh 
}: StudentsBulkActionsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleBulkAction = async (action: string) => {
    if (selectedStudents.length === 0) {
      toast({
        title: "Aucune sélection",
        description: "Veuillez sélectionner au moins un étudiant",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Action réussie",
        description: `${action} appliquée à ${selectedStudents.length} étudiant(s)`,
      });
      
      onClearSelection();
      onRefresh();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'action",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (selectedStudents.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-background border border-border rounded-lg shadow-lg p-4 animate-slide-in-bottom">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-students/10 text-students">
              {selectedStudents.length} sélectionné(s)
            </Badge>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClearSelection}
              className="h-6 w-6 p-0"
            >
              ✕
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleBulkAction("Export")}
              disabled={isLoading}
            >
              <Download className="w-4 h-4 mr-2" />
              Exporter
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleBulkAction("Email")}
              disabled={isLoading}
            >
              <Mail className="w-4 h-4 mr-2" />
              Email
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleBulkAction("Documents")}
              disabled={isLoading}
            >
              <FileText className="w-4 h-4 mr-2" />
              Documents
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleBulkAction("Activer")}
              disabled={isLoading}
            >
              <UserCheck className="w-4 h-4 mr-2" />
              Activer
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleBulkAction("Suspendre")}
              disabled={isLoading}
            >
              <UserX className="w-4 h-4 mr-2" />
              Suspendre
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}