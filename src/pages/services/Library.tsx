import { ServicesModuleLayout } from "@/components/layouts/ServicesModuleLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookCatalog } from "@/components/library/BookCatalog";
import { LoanManager } from "@/components/library/LoanManager";
import { DigitalLibrary } from "@/components/library/DigitalLibrary";
import { ReadingHistory } from "@/components/library/ReadingHistory";

export default function Library() {
  return (
    <ServicesModuleLayout title="Bibliothèque numérique" subtitle="Ressources documentaires">
      <div className="p-6">
        <Tabs defaultValue="catalog" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="catalog">Catalogue</TabsTrigger>
            <TabsTrigger value="loans">Mes emprunts</TabsTrigger>
            <TabsTrigger value="digital">Numérique</TabsTrigger>
            <TabsTrigger value="history">Historique</TabsTrigger>
          </TabsList>

          <TabsContent value="catalog" className="mt-6">
            <BookCatalog />
          </TabsContent>

          <TabsContent value="loans" className="mt-6">
            <LoanManager />
          </TabsContent>

          <TabsContent value="digital" className="mt-6">
            <DigitalLibrary />
          </TabsContent>

          <TabsContent value="history" className="mt-6">
            <ReadingHistory />
          </TabsContent>
        </Tabs>
      </div>
    </ServicesModuleLayout>
  );
}