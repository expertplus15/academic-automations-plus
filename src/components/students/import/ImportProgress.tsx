
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Loader2, Users, Database, FileCheck } from 'lucide-react';

interface ImportProgressProps {
  progress: number;
}

export function ImportProgress({ progress }: ImportProgressProps) {
  const getStageInfo = () => {
    if (progress < 25) {
      return {
        stage: "Préparation des données",
        icon: <FileCheck className="w-5 h-5" />,
        description: "Validation et formatage des données étudiants"
      };
    } else if (progress < 50) {
      return {
        stage: "Création des comptes utilisateurs",
        icon: <Users className="w-5 h-5" />,
        description: "Génération des comptes auth.users et profils"
      };
    } else if (progress < 75) {
      return {
        stage: "Insertion des données étudiants",
        icon: <Database className="w-5 h-5" />,
        description: "Création des enregistrements étudiants et assignation aux groupes"
      };
    } else {
      return {
        stage: "Finalisation",
        icon: <Database className="w-5 h-5" />,
        description: "Vérification finale et génération des rapports"
      };
    }
  };

  const stageInfo = getStageInfo();

  return (
    <div className="space-y-6">
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="text-blue-800 flex items-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            Import en cours...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              {stageInfo.icon}
              <div>
                <p className="font-medium text-blue-900">{stageInfo.stage}</p>
                <p className="text-sm text-blue-700">{stageInfo.description}</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progression</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-3" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Import stages visualization */}
      <Card>
        <CardHeader>
          <CardTitle>Étapes de l'Import</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { name: "Validation des données", completed: progress > 25 },
              { name: "Création des comptes", completed: progress > 50 },
              { name: "Insertion des étudiants", completed: progress > 75 },
              { name: "Assignation aux groupes TD", completed: progress > 90 },
              { name: "Génération des rapports", completed: progress >= 100 }
            ].map((step, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${
                  step.completed ? 'bg-green-500' : 'bg-gray-300'
                }`} />
                <span className={step.completed ? 'text-green-700' : 'text-gray-600'}>
                  {step.name}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="text-center text-gray-600">
        <p>Veuillez patienter pendant l'import des données...</p>
        <p className="text-sm mt-2">
          L'import peut prendre quelques minutes selon le nombre d'étudiants.
        </p>
      </div>
    </div>
  );
}
