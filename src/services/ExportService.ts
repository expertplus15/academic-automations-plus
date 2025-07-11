import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { LevelExportData, ExportOptions } from '@/types/ImportExport';

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
    const template = [
      {
        name: 'Licence 1ère année',
        code: 'L1',
        education_cycle: 'license',
        duration_years: 1,
        semesters: 2,
        ects_credits: 60,
        order_index: 1
      },
      {
        name: 'Master 1ère année',
        code: 'M1',
        education_cycle: 'master',
        duration_years: 1,
        semesters: 2,
        ects_credits: 60,
        order_index: 4
      }
    ];

    const worksheet = XLSX.utils.json_to_sheet(template);
    
    // Add instructions
    const instructions = [
      ['TEMPLATE - IMPORT NIVEAUX ACADÉMIQUES'],
      [''],
      ['Instructions:'],
      ['1. Remplissez les données en respectant le format'],
      ['2. Les cycles possibles: license, master, doctorat, prepa, bts, custom'],
      ['3. Les codes doivent être uniques'],
      ['4. Supprimez ces lignes d\'instruction avant l\'import'],
      [''],
      ['Données d\'exemple:']
    ];

    const instructionSheet = XLSX.utils.aoa_to_sheet(instructions);
    
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, instructionSheet, 'Instructions');
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Template');

    XLSX.writeFile(workbook, 'template_niveaux_academiques.xlsx');
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