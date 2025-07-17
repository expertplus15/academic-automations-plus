import React from 'react';
import { ReleveNotesEMDTemplate, type ReleveNotesEMDData } from './ReleveNotesEMDTemplate';
import { AttestationScolariteTemplate, type AttestationScolariteData } from './AttestationScolariteTemplate';
import { BulletinNotesTemplate, type BulletinNotesData } from './BulletinNotesTemplate';
import { CertificatTemplate, type CertificatData } from './CertificatTemplate';

interface TemplateRendererProps {
  templateType: string;
  data: any;
  isEditable?: boolean;
  onDataChange?: (data: any) => void;
}

export function TemplateRenderer({ templateType, data, isEditable = false, onDataChange }: TemplateRendererProps) {
  switch (templateType) {
    case 'emd_releve':
    case 'transcript':
      return (
        <ReleveNotesEMDTemplate
          data={data as Partial<ReleveNotesEMDData>}
          isEditable={isEditable}
          onDataChange={onDataChange}
        />
      );
    
    case 'bulletin':
      return (
        <BulletinNotesTemplate
          data={data as Partial<BulletinNotesData>}
          isEditable={isEditable}
          onDataChange={onDataChange}
        />
      );
    
    case 'attestation':
    case 'attestation_scolarite':
      return (
        <AttestationScolariteTemplate
          data={data as Partial<AttestationScolariteData>}
          isEditable={isEditable}
          onDataChange={onDataChange}
        />
      );
    
    case 'certificat':
    case 'certificate':
    case 'diplome':
      return (
        <CertificatTemplate
          data={data as Partial<CertificatData>}
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

// Données par défaut pour les templates
export const getDefaultDataForTemplate = (templateType: string) => {
  switch (templateType) {
    case 'emd_releve':
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
    
    case 'bulletin':
      return {
        republique: 'République Française',
        ministere: 'Ministère de l\'Enseignement Supérieur',
        ecole: 'École Supérieure de Management',
        annee_academique: '2023/2024',
        periode: 'Semestre 1',
        numero_bulletin: 'BUL2024001',
        nom: 'DUPONT',
        prenom: 'Jean',
        matricule: 'STU2024001',
        classe: 'L3 Informatique',
        programme: 'Licence Informatique',
        niveau: 'L3',
        moyenne_generale: 14.2,
        moyenne_classe: 13.1,
        rang_classe: '5ème sur 28',
        total_credits: 30,
        credits_obtenus: 30,
        mention_generale: 'Bien',
        decision: 'Validé',
        absences_justifiees: 2,
        absences_non_justifiees: 0,
        retards: 1,
        date_emission: new Date().toLocaleDateString('fr-FR'),
        lieu_emission: 'Paris',
        directeur_pedagogique: 'Dr. Martin LEBLANC',
        professeur_principal: 'Mme. Sophie MARTIN'
      } as Partial<BulletinNotesData>;
    
    case 'attestation':
    case 'attestation_scolarite':
      return {
        republique: 'République Française',
        ministere: 'Ministère de l\'Enseignement Supérieur',
        ecole: 'École Supérieure de Management',
        annee_academique: '2023/2024',
        numero_attestation: 'ATT2024001',
        nom: 'DUPONT',
        prenom: 'Jean',
        date_naissance: '15/05/1998',
        lieu_naissance: 'Paris',
        nationalite: 'Française',
        matricule: 'STU2024001',
        programme: 'Licence Informatique',
        niveau: 'Troisième année',
        statut_inscription: 'régulièrement inscrit(e)',
        date_inscription: '15/09/2023',
        date_emission: new Date().toLocaleDateString('fr-FR'),
        lieu_emission: 'Paris',
        directeur_general: 'LE DIRECTEUR GÉNÉRAL',
        responsable_scolarite: 'Mme. Claire BERNARD'
      } as Partial<AttestationScolariteData>;
    
    case 'certificat':
    case 'certificate':
    case 'diplome':
      return {
        republique: 'République Française',
        ministere: 'Ministère de l\'Enseignement Supérieur',
        ecole: 'École Supérieure de Management',
        numero_certificat: 'CERT2024001',
        type_certificat: 'CERTIFICAT DE RÉUSSITE',
        titre_formation: 'LICENCE PROFESSIONNELLE INFORMATIQUE',
        nom: 'DUPONT',
        prenom: 'Jean',
        date_naissance: '15/05/1998',
        lieu_naissance: 'Paris',
        nationalite: 'Française',
        matricule: 'STU2024001',
        programme: 'Licence Professionnelle Informatique',
        specialisation: 'Développement Web et Mobile',
        niveau: 'Bac+3',
        duree_formation: '3 ans',
        date_debut: '01/09/2021',
        date_fin: '30/06/2024',
        moyenne_generale: 15.8,
        mention: 'Bien',
        total_credits: 180,
        rang_promotion: '3',
        taille_promotion: 45,
        date_deliberation: '25/06/2024',
        date_emission: new Date().toLocaleDateString('fr-FR'),
        lieu_emission: 'Paris',
        president_jury: 'Pr. Michel BERNARD',
        directeur_general: 'LE DIRECTEUR GÉNÉRAL',
        numero_registre: 'REG2024001'
      } as Partial<CertificatData>;
    
    default:
      return {};
  }
};