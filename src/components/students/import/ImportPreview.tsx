
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Users, Calendar, GraduationCap, CheckCircle, AlertCircle } from 'lucide-react';
import { DutgeStudentData, ImportResult } from '@/components/students/import/ImportTab';
import { StudentsImportService } from '@/services/StudentsImportService';

interface ImportPreviewProps {
  data: DutgeStudentData[];
  onImportStart: () => void;
  onImportProgress: (progress: number) => void;
  onImportComplete: (result: ImportResult) => void;
  onBack: () => void;
}

export function ImportPreview({ 
  data, 
  onImportStart, 
  onImportProgress, 
  onImportComplete, 
  onBack 
}: ImportPreviewProps) {
  const [isValidated, setIsValidated] = React.useState(false);
  const [validationErrors, setValidationErrors] = React.useState<string[]>([]);

  React.useEffect(() => {
    validateData();
  }, [data]);

  const validateData = () => {
    const errors: string[] = [];
    
    // Basic validation
    if (data.length === 0) {
      errors.push("Aucune donnée à importer");
    }
    
    // Check for required fields
    data.forEach((student, index) => {
      if (!student.matricule) errors.push(`Ligne ${index + 1}: Matricule manquant`);
      if (!student.nom) errors.push(`Ligne ${index + 1}: Nom manquant`);
      if (!student.prenom) errors.push(`Ligne ${index + 1}: Prénom manquant`);
      if (!student.email) errors.push(`Ligne ${index + 1}: Email manquant`);
    });
    
    // Check for duplicates
    const matricules = data.map(s => s.matricule).filter(Boolean);
    const uniqueMatricules = new Set(matricules);
    if (matricules.length !== uniqueMatricules.size) {
      errors.push("Matricules dupliqués détectés");
    }
    
    setValidationErrors(errors);
    setIsValidated(errors.length === 0);
  };

  const handleImport = async () => {
    if (!isValidated) return;
    
    onImportStart();
    
    try {
      const importService = new StudentsImportService();
      const result = await importService.importStudents(
        data,
        onImportProgress
      );
      onImportComplete(result);
    } catch (error) {
      console.error('Import failed:', error);
      onImportComplete({
        success: 0,
        errors: data.length,
        details: [{ student: 'Import global', error: error instanceof Error ? error.message : 'Erreur inconnue' }],
        createdStudents: [],
        createdGroups: []
      });
    }
  };

  // Group assignment calculation
  const td1Students = data.slice(0, 9);
  const td2Students = data.slice(9);

  return (
    <div className="space-y-6">
      {/* Statistics overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="flex items-center p-6">
            <Users className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Étudiants</p>
              <p className="text-2xl font-bold">{data.length}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <GraduationCap className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Programme</p>
              <p className="text-lg font-semibold">DUT2-GE</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <Calendar className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Année</p>
              <p className="text-lg font-semibold">2023/2024</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            {isValidated ? (
              <CheckCircle className="h-8 w-8 text-green-600" />
            ) : (
              <AlertCircle className="h-8 w-8 text-red-600" />
            )}
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Validation</p>
              <p className="text-lg font-semibold">
                {isValidated ? 'Valide' : 'Erreurs'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Validation errors */}
      {validationErrors.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-800">Erreurs de Validation</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-1">
              {validationErrors.map((error, index) => (
                <li key={index} className="text-red-700">{error}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Group assignment preview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-blue-600">TD1-GE ({td1Students.length} étudiants)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {td1Students.map((student, index) => (
                <div key={index} className="text-sm">
                  {student.prenom} {student.nom}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-green-600">TD2-GE ({td2Students.length} étudiants)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {td2Students.map((student, index) => (
                <div key={index} className="text-sm">
                  {student.prenom} {student.nom}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data preview table */}
      <Card>
        <CardHeader>
          <CardTitle>Aperçu des Données</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Matricule</TableHead>
                  <TableHead>Nom Complet</TableHead>
                  <TableHead>Date Naissance</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Téléphone</TableHead>
                  <TableHead>Groupe TD</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.slice(0, 10).map((student, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{student.matricule}</TableCell>
                    <TableCell>{student.prenom} {student.nom}</TableCell>
                    <TableCell>{student.dateNaissance}</TableCell>
                    <TableCell className="text-sm">{student.email}</TableCell>
                    <TableCell>{student.telephone}</TableCell>
                    <TableCell>
                      <Badge variant={index < 9 ? "default" : "secondary"}>
                        {index < 9 ? "TD1-GE" : "TD2-GE"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {data.length > 10 && (
              <p className="text-center text-gray-500 mt-4">
                ... et {data.length - 10} autres étudiants
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Action buttons */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Retour
        </Button>
        
        <Button 
          onClick={handleImport} 
          disabled={!isValidated}
          className="bg-green-600 hover:bg-green-700"
        >
          Lancer l'Import ({data.length} étudiants)
        </Button>
      </div>
    </div>
  );
}
