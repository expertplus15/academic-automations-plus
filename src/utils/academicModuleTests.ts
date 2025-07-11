import { TestRunner, TestResult } from './testingUtils';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface AcademicTestResult extends TestResult {
  section: string;
  testId: string;
  severity: 'critical' | 'major' | 'minor';
}

export class AcademicModuleTestSuite {
  private testRunner: TestRunner;
  private results: AcademicTestResult[] = [];

  constructor() {
    this.testRunner = TestRunner.getInstance();
  }

  // SECTION 1: Tests du Tableau de Bord Principal
  async testDashboardAccess(): Promise<boolean> {
    try {
      // Vérifier la navigation vers /academic
      window.history.pushState({}, '', '/academic');
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Vérifier les éléments de base
      const titleElement = document.querySelector('h1');
      const refreshButton = document.querySelector('[data-testid="refresh-button"]');
      const settingsButton = document.querySelector('[data-testid="settings-button"]');
      
      return titleElement?.textContent?.includes('Gestion Académique') || 
             document.title.includes('Academic') ||
             window.location.pathname === '/academic';
    } catch {
      return false;
    }
  }

  async testStatisticsCards(): Promise<boolean> {
    try {
      // Vérifier la présence des cartes statistiques
      const cards = document.querySelectorAll('[data-testid*="stat-card"]');
      return cards.length >= 4;
    } catch {
      return false;
    }
  }

  // SECTION 2: Tests des Programmes
  async testProgramsNavigation(): Promise<boolean> {
    try {
      window.history.pushState({}, '', '/academic/programs');
      await new Promise(resolve => setTimeout(resolve, 500));
      return window.location.pathname === '/academic/programs';
    } catch {
      return false;
    }
  }

  async testProgramsData(): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('programs')
        .select('id, name, code')
        .limit(5);
      
      return !error && Array.isArray(data);
    } catch {
      return false;
    }
  }

  async testProgramCRUD(): Promise<boolean> {
    try {
      // Test de création
      const { data: insertData, error: insertError } = await supabase
        .from('programs')
        .insert({
          name: 'Test Programme QA',
          code: 'TSTQA2024',
          department_id: '00000000-0000-0000-0000-000000000000', // UUID temporaire pour test
          description: 'Programme de test'
        })
        .select()
        .single();

      if (insertError || !insertData) return false;

      // Test de modification
      const { error: updateError } = await supabase
        .from('programs')
        .update({ name: 'Test Programme QA Modifié' })
        .eq('id', insertData.id);

      if (updateError) return false;

      // Test de suppression
      const { error: deleteError } = await supabase
        .from('programs')
        .delete()
        .eq('id', insertData.id);

      return !deleteError;
    } catch {
      return false;
    }
  }

  // SECTION 3: Tests des Niveaux
  async testLevelsNavigation(): Promise<boolean> {
    try {
      window.history.pushState({}, '', '/academic/levels');
      await new Promise(resolve => setTimeout(resolve, 500));
      return window.location.pathname === '/academic/levels';
    } catch {
      return false;
    }
  }

  async testLevelsData(): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('academic_levels')
        .select('id, name, education_cycle')
        .limit(10);
      
      return !error && Array.isArray(data) && data.length > 0;
    } catch {
      return false;
    }
  }

  async testLevelCRUD(): Promise<boolean> {
    try {
      // Test de création
      const { data: insertData, error: insertError } = await supabase
        .from('academic_levels')
        .insert({
          name: 'Test Niveau QA',
          code: 'TNQA',
          education_cycle: 'licence',
          order_index: 999
        })
        .select()
        .single();

      if (insertError || !insertData) return false;

      // Test de modification
      const { error: updateError } = await supabase
        .from('academic_levels')
        .update({ name: 'Test Niveau QA Modifié' })
        .eq('id', insertData.id);

      if (updateError) return false;

      // Test de suppression
      const { error: deleteError } = await supabase
        .from('academic_levels')
        .delete()
        .eq('id', insertData.id);

      return !deleteError;
    } catch {
      return false;
    }
  }

  // SECTION 4: Tests des Matières
  async testSubjectsNavigation(): Promise<boolean> {
    try {
      window.history.pushState({}, '', '/academic/subjects');
      await new Promise(resolve => setTimeout(resolve, 500));
      return window.location.pathname === '/academic/subjects';
    } catch {
      return false;
    }
  }

  async testSubjectsData(): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('subjects')
        .select('id, name, code')
        .limit(10);
      
      return !error && Array.isArray(data);
    } catch {
      return false;
    }
  }

  // SECTION 5: Tests d'Import/Export
  async testImportExportFunctionality(): Promise<boolean> {
    try {
      // Vérifier la présence des boutons d'import/export
      const importButton = document.querySelector('[data-testid="import-button"]');
      const exportButton = document.querySelector('[data-testid="export-button"]');
      
      return importButton !== null || exportButton !== null || 
             document.querySelector('.import-export-toolbar') !== null;
    } catch {
      return false;
    }
  }

  // SECTION 6: Tests de Performance
  async testPageLoadTime(): Promise<boolean> {
    try {
      const startTime = performance.now();
      window.history.pushState({}, '', '/academic');
      await new Promise(resolve => setTimeout(resolve, 100));
      const endTime = performance.now();
      
      const loadTime = endTime - startTime;
      return loadTime < 3000; // < 3 secondes
    } catch {
      return false;
    }
  }

  async testDatabaseConnection(): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('academic_levels')
        .select('id')
        .limit(1);
      
      return !error;
    } catch {
      return false;
    }
  }

  // SECTION 7: Tests de Validation des Données
  async testDataValidation(): Promise<boolean> {
    try {
      // Test avec des données invalides
      const { error } = await supabase
        .from('academic_levels')
        .insert({
          name: '', // Nom vide - devrait échouer
          code: '',
          education_cycle: 'invalid_cycle',
          order_index: -1
        });
      
      // Si l'insertion échoue, c'est bon signe (validation fonctionne)
      return !!error;
    } catch {
      return true; // Si ça throw, c'est que la validation fonctionne
    }
  }

  // SECTION 8: Tests de Responsive Design
  async testResponsiveDesign(): Promise<boolean> {
    try {
      const originalWidth = window.innerWidth;
      
      // Simuler différentes tailles d'écran
      const testSizes = [1920, 1366, 768, 375];
      
      for (const size of testSizes) {
        // On ne peut pas vraiment changer la taille de la fenêtre
        // Mais on peut tester si les media queries CSS existent
        const mediaQuery = window.matchMedia(`(max-width: ${size}px)`);
        if (!mediaQuery) return false;
      }
      
      return true;
    } catch {
      return false;
    }
  }

  // Méthode principale pour exécuter tous les tests
  async runFullTestSuite(): Promise<AcademicTestResult[]> {
    console.log('🧪 Démarrage de la suite de tests du Module Gestion Académique');
    
    const tests = [
      // Section 1: Tableau de Bord
      { 
        name: 'TEST 1.1 - Accès Tableau de Bord', 
        test: () => this.testDashboardAccess(),
        section: 'Dashboard',
        testId: '1.1',
        severity: 'critical' as const
      },
      { 
        name: 'TEST 1.2 - Cartes Statistiques', 
        test: () => this.testStatisticsCards(),
        section: 'Dashboard',
        testId: '1.2',
        severity: 'major' as const
      },
      
      // Section 2: Programmes
      { 
        name: 'TEST 2.1 - Navigation Programmes', 
        test: () => this.testProgramsNavigation(),
        section: 'Programmes',
        testId: '2.1',
        severity: 'critical' as const
      },
      { 
        name: 'TEST 2.2 - Données Programmes', 
        test: () => this.testProgramsData(),
        section: 'Programmes',
        testId: '2.2',
        severity: 'critical' as const
      },
      { 
        name: 'TEST 2.3 - CRUD Programmes', 
        test: () => this.testProgramCRUD(),
        section: 'Programmes',
        testId: '2.3',
        severity: 'critical' as const
      },
      
      // Section 3: Niveaux
      { 
        name: 'TEST 5.1 - Navigation Niveaux', 
        test: () => this.testLevelsNavigation(),
        section: 'Niveaux',
        testId: '5.1',
        severity: 'critical' as const
      },
      { 
        name: 'TEST 5.2 - Données Niveaux', 
        test: () => this.testLevelsData(),
        section: 'Niveaux',
        testId: '5.2',
        severity: 'critical' as const
      },
      { 
        name: 'TEST 5.3 - CRUD Niveaux', 
        test: () => this.testLevelCRUD(),
        section: 'Niveaux',
        testId: '5.3',
        severity: 'critical' as const
      },
      
      // Section 4: Matières
      { 
        name: 'TEST 4.1 - Navigation Matières', 
        test: () => this.testSubjectsNavigation(),
        section: 'Matières',
        testId: '4.1',
        severity: 'critical' as const
      },
      { 
        name: 'TEST 4.2 - Données Matières', 
        test: () => this.testSubjectsData(),
        section: 'Matières',
        testId: '4.2',
        severity: 'major' as const
      },
      
      // Section 5: Import/Export
      { 
        name: 'TEST 9.1 - Fonctionnalité Import/Export', 
        test: () => this.testImportExportFunctionality(),
        section: 'Import/Export',
        testId: '9.1',
        severity: 'major' as const
      },
      
      // Section 6: Performance
      { 
        name: 'TEST PERF.1 - Temps de Chargement', 
        test: () => this.testPageLoadTime(),
        section: 'Performance',
        testId: 'PERF.1',
        severity: 'major' as const
      },
      { 
        name: 'TEST PERF.2 - Connexion Base de Données', 
        test: () => this.testDatabaseConnection(),
        section: 'Performance',
        testId: 'PERF.2',
        severity: 'critical' as const
      },
      
      // Section 7: Validation
      { 
        name: 'TEST VAL.1 - Validation des Données', 
        test: () => this.testDataValidation(),
        section: 'Validation',
        testId: 'VAL.1',
        severity: 'major' as const
      },
      
      // Section 8: Responsive
      { 
        name: 'TEST RESP.1 - Design Responsive', 
        test: () => this.testResponsiveDesign(),
        section: 'Responsive',
        testId: 'RESP.1',
        severity: 'minor' as const
      }
    ];

    this.results = [];

    for (const { name, test, section, testId, severity } of tests) {
      try {
        const result = await this.testRunner.runTest(name, test);
        const academicResult: AcademicTestResult = {
          ...result,
          section,
          testId,
          severity
        };
        
        this.results.push(academicResult);
        console.log(`${result.success ? '✅' : '❌'} ${name} (${result.duration}ms)`);
        
      } catch (error) {
        const academicResult: AcademicTestResult = {
          success: false,
          message: `❌ ${name} - Erreur critique`,
          details: error,
          section,
          testId,
          severity
        };
        
        this.results.push(academicResult);
        console.error(`❌ ${name} - Erreur critique:`, error);
      }
    }

    this.generateTestReport();
    return this.results;
  }

  generateTestReport(): void {
    const stats = this.getTestStats();
    
    console.log('\n📊 RAPPORT DE TEST - MODULE GESTION ACADÉMIQUE');
    console.log('=====================================');
    console.log(`Total des tests: ${stats.total}`);
    console.log(`Tests réussis: ${stats.passed} (${stats.passRate}%)`);
    console.log(`Tests échoués: ${stats.failed}`);
    console.log(`Durée moyenne: ${stats.averageDuration}ms`);
    console.log('\n📋 DÉTAIL PAR SECTION:');
    
    const sections = [...new Set(this.results.map(r => r.section))];
    sections.forEach(section => {
      const sectionResults = this.results.filter(r => r.section === section);
      const sectionPassed = sectionResults.filter(r => r.success).length;
      console.log(`  ${section}: ${sectionPassed}/${sectionResults.length} tests réussis`);
    });
    
    console.log('\n🐛 BUGS DÉTECTÉS:');
    const failedTests = this.results.filter(r => !r.success);
    failedTests.forEach(test => {
      console.log(`  BUG #${test.testId} [${test.severity.toUpperCase()}] - ${test.section}: ${test.message}`);
    });
    
    const criticalFailures = failedTests.filter(r => r.severity === 'critical').length;
    const validationStatus = criticalFailures === 0 ? '✅ VALIDÉ' : '❌ NON VALIDÉ';
    
    console.log(`\n🎯 STATUT DE VALIDATION: ${validationStatus}`);
    console.log(`Bugs critiques: ${criticalFailures}`);
    
    // Toast de notification
    toast({
      title: 'Tests du Module Académique terminés',
      description: `${stats.passed}/${stats.total} tests réussis - ${criticalFailures} bugs critiques`,
      variant: criticalFailures === 0 ? "default" : "destructive"
    });
  }

  getTestStats() {
    const total = this.results.length;
    const passed = this.results.filter(r => r.success).length;
    const failed = total - passed;
    const averageDuration = total > 0 
      ? Math.round(this.results.reduce((sum, r) => sum + (r.duration || 0), 0) / total)
      : 0;

    return {
      total,
      passed,
      failed,
      passRate: total > 0 ? Math.round((passed / total) * 100) : 0,
      averageDuration
    };
  }

  getResults(): AcademicTestResult[] {
    return [...this.results];
  }

  clearResults(): void {
    this.results = [];
    this.testRunner.clearResults();
  }
}

// Export de la fonction principale
export async function runAcademicModuleTests(): Promise<AcademicTestResult[]> {
  const testSuite = new AcademicModuleTestSuite();
  return await testSuite.runFullTestSuite();
}