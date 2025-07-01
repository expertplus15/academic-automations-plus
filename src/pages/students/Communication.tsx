
import React from 'react';
import { StudentsPageHeader } from "@/components/StudentsPageHeader";
import { CommunicationHub } from "@/components/communication/CommunicationHub";

export default function Communication() {
  return (
    <div className="min-h-screen bg-background">
      <StudentsPageHeader 
        title="Communication Intégrée" 
        subtitle="Messagerie et notifications pour les étudiants" 
      />
      <div className="p-6">
        <CommunicationHub />
      </div>
    </div>
  );
}
