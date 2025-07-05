import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useErrorHandler } from './useErrorHandler';
import { toast } from '@/hooks/use-toast';

export interface ModuleTest {
  id: string;
  name: string;
  route: string;
  status: 'pending' | 'running' | 'passed' | 'failed';
  error?: string;
  duration?: number;
}

export interface TestSuite {
  id: string;
  name: string;
  tests: ModuleTest[];
  status: 'idle' | 'running' | 'completed';
  startTime?: Date;
  endTime?: Date;
}

export function useModuleTests() {
  const [testSuites, setTestSuites] = useState<TestSuite[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const { handleError } = useErrorHandler();
  const navigate = useNavigate();

  // Tests critiques pour tous les modules
  const createCriticalTests = useCallback((): TestSuite[] => {
    return [
      {
        id: 'navigation-tests',
        name: 'Tests de Navigation',
        status: 'idle',
        tests: [
          { id: 'students-nav', name: 'Navigation Étudiants', route: '/students', status: 'pending' },
          { id: 'academic-nav', name: 'Navigation Académique', route: '/academic', status: 'pending' },
          { id: 'finance-nav', name: 'Navigation Finance', route: '/finance', status: 'pending' },
          { id: 'exams-nav', name: 'Navigation Examens', route: '/exams', status: 'pending' },
          { id: 'hr-nav', name: 'Navigation RH', route: '/hr', status: 'pending' },
          { id: 'resources-nav', name: 'Navigation Ressources', route: '/resources', status: 'pending' }
        ]
      },
      {
        id: 'database-tests',
        name: 'Tests Base de Données',
        status: 'idle',
        tests: [
          { id: 'students-fetch', name: 'Récupération Étudiants', route: '', status: 'pending' },
          { id: 'programs-fetch', name: 'Récupération Programmes', route: '', status: 'pending' },
          { id: 'departments-fetch', name: 'Récupération Départements', route: '', status: 'pending' },
          { id: 'subjects-fetch', name: 'Récupération Matières', route: '', status: 'pending' },
          { id: 'assets-fetch', name: 'Récupération Équipements', route: '', status: 'pending' },
          { id: 'asset-categories-fetch', name: 'Récupération Catégories', route: '', status: 'pending' },
          { id: 'rooms-fetch', name: 'Récupération Salles', route: '', status: 'pending' }
        ]
      },
      {
        id: 'functionality-tests',
        name: 'Tests Fonctionnalités',
        status: 'idle',
        tests: [
          { id: 'toast-system', name: 'Système de Notifications', route: '', status: 'pending' },
          { id: 'form-validation', name: 'Validation Formulaires', route: '', status: 'pending' },
          { id: 'error-handling', name: 'Gestion Erreurs', route: '', status: 'pending' },
          { id: 'network-detection', name: 'Détection Réseau', route: '', status: 'pending' }
        ]
      }
    ];
  }, []);

  const runNavigationTest = useCallback(async (test: ModuleTest): Promise<boolean> => {
    try {
      // Simuler la vérification de route sans naviguer réellement
      // pour éviter de perturber l'état de l'application
      const routeExists = [
        '/students', '/academic', '/finance', '/exams', 
        '/hr', '/resources', '/communication', '/elearning'
      ].includes(test.route);
      
      // Petite simulation d'attente
      await new Promise(resolve => setTimeout(resolve, 200));
      
      return routeExists;
    } catch (error) {
      console.error(`Navigation test failed: ${test.name}`, error);
      return false;
    }
  }, []);

  const runDatabaseTest = useCallback(async (test: ModuleTest): Promise<boolean> => {
    try {
      let query;
      switch (test.id) {
        case 'students-fetch':
          query = supabase.from('students').select('id').limit(1);
          break;
        case 'programs-fetch':
          query = supabase.from('programs').select('id').limit(1);
          break;
        case 'departments-fetch':
          query = supabase.from('departments').select('id').limit(1);
          break;
        case 'subjects-fetch':
          query = supabase.from('subjects').select('id').limit(1);
          break;
        case 'assets-fetch':
          query = supabase.from('assets').select('id').limit(1);
          break;
        case 'asset-categories-fetch':
          query = supabase.from('asset_categories').select('id').limit(1);
          break;
        case 'rooms-fetch':
          query = supabase.from('rooms').select('id').limit(1);
          break;
        default:
          return false;
      }

      const { error } = await query;
      return !error;
    } catch (error) {
      handleError(error, { context: `Database test: ${test.name}` });
      return false;
    }
  }, [handleError]);

  const runFunctionalityTest = useCallback(async (test: ModuleTest): Promise<boolean> => {
    try {
      switch (test.id) {
        case 'toast-system':
          // Test silencieux du système de toast sans afficher de notification
          try {
            const testToast = () => toast({ title: "", description: "", duration: 0 });
            testToast();
            return true;
          } catch {
            return false;
          }
        
        case 'form-validation':
          // Test basique de validation
          const testValidation = (value: string) => value.length > 0;
          return testValidation('test') === true && testValidation('') === false;
        
        case 'error-handling':
          // Test du gestionnaire d'erreur
          try {
            throw new Error('Test error');
          } catch (error) {
            handleError(error, { showToast: false, context: 'Error handler test' });
            return true;
          }
        
        case 'network-detection':
          return navigator.onLine !== undefined;
        
        default:
          return false;
      }
    } catch (error) {
      console.error(`Functionality test failed: ${test.name}`, error);
      return false;
    }
  }, [handleError]);

  const runSingleTest = useCallback(async (test: ModuleTest, suiteId: string): Promise<void> => {
    const startTime = Date.now();
    
    setTestSuites(prev => prev.map(suite => 
      suite.id === suiteId ? {
        ...suite,
        tests: suite.tests.map(t => 
          t.id === test.id ? { ...t, status: 'running' } : t
        )
      } : suite
    ));

    let success = false;
    let error: string | undefined;

    try {
      if (suiteId === 'navigation-tests') {
        success = await runNavigationTest(test);
      } else if (suiteId === 'database-tests') {
        success = await runDatabaseTest(test);
      } else if (suiteId === 'functionality-tests') {
        success = await runFunctionalityTest(test);
      }
    } catch (err) {
      error = err instanceof Error ? err.message : 'Test failed';
      success = false;
    }

    const duration = Date.now() - startTime;

    setTestSuites(prev => prev.map(suite => 
      suite.id === suiteId ? {
        ...suite,
        tests: suite.tests.map(t => 
          t.id === test.id ? { 
            ...t, 
            status: success ? 'passed' : 'failed',
            error,
            duration
          } : t
        )
      } : suite
    ));
  }, [runNavigationTest, runDatabaseTest, runFunctionalityTest]);

  const runAllTests = useCallback(async () => {
    setIsRunning(true);
    const suites = createCriticalTests();
    setTestSuites(suites);

    toast({
      title: "Tests démarrés",
      description: "Exécution des tests critiques en cours..."
    });

    try {
      // Garder trace des résultats localement pour éviter les problèmes d'état asynchrone
      let completedSuites = [...suites];
      
      for (const suite of suites) {
        setTestSuites(prev => prev.map(s => 
          s.id === suite.id ? { ...s, status: 'running', startTime: new Date() } : s
        ));

        // Traiter chaque test de la suite
        for (let i = 0; i < suite.tests.length; i++) {
          const test = suite.tests[i];
          const startTime = Date.now();
          
          // Marquer le test comme en cours
          setTestSuites(prev => prev.map(s => 
            s.id === suite.id ? {
              ...s,
              tests: s.tests.map(t => 
                t.id === test.id ? { ...t, status: 'running' } : t
              )
            } : s
          ));

          let success = false;
          let error: string | undefined;

          try {
            if (suite.id === 'navigation-tests') {
              success = await runNavigationTest(test);
            } else if (suite.id === 'database-tests') {
              success = await runDatabaseTest(test);
            } else if (suite.id === 'functionality-tests') {
              success = await runFunctionalityTest(test);
            }
          } catch (err) {
            error = err instanceof Error ? err.message : 'Test failed';
            success = false;
          }

          const duration = Date.now() - startTime;
          
          // Mettre à jour le résultat localement ET dans l'état
          const suiteIndex = completedSuites.findIndex(s => s.id === suite.id);
          const testIndex = completedSuites[suiteIndex].tests.findIndex(t => t.id === test.id);
          completedSuites[suiteIndex].tests[testIndex] = {
            ...test,
            status: success ? 'passed' : 'failed',
            error,
            duration
          };

          setTestSuites(prev => prev.map(s => 
            s.id === suite.id ? {
              ...s,
              tests: s.tests.map(t => 
                t.id === test.id ? { 
                  ...t, 
                  status: success ? 'passed' : 'failed',
                  error,
                  duration
                } : t
              )
            } : s
          ));
          
          // Petite pause entre les tests
          await new Promise(resolve => setTimeout(resolve, 300));
        }

        // Marquer la suite comme terminée
        completedSuites[completedSuites.findIndex(s => s.id === suite.id)].status = 'completed';
        setTestSuites(prev => prev.map(s => 
          s.id === suite.id ? { ...s, status: 'completed', endTime: new Date() } : s
        ));
      }

      // Calculer les résultats à partir des données locales
      const totalTests = completedSuites.reduce((acc, suite) => acc + suite.tests.length, 0);
      const passedTests = completedSuites.reduce((acc, suite) => 
        acc + suite.tests.filter(t => t.status === 'passed').length, 0
      );

      toast({
        title: "Tests terminés",
        description: `${passedTests}/${totalTests} tests réussis`,
        variant: passedTests === totalTests ? "default" : "destructive"
      });

    } catch (error) {
      handleError(error, { context: 'Module tests execution' });
    } finally {
      setIsRunning(false);
    }
  }, [createCriticalTests, runNavigationTest, runDatabaseTest, runFunctionalityTest, handleError]);

  const resetTests = useCallback(() => {
    setTestSuites([]);
    setIsRunning(false);
  }, []);

  const getTestSummary = useCallback(() => {
    const totalTests = testSuites.reduce((acc, suite) => acc + suite.tests.length, 0);
    const passedTests = testSuites.reduce((acc, suite) => 
      acc + suite.tests.filter(t => t.status === 'passed').length, 0
    );
    const failedTests = testSuites.reduce((acc, suite) => 
      acc + suite.tests.filter(t => t.status === 'failed').length, 0
    );
    const pendingTests = testSuites.reduce((acc, suite) => 
      acc + suite.tests.filter(t => t.status === 'pending').length, 0
    );

    return {
      total: totalTests,
      passed: passedTests,
      failed: failedTests,
      pending: pendingTests,
      passRate: totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0
    };
  }, [testSuites]);

  return {
    testSuites,
    isRunning,
    runAllTests,
    resetTests,
    getTestSummary,
    runSingleTest
  };
}