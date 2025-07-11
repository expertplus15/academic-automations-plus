import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { LevelExportData, SubjectExportData, ExportOptions } from '@/types/ImportExport';

export class ExportService {
  static exportToExcel(data: LevelExportData[], filename: string = 'niveaux-academiques') {
    const worksheet = XLSX.utils.json_to_sheet(data, {
      header: ['name', 'code', 'education_cycle', 'duration_years', 'semesters', 'ects_credits', 'order_index']
    });

    // Style the header
    const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
    for (let col = range.s.c; col <= range.e.c; col++) {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
      if (!worksheet[cellAddress]) continue;
      worksheet[cellAddress].s = {
        font: { bold: true, sz: 12 },
        fill: { fgColor: { rgb: 'E3F2FD' } },
        alignment: { horizontal: 'center' }
      };
    }

    // Set column headers in French
    const frenchHeaders = [
      'Nom du niveau',
      'Code',
      'Cycle d\'études',
      'Durée (années)',
      'Nombre de semestres',
      'Crédits ECTS',
      'Ordre d\'affichage'
    ];

    frenchHeaders.forEach((header, index) => {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: index });
      worksheet[cellAddress] = { v: header, t: 's' };
    });

    // Set column widths
    worksheet['!cols'] = [
      { width: 25 }, // Nom
      { width: 10 }, // Code
      { width: 20 }, // Cycle
      { width: 15 }, // Durée
      { width: 18 }, // Semestres
      { width: 15 }, // ECTS
      { width: 15 }  // Ordre
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Niveaux');

    // Add metadata sheet
    const metaData = [
      ['Export généré le', new Date().toLocaleString('fr-FR')],
      ['Nombre total de niveaux', data.length],
      ['', ''],
      ['Instructions d\'import:', ''],
      ['1. Respecter le format des colonnes', ''],
      ['2. Ne pas modifier les en-têtes', ''],
      ['3. Les codes doivent être uniques', ''],
      ['4. Les valeurs numériques doivent être positives', '']
    ];

    const metaSheet = XLSX.utils.aoa_to_sheet(metaData);
    XLSX.utils.book_append_sheet(workbook, metaSheet, 'Informations');

    XLSX.writeFile(workbook, `${filename}_${new Date().toISOString().split('T')[0]}.xlsx`);
  }

  static exportToPDF(data: LevelExportData[], filename: string = 'niveaux-academiques') {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(20);
    doc.text('Niveaux d\'Études Académiques', 20, 20);
    
    doc.setFontSize(12);
    doc.text(`Généré le: ${new Date().toLocaleDateString('fr-FR')}`, 20, 30);
    doc.text(`Nombre total: ${data.length} niveaux`, 20, 38);

    // Table
    const tableData = data.map(level => [
      level.name,
      level.code,
      this.getCycleLabel(level.education_cycle),
      level.duration_years.toString(),
      level.semesters.toString(),
      level.ects_credits?.toString() || '-',
      level.order_index.toString()
    ]);

    autoTable(doc, {
      head: [['Nom', 'Code', 'Cycle', 'Durée', 'Semestres', 'ECTS', 'Ordre']],
      body: tableData,
      startY: 50,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [33, 150, 243] },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      margin: { top: 50 }
    });

    doc.save(`${filename}_${new Date().toISOString().split('T')[0]}.pdf`);
  }

  static downloadTemplate() {
    // Template data with comprehensive examples
    const templateData = [
      {
        'Nom du niveau': 'Licence 1ère année',
        'Code': 'L1',
        'Cycle d\'études': 'license',
        'Durée (années)': 1,
        'Nombre de semestres': 2,
        'Crédits ECTS': 60,
        'Ordre d\'affichage': 1
      },
      {
        'Nom du niveau': 'Licence 2ème année',
        'Code': 'L2',
        'Cycle d\'études': 'license',
        'Durée (années)': 1,
        'Nombre de semestres': 2,
        'Crédits ECTS': 60,
        'Ordre d\'affichage': 2
      },
      {
        'Nom du niveau': 'Master 1ère année',
        'Code': 'M1',
        'Cycle d\'études': 'master',
        'Durée (années)': 1,
        'Nombre de semestres': 2,
        'Crédits ECTS': 60,
        'Ordre d\'affichage': 4
      }
    ];

    // Instructions sheet
    const instructions = [
      ['MODÈLE D\'IMPORTATION - NIVEAUX ACADÉMIQUES'],
      [''],
      ['INSTRUCTIONS IMPORTANTES:'],
      ['1. Respectez exactement les noms des colonnes'],
      ['2. Les codes doivent être uniques (pas de doublons)'],
      ['3. Cycles autorisés: license, master, doctorat, prepa, bts, custom'],
      ['4. Durée et semestres: nombres entiers positifs'],
      ['5. Crédits ECTS: nombre entier (optionnel)'],
      ['6. Ordre d\'affichage: nombre entier pour le tri'],
      [''],
      ['FORMATS REQUIS:'],
      ['• Nom du niveau: Texte (obligatoire)'],
      ['• Code: Texte court unique (obligatoire)'],
      ['• Cycle d\'études: license/master/doctorat/prepa/bts/custom'],
      ['• Durée (années): Nombre entier'],
      ['• Nombre de semestres: Nombre entier'],
      ['• Crédits ECTS: Nombre entier (peut être vide)'],
      ['• Ordre d\'affichage: Nombre entier'],
      [''],
      ['ÉTAPES:'],
      ['1. Supprimez cet onglet "Instructions"'],
      ['2. Remplissez l\'onglet "Données" avec vos niveaux'],
      ['3. Sauvegardez le fichier'],
      ['4. Importez depuis l\'interface']
    ];

    const instructionSheet = XLSX.utils.aoa_to_sheet(instructions);
    const dataSheet = XLSX.utils.json_to_sheet(templateData);
    
    // Style the data sheet headers
    const range = XLSX.utils.decode_range(dataSheet['!ref'] || 'A1');
    for (let col = range.s.c; col <= range.e.c; col++) {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
      if (!dataSheet[cellAddress]) continue;
      dataSheet[cellAddress].s = {
        font: { bold: true, sz: 12 },
        fill: { fgColor: { rgb: 'E3F2FD' } },
        alignment: { horizontal: 'center' }
      };
    }

    // Set column widths for data sheet
    dataSheet['!cols'] = [
      { width: 25 }, // Nom
      { width: 10 }, // Code
      { width: 20 }, // Cycle
      { width: 15 }, // Durée
      { width: 18 }, // Semestres
      { width: 15 }, // ECTS
      { width: 15 }  // Ordre
    ];

    // Set column widths for instructions
    instructionSheet['!cols'] = [{ width: 60 }];
    
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, instructionSheet, 'Instructions');
    XLSX.utils.book_append_sheet(workbook, dataSheet, 'Données');

    XLSX.writeFile(workbook, 'modele_import_niveaux_academiques.xlsx');
  }

  // Services pour les matières
  static exportSubjectsToExcel(data: SubjectExportData[]) {
    const worksheet = XLSX.utils.json_to_sheet(data.map(subject => ({
      'Nom': subject.name,
      'Code': subject.code,
      'Description': subject.description || '',
      'Crédits ECTS': subject.credits_ects,
      'Coefficient': subject.coefficient,
      'Heures Théorie': subject.hours_theory,
      'Heures Pratique': subject.hours_practice,
      'Heures Projet': subject.hours_project,
      'Total Heures': subject.hours_theory + subject.hours_practice + subject.hours_project,
      'Statut': subject.status
    })));

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Matières');

    const fileName = `matieres_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  }

  static exportSubjectsToPDF(data: SubjectExportData[]) {
    const doc = new jsPDF();

    // En-tête
    doc.setFontSize(20);
    doc.text('Liste des Matières', 20, 20);
    
    doc.setFontSize(12);
    doc.text(`Généré le: ${new Date().toLocaleDateString('fr-FR')}`, 20, 30);
    doc.text(`Nombre total: ${data.length} matières`, 20, 40);

    // Tableau des données
    const tableData = data.map(subject => [
      subject.name,
      subject.code,
      subject.credits_ects.toString(),
      subject.coefficient.toString(),
      (subject.hours_theory + subject.hours_practice + subject.hours_project).toString(),
      subject.status
    ]);

    autoTable(doc, {
      head: [['Nom', 'Code', 'ECTS', 'Coeff.', 'Total H', 'Statut']],
      body: tableData,
      startY: 50,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [52, 152, 219] }
    });

    const fileName = `matieres_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
  }

  static downloadSubjectsTemplate() {
    // Template data with comprehensive examples
    const templateData = [
      {
        'Nom': 'Mathématiques Appliquées',
        'Code': 'MATH101',
        'Description': 'Introduction aux mathématiques pour l\'informatique',
        'Crédits ECTS': 6,
        'Coefficient': 1.5,
        'Heures Théorie': 30,
        'Heures Pratique': 15,
        'Heures Projet': 0,
        'Statut': 'active'
      },
      {
        'Nom': 'Algorithmique et Programmation',
        'Code': 'INFO102',
        'Description': 'Bases de l\'algorithmique et programmation orientée objet',
        'Crédits ECTS': 8,
        'Coefficient': 2,
        'Heures Théorie': 25,
        'Heures Pratique': 35,
        'Heures Projet': 10,
        'Statut': 'active'
      },
      {
        'Nom': 'Communication Professionnelle',
        'Code': 'COM101',
        'Description': 'Techniques de communication écrite et orale',
        'Crédits ECTS': 3,
        'Coefficient': 1,
        'Heures Théorie': 20,
        'Heures Pratique': 10,
        'Heures Projet': 5,
        'Statut': 'active'
      }
    ];

    // Instructions sheet
    const instructions = [
      ['MODÈLE D\'IMPORTATION - MATIÈRES ACADÉMIQUES'],
      [''],
      ['INSTRUCTIONS IMPORTANTES:'],
      ['1. Respectez exactement les noms des colonnes'],
      ['2. Les codes doivent être uniques (pas de doublons)'],
      ['3. Statuts autorisés: active, inactive, archived'],
      ['4. Tous les nombres doivent être positifs'],
      ['5. La description est optionnelle'],
      ['6. Les heures peuvent être à 0 si non applicable'],
      [''],
      ['FORMATS REQUIS:'],
      ['• Nom: Texte (obligatoire)'],
      ['• Code: Texte court unique (obligatoire)'],
      ['• Description: Texte long (optionnel)'],
      ['• Crédits ECTS: Nombre entier positif'],
      ['• Coefficient: Nombre décimal (ex: 1.5)'],
      ['• Heures Théorie: Nombre entier'],
      ['• Heures Pratique: Nombre entier'],
      ['• Heures Projet: Nombre entier'],
      ['• Statut: active/inactive/archived'],
      [''],
      ['CONSEILS:'],
      ['• Total heures = Théorie + Pratique + Projet'],
      ['• Coefficient affecte le calcul des moyennes'],
      ['• Codes courts facilitent la gestion (ex: MATH101)'],
      [''],
      ['ÉTAPES:'],
      ['1. Supprimez cet onglet "Instructions"'],
      ['2. Remplissez l\'onglet "Données" avec vos matières'],
      ['3. Vérifiez l\'unicité des codes'],
      ['4. Sauvegardez et importez le fichier']
    ];

    const instructionSheet = XLSX.utils.aoa_to_sheet(instructions);
    const dataSheet = XLSX.utils.json_to_sheet(templateData);
    
    // Style the data sheet headers
    const range = XLSX.utils.decode_range(dataSheet['!ref'] || 'A1');
    for (let col = range.s.c; col <= range.e.c; col++) {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
      if (!dataSheet[cellAddress]) continue;
      dataSheet[cellAddress].s = {
        font: { bold: true, sz: 12 },
        fill: { fgColor: { rgb: 'E8F5E8' } },
        alignment: { horizontal: 'center' }
      };
    }

    // Set column widths for data sheet
    dataSheet['!cols'] = [
      { width: 30 }, // Nom
      { width: 12 }, // Code
      { width: 40 }, // Description
      { width: 12 }, // ECTS
      { width: 12 }, // Coefficient
      { width: 15 }, // H. Théorie
      { width: 15 }, // H. Pratique
      { width: 15 }, // H. Projet
      { width: 12 }  // Statut
    ];

    // Set column widths for instructions
    instructionSheet['!cols'] = [{ width: 60 }];
    
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, instructionSheet, 'Instructions');
    XLSX.utils.book_append_sheet(workbook, dataSheet, 'Données');

    XLSX.writeFile(workbook, 'modele_import_matieres_academiques.xlsx');
  }

  private static getCycleLabel(cycle: string): string {
    const cycleLabels: Record<string, string> = {
      license: 'Licence',
      master: 'Master',
      doctorat: 'Doctorat',
      prepa: 'Classes Préparatoires',
      bts: 'BTS/DUT',
      custom: 'Cycle Personnalisé'
    };
    return cycleLabels[cycle] || cycle;
  }
}