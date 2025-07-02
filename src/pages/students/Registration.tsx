
import { ModuleLayout } from "@/components/layouts/ModuleLayout";
import { UltimateRegistrationForm } from "./registration/UltimateRegistrationForm";

export default function Registration() {
  return (
    <ModuleLayout 
      title="Inscription Intelligente" 
      subtitle="Système d'inscription automatisé avec validation temps réel et gestion avancée des comptes existants"
      showHeader={true}
    >
      <div className="p-6">
        <UltimateRegistrationForm />
      </div>
    </ModuleLayout>
  );
}
