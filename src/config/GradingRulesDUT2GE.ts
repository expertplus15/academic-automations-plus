
export interface DUT2GESubjectConfig {
  id: string;
  name: string;
  coefficient: number;
  semester: 3 | 4;
  ccWeight: number;
  examWeight: number;
  isEliminatory: boolean;
  minGrade?: number;
}

export interface DUT2GEGradingConfig {
  subjects: DUT2GESubjectConfig[];
  compensationRules: {
    minGeneralAverage: number;
    minEliminatoryGrade: number;
    allowCompensation: boolean;
  };
  mentions: {
    tresBien: number;
    bien: number;
    assezBien: number;
    passable: number;
  };
}

export const DUT2GE_GRADING_CONFIG: DUT2GEGradingConfig = {
  subjects: [
    // Semestre 3
    { id: 'droit', name: 'Droit des Affaires', coefficient: 4, semester: 3, ccWeight: 50, examWeight: 50, isEliminatory: true, minGrade: 7 },
    { id: 'pei', name: 'Problèmes Économiques Internationaux', coefficient: 4, semester: 3, ccWeight: 50, examWeight: 50, isEliminatory: true, minGrade: 7 },
    { id: 'marketing', name: 'Mix Marketing', coefficient: 4, semester: 3, ccWeight: 50, examWeight: 50, isEliminatory: true, minGrade: 7 },
    { id: 'calcul', name: 'Calcul et Analyse des Coûts', coefficient: 4, semester: 3, ccWeight: 50, examWeight: 50, isEliminatory: true, minGrade: 7 },
    { id: 'tq', name: 'Techniques Quantitatives', coefficient: 3, semester: 3, ccWeight: 50, examWeight: 50, isEliminatory: false },
    { id: 'info', name: 'Environnement Informatique', coefficient: 3, semester: 3, ccWeight: 50, examWeight: 50, isEliminatory: false },
    { id: 'comm', name: 'Communication Professionnelle', coefficient: 3, semester: 3, ccWeight: 50, examWeight: 50, isEliminatory: false },
    { id: 'anglais', name: 'Anglais', coefficient: 3, semester: 3, ccWeight: 50, examWeight: 50, isEliminatory: false },
    { id: 'ppp3', name: 'Projet Personnel et Professionnel 3', coefficient: 2, semester: 3, ccWeight: 50, examWeight: 50, isEliminatory: false },
    
    // Semestre 4
    { id: 'finance', name: 'Finance d\'Entreprise', coefficient: 4, semester: 4, ccWeight: 50, examWeight: 50, isEliminatory: true, minGrade: 7 },
    { id: 'production', name: 'Gestion de Production', coefficient: 3, semester: 4, ccWeight: 50, examWeight: 50, isEliminatory: false },
    { id: 'strategie', name: 'Stratégie et Création', coefficient: 4, semester: 4, ccWeight: 50, examWeight: 50, isEliminatory: true, minGrade: 7 },
    { id: 'nego', name: 'Négociation', coefficient: 3, semester: 4, ccWeight: 50, examWeight: 50, isEliminatory: false },
    { id: 'tci', name: 'Commerce International', coefficient: 3, semester: 4, ccWeight: 50, examWeight: 50, isEliminatory: false },
    { id: 'anglais2', name: 'Anglais 2', coefficient: 3, semester: 4, ccWeight: 50, examWeight: 50, isEliminatory: false },
    { id: 'ppp4', name: 'Projet Personnel et Professionnel 4', coefficient: 3, semester: 4, ccWeight: 100, examWeight: 0, isEliminatory: false },
    { id: 'projet', name: 'Projet Tutoré', coefficient: 3, semester: 4, ccWeight: 50, examWeight: 50, isEliminatory: false },
    { id: 'stage', name: 'Stage', coefficient: 4, semester: 4, ccWeight: 50, examWeight: 50, isEliminatory: false }
  ],
  compensationRules: {
    minGeneralAverage: 10,
    minEliminatoryGrade: 7,
    allowCompensation: true
  },
  mentions: {
    tresBien: 16,
    bien: 14,
    assezBien: 12,
    passable: 10
  }
};

export class DUT2GEGradingEngine {
  private config = DUT2GE_GRADING_CONFIG;

  // Calculate subject average (CC + Exam)
  calculateSubjectAverage(cc: number | null, exam: number | null, subjectId: string): number | null {
    const subject = this.config.subjects.find(s => s.id === subjectId);
    if (!subject) return null;

    const ccValue = cc || 0;
    const examValue = exam || 0;

    // Handle special cases
    if (cc === null && exam === null) return null;
    if (cc === null) return examValue * (subject.examWeight / 100);
    if (exam === null) return ccValue * (subject.ccWeight / 100);

    return (ccValue * subject.ccWeight + examValue * subject.examWeight) / 100;
  }

  // Calculate semester average
  calculateSemesterAverage(subjectGrades: Record<string, number>, semester: 3 | 4): number | null {
    const semesterSubjects = this.config.subjects.filter(s => s.semester === semester);
    let totalPoints = 0;
    let totalCoefficients = 0;

    semesterSubjects.forEach(subject => {
      const grade = subjectGrades[subject.id];
      if (grade !== undefined && grade !== null) {
        totalPoints += grade * subject.coefficient;
        totalCoefficients += subject.coefficient;
      }
    });

    return totalCoefficients > 0 ? totalPoints / totalCoefficients : null;
  }

  // Calculate general average (S3 + S4)
  calculateGeneralAverage(semester3Avg: number | null, semester4Avg: number | null): number | null {
    if (semester3Avg === null || semester4Avg === null) return null;
    return (semester3Avg + semester4Avg) / 2;
  }

  // Check compensation eligibility
  checkCompensation(generalAverage: number | null, subjectGrades: Record<string, number>): boolean {
    if (!generalAverage || generalAverage < this.config.compensationRules.minGeneralAverage) {
      return false;
    }

    // Check eliminatory grades
    const eliminatorySubjects = this.config.subjects.filter(s => s.isEliminatory);
    for (const subject of eliminatorySubjects) {
      const grade = subjectGrades[subject.id];
      if (grade !== undefined && grade < (subject.minGrade || this.config.compensationRules.minEliminatoryGrade)) {
        return false;
      }
    }

    return true;
  }

  // Get mention based on average
  getMention(average: number | null): string {
    if (!average) return 'NON ÉVALUÉ';
    
    if (average >= this.config.mentions.tresBien) return 'TRÈS BIEN';
    if (average >= this.config.mentions.bien) return 'BIEN';
    if (average >= this.config.mentions.assezBien) return 'ASSEZ-BIEN';
    if (average >= this.config.mentions.passable) return 'PASSABLE';
    return 'AJOURNÉ';
  }

  // Get decision (ADMIS/AJOURNÉ)
  getDecision(generalAverage: number | null, subjectGrades: Record<string, number>): string {
    if (!generalAverage) return 'NON ÉVALUÉ';
    
    const hasCompensation = this.checkCompensation(generalAverage, subjectGrades);
    return hasCompensation ? 'ADMIS' : 'AJOURNÉ';
  }

  // Full calculation for a student
  calculateStudentResults(grades: Record<string, { cc: number | null; exam: number | null }>) {
    const subjectAverages: Record<string, number> = {};
    
    // Calculate subject averages
    Object.entries(grades).forEach(([subjectId, grade]) => {
      const average = this.calculateSubjectAverage(grade.cc, grade.exam, subjectId);
      if (average !== null) {
        subjectAverages[subjectId] = average;
      }
    });

    // Calculate semester averages
    const semester3Average = this.calculateSemesterAverage(subjectAverages, 3);
    const semester4Average = this.calculateSemesterAverage(subjectAverages, 4);
    const generalAverage = this.calculateGeneralAverage(semester3Average, semester4Average);

    // Get final results
    const mention = this.getMention(generalAverage);
    const decision = this.getDecision(generalAverage, subjectAverages);

    return {
      subjectAverages,
      semester3Average,
      semester4Average,
      generalAverage,
      mention,
      decision,
      hasCompensation: this.checkCompensation(generalAverage, subjectAverages)
    };
  }
}
