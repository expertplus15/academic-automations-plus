
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Users, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function QuickImportAccess() {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-emerald-500" />
          Outils d'Import
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-3">
            <Users className="w-4 h-4 text-emerald-600" />
            <div>
              <p className="font-medium text-sm">Import DUTGE</p>
              <p className="text-xs text-muted-foreground">17 étudiants prêts à importer</p>
            </div>
          </div>
          <Button 
            size="sm" 
            onClick={() => navigate('/academic/dutge-import')}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            <Download className="w-4 h-4 mr-1" />
            Importer
          </Button>
        </div>
        
        <p className="text-xs text-muted-foreground">
          Utilisez l'import DUTGE pour ajouter rapidement tous les étudiants avec leurs profils complets.
        </p>
      </CardContent>
    </Card>
  );
}
