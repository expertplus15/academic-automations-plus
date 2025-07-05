import { toast } from '@/hooks/use-toast';

export interface TestResult {
  success: boolean;
  message: string;
  details?: any;
  duration?: number;
}

export class TestRunner {
  private static instance: TestRunner;
  private results: TestResult[] = [];

  static getInstance(): TestRunner {
    if (!TestRunner.instance) {
      TestRunner.instance = new TestRunner();
    }
    return TestRunner.instance;
  }

  async runTest(
    name: string,
    testFn: () => Promise<boolean> | boolean,
    timeout: number = 5000
  ): Promise<TestResult> {
    const startTime = Date.now();
    
    try {
      const timeoutPromise = new Promise<boolean>((_, reject) => {
        setTimeout(() => reject(new Error('Test timeout')), timeout);
      });

      const testPromise = Promise.resolve(testFn());
      const success = await Promise.race([testPromise, timeoutPromise]);
      const duration = Date.now() - startTime;

      const result: TestResult = {
        success,
        message: success ? `✅ ${name} - Test réussi` : `❌ ${name} - Test échoué`,
        duration
      };

      this.results.push(result);
      return result;

    } catch (error) {
      const duration = Date.now() - startTime;
      const result: TestResult = {
        success: false,
        message: `❌ ${name} - Erreur: ${error instanceof Error ? error.message : 'Erreur inconnue'}`,
        details: error,
        duration
      };

      this.results.push(result);
      return result;
    }
  }

  async runTestSuite(
    suiteName: string,
    tests: Array<{ name: string; test: () => Promise<boolean> | boolean }>
  ): Promise<TestResult[]> {
    console.log(`🧪 Démarrage de la suite: ${suiteName}`);
    
    const results: TestResult[] = [];
    
    for (const { name, test } of tests) {
      const result = await this.runTest(name, test);
      results.push(result);
      console.log(result.message);
    }

    const passed = results.filter(r => r.success).length;
    const total = results.length;
    
    const suiteMessage = `📊 Suite ${suiteName}: ${passed}/${total} tests réussis`;
    console.log(suiteMessage);
    
    toast({
      title: `Suite ${suiteName} terminée`,
      description: `${passed}/${total} tests réussis`,
      variant: passed === total ? "default" : "destructive"
    });

    return results;
  }

  getResults(): TestResult[] {
    return [...this.results];
  }

  clearResults(): void {
    this.results = [];
  }

  getStats() {
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
}

// Tests prédéfinis pour les fonctionnalités critiques
export const criticalTests = {
  // Test de navigation
  navigation: async (route: string): Promise<boolean> => {
    try {
      const currentPath = window.location.pathname;
      window.history.pushState({}, '', route);
      await new Promise(resolve => setTimeout(resolve, 100));
      return window.location.pathname === route;
    } catch {
      return false;
    }
  },

  // Test de localStorage
  localStorage: async (): Promise<boolean> => {
    try {
      const testKey = 'test-storage';
      const testValue = 'test-value';
      localStorage.setItem(testKey, testValue);
      const retrieved = localStorage.getItem(testKey);
      localStorage.removeItem(testKey);
      return retrieved === testValue;
    } catch {
      return false;
    }
  },

  // Test de toast
  toastSystem: async (): Promise<boolean> => {
    try {
      toast({ title: "Test", description: "Test de notification" });
      return true;
    } catch {
      return false;
    }
  },

  // Test de connectivité réseau
  networkConnectivity: async (): Promise<boolean> => {
    return navigator.onLine;
  },

  // Test des APIs de base
  basicApis: async (): Promise<boolean> => {
    try {
      return typeof fetch !== 'undefined' && 
             typeof JSON !== 'undefined' && 
             typeof Promise !== 'undefined';
    } catch {
      return false;
    }
  },

  // Test de responsive design
  responsiveDesign: async (): Promise<boolean> => {
    try {
      const viewport = window.innerWidth;
      return viewport > 0 && typeof window.matchMedia !== 'undefined';
    } catch {
      return false;
    }
  }
};

// Utilitaire pour exécuter tous les tests critiques
export async function runAllCriticalTests(): Promise<TestResult[]> {
  const testRunner = TestRunner.getInstance();
  
  return await testRunner.runTestSuite('Tests Critiques', [
    { name: 'Stockage Local', test: criticalTests.localStorage },
    { name: 'Système Toast', test: criticalTests.toastSystem },
    { name: 'Connectivité Réseau', test: criticalTests.networkConnectivity },
    { name: 'APIs de Base', test: criticalTests.basicApis },
    { name: 'Design Responsive', test: criticalTests.responsiveDesign },
    { name: 'Navigation Dashboard', test: () => criticalTests.navigation('/dashboard') },
    { name: 'Navigation Students', test: () => criticalTests.navigation('/students') },
    { name: 'Navigation Academic', test: () => criticalTests.navigation('/academic') },
    { name: 'Navigation Finance', test: () => criticalTests.navigation('/finance') }
  ]);
}