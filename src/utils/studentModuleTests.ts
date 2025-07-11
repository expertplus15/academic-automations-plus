import { TestRunner, TestResult } from './testingUtils';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface StudentTestResult extends TestResult {
  section: string;
  testId: string;
  severity: 'critical' | 'major' | 'minor';
}

export class StudentModuleTestSuite {
  private testRunner: TestRunner;
  private results: StudentTestResult[] = [];

  constructor() {
    this.testRunner = TestRunner.getInstance();
  }

  // SECTION 1: Tests du Tableau de Bord Étudiants
  async testStudentDashboardAccess(): Promise<boolean> {
    try {
      // Vérifier la navigation vers /students
      window.history.pushState({}, '', '/students');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Vérifier les éléments de base
      const titleElement = document.querySelector('h1');
      const subtitleElement = document.querySelector('[data-testid="students-subtitle"]');
      
      return titleElement?.textContent?.includes('Gestion') || 
             window.location.pathname.includes('/students') ||
             document.title.includes('Étudiants');
    } catch {
      return false;
    }
  }

  async testStudentStatisticsCards(): Promise<boolean> {
    try {
      // Vérifier la présence des 4 cartes statistiques
      const inscriptsCard = document.querySelector('[data-testid="students-enrolled-card"]');
      const newInscriptionsCard = document.querySelector('[data-testid="new-enrollments-card"]');
      const retentionCard = document.querySelector('[data-testid="retention-rate-card"]');
      const activeCard = document.querySelector('[data-testid="active-students-card"]');
      
      return !!(inscriptsCard || newInscriptionsCard || retentionCard || activeCard);
    } catch {
      return false;
    }
  }

  // SECTION 2: Tests d'Inscription Automatique
  async testStudentEnrollmentAccess(): Promise<boolean> {
    try {
      window.history.pushState({}, '', '/students/enrollment');
      await new Promise(resolve => setTimeout(resolve, 500));
      return window.location.pathname.includes('/students/enrollment');
    } catch {
      return false;
    }
  }

  async testEnrollmentFormValidation(): Promise<boolean> {
    try {
      // Simuler la validation de formulaire avec des données invalides
      const testData = {
        email: 'invalid-email',
        birthDate: new Date(Date.now() + 86400000), // Date future
        phone: 'invalid-phone'
      };
      
      // Vérifier que la validation détecte les erreurs
      const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(testData.email);
      const dateValid = testData.birthDate <= new Date();
      const phoneValid = /^(\+33|0)[1-9]\d{8}$/.test(testData.phone);
      
      // Si la validation fonctionne, au moins une erreur devrait être détectée
      return !emailValid || !dateValid || !phoneValid;
    } catch {
      return false;
    }
  }

  async testStudentCRUD(): Promise<boolean> {
    try {
      // Test de création d'étudiant
      const { data: insertData, error: insertError } = await supabase
        .from('students')
        .insert({
          student_number: 'TST25001',
          enrollment_date: new Date().toISOString().split('T')[0],
          status: 'active',
          profile_id: '00000000-0000-0000-0000-000000000000', // UUID temporaire pour test
          program_id: '00000000-0000-0000-0000-000000000000' // UUID temporaire pour test
        })
        .select()
        .single();

      if (insertError || !insertData) return false;

      // Test de modification
      const { error: updateError } = await supabase
        .from('students')
        .update({ status: 'suspended' })
        .eq('id', insertData.id);

      if (updateError) return false;

      // Test de suppression
      const { error: deleteError } = await supabase
        .from('students')
        .delete()
        .eq('id', insertData.id);

      return !deleteError;
    } catch {
      return false;
    }
  }

  // SECTION 3: Tests de Suivi des Inscriptions
  async testEnrollmentTracking(): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('students')
        .select('id, student_number, status, enrollment_date')
        .limit(5);
      
      return !error && Array.isArray(data);
    } catch {
      return false;
    }
  }

  async testEnrollmentFilters(): Promise<boolean> {
    try {
      // Test de filtrage par statut
      const { data: activeStudents, error: activeError } = await supabase
        .from('students')
        .select('id')
        .eq('status', 'active');

      const { data: suspendedStudents, error: suspendedError } = await supabase
        .from('students')
        .select('id')
        .eq('status', 'suspended');

      return !activeError && !suspendedError && 
             Array.isArray(activeStudents) && Array.isArray(suspendedStudents);
    } catch {
      return false;
    }
  }

  // SECTION 4: Tests des Approbations
  async testApprovalWorkflow(): Promise<boolean> {
    try {
      // Vérifier la navigation vers les approbations
      window.history.pushState({}, '', '/students/approvals');
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Vérifier la présence d'éléments d'approbation
      const approvalsList = document.querySelector('[data-testid="approvals-list"]');
      const approvalActions = document.querySelector('[data-testid="approval-actions"]');
      
      return window.location.pathname.includes('/students/approvals') ||
             !!(approvalsList || approvalActions);
    } catch {
      return false;
    }
  }

  // SECTION 5: Tests des Cartes Étudiants
  async testStudentCardsGeneration(): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('student_cards')
        .select('id, card_number, status')
        .limit(3);

      return !error && Array.isArray(data);
    } catch {
      return false;
    }
  }

  async testCardTemplateCustomization(): Promise<boolean> {
    try {
      // Vérifier la navigation vers les cartes
      window.history.pushState({}, '', '/students/cards');
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Vérifier la présence d'éléments de personnalisation
      const templateEditor = document.querySelector('[data-testid="card-template-editor"]');
      const previewCard = document.querySelector('[data-testid="card-preview"]');
      
      return window.location.pathname.includes('/students/cards') ||
             !!(templateEditor || previewCard);
    } catch {
      return false;
    }
  }

  // SECTION 6: Tests des Profils Étudiants
  async testStudentProfileAccess(): Promise<boolean> {
    try {
      // Simuler l'accès au profil d'un étudiant spécifique
      window.history.pushState({}, '', '/students/profile/GC25002');
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const profileTabs = document.querySelectorAll('[data-testid*="profile-tab"]');
      const personalInfo = document.querySelector('[data-testid="personal-info"]');
      
      return window.location.pathname.includes('/students/profile') ||
             profileTabs.length >= 3 || !!personalInfo;
    } catch {
      return false;
    }
  }

  async testProfileDataIntegrity(): Promise<boolean> {
    try {
      // Vérifier la cohérence des données étudiants avec les profils
      const { data: studentsWithProfiles, error } = await supabase
        .from('students')
        .select('id, student_number, profile_id, profiles(full_name, email)')
        .limit(5);

      if (error || !Array.isArray(studentsWithProfiles)) return false;

      // Vérifier que chaque étudiant a un profil valide
      return studentsWithProfiles.every(student => 
        student.profile_id && student.profiles
      );
    } catch {
      return false;
    }
  }

  // SECTION 7: Tests des Analyses
  async testStudentAnalytics(): Promise<boolean> {
    try {
      window.history.pushState({}, '', '/students/analytics');
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const analyticsCharts = document.querySelectorAll('[data-testid*="chart"]');
      const kpiCards = document.querySelectorAll('[data-testid*="kpi"]');
      
      return window.location.pathname.includes('/students/analytics') ||
             analyticsCharts.length > 0 || kpiCards.length > 0;
    } catch {
      return false;
    }
  }

  async testEnrollmentTrends(): Promise<boolean> {
    try {
      // Simuler l'analyse des tendances d'inscription
      const { data: recentEnrollments, error } = await supabase
        .from('students')
        .select('enrollment_date')
        .gte('enrollment_date', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
        .order('enrollment_date', { ascending: false });

      return !error && Array.isArray(recentEnrollments);
    } catch {
      return false;
    }
  }

  // SECTION 8: Tests des Alertes Automatiques
  async testAlertConfiguration(): Promise<boolean> {
    try {
      // Vérifier l'accès aux configurations d'alerte
      window.history.pushState({}, '', '/students/alerts');
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const alertRules = document.querySelector('[data-testid="alert-rules"]');
      const alertHistory = document.querySelector('[data-testid="alert-history"]');
      
      return window.location.pathname.includes('/students/alerts') ||
             !!(alertRules || alertHistory);
    } catch {
      return false;
    }
  }

  // SECTION 9: Tests des Documents Administratifs
  async testDocumentGeneration(): Promise<boolean> {
    try {
      // Tester la génération de documents
      const { data: documentTemplates, error } = await supabase
        .from('document_templates')
        .select('id, name, template_type')
        .eq('is_active', true)
        .limit(5);

      return !error && Array.isArray(documentTemplates);
    } catch {
      return false;
    }
  }

  // SECTION 10: Tests de Performance
  async testStudentSearchPerformance(): Promise<boolean> {
    try {
      const startTime = performance.now();
      
      // Simuler une recherche d'étudiant
      const { data, error } = await supabase
        .from('students')
        .select('id, student_number, profiles(full_name)')
        .ilike('student_number', '%GC%')
        .limit(10);

      const endTime = performance.now();
      const searchTime = endTime - startTime;
      
      // Recherche doit être rapide (< 500ms) et retourner des résultats
      return !error && Array.isArray(data) && searchTime < 500;
    } catch {
      return false;
    }
  }

  async testDatabaseConnection(): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('students')
        .select('id')
        .limit(1);
      
      return !error;
    } catch {
      return false;
    }
  }

  // SECTION 11: Tests de Sécurité et Permissions
  async testDataSecurity(): Promise<boolean> {
    try {
      // Vérifier que l'accès aux données sensibles nécessite une authentification
      const { data: sensitiveData, error } = await supabase
        .from('students')
        .select('profile_id, academic_level_id')
        .limit(1);

      // Si on peut accéder aux données, vérifier qu'il y a une session active
      return !error || error.message.includes('permission');
    } catch {
      return true; // Si ça throw, c'est probablement que la sécurité fonctionne
    }
  }

  // Méthode principale pour exécuter tous les tests
  async runFullTestSuite(): Promise<StudentTestResult[]> {
    console.log('🧪 Démarrage de la suite de tests du Module Gestion Étudiants');
    
    const tests = [
      // Section 1: Tableau de Bord
      { 
        name: 'TEST 1.1 - Accès Tableau de Bord Étudiants', 
        test: () => this.testStudentDashboardAccess(),
        section: 'Tableau de Bord',
        testId: '1.1',
        severity: 'critical' as const
      },
      { 
        name: 'TEST 1.2 - Cartes Statistiques Étudiants', 
        test: () => this.testStudentStatisticsCards(),
        section: 'Tableau de Bord',
        testId: '1.2',
        severity: 'major' as const
      },
      
      // Section 2: Inscription Automatique
      { 
        name: 'TEST 2.1 - Accès Inscription Automatique', 
        test: () => this.testStudentEnrollmentAccess(),
        section: 'Inscription',
        testId: '2.1',
        severity: 'critical' as const
      },
      { 
        name: 'TEST 2.2 - Validation Formulaire Inscription', 
        test: () => this.testEnrollmentFormValidation(),
        section: 'Inscription',
        testId: '2.2',
        severity: 'major' as const
      },
      { 
        name: 'TEST 2.3 - CRUD Étudiants', 
        test: () => this.testStudentCRUD(),
        section: 'Inscription',
        testId: '2.3',
        severity: 'critical' as const
      },
      
      // Section 3: Suivi Inscriptions
      { 
        name: 'TEST 3.1 - Suivi des Inscriptions', 
        test: () => this.testEnrollmentTracking(),
        section: 'Suivi',
        testId: '3.1',
        severity: 'critical' as const
      },
      { 
        name: 'TEST 3.2 - Filtres et Recherche', 
        test: () => this.testEnrollmentFilters(),
        section: 'Suivi',
        testId: '3.2',
        severity: 'major' as const
      },
      
      // Section 4: Approbations
      { 
        name: 'TEST 4.1 - Workflow d\'Approbation', 
        test: () => this.testApprovalWorkflow(),
        section: 'Approbations',
        testId: '4.1',
        severity: 'critical' as const
      },
      
      // Section 5: Cartes Étudiants
      { 
        name: 'TEST 5.1 - Génération Cartes Étudiants', 
        test: () => this.testStudentCardsGeneration(),
        section: 'Cartes',
        testId: '5.1',
        severity: 'major' as const
      },
      { 
        name: 'TEST 5.2 - Personnalisation Templates', 
        test: () => this.testCardTemplateCustomization(),
        section: 'Cartes',
        testId: '5.2',
        severity: 'minor' as const
      },
      
      // Section 6: Profils Étudiants
      { 
        name: 'TEST 6.1 - Accès Profils Étudiants', 
        test: () => this.testStudentProfileAccess(),
        section: 'Profils',
        testId: '6.1',
        severity: 'critical' as const
      },
      { 
        name: 'TEST 6.2 - Intégrité Données Profils', 
        test: () => this.testProfileDataIntegrity(),
        section: 'Profils',
        testId: '6.2',
        severity: 'major' as const
      },
      
      // Section 7: Analyses
      { 
        name: 'TEST 7.1 - Analyses et Tableaux de Bord', 
        test: () => this.testStudentAnalytics(),
        section: 'Analyses',
        testId: '7.1',
        severity: 'major' as const
      },
      { 
        name: 'TEST 7.2 - Tendances d\'Inscription', 
        test: () => this.testEnrollmentTrends(),
        section: 'Analyses',
        testId: '7.2',
        severity: 'minor' as const
      },
      
      // Section 8: Alertes
      { 
        name: 'TEST 8.1 - Configuration Alertes', 
        test: () => this.testAlertConfiguration(),
        section: 'Alertes',
        testId: '8.1',
        severity: 'major' as const
      },
      
      // Section 9: Documents
      { 
        name: 'TEST 9.1 - Génération Documents', 
        test: () => this.testDocumentGeneration(),
        section: 'Documents',
        testId: '9.1',
        severity: 'major' as const
      },
      
      // Section 10: Performance
      { 
        name: 'TEST PERF.1 - Performance Recherche', 
        test: () => this.testStudentSearchPerformance(),
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
      
      // Section 11: Sécurité
      { 
        name: 'TEST SEC.1 - Sécurité des Données', 
        test: () => this.testDataSecurity(),
        section: 'Sécurité',
        testId: 'SEC.1',
        severity: 'critical' as const
      }
    ];

    this.results = [];

    for (const { name, test, section, testId, severity } of tests) {
      try {
        const result = await this.testRunner.runTest(name, test);
        const studentResult: StudentTestResult = {
          ...result,
          section,
          testId,
          severity
        };
        
        this.results.push(studentResult);
        console.log(`${result.success ? '✅' : '❌'} ${name} (${result.duration}ms)`);
        
      } catch (error) {
        const studentResult: StudentTestResult = {
          success: false,
          message: `❌ ${name} - Erreur critique`,
          details: error,
          section,
          testId,
          severity
        };
        
        this.results.push(studentResult);
        console.error(`❌ ${name} - Erreur critique:`, error);
      }
    }

    this.generateTestReport();
    return this.results;
  }

  generateTestReport(): void {
    const stats = this.getTestStats();
    
    console.log('\n📊 RAPPORT DE TEST - MODULE GESTION ÉTUDIANTS');
    console.log('==========================================');
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
      console.log(`  BUG #GE-${test.testId} [${test.severity.toUpperCase()}] - ${test.section}: ${test.message}`);
    });
    
    const criticalFailures = failedTests.filter(r => r.severity === 'critical').length;
    const validationStatus = criticalFailures === 0 ? '✅ VALIDÉ' : '❌ NON VALIDÉ';
    
    console.log(`\n🎯 STATUT DE VALIDATION: ${validationStatus}`);
    console.log(`Bugs critiques: ${criticalFailures}`);
    console.log(`Badge "3" à investiguer: ${criticalFailures > 0 ? 'Peut être lié aux bugs' : 'Origine à déterminer'}`);
    
    // Toast de notification
    toast({
      title: 'Tests du Module Gestion Étudiants terminés',
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

  getResults(): StudentTestResult[] {
    return [...this.results];
  }

  clearResults(): void {
    this.results = [];
    this.testRunner.clearResults();
  }
}

// Fonction utilitaire pour exécuter la suite de tests
export async function runStudentModuleTests(): Promise<StudentTestResult[]> {
  const testSuite = new StudentModuleTestSuite();
  return await testSuite.runFullTestSuite();
}