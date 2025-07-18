import { dutgeTestDataGenerator } from './DUTGETestDataGenerator';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

export class TestFileGenerator {
  // Générer et télécharger tous les fichiers de test
  async generateAllTestFiles(): Promise<void> {
    const zip = new JSZip();
    
    // Dossier principal
    const testFolder = zip.folder("DUTGE_Test_Files");
    if (!testFolder) throw new Error("Impossible de créer le dossier de test");

    // 1. Fichier d'import des étudiants
    const studentsCSV = dutgeTestDataGenerator.generateStudentImportCSV();
    testFolder.file("01_Import_Etudiants_DUTGE.csv", studentsCSV);

    // 2. Fichier de configuration des matières
    const matieres = dutgeTestDataGenerator.generateMatieres();
    const matieresCSV = this.generateMatieresCSV(matieres);
    testFolder.file("02_Configuration_Matieres_S3.csv", matieresCSV);

    // 3. Fichiers de notes par matière
    const notesFolder = testFolder.folder("03_Notes_Par_Matiere");
    if (notesFolder) {
      const gradesData = dutgeTestDataGenerator.generateGradesImportData();
      gradesData.forEach(({ matiere, data }) => {
        const fileName = `Notes_${matiere.replace(/[^a-zA-Z0-9]/g, '_')}.csv`;
        notesFolder.file(fileName, data);
      });
    }

    // 4. Fichier de planning des examens
    const planningExamens = this.generateExamScheduleCSV();
    testFolder.file("04_Planning_Examens_S3.csv", planningExamens);

    // 5. Templates de documents
    const templatesFolder = testFolder.folder("05_Templates_Documents");
    if (templatesFolder) {
      const templates = this.generateDocumentTemplates();
      Object.entries(templates).forEach(([name, content]) => {
        templatesFolder.file(name, content);
      });
    }

    // 6. Fichier de configuration du programme
    const programConfig = this.generateProgramConfigJSON();
    testFolder.file("06_Configuration_Programme_DUTGE.json", programConfig);

    // 7. Guide d'utilisation
    const guide = this.generateUsageGuide();
    testFolder.file("README_GUIDE_UTILISATION.md", guide);

    // Générer et télécharger le ZIP
    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, `DUTGE_Test_Suite_${new Date().toISOString().split('T')[0]}.zip`);
  }

  private generateMatieresCSV(matieres: any[]): string {
    const header = "code,intitule,type,coefficient,ects,cm,td,tp,enseignant,semester";
    const rows = matieres.map(m => 
      `${m.code},${m.intitule},${m.type},${m.coefficient},${m.ects},${m.volumeHoraire.cm},${m.volumeHoraire.td},${m.volumeHoraire.tp},${m.enseignant},${m.semester}`
    );
    return [header, ...rows].join('\n');
  }

  private generateExamScheduleCSV(): string {
    const header = "matiere_code,date_examen,heure_debut,heure_fin,salle,surveillant,type_examen,duree_minutes";
    const matieres = dutgeTestDataGenerator.generateMatieres();
    
    const examRows = matieres
      .filter(m => m.code !== 'STAGE408') // Pas d'examen pour le stage
      .map((m, index) => {
        const examDate = new Date();
        examDate.setDate(examDate.getDate() + (index * 2) + 7); // Étaler sur 2 semaines
        
        const heureDebut = index % 2 === 0 ? "08:00" : "14:00";
        const heureFin = index % 2 === 0 ? "10:00" : "16:00";
        const salle = `A${200 + index}`;
        const surveillant = `Surveillant ${index + 1}`;
        
        return `${m.code},${examDate.toISOString().split('T')[0]},${heureDebut},${heureFin},${salle},${surveillant},Ecrit,120`;
      });
    
    return [header, ...examRows].join('\n');
  }

  private generateDocumentTemplates(): Record<string, string> {
    return {
      "Releve_Notes_Template.html": this.generateReleveNotesTemplate(),
      "Attestation_Reussite_Template.html": this.generateAttestationTemplate(),
      "Bulletin_Classe_Template.html": this.generateBulletinClasseTemplate(),
      "Diplome_Template.html": this.generateDiplomeTemplate()
    };
  }

  private generateReleveNotesTemplate(): string {
    return `
<!DOCTYPE html>
<html>
<head>
    <title>Relevé de Notes - {{student_name}}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { text-align: center; margin-bottom: 30px; }
        .logo { width: 100px; height: auto; }
        .student-info { margin: 20px 0; }
        .grades-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .grades-table th, .grades-table td { border: 1px solid #ccc; padding: 8px; text-align: left; }
        .grades-table th { background-color: #f5f5f5; }
        .signature { text-align: right; margin-top: 40px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>UNIVERSITÉ DE GESTION</h1>
        <h2>Relevé de Notes</h2>
        <p>DUT Gestion des Entreprises - Semestre 3</p>
    </div>
    
    <div class="student-info">
        <p><strong>Étudiant :</strong> {{student_name}}</p>
        <p><strong>Numéro étudiant :</strong> {{student_number}}</p>
        <p><strong>Classe :</strong> {{class_name}}</p>
        <p><strong>Année universitaire :</strong> {{academic_year}}</p>
    </div>
    
    <table class="grades-table">
        <thead>
            <tr>
                <th>Matière</th>
                <th>CC1</th>
                <th>CC2</th>
                <th>TD</th>
                <th>TP</th>
                <th>Examen</th>
                <th>Moyenne</th>
                <th>ECTS</th>
            </tr>
        </thead>
        <tbody>
            {{#each subjects}}
            <tr>
                <td>{{name}}</td>
                <td>{{cc1}}</td>
                <td>{{cc2}}</td>
                <td>{{td}}</td>
                <td>{{tp}}</td>
                <td>{{exam}}</td>
                <td><strong>{{average}}</strong></td>
                <td>{{ects}}</td>
            </tr>
            {{/each}}
        </tbody>
    </table>
    
    <div style="margin-top: 20px;">
        <p><strong>Moyenne générale :</strong> {{overall_average}}/20</p>
        <p><strong>Total ECTS acquis :</strong> {{total_ects}}/30</p>
        <p><strong>Mention :</strong> {{mention}}</p>
    </div>
    
    <div class="signature">
        <p>Fait le {{date}}</p>
        <p>Le Directeur des Études</p>
        <br><br>
        <p>{{director_name}}</p>
    </div>
</body>
</html>`;
  }

  private generateAttestationTemplate(): string {
    return `
<!DOCTYPE html>
<html>
<head>
    <title>Attestation de Réussite</title>
    <style>
        body { font-family: 'Times New Roman', serif; margin: 40px; text-align: center; }
        .header { margin-bottom: 50px; }
        .title { font-size: 24px; font-weight: bold; margin: 30px 0; }
        .content { text-align: justify; line-height: 1.6; margin: 30px 0; }
        .signature { text-align: right; margin-top: 60px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>UNIVERSITÉ DE GESTION</h1>
        <h2>DÉPARTEMENT GESTION DES ENTREPRISES</h2>
    </div>
    
    <div class="title">
        ATTESTATION DE RÉUSSITE
    </div>
    
    <div class="content">
        <p>Le Directeur des Études du Département Gestion des Entreprises de l'Université de Gestion atteste que :</p>
        
        <p style="text-align: center; font-weight: bold; margin: 30px 0;">
            {{student_title}} {{student_name}}<br>
            Né(e) le {{birth_date}} à {{birth_place}}<br>
            Numéro étudiant : {{student_number}}
        </p>
        
        <p>a validé avec succès le <strong>{{semester_name}}</strong> du cursus <strong>DUT Gestion des Entreprises</strong> avec une moyenne générale de <strong>{{overall_average}}/20</strong> et a obtenu <strong>{{total_ects}} crédits ECTS</strong>.</p>
        
        <p>Cette attestation est délivrée pour valoir ce que de droit.</p>
    </div>
    
    <div class="signature">
        <p>Fait à {{city}}, le {{date}}</p>
        <br><br>
        <p>Le Directeur des Études</p>
        <br><br>
        <p>{{director_name}}</p>
    </div>
    
    <div style="margin-top: 40px; text-align: center; font-size: 12px;">
        <p>Université de Gestion - {{address}} - Tél: {{phone}} - Email: {{email}}</p>
    </div>
</body>
</html>`;
  }

  private generateBulletinClasseTemplate(): string {
    return `
<!DOCTYPE html>
<html>
<head>
    <title>Bulletin de Classe - {{class_name}}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; font-size: 12px; }
        .header { text-align: center; margin-bottom: 20px; }
        .class-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .class-table th, .class-table td { border: 1px solid #ccc; padding: 4px; text-align: center; }
        .class-table th { background-color: #f0f0f0; font-weight: bold; }
        .stats { margin-top: 20px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>BULLETIN DE CLASSE</h1>
        <h2>{{class_name}} - {{semester_name}}</h2>
        <p>Année universitaire {{academic_year}}</p>
    </div>
    
    <table class="class-table">
        <thead>
            <tr>
                <th rowspan="2">Rang</th>
                <th rowspan="2">Nom</th>
                <th rowspan="2">Prénom</th>
                <th colspan="8">Matières</th>
                <th rowspan="2">Moyenne</th>
                <th rowspan="2">ECTS</th>
            </tr>
            <tr>
                <th>COMPTA</th>
                <th>GEST</th>
                <th>MARK</th>
                <th>DROIT</th>
                <th>INFO</th>
                <th>LANG</th>
                <th>COMM</th>
                <th>STAGE</th>
            </tr>
        </thead>
        <tbody>
            {{#each students}}
            <tr>
                <td>{{rank}}</td>
                <td>{{last_name}}</td>
                <td>{{first_name}}</td>
                <td>{{grades.compta}}</td>
                <td>{{grades.gest}}</td>
                <td>{{grades.mark}}</td>
                <td>{{grades.droit}}</td>
                <td>{{grades.info}}</td>
                <td>{{grades.lang}}</td>
                <td>{{grades.comm}}</td>
                <td>{{grades.stage}}</td>
                <td><strong>{{overall_average}}</strong></td>
                <td>{{ects}}</td>
            </tr>
            {{/each}}
        </tbody>
    </table>
    
    <div class="stats">
        <h3>Statistiques de la classe</h3>
        <p><strong>Effectif :</strong> {{total_students}} étudiants</p>
        <p><strong>Moyenne de classe :</strong> {{class_average}}/20</p>
        <p><strong>Médiane :</strong> {{median}}/20</p>
        <p><strong>Mention Très Bien (≥16) :</strong> {{excellent_count}} ({{excellent_percent}}%)</p>
        <p><strong>Mention Bien (≥14) :</strong> {{good_count}} ({{good_percent}}%)</p>
        <p><strong>Mention Assez Bien (≥12) :</strong> {{fair_count}} ({{fair_percent}}%)</p>
        <p><strong>Admis (≥10) :</strong> {{pass_count}} ({{pass_percent}}%)</p>
    </div>
    
    <div style="text-align: right; margin-top: 30px;">
        <p>Édité le {{date}}</p>
    </div>
</body>
</html>`;
  }

  private generateDiplomeTemplate(): string {
    return `
<!DOCTYPE html>
<html>
<head>
    <title>Diplôme DUT Gestion des Entreprises</title>
    <style>
        body { 
            font-family: 'Times New Roman', serif; 
            margin: 0; 
            padding: 40px; 
            background: linear-gradient(45deg, #f8f9fa, #e9ecef);
            min-height: 100vh;
        }
        .diploma-container {
            background: white;
            padding: 60px;
            border: 5px solid #2c3e50;
            border-radius: 20px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }
        .header { text-align: center; margin-bottom: 40px; }
        .university { font-size: 28px; font-weight: bold; color: #2c3e50; }
        .degree-title { 
            font-size: 36px; 
            font-weight: bold; 
            margin: 30px 0; 
            color: #8b4513;
            text-decoration: underline;
        }
        .content { text-align: center; line-height: 2; font-size: 18px; }
        .student-name { 
            font-size: 32px; 
            font-weight: bold; 
            color: #2c3e50; 
            margin: 20px 0;
            text-transform: uppercase;
        }
        .signatures { 
            display: flex; 
            justify-content: space-between; 
            margin-top: 60px; 
            text-align: center;
        }
        .seal { 
            position: absolute; 
            bottom: 100px; 
            right: 100px; 
            width: 120px; 
            height: 120px; 
            border: 3px solid #8b4513; 
            border-radius: 50%; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            background: #f8f9fa;
        }
    </style>
</head>
<body>
    <div class="diploma-container">
        <div class="header">
            <div class="university">UNIVERSITÉ DE GESTION</div>
            <div style="font-size: 18px; margin-top: 10px;">ÉTABLISSEMENT D'ENSEIGNEMENT SUPÉRIEUR</div>
        </div>
        
        <div class="content">
            <div class="degree-title">DIPLÔME UNIVERSITAIRE DE TECHNOLOGIE</div>
            <div style="font-size: 24px; margin: 20px 0;">GESTION DES ENTREPRISES</div>
            
            <p style="margin: 40px 0;">Le Président de l'Université de Gestion</p>
            <p>Vu les lois et règlements en vigueur,</p>
            <p>Vu les délibérations du jury en date du {{jury_date}},</p>
            
            <p style="margin: 40px 0; font-size: 20px;">
                <strong>CONFÈRE À</strong>
            </p>
            
            <div class="student-name">{{student_name}}</div>
            
            <p>Né(e) le {{birth_date}} à {{birth_place}}</p>
            
            <p style="margin: 40px 0; font-size: 20px;">
                <strong>LE GRADE DE</strong><br>
                <span style="font-size: 24px; color: #8b4513;">DIPLÔMÉ UNIVERSITAIRE DE TECHNOLOGIE</span><br>
                <strong>EN GESTION DES ENTREPRISES</strong>
            </p>
            
            <p>avec la mention <strong>{{mention}}</strong></p>
            
            <p style="margin-top: 40px;">Pour lui servir et valoir ce que de droit.</p>
        </div>
        
        <div class="signatures">
            <div>
                <p>Le Directeur des Études</p>
                <br><br>
                <p>{{director_name}}</p>
            </div>
            <div>
                <p>Le Président de l'Université</p>
                <br><br>
                <p>{{president_name}}</p>
            </div>
        </div>
        
        <div style="text-align: center; margin-top: 30px;">
            <p>Délivré le {{date}}</p>
        </div>
        
        <div class="seal">
            <div style="text-align: center; font-size: 12px; font-weight: bold;">
                SCEAU<br>DE<br>L'UNIVERSITÉ
            </div>
        </div>
    </div>
</body>
</html>`;
  }

  private generateProgramConfigJSON(): string {
    const config = {
      program: dutgeTestDataGenerator.generateDUTGEProgram(),
      subjects: dutgeTestDataGenerator.generateMatieres(),
      classes: dutgeTestDataGenerator.generateClasses(),
      evaluationTypes: [
        { code: "CC1", name: "Contrôle Continu 1", weight: 20 },
        { code: "CC2", name: "Contrôle Continu 2", weight: 20 },
        { code: "TD", name: "Travaux Dirigés", weight: 15 },
        { code: "TP", name: "Travaux Pratiques", weight: 15 },
        { code: "EXAM", name: "Examen Final", weight: 30 }
      ],
      gradingRules: {
        minPassingGrade: 10,
        compensationThreshold: 8,
        maxCompensation: 2,
        ectsValidationThreshold: 10
      },
      mentions: [
        { name: "Très Bien", minGrade: 16 },
        { name: "Bien", minGrade: 14 },
        { name: "Assez Bien", minGrade: 12 },
        { name: "Passable", minGrade: 10 }
      ]
    };
    
    return JSON.stringify(config, null, 2);
  }

  private generateUsageGuide(): string {
    return `# Guide d'Utilisation - Suite de Tests DUTGE

## 📋 Vue d'ensemble

Ce package contient tous les fichiers nécessaires pour tester complètement le module "Évaluations & Résultats" avec le cas d'usage DUTGE (DUT Gestion des Entreprises).

## 📁 Contenu du Package

### 1. Import des Étudiants
- **01_Import_Etudiants_DUTGE.csv**
  - 60 étudiants répartis en 2 classes (DUTGE2-A et DUTGE2-B)
  - Colonnes : matricule, nom, prénom, dateNaissance, email, telephone, classe

### 2. Configuration des Matières
- **02_Configuration_Matieres_S3.csv**
  - 8 matières du semestre 3
  - Colonnes : code, intitulé, type, coefficient, ECTS, volumes horaires, enseignant

### 3. Notes par Matière (Dossier)
- **03_Notes_Par_Matiere/**
  - 8 fichiers CSV (un par matière)
  - Colonnes : matricule, cc1, cc2, td, tp, examen_final
  - 60 lignes par fichier (une par étudiant)

### 4. Planning des Examens
- **04_Planning_Examens_S3.csv**
  - Planning complet des examens du semestre 3
  - Colonnes : matiere_code, date_examen, heure_debut, heure_fin, salle, surveillant, type_examen, duree_minutes

### 5. Templates de Documents (Dossier)
- **05_Templates_Documents/**
  - Relevé_Notes_Template.html
  - Attestation_Reussite_Template.html
  - Bulletin_Classe_Template.html
  - Diplome_Template.html

### 6. Configuration du Programme
- **06_Configuration_Programme_DUTGE.json**
  - Configuration complète du programme DUTGE
  - Règles de notation, mentions, types d'évaluation

## 🚀 Procédure de Test

### Phase 1 : Configuration Initiale
1. Créer le programme DUTGE dans le système
2. Importer la configuration depuis le fichier JSON
3. Configurer les 8 matières du semestre 3
4. Créer les 2 classes (DUTGE2-A et DUTGE2-B)

### Phase 2 : Import des Étudiants
1. Utiliser le fichier **01_Import_Etudiants_DUTGE.csv**
2. Vérifier la répartition : 30 en classe A, 30 en classe B
3. Contrôler la génération des numéros étudiants (2425GE001 à 2425GE060)

### Phase 3 : Saisie des Notes
1. Tester la saisie individuelle avec quelques étudiants
2. Utiliser la saisie matricielle par matière
3. Importer les notes en lot avec les fichiers du dossier **03_Notes_Par_Matiere/**
4. Vérifier les calculs automatiques de moyennes

### Phase 4 : Validation et Workflow
1. Tester le workflow de validation des notes
2. Publier les notes aux étudiants
3. Gérer les réclamations et corrections

### Phase 5 : Génération de Documents
1. Utiliser les templates du dossier **05_Templates_Documents/**
2. Générer les relevés de notes pour tous les étudiants
3. Produire les attestations de réussite
4. Créer le bulletin de classe complet

## 📊 Données de Test

### Répartition des Profils Étudiants
- **Excellents (16+)** : ~10% des étudiants
- **Bons (13-16)** : ~30% des étudiants  
- **Moyens (11-13)** : ~40% des étudiants
- **En difficulté (8-11)** : ~20% des étudiants

### Matières du Semestre 3
1. **COMPTA401** - Comptabilité Approfondie (5 ECTS, Coeff. 4)
2. **GEST402** - Contrôle de Gestion (5 ECTS, Coeff. 4)
3. **MARK403** - Marketing Stratégique (4 ECTS, Coeff. 3)
4. **DROIT404** - Droit des Sociétés (4 ECTS, Coeff. 3)
5. **INFO405** - Systèmes d'Information (4 ECTS, Coeff. 3)
6. **LANG406** - Anglais des Affaires (3 ECTS, Coeff. 2)
7. **COMM407** - Communication Professionnelle (3 ECTS, Coeff. 2)
8. **STAGE408** - Stage en Entreprise (8 ECTS, Coeff. 6)

## ✅ Points de Contrôle

### Configuration
- [ ] Programme DUTGE créé avec 120 ECTS sur 4 semestres
- [ ] 8 matières configurées avec coefficients et volumes horaires
- [ ] 2 classes créées avec capacité de 30 étudiants chacune
- [ ] Types d'évaluation définis (CC1, CC2, TD, TP, Examen)

### Import Étudiants
- [ ] 60 étudiants importés sans erreur
- [ ] Répartition correcte : 30 en A, 30 en B
- [ ] Numéros étudiants générés automatiquement
- [ ] Pas d'étudiants orphelins

### Saisie Notes
- [ ] 480 notes saisies (60 étudiants × 8 matières)
- [ ] Toutes les notes entre 0 et 20
- [ ] Calculs de moyennes corrects
- [ ] Diversité des profils d'étudiants respectée

### Documents
- [ ] Relevés générés pour les 60 étudiants
- [ ] Templates correctement appliqués
- [ ] Variables dynamiques remplacées
- [ ] Formats d'export fonctionnels

## 🔧 Troubleshooting

### Erreurs Communes
1. **Import étudiant échoue** : Vérifier le format des dates (YYYY-MM-DD)
2. **Notes hors limites** : Toutes les notes doivent être entre 0 et 20
3. **Calculs incorrects** : Vérifier les coefficients des matières
4. **Documents vides** : Contrôler la correspondance des variables

### Support
Pour toute question ou problème, consulter :
- Documentation technique du module
- Logs d'exécution des tests
- Guide utilisateur de la plateforme

---

**Dernière mise à jour :** ${new Date().toLocaleDateString()}
**Version des données de test :** 1.0
**Contact support :** support@universite-gestion.fr
`;
  }

  // Méthode utilitaire pour télécharger un fichier unique
  downloadSingleFile(filename: string, content: string, mimeType: string = 'text/csv'): void {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

export const testFileGenerator = new TestFileGenerator();