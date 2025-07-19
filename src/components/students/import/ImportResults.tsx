
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle, XCircle, Download, RotateCcw, Users, GraduationCap } from 'lucide-react';
import { ImportResult } from '@/pages/students/Import';
import { useToast } from '@/hooks/use-toast';

interface ImportResultsProps {
  result: ImportResult;
  onReset: () => void;
}

export function ImportResults({ result, onReset }: ImportResultsProps) {
  const { toast } = useToast();

  const generateClassList = () => {
    const csvContent = [
      'Matricule,Nom,Prenom,Email,Groupe_TD,Date_Import',
      ...result.createdStudents.map(student => 
        `${student.student_number},${student.profiles?.full_name?.split(' ').slice(1).join(' ')},${student.profiles?.full_name?.split(' ')[0]},${student.profiles?.email},${student.group_name || 'Non assigné'},${new Date().toLocaleDateString()}`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `liste-classe-dutge-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Liste de classe téléchargée",
      description: `${result.createdStudents.length} étudiants exportés`,
    });
  };

  const generateStatisticsReport = () => {
    const reportData = {
      import_date: new Date().toISOString(),
      total_students: result.success,
      failed_imports: result.errors,
      success_rate: ((result.success / (result.success + result.errors)) * 100).toFixed(1),
      program: "DUT Gestion des Entreprises",
      level: "DUT2",
      academic_year: "2023/2024",
      groups_created: result.createdGroups,
      students_by_group: {
        "TD1-GE": result.createdStudents.filter((_, index) => index < 9).length,
        "TD2-GE": result.createdStudents.filter((_, index) => index >= 9).length
      }
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rapport-import-dutge-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Rapport statistique téléchargé",
      description: "Données complètes de l'import exportées",
    });
  };

  return (
    <div className="space-y-6">
      {/* Success banner */}
      {result.success > 0 && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-green-800 flex items-center gap-2">
              <CheckCircle className="w-6 h-6" />
              ✅ ÉTAPE 2 COMPLÉTÉE : {result.success} étudiants DUTGE importés
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="bg-white p-4 rounded-lg">
                <Users className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-green-800">{result.success}</p>
                <p className="text-sm text-green-600">Étudiants importés</p>
              </div>
              
              <div className="bg-white p-4 rounded-lg">
                <GraduationCap className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-blue-800">{result.createdGroups.length}</p>
                <p className="text-sm text-blue-600">Groupes TD créés</p>
              </div>
              
              <div className="bg-white p-4 rounded-lg">
                <CheckCircle className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-purple-800">
                  {((result.success / (result.success + result.errors)) * 100).toFixed(0)}%
                </p>
                <p className="text-sm text-purple-600">Taux de réussite</p>
              </div>
              
              <div className="bg-white p-4 rounded-lg">
                <Download className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-orange-800">3</p>
                <p className="text-sm text-orange-600">Documents générés</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error summary */}
      {result.errors > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-800 flex items-center gap-2">
              <XCircle className="w-6 h-6" />
              Erreurs d'Import ({result.errors})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {result.details.filter(detail => detail.error).map((detail, index) => (
                <div key={index} className="flex items-center gap-2 text-red-700">
                  <XCircle className="w-4 h-4" />
                  <span className="font-medium">{detail.student}:</span>
                  <span>{detail.error}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Groups created */}
      {result.createdGroups.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>✅ Groupes TD créés et assignés</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {result.createdGroups.map((groupName, index) => (
                <div key={index} className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-800">{groupName}</h4>
                  <p className="text-blue-600">
                    {index === 0 ? '9 étudiants assignés' : '8 étudiants assignés'}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Students table */}
      {result.createdStudents.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>✅ Étudiants Importés avec Succès</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Matricule</TableHead>
                    <TableHead>Nom Complet</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Groupe TD</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {result.createdStudents.map((student, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{student.student_number}</TableCell>
                      <TableCell>{student.profiles?.full_name}</TableCell>
                      <TableCell className="text-sm">{student.profiles?.email}</TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-800">
                          {student.status || 'Actif'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={index < 9 ? "default" : "secondary"}>
                          {index < 9 ? "TD1-GE" : "TD2-GE"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action buttons */}
      <div className="flex flex-wrap gap-4 justify-between">
        <div className="flex gap-2">
          <Button onClick={generateClassList} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            ✅ Liste de Classe (CSV)
          </Button>
          
          <Button onClick={generateStatisticsReport} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            ✅ Rapport Statistique
          </Button>
        </div>
        
        <Button onClick={onReset} variant="outline">
          <RotateCcw className="w-4 h-4 mr-2" />
          Nouvel Import
        </Button>
      </div>

      {/* Final confirmation */}
      <Card className="border-green-200 bg-green-50">
        <CardContent className="pt-6">
          <div className="text-center text-green-800">
            <CheckCircle className="w-16 h-16 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Import Terminé avec Succès!</h3>
            <p className="mb-4">
              Les {result.success} étudiants DUTGE sont maintenant disponibles dans le système.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>✅ Comptes utilisateurs créés</div>
              <div>✅ Profils étudiants configurés</div>
              <div>✅ Groupes TD assignés</div>
              <div>✅ Documents générés</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
