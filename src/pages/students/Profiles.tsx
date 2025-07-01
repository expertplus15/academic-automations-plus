
import React from 'react';
import { StudentsPageHeader } from "@/components/StudentsPageHeader";
import { StudentsProfilesManagement } from "@/components/students/StudentsProfilesManagement";

export default function Profiles() {
  return (
    <div className="min-h-screen bg-background">
      <StudentsPageHeader 
        title="Profils Étudiants" 
        subtitle="Gestion complète des profils et informations des étudiants" 
      />
      <div className="p-6">
        <StudentsProfilesManagement />
      </div>
    </div>
  );
}
