
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, Download, Users, BookOpen } from 'lucide-react';
import { useDUTGEData } from '@/hooks/useDUTGEData';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

export function GradeImportTab() {
  const { stats, loading, verifyDUTGEPrerequisites } = useDUTGEData();
  const navigate = useNavigate();

  const handleDUTGEImport = () => {
    navigate('/academic/configuration?tab=dutge-import');
  };

  const handleExcelImport = () => {
    navigate('/academic/configuration?tab=excel-import');
  };

  const downloadTemplate = () => {
    // Create CSV template for DUTGE grades
    const headers = ['matricule_etudiant', 'code_matiere', 'cc1', 'cc2', 'td', 'examen_final'];
    const csvContent = headers.join(',') + '\n' + 
                      'DUTGE24001,COMPTA401,15.5,16.0,14.5,17.0\n' +
                      'DUTGE24002,COMPTA401,12.0,13.5,15.0,14.5';
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'template_notes_dutge.csv';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-6">
      {/* DUTGE Import Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Import DUTGE - Rapide
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.totalStudents}</div>
              <div className="text-sm text-muted-foreground">Étudiants DUTGE</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.totalSubjects}</div>
              <div className="text-sm text-muted-foreground">Matières</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{stats.importedGrades}</div>
              <div className="text-sm text-muted-foreground">Notes importées</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{stats.publishedGrades}</div>
              <div className="text-sm text-muted-foreground">Notes publiées</div>
            </div>
          </div>

          <div className="flex gap-3 flex-wrap">
            <Button onClick={handleDUTGEImport} className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Import DUTGE Guidé
            </Button>
            <Button variant="outline" onClick={downloadTemplate}>
              <Download className="w-4 h-4 mr-2" />
              Template CSV
            </Button>
          </div>

          <div className="text-sm text-muted-foreground">
            Import optimisé pour les étudiants DUTGE avec validation automatique et guide pas-à-pas.
          </div>
        </CardContent>
      </Card>

      {/* General Import Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Import Général
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-3 flex-wrap">
            <Button variant="outline" onClick={handleExcelImport}>
              <Upload className="w-4 h-4 mr-2" />
              Import Excel/CSV
            </Button>
          </div>
          <div className="text-sm text-muted-foreground">
            Import standard pour tous les programmes avec templates Excel et validation avancée.
          </div>
        </CardContent>
      </Card>

      {/* Quick Instructions */}
      <Card>
        <CardContent className="pt-6">
          <h4 className="font-medium mb-3">Guide rapide :</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="w-6 h-6 p-0 flex items-center justify-center">1</Badge>
              <span>Téléchargez le template CSV ou utilisez l'import guidé DUTGE</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="w-6 h-6 p-0 flex items-center justify-center">2</Badge>
              <span>Préparez vos données avec les matricules et codes matières</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="w-6 h-6 p-0 flex items-center justify-center">3</Badge>
              <span>Importez et validez automatiquement</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="w-6 h-6 p-0 flex items-center justify-center">4</Badge>
              <span>Vérifiez dans la saisie matricielle et publiez</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
