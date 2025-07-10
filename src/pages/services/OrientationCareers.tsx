import { ServicesModuleLayout } from "@/components/layouts/ServicesModuleLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Globe } from "lucide-react";

export default function OrientationCareers() {
  return (
    <ServicesModuleLayout title="Orientation & Carrière" subtitle="Accompagnement scolaire et insertion professionnelle">
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <Tabs defaultValue="orientation" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="orientation" className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Orientation scolaire
              </TabsTrigger>
              <TabsTrigger value="careers" className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                Insertion professionnelle
              </TabsTrigger>
            </TabsList>

            <TabsContent value="orientation" className="space-y-4">
              <div className="bg-card rounded-lg border p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  Services d'Orientation Scolaire
                </h3>
                <p className="text-muted-foreground mb-6">
                  Accompagnement personnalisé pour le choix d'orientation et la construction du parcours académique.
                </p>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">Conseil d'orientation</h4>
                      <p className="text-sm text-muted-foreground">Entretiens individuels avec des conseillers d'orientation pour définir le projet académique.</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">Tests d'aptitudes</h4>
                      <p className="text-sm text-muted-foreground">Évaluations psychométriques pour identifier les forces et centres d'intérêt.</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">Information sur les filières</h4>
                      <p className="text-sm text-muted-foreground">Documentation complète sur les programmes et débouchés professionnels.</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">Suivi personnalisé</h4>
                      <p className="text-sm text-muted-foreground">Accompagnement continu tout au long du parcours de formation.</p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="careers" className="space-y-4">
              <div className="bg-card rounded-lg border p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-primary" />
                  Insertion Professionnelle & Job Board
                </h3>
                <p className="text-muted-foreground mb-6">
                  Services d'aide à l'insertion professionnelle, stages et recherche d'emploi.
                </p>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">Recherche de stages</h4>
                      <p className="text-sm text-muted-foreground">Plateforme de mise en relation avec les entreprises partenaires.</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">Job board</h4>
                      <p className="text-sm text-muted-foreground">Offres d'emploi et de stages exclusives aux étudiants.</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">Ateliers CV & entretiens</h4>
                      <p className="text-sm text-muted-foreground">Formation à la recherche d'emploi et préparation aux entretiens.</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">Réseau professionnel</h4>
                      <p className="text-sm text-muted-foreground">Mise en contact avec les anciens diplômés et professionnels du secteur.</p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ServicesModuleLayout>
  );
}