import { ElearningPageHeader } from "@/components/ElearningPageHeader";

export default function Authoring() {
  return (
    <div className="min-h-screen bg-background">
      <ElearningPageHeader 
        title="Authoring WYSIWYG" 
        subtitle="Création de contenu e-learning" 
      />
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-card rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">Authoring WYSIWYG</h2>
            <p className="text-muted-foreground">
              Interface de création de contenu e-learning à venir.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}