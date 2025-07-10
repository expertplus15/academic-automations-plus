import React, { useState } from 'react';
import { ServicesModuleLayout } from "@/components/layouts/ServicesModuleLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TransportLinesMap } from "@/components/transport/TransportLinesMap";
import { ReservationForm } from "@/components/transport/ReservationForm";
import { MyReservations } from "@/components/transport/MyReservations";
import { SubscriptionWidget } from "@/components/transport/SubscriptionWidget";
import { Map, Calendar, CreditCard, History } from "lucide-react";

export default function Transport() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleReservationCreated = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <ServicesModuleLayout title="Transport scolaire" subtitle="Lignes & réservations">
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue="lines" className="space-y-6">
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="lines" className="flex items-center gap-2">
                <Map className="h-4 w-4" />
                Lignes de transport
              </TabsTrigger>
              <TabsTrigger value="reservation" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Réserver
              </TabsTrigger>
              <TabsTrigger value="my-reservations" className="flex items-center gap-2">
                <History className="h-4 w-4" />
                Mes réservations
              </TabsTrigger>
              <TabsTrigger value="subscription" className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Abonnements
              </TabsTrigger>
            </TabsList>

            <TabsContent value="lines" className="space-y-6">
              <TransportLinesMap />
            </TabsContent>

            <TabsContent value="reservation" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <TransportLinesMap />
                <ReservationForm onReservationCreated={handleReservationCreated} />
              </div>
            </TabsContent>

            <TabsContent value="my-reservations" className="space-y-6">
              <MyReservations key={refreshKey} />
            </TabsContent>

            <TabsContent value="subscription" className="space-y-6">
              <SubscriptionWidget />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ServicesModuleLayout>
  );
}