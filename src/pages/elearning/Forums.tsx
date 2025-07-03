import React from 'react';
import { ModuleLayout } from '@/components/layouts/ModuleLayout';
import { ElearningModuleSidebar } from '@/components/ElearningModuleSidebar';
import { ElearningPageHeader } from "@/components/ElearningPageHeader";
import { ForumsList } from '@/components/elearning/ForumsList';

export default function Forums() {
  return (
    <ModuleLayout sidebar={<ElearningModuleSidebar />}>
      <div className="p-8 space-y-8">
        <ElearningPageHeader 
          title="Forums de Discussion" 
          subtitle="Participez aux discussions collaboratives et échangez avec la communauté" 
        />
        
        <ForumsList
          onForumClick={(forumId) => {
            // Navigation vers le forum spécifique
            console.log('Navigate to forum:', forumId);
          }}
        />
      </div>
    </ModuleLayout>
  );
}