import { ServicesModuleLayout } from "@/components/layouts/ServicesModuleLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HealthRecord } from "@/components/health/HealthRecord";
import { AppointmentManager } from "@/components/health/AppointmentManager";
import { MedicationTracker } from "@/components/health/MedicationTracker";
import { EmergencyInfo } from "@/components/health/EmergencyInfo";
import { FileText, Stethoscope, Pill, AlertTriangle, Activity } from "lucide-react";

export default function Health() {
  return (
    <ServicesModuleLayout title="Santé & Bien-être" subtitle="Gestion médicale et accompagnement santé">
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <Tabs defaultValue="records" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="records" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Dossiers médicaux
              </TabsTrigger>
              <TabsTrigger value="appointments" className="flex items-center gap-2">
                <Stethoscope className="w-4 h-4" />
                Suivi santé
              </TabsTrigger>
              <TabsTrigger value="medications" className="flex items-center gap-2">
                <Pill className="w-4 h-4" />
                Médicaments
              </TabsTrigger>
              <TabsTrigger value="emergency" className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Urgences
              </TabsTrigger>
              <TabsTrigger value="accessibility" className="flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Accessibilité
              </TabsTrigger>
            </TabsList>

            <TabsContent value="records" className="space-y-4">
              <div className="bg-card rounded-lg border p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  Dossiers Médicaux
                </h3>
                <p className="text-muted-foreground mb-4">
                  Gestion sécurisée des dossiers de santé des étudiants conformément au RGPD.
                </p>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Consultation des dossiers</h4>
                    <p className="text-sm text-muted-foreground">Accès aux informations médicales avec contrôle d'accès strict.</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Mise à jour des données</h4>
                    <p className="text-sm text-muted-foreground">Modification sécurisée des informations de santé.</p>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="appointments" className="space-y-4">
              <div className="bg-card rounded-lg border p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Stethoscope className="w-5 h-5 text-primary" />
                  Suivi Santé & Rendez-vous
                </h3>
                <p className="text-muted-foreground mb-4">
                  Planification et suivi des rendez-vous médicaux des étudiants.
                </p>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Planification des RDV</h4>
                    <p className="text-sm text-muted-foreground">Système de prise de rendez-vous en ligne.</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Suivi médical</h4>
                    <p className="text-sm text-muted-foreground">Historique et suivi des consultations.</p>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="medications" className="space-y-4">
              <div className="bg-card rounded-lg border p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Pill className="w-5 h-5 text-primary" />
                  Gestion des Médicaments
                </h3>
                <p className="text-muted-foreground mb-4">
                  Suivi des traitements et gestion de la pharmacie étudiante.
                </p>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Ordonnances</h4>
                    <p className="text-sm text-muted-foreground">Gestion des prescriptions médicales.</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Stock pharmacie</h4>
                    <p className="text-sm text-muted-foreground">Inventaire et distribution des médicaments.</p>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="emergency" className="space-y-4">
              <div className="bg-card rounded-lg border p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-primary" />
                  Services d'Urgence
                </h3>
                <p className="text-muted-foreground mb-4">
                  Protocoles et gestion des urgences médicales sur le campus.
                </p>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Protocoles d'urgence</h4>
                    <p className="text-sm text-muted-foreground">Procédures à suivre en cas d'urgence médicale.</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Contacts d'urgence</h4>
                    <p className="text-sm text-muted-foreground">Numéros et contacts pour les situations critiques.</p>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="accessibility" className="space-y-4">
              <div className="bg-card rounded-lg border p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-primary" />
                  Services d'Accessibilité
                </h3>
                <p className="text-muted-foreground mb-4">
                  Support et accompagnement pour les étudiants en situation de handicap.
                </p>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Aménagements</h4>
                    <p className="text-sm text-muted-foreground">Adaptation des conditions d'études et d'examens.</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Accompagnement</h4>
                    <p className="text-sm text-muted-foreground">Support personnalisé et suivi individuel.</p>
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