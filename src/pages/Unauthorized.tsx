import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ArrowLeft } from "lucide-react";

export default function Unauthorized() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="max-w-md mx-auto text-center p-6">
        <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-8 h-8 text-destructive" />
        </div>
        
        <h1 className="text-2xl font-bold text-foreground mb-4">
          Accès non autorisé
        </h1>
        
        <p className="text-muted-foreground mb-6">
          Vous n'avez pas les permissions nécessaires pour accéder à cette page.
          Veuillez contacter votre administrateur pour obtenir les droits d'accès appropriés.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour
          </Button>
          
          <Button
            onClick={() => navigate("/dashboard")}
          >
            Tableau de bord
          </Button>
        </div>
      </div>
    </div>
  );
}