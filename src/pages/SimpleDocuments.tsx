import { SimpleDocumentGeneratorComponent } from '@/components/documents/SimpleDocumentGenerator';

export function SimpleDocuments() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Générateur de Documents Simplifié</h1>
        <p className="text-muted-foreground">
          Solution ultra-simplifiée pour générer des documents rapidement et sans erreur
        </p>
      </div>
      
      <SimpleDocumentGeneratorComponent />
    </div>
  );
}

export default SimpleDocuments;