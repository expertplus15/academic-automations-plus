import { ElearningPageHeader } from "@/components/ElearningPageHeader";

export default function Elearning() {
  return (
    <div className="min-h-screen bg-background">
      <ElearningPageHeader 
        title="eLearning" 
        subtitle="Plateforme d'apprentissage numérique" 
      />
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-card rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">Plateforme eLearning</h2>
            <p className="text-muted-foreground">
              Gestion des cours en ligne et ressources numériques.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}