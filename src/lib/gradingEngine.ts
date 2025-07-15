/**
 * Central Academic Grading Engine
 * Handles all grade calculations, validations, and academic logic
 */

export interface WeightingRule {
  cc: number;
  examen: number;
}

export interface GradingConfig {
  parametresGeneraux: {
    baremeDefaut: number;
    noteMinimalePassage: number;
    nombreDecimales: number;
    methodeArrondi: 'mathematical' | 'up' | 'down';
    anneeAcademique: string;
  };
  ponderation: {
    defaut: WeightingRule;
    parTypeMatiere: Record<string, WeightingRule>;
  };
  mentions: Array<{
    min: number;
    max: number;
    label: string;
    couleur: string;
  }>;
  compensation: {
    active: boolean;
    noteMinimaleCompensable: number;
    type: 'intra-semestre' | 'inter-semestre' | 'annuelle';
    regles: {
      entreFondamentales: boolean;
      avecComplementaires: boolean;
      fortCoefficient: boolean;
    };
  };
}

export interface MatiereNote {
  id: string;
  cc: number;
  examen: number;
  coefficient: number;
  typeMatiere: string;
  moyenne?: number;
  total?: number;
  mention?: string;
}

export class MoteurCalculAcademique {
  private config: GradingConfig;

  constructor(config: GradingConfig) {
    this.config = config;
  }

  /**
   * Calculate subject average based on CC and exam grades
   */
  calculerMoyenneMatiere(cc: number, examen: number, typeMatiere: string = 'defaut'): number {
    const pond = this.config.ponderation.parTypeMatiere[typeMatiere] || this.config.ponderation.defaut;
    
    // Handle special cases
    if (cc === 0 && examen === 0) return 0;
    if (cc === 0) return examen * pond.examen;
    if (examen === 0) return cc * pond.cc;
    
    const moyenne = (cc * pond.cc) + (examen * pond.examen);
    return this.arrondir(moyenne);
  }

  /**
   * Calculate weighted total for a subject
   */
  calculerTotalPondere(moyenne: number, coefficient: number): number {
    return this.arrondir(moyenne * coefficient);
  }

  /**
   * Calculate general average from all subjects
   */
  calculerMoyenneGenerale(matieres: MatiereNote[]): number {
    const totalPoints = matieres.reduce((sum, m) => {
      const moyenne = m.moyenne || this.calculerMoyenneMatiere(m.cc, m.examen, m.typeMatiere);
      return sum + (moyenne * m.coefficient);
    }, 0);
    
    const totalCoeffs = matieres.reduce((sum, m) => sum + m.coefficient, 0);
    
    if (totalCoeffs === 0) return 0;
    return this.arrondir(totalPoints / totalCoeffs);
  }

  /**
   * Check compensation rules
   */
  verifierCompensation(matieres: MatiereNote[]): boolean {
    if (!this.config.compensation.active) return false;
    
    const moyenneGen = this.calculerMoyenneGenerale(matieres);
    if (moyenneGen < this.config.parametresGeneraux.noteMinimalePassage) return false;
    
    return matieres.every(m => {
      const moyenne = m.moyenne || this.calculerMoyenneMatiere(m.cc, m.examen, m.typeMatiere);
      return moyenne >= this.config.compensation.noteMinimaleCompensable ||
             moyenne >= this.config.parametresGeneraux.noteMinimalePassage;
    });
  }

  /**
   * Assign mention based on average
   */
  attribuerMention(moyenne: number): { label: string; couleur: string } | null {
    const mention = this.config.mentions.find(m => 
      moyenne >= m.min && moyenne <= m.max
    );
    
    return mention ? { label: mention.label, couleur: mention.couleur } : null;
  }

  /**
   * Round value according to configuration
   */
  arrondir(valeur: number): number {
    const decimales = this.config.parametresGeneraux.nombreDecimales;
    const facteur = Math.pow(10, decimales);
    
    switch(this.config.parametresGeneraux.methodeArrondi) {
      case 'up': return Math.ceil(valeur * facteur) / facteur;
      case 'down': return Math.floor(valeur * facteur) / facteur;
      default: return Math.round(valeur * facteur) / facteur;
    }
  }

  /**
   * Calculate ECTS credits earned
   */
  calculerECTS(matieres: MatiereNote[], ectsParMatiere: Record<string, number>): number {
    let totalECTS = 0;
    
    matieres.forEach(matiere => {
      const moyenne = matiere.moyenne || this.calculerMoyenneMatiere(matiere.cc, matiere.examen, matiere.typeMatiere);
      const ects = ectsParMatiere[matiere.id] || 0;
      
      if (moyenne >= this.config.parametresGeneraux.noteMinimalePassage) {
        totalECTS += ects;
      } else if (this.config.compensation.active && moyenne >= this.config.compensation.noteMinimaleCompensable) {
        // Partial ECTS with compensation
        totalECTS += ects * 0.5;
      }
    });
    
    return totalECTS;
  }

  /**
   * Validate grade entry
   */
  validerNote(note: number, noteMax: number = this.config.parametresGeneraux.baremeDefaut): {
    valide: boolean;
    erreurs: string[];
    avertissements: string[];
  } {
    const erreurs: string[] = [];
    const avertissements: string[] = [];

    // Range validation
    if (note < 0 || note > noteMax) {
      erreurs.push(`Note doit être entre 0 et ${noteMax}`);
    }

    // Warning for very low grades
    if (note < (noteMax * 0.3)) {
      avertissements.push('Note particulièrement basse - Vérifier la saisie');
    }

    return {
      valide: erreurs.length === 0,
      erreurs,
      avertissements
    };
  }

  /**
   * Process entire student record
   */
  traiterDossierEtudiant(matieres: MatiereNote[], ectsParMatiere: Record<string, number> = {}) {
    // Calculate averages for each subject
    const matieresAvecCalculs = matieres.map(matiere => ({
      ...matiere,
      moyenne: this.calculerMoyenneMatiere(matiere.cc, matiere.examen, matiere.typeMatiere),
      total: this.calculerTotalPondere(
        matiere.moyenne || this.calculerMoyenneMatiere(matiere.cc, matiere.examen, matiere.typeMatiere),
        matiere.coefficient
      )
    }));

    // Add mentions
    const matieresAvecMentions = matieresAvecCalculs.map(matiere => ({
      ...matiere,
      mention: this.attribuerMention(matiere.moyenne!)?.label || 'N/A'
    }));

    const moyenneGenerale = this.calculerMoyenneGenerale(matieresAvecMentions);
    const mentionGenerale = this.attribuerMention(moyenneGenerale);
    const compensation = this.verifierCompensation(matieresAvecMentions);
    const ectsObtenus = this.calculerECTS(matieresAvecMentions, ectsParMatiere);

    return {
      matieres: matieresAvecMentions,
      moyenneGenerale,
      mentionGenerale,
      decision: moyenneGenerale >= this.config.parametresGeneraux.noteMinimalePassage ? 'ADMIS' : 'AJOURNÉ',
      compensation,
      ectsObtenus,
      calculeLe: new Date().toISOString()
    };
  }
}

// Default French academic configuration
export const DEFAULT_GRADING_CONFIG: GradingConfig = {
  parametresGeneraux: {
    baremeDefaut: 20,
    noteMinimalePassage: 10,
    nombreDecimales: 2,
    methodeArrondi: 'mathematical',
    anneeAcademique: '2023/2024'
  },
  ponderation: {
    defaut: {
      cc: 0.4,
      examen: 0.6
    },
    parTypeMatiere: {
      'fondamentale': { cc: 0.4, examen: 0.6 },
      'complementaire': { cc: 0.5, examen: 0.5 },
      'projet': { cc: 0.7, examen: 0.3 }
    }
  },
  mentions: [
    { min: 16, max: 20, label: 'Très Bien', couleur: '#4caf50' },
    { min: 14, max: 15.99, label: 'Bien', couleur: '#2196f3' },
    { min: 12, max: 13.99, label: 'Assez Bien', couleur: '#ff9800' },
    { min: 10, max: 11.99, label: 'Passable', couleur: '#9e9e9e' },
    { min: 0, max: 9.99, label: 'Ajourné', couleur: '#f44336' }
  ],
  compensation: {
    active: true,
    noteMinimaleCompensable: 7,
    type: 'inter-semestre',
    regles: {
      entreFondamentales: true,
      avecComplementaires: true,
      fortCoefficient: false
    }
  }
};