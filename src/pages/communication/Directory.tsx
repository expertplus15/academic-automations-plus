import React from 'react';
import { CommunicationModuleLayout } from '@/components/layouts/CommunicationModuleLayout';
import { ContactsList } from '@/components/communication/ContactsList';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Users, UserPlus } from 'lucide-react';

export default function Directory() {
  const headerActions = [
    {
      label: "Ajouter contact",
      icon: UserPlus,
      onClick: () => {},
      variant: 'default' as const
    }
  ];

  return (
    <ProtectedRoute allowedRoles={['admin', 'teacher', 'hr', 'student']}>
      <CommunicationModuleLayout 
        showHeader={true}
        title="Répertoire"
        subtitle="Contacts étudiants, enseignants et personnel"
        actions={headerActions}
      >
        <div className="p-6">
          <ContactsList />
        </div>
      </CommunicationModuleLayout>
    </ProtectedRoute>
  );
}