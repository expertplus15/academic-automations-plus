
import { StudentsPageHeader } from "@/components/StudentsPageHeader";
import { RegistrationForm } from "./registration/RegistrationForm";

export default function Registration() {
  return (
    <div className="min-h-screen bg-background">
      <StudentsPageHeader 
        title="Inscription automatisée" 
        subtitle="Processus d'inscription en moins de 30 secondes" 
      />
      <div className="p-6">
        <RegistrationForm />
      </div>
    </div>
  );
}
