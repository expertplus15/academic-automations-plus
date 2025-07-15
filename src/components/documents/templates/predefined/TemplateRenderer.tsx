import React from 'react';
import { ReleveNotesEMDTemplate, type ReleveNotesEMDData } from './ReleveNotesEMDTemplate';

interface TemplateRendererProps {
  templateType: string;
  data: any;
  isEditable?: boolean;
  onDataChange?: (data: any) => void;
}

export function TemplateRenderer({ templateType, data, isEditable = false, onDataChange }: TemplateRendererProps) {
  switch (templateType) {
    case 'emd_releve':
    case 'bulletin':  // Mapping pour les types de la base
    case 'transcript':
      return (
        <ReleveNotesEMDTemplate
          data={data as Partial<ReleveNotesEMDData>}
          isEditable={isEditable}
          onDataChange={onDataChange}
        />
      );
    
    default:
      return (
        <div className="p-8 text-center border-2 border-dashed border-gray-300 rounded-lg">
          <p className="text-gray-500">Template "{templateType}" non trouvé</p>
          <p className="text-sm text-gray-400 mt-2">
            Créez d'abord un template pour ce type de document dans le module Documentation
          </p>
          <div className="mt-4 text-xs text-muted-foreground">
            Type: {templateType} | Données: {Object.keys(data || {}).length} propriétés
          </div>
        </div>
      );
  }
}

// Données par défaut pour le template EMD
export const getDefaultDataForTemplate = (templateType: string) => {
  switch (templateType) {
    case 'emd_releve':
    case 'bulletin':
    case 'transcript':
      return {
        republique: 'République Française',
        ministere: '',
        ecole: 'École Supérieure de Management',
        annee_academique: '2023/2024',
        session: 'SESSION 1',
        nom: 'AHMED HASSAN FARAH',
        niveau: 'Système Licence de Sécurité',
        systeme_etude: 'LICENCE',
        semestre1: [
          {
            matiere: 'Comptabilité',
            nature_ue: 'Fondamentale',
            credit: 15.00,
            session: 7.00,
            rattrapage: 14.00,
            coefficient: 5
          },
          {
            matiere: 'Droit de l\'entreprise',
            nature_ue: 'Fondamentale',
            credit: 12.00,
            session: 16.00,
            rattrapage: 0,
            coefficient: 4
          },
          {
            matiere: 'Administration linux',
            nature_ue: 'Fondamentale',
            credit: 13.00,
            session: 7.00,
            rattrapage: 9.40,
            coefficient: 5
          }
        ],
        semestre2: [
          {
            matiere: 'Programmation orientée système',
            nature_ue: 'Fondamentale',
            credit: 8.00,
            session: 0.00,
            rattrapage: 8.00,
            coefficient: 3
          },
          {
            matiere: 'Base de données',
            nature_ue: 'Fondamentale',
            credit: 9.00,
            session: 11.00,
            rattrapage: 10.20,
            coefficient: 5
          }
        ],
        moyenne_generale_s1: 11.65,
        moyenne_generale_s2: 10.88,
        moyenne_generale: 11.23,
        mention: 'PASSABLE',
        decision: 'ADMIS',
        date: '2024-07-31',
        directeur_general: 'LE DIRECTEUR GENERAL'
      } as Partial<ReleveNotesEMDData>;
    
    default:
      return {};
  }
};