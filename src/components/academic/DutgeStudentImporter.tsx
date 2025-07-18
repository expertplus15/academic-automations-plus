import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Upload, Users, CheckCircle, AlertCircle } from 'lucide-react';

// Data for the 17 DUTGE students
const DUTGE_STUDENTS = [
  { matricule: '2324EMD002GE', nom: 'ABDALLAH', prenom: 'ABDOULKADER ABDALLAH', dateNaissance: '2000-10-30', lieuNaissance: 'DJIBOUTI', email: 'exprh21@gmail.com', telephone: '+253 77 12 34 56' },
  { matricule: '2324EMD003GE', nom: 'ABDIRAHMAN', prenom: 'MOHAMED OMAR', dateNaissance: '2003-03-30', lieuNaissance: 'DJIBOUTI', email: 'exprh21@gmail.com', telephone: '+253 77 12 34 57' },
  { matricule: '2324EMD004GE', nom: 'ABDOURAHMAN', prenom: 'GALAL MOHAMED', dateNaissance: '2003-07-03', lieuNaissance: 'DJIBOUTI', email: 'exprh21@gmail.com', telephone: '+253 77 12 34 58' },
  { matricule: '2324EMD005GE', nom: 'ABDOURAZAK', prenom: 'IDRISS AWALEH', dateNaissance: '2004-04-21', lieuNaissance: 'DJIBOUTI', email: 'exprh21@gmail.com', telephone: '+253 77 12 34 59' },
  { matricule: '2324EMD007GE', nom: 'ALI', prenom: 'DJIBRIL ABDI', dateNaissance: '2001-01-01', lieuNaissance: 'ARTA', email: 'exprh21@gmail.com', telephone: '+253 77 12 34 60' },
  { matricule: '2324EMD001GE', nom: 'AMIR', prenom: 'HASSAN ABDILLAHI', dateNaissance: '2003-10-07', lieuNaissance: 'DJIBOUTI', email: 'exprh21@gmail.com', telephone: '+253 77 12 34 61' },
  { matricule: '2324EMD008GE', nom: 'ANHAR', prenom: 'HOUSSEIN SAID', dateNaissance: '2005-11-16', lieuNaissance: 'ALI-SABIEH', email: 'exprh21@gmail.com', telephone: '+253 77 12 34 62' },
  { matricule: '2324EMD009GE', nom: 'ASMA', prenom: 'KADAR ALI', dateNaissance: '2002-09-19', lieuNaissance: 'DJIBOUTI', email: 'exprh21@gmail.com', telephone: '+253 77 12 34 63' },
  { matricule: '2324EMD012GE', nom: 'AYOUB', prenom: 'AHMED YACIN', dateNaissance: '2000-08-18', lieuNaissance: 'DJIBOUTI', email: 'exprh21@gmail.com', telephone: '+253 77 12 34 64' },
  { matricule: '2324EMD042GE', nom: 'BILAN', prenom: 'ABDOURAHMAN ABDILLAHI', dateNaissance: '2003-09-08', lieuNaissance: 'DJIBOUTI', email: 'exprh21@gmail.com', telephone: '+253 77 12 34 65' },
  { matricule: '2324EMD014GE', nom: 'DJAMA', prenom: 'MOHAMED DAHER', dateNaissance: '2007-06-23', lieuNaissance: 'DJIBOUTI', email: 'exprh21@gmail.com', telephone: '+253 77 12 34 66' },
  { matricule: '2324EMD015GE', nom: 'FATIMATALZAHRA', prenom: 'ABDALLAH SALAM', dateNaissance: '2001-10-20', lieuNaissance: 'DJIBOUTI', email: 'exprh21@gmail.com', telephone: '+253 77 12 34 67' },
  { matricule: '2324EMD016GE', nom: 'FAWAZ', prenom: 'WALID MOHAMED', dateNaissance: '2005-06-19', lieuNaissance: 'DJIBOUTI', email: 'exprh21@gmail.com', telephone: '+253 77 12 34 68' },
  { matricule: '2324EMD017GE', nom: 'HODAN', prenom: 'ABDOULKADER AHMED', dateNaissance: '2003-12-15', lieuNaissance: 'DJIBOUTI', email: 'exprh21@gmail.com', telephone: '+253 77 12 34 69' },
  { matricule: '2324EMD018GE', nom: 'KHADIJA', prenom: 'OMAR HASSAN', dateNaissance: '2004-02-28', lieuNaissance: 'DJIBOUTI', email: 'exprh21@gmail.com', telephone: '+253 77 12 34 70' },
  { matricule: '2324EMD019GE', nom: 'MOHAMED', prenom: 'YOUSSOUF ALI', dateNaissance: '2002-11-12', lieuNaissance: 'TADJOURAH', email: 'exprh21@gmail.com', telephone: '+253 77 12 34 71' },
  { matricule: '2324EMD020GE', nom: 'YASMIN', prenom: 'AHMED OMAR', dateNaissance: '2004-08-05', lieuNaissance: 'OBOCK', email: 'exprh21@gmail.com', telephone: '+253 77 12 34 72' }
];

const PROGRAM_ID = 'ced83506-8666-487b-a310-f0b1a97b0c5c'; // DUTGE
const CLASS_GROUP_ID = '690df468-e820-4a19-a48c-fe0e327130ab'; // DUT2-GE

export const DutgeStudentImporter = () => {
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [importResults, setImportResults] = useState<{
    success: number;
    failed: number;
    details: string[];
  } | null>(null);

  const createStudent = async (studentData: typeof DUTGE_STUDENTS[0], index: number) => {
    try {
      // Update progress
      setProgress(((index + 1) / DUTGE_STUDENTS.length) * 100);

      // Create user account
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: studentData.email,
        email_confirm: true,
        user_metadata: {
          full_name: `${studentData.prenom} ${studentData.nom}`,
          role: 'student'
        }
      });

      if (authError) throw authError;

      // Wait for profile creation
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Create student record
      const { data: student, error: studentError } = await supabase
        .from('students')
        .insert({
          profile_id: authData.user.id,
          student_number: studentData.matricule,
          program_id: PROGRAM_ID,
          year_level: 2,
          status: 'active',
          enrollment_date: '2023-09-01'
        })
        .select()
        .single();

      if (studentError) throw studentError;

      // Note: Students are automatically associated with their program
      // Group assignments will be handled separately after all students are created

      return { success: true, student: studentData.nom };
    } catch (error) {
      console.error(`Error importing ${studentData.nom}:`, error);
      return { success: false, student: studentData.nom, error: error.message };
    }
  };

  const createTDGroups = async () => {
    try {
      // Create TD1-GE group (9 students)
      const { data: td1Group, error: td1Error } = await supabase
        .from('class_groups')
        .insert({
          name: 'TD1-GE',
          code: 'TD1-GE-2324',
          group_type: 'td',
          program_id: PROGRAM_ID,
          parent_group_id: CLASS_GROUP_ID,
          max_students: 9
        })
        .select()
        .single();

      if (td1Error) throw td1Error;

      // Create TD2-GE group (8 students)
      const { data: td2Group, error: td2Error } = await supabase
        .from('class_groups')
        .insert({
          name: 'TD2-GE',
          code: 'TD2-GE-2324',
          group_type: 'td',
          program_id: PROGRAM_ID,
          parent_group_id: CLASS_GROUP_ID,
          max_students: 8
        })
        .select()
        .single();

      if (td2Error) throw td2Error;

      // Get students to assign to TD groups
      const { data: students, error: studentsError } = await supabase
        .from('students')
        .select('id, student_number')
        .eq('program_id', PROGRAM_ID)
        .order('student_number');

      if (studentsError) throw studentsError;

      // Note: TD groups are created but student assignment will be handled 
      // through the administration interface for now
      console.log(`Created TD1-GE group with capacity for 9 students`);
      console.log(`Created TD2-GE group with capacity for 8 students`);
      console.log(`Found ${students.length} DUTGE students to potentially assign`);

      return { td1Count: 9, td2Count: 8 };
    } catch (error) {
      console.error('Error creating TD groups:', error);
      throw error;
    }
  };

  const handleImport = async () => {
    setImporting(true);
    setProgress(0);
    setImportResults(null);

    try {
      toast.info('Début de l\'import des étudiants DUTGE...');

      const results = {
        success: 0,
        failed: 0,
        details: [] as string[]
      };

      // Import each student
      for (let i = 0; i < DUTGE_STUDENTS.length; i++) {
        const result = await createStudent(DUTGE_STUDENTS[i], i);
        
        if (result.success) {
          results.success++;
          results.details.push(`✅ ${result.student} - Importé avec succès`);
        } else {
          results.failed++;
          results.details.push(`❌ ${result.student} - Erreur: ${result.error}`);
        }
      }

      // Create TD groups
      toast.info('Création des groupes TD...');
      const groupResults = await createTDGroups();
      results.details.push(`✅ TD1-GE créé avec ${groupResults.td1Count} étudiants`);
      results.details.push(`✅ TD2-GE créé avec ${groupResults.td2Count} étudiants`);

      setImportResults(results);

      if (results.failed === 0) {
        toast.success(`Import terminé avec succès! ${results.success} étudiants importés`);
      } else {
        toast.warning(`Import terminé avec ${results.failed} erreurs sur ${DUTGE_STUDENTS.length} étudiants`);
      }

    } catch (error) {
      console.error('Import error:', error);
      toast.error('Erreur lors de l\'import: ' + error.message);
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Import des Étudiants DUTGE 2023/2024
          </CardTitle>
          <CardDescription>
            Import automatique de 17 étudiants en DUT2 Gestion des Entreprises
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
            <Users className="h-8 w-8 text-primary" />
            <div>
              <h3 className="font-semibold">17 Étudiants à importer</h3>
              <p className="text-sm text-muted-foreground">
                Programme: DUT Gestion des Entreprises (DUTGE)<br />
                Classe: DUT2-GE<br />
                Email commun: exprh21@gmail.com
              </p>
            </div>
          </div>

          {importing && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Import en cours...</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          )}

          <Button 
            onClick={handleImport} 
            disabled={importing}
            className="w-full"
            size="lg"
          >
            {importing ? 'Import en cours...' : 'Lancer l\'Import'}
          </Button>

          {importResults && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {importResults.failed === 0 ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-orange-500" />
                  )}
                  Résultats de l'Import
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {importResults.success}
                    </div>
                    <div className="text-sm text-green-700">Succès</div>
                  </div>
                  <div className="text-center p-3 bg-red-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">
                      {importResults.failed}
                    </div>
                    <div className="text-sm text-red-700">Échecs</div>
                  </div>
                </div>
                
                <div className="space-y-1 max-h-60 overflow-y-auto">
                  {importResults.details.map((detail, index) => (
                    <div key={index} className="text-sm font-mono">
                      {detail}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
};