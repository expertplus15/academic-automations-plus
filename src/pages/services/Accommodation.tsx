import { ServicesModuleLayout } from "@/components/layouts/ServicesModuleLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RoomBrowser } from "@/components/accommodation/RoomBrowser";
import { BookingForm } from "@/components/accommodation/BookingForm";
import { MyAccommodation } from "@/components/accommodation/MyAccommodation";
import { PaymentManager } from "@/components/accommodation/PaymentManager";
import { MaintenanceRequests } from "@/components/accommodation/MaintenanceRequests";

export default function Accommodation() {
  return (
    <ServicesModuleLayout title="Hébergement" subtitle="Internat et dortoirs">
      <div className="p-6">
        <Tabs defaultValue="browse" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="browse">Parcourir</TabsTrigger>
            <TabsTrigger value="booking">Demande</TabsTrigger>
            <TabsTrigger value="my-accommodation">Mon logement</TabsTrigger>
            <TabsTrigger value="payments">Paiements</TabsTrigger>
            <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          </TabsList>

          <TabsContent value="browse" className="mt-6">
            <RoomBrowser />
          </TabsContent>

          <TabsContent value="booking" className="mt-6">
            <BookingForm />
          </TabsContent>

          <TabsContent value="my-accommodation" className="mt-6">
            <MyAccommodation />
          </TabsContent>

          <TabsContent value="payments" className="mt-6">
            <PaymentManager />
          </TabsContent>

          <TabsContent value="maintenance" className="mt-6">
            <MaintenanceRequests />
          </TabsContent>
        </Tabs>
      </div>
    </ServicesModuleLayout>
  );
}