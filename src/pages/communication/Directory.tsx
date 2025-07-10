import React from 'react';
import { ContactsList } from '@/components/communication/ContactsList';

export default function Directory() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Répertoire</h1>
        <p className="text-muted-foreground">Contacts étudiants, enseignants et personnel</p>
      </div>
      
      <ContactsList />
    </div>
  );
}