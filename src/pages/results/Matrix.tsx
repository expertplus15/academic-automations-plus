import { ModuleLayout } from "@/components/layouts/ModuleLayout";
import { MatriceInterface } from "@/components/results/MatriceInterface";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

export default function Matrix() {
  const [searchParams] = useSearchParams();
  const [isNewSession, setIsNewSession] = useState(false);

  useEffect(() => {
    // Détection du paramètre ?new=true pour créer une nouvelle session
    if (searchParams.get('new') === 'true') {
      setIsNewSession(true);
    }
  }, [searchParams]);

  return (
    <ModuleLayout 
      title="Interface Matricielle" 
      subtitle={isNewSession ? "Nouvelle session collaborative démarrée" : "Saisie collaborative type Google Sheets - Édition simultanée"}
      showHeader={true}
    >
      <div className="p-6">
        <MatriceInterface isNewSession={isNewSession} />
      </div>
    </ModuleLayout>
  );
}