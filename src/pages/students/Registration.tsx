
import { StudentsPageHeader } from "@/components/StudentsPageHeader";
import { UltimateRegistrationForm } from "./registration/UltimateRegistrationForm";

export default function Registration() {
  return (
    <div className="min-h-screen bg-background">
      <StudentsPageHeader 
        title="Inscription Intelligente" 
        subtitle="Système d'inscription automatisé avec validation temps réel et gestion avancée des comptes existants" 
      />
      <div className="p-6">
        <UltimateRegistrationForm />
      </div>
    </div>
  );
}
