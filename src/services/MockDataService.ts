/**
 * Service pour générer des données de test réalistes pour les templates
 */
export class MockDataService {
  static getStudentMockData() {
    return {
      nom: 'AHMED HASSAN FARAH',
      prenom: 'Ahmed',
      matricule: 'STU2024001',
      email: 'ahmed.hassan@emd.dj',
      telephone: '+253 77 123 456',
      date_naissance: '1998-05-15',
      lieu_naissance: 'Djibouti',
      nationalite: 'Djiboutienne',
      programme: 'Licence en Sécurité Informatique',
      niveau: 'L3',
      semestre: 'S5',
      annee_academique: '2023/2024',
      session: 'SESSION 1',
      moyenne_generale: 13.75,
      mention: 'ASSEZ BIEN',
      decision: 'ADMIS',
      date_emission: new Date().toLocaleDateString('fr-FR'),
      
      // Adresses
      adresse_etudiant: '123 Rue de la République, Djibouti',
      adresse_parents: '456 Avenue Hassan Gouled, Djibouti',
      
      // Informations institutionnelles
      republique: 'République de Djibouti',
      ministere: 'Ministère de l\'Enseignement Supérieur et de la Recherche',
      ecole: 'École de Management De Djibouti',
      directeur_general: 'LE DIRECTEUR GENERAL',
      responsable_academique: 'Dr. Mohamed Ali HASSAN',
      
      // Notes par semestre
      semestre1: [
        {
          matiere: 'Programmation Avancée',
          code: 'PROG301',
          nature_ue: 'Fondamentale',
          credit: 6,
          session: 14.5,
          rattrapage: 0,
          coefficient: 3,
          note_finale: 14.5,
          validation: 'Validé'
        },
        {
          matiere: 'Sécurité des Réseaux',
          code: 'SEC301',
          nature_ue: 'Fondamentale',
          credit: 6,
          session: 12.0,
          rattrapage: 15.5,
          coefficient: 3,
          note_finale: 15.5,
          validation: 'Validé'
        },
        {
          matiere: 'Base de Données Avancées',
          code: 'BDD301',
          nature_ue: 'Fondamentale',
          credit: 4,
          session: 16.0,
          rattrapage: 0,
          coefficient: 2,
          note_finale: 16.0,
          validation: 'Validé'
        },
        {
          matiere: 'Anglais Technique',
          code: 'ANG301',
          nature_ue: 'Transversale',
          credit: 2,
          session: 13.0,
          rattrapage: 0,
          coefficient: 1,
          note_finale: 13.0,
          validation: 'Validé'
        }
      ],
      
      semestre2: [
        {
          matiere: 'Cryptographie',
          code: 'CRYP302',
          nature_ue: 'Fondamentale',
          credit: 6,
          session: 15.0,
          rattrapage: 0,
          coefficient: 3,
          note_finale: 15.0,
          validation: 'Validé'
        },
        {
          matiere: 'Audit Sécurité',
          code: 'AUD302',
          nature_ue: 'Fondamentale',
          credit: 4,
          session: 11.0,
          rattrapage: 13.5,
          coefficient: 2,
          note_finale: 13.5,
          validation: 'Validé'
        },
        {
          matiere: 'Projet Professionnel',
          code: 'PROJ302',
          nature_ue: 'Professionnelle',
          credit: 8,
          session: 17.0,
          rattrapage: 0,
          coefficient: 4,
          note_finale: 17.0,
          validation: 'Validé'
        }
      ],
      
      // Statistiques
      moyenne_generale_s1: 14.2,
      moyenne_generale_s2: 15.1,
      total_credits_s1: 18,
      total_credits_s2: 18,
      total_credits_annee: 36,
      credits_obtenus: 36,
      taux_reussite: 100
    };
  }

  static getTemplateVariables() {
    return {
      // Variables étudiant
      '{{nom}}': 'AHMED HASSAN FARAH',
      '{{prenom}}': 'Ahmed',
      '{{matricule}}': 'STU2024001',
      '{{email}}': 'ahmed.hassan@emd.dj',
      '{{programme}}': 'Licence en Sécurité Informatique',
      '{{niveau}}': 'L3',
      '{{annee_academique}}': '2023/2024',
      
      // Variables institutionnelles
      '{{institution}}': 'École de Management De Djibouti',
      '{{ministere}}': 'Ministère de l\'Enseignement Supérieur et de la Recherche',
      '{{republique}}': 'République de Djibouti',
      '{{directeur}}': 'LE DIRECTEUR GENERAL',
      
      // Variables académiques
      '{{moyenne_generale}}': '13.75',
      '{{mention}}': 'ASSEZ BIEN',
      '{{decision}}': 'ADMIS',
      '{{credits_obtenus}}': '36',
      '{{credits_totaux}}': '36',
      
      // Variables de date
      '{{date_emission}}': new Date().toLocaleDateString('fr-FR'),
      '{{date_aujourd_hui}}': new Date().toLocaleDateString('fr-FR'),
      '{{annee_courante}}': new Date().getFullYear().toString()
    };
  }

  static replaceVariables(content: string, variables?: Record<string, string>): string {
    const allVariables = { ...this.getTemplateVariables(), ...variables };
    
    let result = content;
    Object.entries(allVariables).forEach(([key, value]) => {
      const regex = new RegExp(key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
      result = result.replace(regex, value);
    });
    
    return result;
  }

  static getTemplatePreviewData(templateType: string) {
    const baseData = this.getStudentMockData();
    
    switch (templateType) {
      case 'emd_releve':
        return baseData;
        
      case 'bulletin':
        return {
          ...baseData,
          periode: 'Trimestre 1',
          classe: '3ème année Licence',
          rang: '3ème sur 25'
        };
        
      case 'attestation':
        return {
          ...baseData,
          type_attestation: 'Attestation de Scolarité',
          annee_inscription: '2023/2024',
          statut: 'Régulièrement inscrit(e)'
        };
        
      case 'diplome':
        return {
          ...baseData,
          titre_diplome: 'Licence en Sécurité Informatique',
          date_obtention: '2024-07-15',
          numero_diplome: 'DIP2024001',
          mention: 'Assez Bien'
        };
        
      default:
        return baseData;
    }
  }
}