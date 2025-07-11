
import { StudentsModuleLayout } from "@/components/layouts/StudentsModuleLayout";
import { UltimateRegistrationForm } from "./registration/UltimateRegistrationForm";

export default function Registration() {
  return (
    <StudentsModuleLayout 
      title="Inscription Intelligente" 
      subtitle="Système d'inscription automatisé avec validation temps réel et gestion avancée des comptes existants"
    >
      <div className="p-6">
        <UltimateRegistrationForm />
      </div>
    </StudentsModuleLayout>
  );
}
