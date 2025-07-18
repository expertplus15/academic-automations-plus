import { supabase } from '@/integrations/supabase/client';

// Types pour les données de test DUTGE
export interface DUTGEStudent {
  matricule: string;
  nom: string;
  prenom: string;
  dateNaissance: string;
  email: string;
  telephone: string;
  classe: string;
  profileData: {
    full_name: string;
    email: string;
    role: 'student';
  };
}

export interface DUTGEMatiere {
  code: string;
  intitule: string;
  type: 'Fondamentale' | 'Complémentaire' | 'Pratique';
  coefficient: number;
  ects: number;
  volumeHoraire: { cm: number; td: number; tp: number };
  enseignant: string;
  semester: number;
}

export interface DUTGEGradeData {
  matricule: string;
  codeMatiere: string;
  notes: {
    cc1: number | null;
    cc2: number | null;
    td: number | null;
    tp: number | null;
    examenFinal: number | null;
  };
}

export interface DUTGEProgramData {
  code: string;
  intitule: string;
  type: string;
  duree: number;
  semestres: number;
  credits: number;
  departmentId: string;
}

export class DUTGETestDataGenerator {
  private lastNames = [
    "MARTIN", "BERNARD", "DUBOIS", "THOMAS", "ROBERT", "PETIT", 
    "DURAND", "LEROY", "MOREAU", "SIMON", "LAURENT", "LEFEBVRE",
    "MICHEL", "GARCIA", "DAVID", "BERTRAND", "ROUX", "VINCENT",
    "FOURNIER", "MOREL", "GIRARD", "ANDRE", "LEFEVRE", "MERCIER"
  ];

  private firstNames = [
    "Sophie", "Lucas", "Emma", "Nathan", "Léa", "Hugo", "Clara", 
    "Louis", "Inès", "Tom", "Julie", "Théo", "Camille", "Arthur",
    "Manon", "Paul", "Marie", "Antoine", "Sarah", "Nicolas",
    "Océane", "Maxime", "Chloé", "Alexandre", "Lisa", "Julien"
  ];

  // Génération du programme DUTGE complet
  generateDUTGEProgram(): DUTGEProgramData {
    return {
      code: "DUTGE",
      intitule: "DUT Gestion des Entreprises",
      type: "DUT",
      duree: 2,
      semestres: 4,
      credits: 120,
      departmentId: "dept-ge-001"
    };
  }

  // Génération des 8 matières du semestre 3
  generateMatieres(): DUTGEMatiere[] {
    return [
      {
        code: "COMPTA401",
        intitule: "Comptabilité Approfondie",
        type: "Fondamentale",
        coefficient: 4,
        ects: 5,
        volumeHoraire: { cm: 30, td: 30, tp: 0 },
        enseignant: "Prof. Durand",
        semester: 3
      },
      {
        code: "GEST402",
        intitule: "Contrôle de Gestion",
        type: "Fondamentale",
        coefficient: 4,
        ects: 5,
        volumeHoraire: { cm: 30, td: 20, tp: 10 },
        enseignant: "Prof. Martin",
        semester: 3
      },
      {
        code: "MARK403",
        intitule: "Marketing Stratégique",
        type: "Fondamentale",
        coefficient: 3,
        ects: 4,
        volumeHoraire: { cm: 25, td: 20, tp: 0 },
        enseignant: "Prof. Leblanc",
        semester: 3
      },
      {
        code: "DROIT404",
        intitule: "Droit des Sociétés",
        type: "Fondamentale",
        coefficient: 3,
        ects: 4,
        volumeHoraire: { cm: 30, td: 15, tp: 0 },
        enseignant: "Prof. Moreau",
        semester: 3
      },
      {
        code: "INFO405",
        intitule: "Systèmes d'Information",
        type: "Complémentaire",
        coefficient: 3,
        ects: 4,
        volumeHoraire: { cm: 20, td: 10, tp: 20 },
        enseignant: "Prof. Petit",
        semester: 3
      },
      {
        code: "LANG406",
        intitule: "Anglais des Affaires",
        type: "Complémentaire",
        coefficient: 2,
        ects: 3,
        volumeHoraire: { cm: 15, td: 30, tp: 0 },
        enseignant: "Prof. Smith",
        semester: 3
      },
      {
        code: "COMM407",
        intitule: "Communication Professionnelle",
        type: "Complémentaire",
        coefficient: 2,
        ects: 3,
        volumeHoraire: { cm: 20, td: 25, tp: 0 },
        enseignant: "Prof. Rousseau",
        semester: 3
      },
      {
        code: "STAGE408",
        intitule: "Stage en Entreprise",
        type: "Pratique",
        coefficient: 6,
        ects: 8,
        volumeHoraire: { cm: 0, td: 0, tp: 280 },
        enseignant: "Tuteurs",
        semester: 3
      }
    ];
  }

  // Génération des 60 étudiants
  generateStudents(count: number = 60): DUTGEStudent[] {
    const students: DUTGEStudent[] = [];
    
    for (let i = 1; i <= count; i++) {
      const lastName = this.lastNames[i % this.lastNames.length];
      const firstName = this.firstNames[i % this.firstNames.length];
      const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@etu.univ.fr`;
      
      students.push({
        matricule: `2425GE${String(i).padStart(3, '0')}`,
        nom: lastName,
        prenom: firstName,
        dateNaissance: this.generateBirthDate(2003),
        email,
        telephone: `06${String(Math.floor(Math.random() * 100000000)).padStart(8, '0')}`,
        classe: i <= 30 ? "DUTGE2-A" : "DUTGE2-B",
        profileData: {
          full_name: `${firstName} ${lastName}`,
          email,
          role: 'student' as const
        }
      });
    }
    
    return students;
  }

  // Génération des notes réalistes
  generateGrades(students: DUTGEStudent[], matieres: DUTGEMatiere[]): DUTGEGradeData[] {
    const grades: DUTGEGradeData[] = [];
    
    students.forEach(student => {
      matieres.forEach(matiere => {
        // Créer un profil d'étudiant (excellent, bon, moyen, en difficulté)
        const studentProfile = this.getStudentProfile(student.matricule);
        const baseGrade = this.getBaseGradeForProfile(studentProfile);
        
        grades.push({
          matricule: student.matricule,
          codeMatiere: matiere.code,
          notes: {
            cc1: this.randomGrade(baseGrade - 2, baseGrade + 2),
            cc2: this.randomGrade(baseGrade - 1, baseGrade + 3),
            td: matiere.volumeHoraire.td > 0 ? this.randomGrade(baseGrade - 1, baseGrade + 2) : null,
            tp: matiere.volumeHoraire.tp > 0 ? this.randomGrade(baseGrade, baseGrade + 3) : null,
            examenFinal: this.randomGrade(baseGrade - 3, baseGrade + 2)
          }
        });
      });
    });
    
    return grades;
  }

  // Profils d'étudiants pour des notes réalistes
  private getStudentProfile(matricule: string): 'excellent' | 'bon' | 'moyen' | 'difficulte' {
    const lastDigit = parseInt(matricule.slice(-1));
    if (lastDigit <= 1) return 'excellent';
    if (lastDigit <= 4) return 'bon';
    if (lastDigit <= 7) return 'moyen';
    return 'difficulte';
  }

  private getBaseGradeForProfile(profile: string): number {
    switch (profile) {
      case 'excellent': return 16;
      case 'bon': return 13;
      case 'moyen': return 11;
      case 'difficulte': return 8;
      default: return 11;
    }
  }

  private randomGrade(min: number, max: number): number {
    const grade = Math.random() * (max - min) + min;
    // Arrondi au 0.5 près et contraindre entre 0 et 20
    return Math.max(0, Math.min(20, Math.round(grade * 2) / 2));
  }

  private generateBirthDate(year: number): string {
    const month = Math.floor(Math.random() * 12) + 1;
    const day = Math.floor(Math.random() * 28) + 1;
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  }

  // Méthode pour créer les classes DUTGE
  generateClasses() {
    return [
      {
        code: "DUTGE2-A",
        intitule: "DUT GE 2ème année - Groupe A",
        capacite: 30,
        salle: "A204",
        emploiDuTemps: "matin",
        program_id: "dutge-program-id"
      },
      {
        code: "DUTGE2-B",
        intitule: "DUT GE 2ème année - Groupe B",
        capacite: 30,
        salle: "A205",
        emploiDuTemps: "apres-midi",
        program_id: "dutge-program-id"
      }
    ];
  }

  // Génération des fichiers d'import CSV/Excel
  convertToCSV(data: any[], columns: string[]): string {
    const header = columns.join(',');
    const rows = data.map(item => 
      columns.map(col => {
        const value = item[col] || '';
        // Échapper les guillemets et virgules
        return typeof value === 'string' && (value.includes(',') || value.includes('"')) 
          ? `"${value.replace(/"/g, '""')}"` 
          : value;
      }).join(',')
    );
    
    return [header, ...rows].join('\n');
  }

  // Génération du fichier d'import des étudiants
  generateStudentImportCSV(): string {
    const students = this.generateStudents(60);
    return this.convertToCSV(students, [
      'matricule', 'nom', 'prenom', 'dateNaissance', 
      'email', 'telephone', 'classe'
    ]);
  }

  // Génération du fichier d'import des notes
  generateGradesImportData(): { matiere: string; data: string }[] {
    const students = this.generateStudents(60);
    const matieres = this.generateMatieres();
    const grades = this.generateGrades(students, matieres);
    
    return matieres.map(matiere => {
      const matiereGrades = grades.filter(g => g.codeMatiere === matiere.code);
      const csvData = this.convertToCSV(
        matiereGrades.map(g => ({
          matricule: g.matricule,
          cc1: g.notes.cc1,
          cc2: g.notes.cc2,
          td: g.notes.td,
          tp: g.notes.tp,
          examen_final: g.notes.examenFinal
        })),
        ['matricule', 'cc1', 'cc2', 'td', 'tp', 'examen_final']
      );
      
      return {
        matiere: matiere.intitule,
        data: csvData
      };
    });
  }

  // Méthodes pour créer les données dans Supabase
  async createDUTGEProgramInDB() {
    const program = this.generateDUTGEProgram();
    
    // Créer d'abord le département s'il n'existe pas
    const { data: dept } = await supabase
      .from('departments')
      .upsert({
        id: program.departmentId,
        name: 'Gestion des Entreprises',
        code: 'GE',
        description: 'Département de Gestion des Entreprises'
      })
      .select()
      .single();

    // Créer le programme
    return await supabase
      .from('programs')
      .upsert({
        code: program.code,
        name: program.intitule,
        description: `Programme ${program.intitule} - ${program.duree} années, ${program.credits} ECTS`,
        duration_years: program.duree,
        total_ects: program.credits,
        department_id: dept?.id || program.departmentId
      })
      .select()
      .single();
  }

  async createDUTGEStudentsInDB() {
    const students = this.generateStudents(60);
    const insertData = [];

    for (const student of students) {
      // Note: En production, les profils seraient créés via l'authentification
      // Ici on simule juste la structure pour les tests
      const mockProfileId = `profile-${student.matricule}`;
      
      insertData.push({
        student_number: student.matricule,
        profile_id: mockProfileId,
        enrollment_date: new Date().toISOString(),
        status: 'active'
      });
    }

    // Simulation - en réalité il faudrait d'abord créer les profils auth
    console.log('Données étudiants générées pour test:', insertData.length);
    return { data: insertData, error: null };
  }
}

export const dutgeTestDataGenerator = new DUTGETestDataGenerator();