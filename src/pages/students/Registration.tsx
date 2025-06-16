
import { StudentsPageHeader } from "@/components/StudentsPageHeader";
import { EnhancedRegistrationForm } from "./registration/EnhancedRegistrationForm";

export default function Registration() {
  return (
    <div className="min-h-screen bg-background">
      <StudentsPageHeader 
        title="Inscription automatisée" 
        subtitle="Processus d'inscription intelligent avec détection automatique des comptes existants" 
      />
      <div className="p-6">
        <EnhancedRegistrationForm />
      </div>
    </div>
  );
}
