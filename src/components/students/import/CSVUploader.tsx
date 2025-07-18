
import React, { useCallback, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileText, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { DutgeStudentData } from '@/pages/students/Import';

interface CSVUploaderProps {
  onCSVUploaded: (data: DutgeStudentData[]) => void;
}

export function CSVUploader({ onCSVUploaded }: CSVUploaderProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const { toast } = useToast();

  // Data for the 17 DUTGE students
  const dutgeStudentsData = `Matricule,Nom,Prénom,Date_Naissance,Lieu_Naissance,Email,Telephone,Classe,Statut
2324EMD002GE,ABDALLAH,ABDOULKADER ABDALLAH,2000-10-30,DJIBOUTI,abdoulkader.abdallah.ge2024@institut.dj,+253 77 12 34 56,DUT2-GE,Actif
2324EMD003GE,ABDIRAHMAN,MOHAMED OMAR,2003-03-30,DJIBOUTI,mohamed.abdirahman.ge2024@institut.dj,+253 77 12 34 57,DUT2-GE,Actif
2324EMD004GE,ABDOURAHMAN,GALAL MOHAMED,2003-07-03,DJIBOUTI,galal.abdourahman.ge2024@institut.dj,+253 77 12 34 58,DUT2-GE,Actif
2324EMD005GE,ABDOURAZAK,IDRISS AWALEH,2004-04-21,DJIBOUTI,idriss.abdourazak.ge2024@institut.dj,+253 77 12 34 59,DUT2-GE,Actif
2324EMD007GE,ALI,DJIBRIL ABDI,2001-01-01,ARTA,djibril.ali.ge2024@institut.dj,+253 77 12 34 60,DUT2-GE,Actif
2324EMD001GE,AMIR,HASSAN ABDILLAHI,2003-10-07,DJIBOUTI,hassan.amir.ge2024@institut.dj,+253 77 12 34 61,DUT2-GE,Actif
2324EMD008GE,ANHAR,HOUSSEIN SAID,2005-11-16,ALI-SABIEH,houssein.anhar.ge2024@institut.dj,+253 77 12 34 62,DUT2-GE,Actif
2324EMD009GE,ASMA,KADAR ALI,2002-09-19,DJIBOUTI,kadar.asma.ge2024@institut.dj,+253 77 12 34 63,DUT2-GE,Actif
2324EMD012GE,AYOUB,AHMED YACIN,2000-08-18,DJIBOUTI,ahmed.ayoub.ge2024@institut.dj,+253 77 12 34 64,DUT2-GE,Actif
2324EMD042GE,BILAN,ABDOURAHMAN ABDILLAHI,2003-09-08,DJIBOUTI,abdourahman.bilan.ge2024@institut.dj,+253 77 12 34 65,DUT2-GE,Actif
2324EMD014GE,DJAMA,MOHAMED DAHER,2007-06-23,DJIBOUTI,mohamed.djama.ge2024@institut.dj,+253 77 12 34 66,DUT2-GE,Actif
2324EMD015GE,FATIMATALZAHRA,ABDALLAH SALAM,2001-10-20,DJIBOUTI,abdallah.fatimatalzahra.ge2024@institut.dj,+253 77 12 34 67,DUT2-GE,Actif
2324EMD016GE,FAWAZ,WALID MOHAMED,2005-06-19,DJIBOUTI,walid.fawaz.ge2024@institut.dj,+253 77 12 34 68,DUT2-GE,Actif
2324EMD017GE,HASSAN,OMAR ALI,2002-12-15,DJIBOUTI,omar.hassan.ge2024@institut.dj,+253 77 12 34 69,DUT2-GE,Actif
2324EMD018GE,IBRAHIM,SAID AHMED,2003-05-22,DJIBOUTI,said.ibrahim.ge2024@institut.dj,+253 77 12 34 70,DUT2-GE,Actif
2324EMD019GE,KHADIJA,MOHAMED HASSAN,2004-01-08,DJIBOUTI,mohamed.khadija.ge2024@institut.dj,+253 77 12 34 71,DUT2-GE,Actif
2324EMD020GE,MOHAMED,ALI FARAH,2002-07-30,DJIBOUTI,ali.mohamed.ge2024@institut.dj,+253 77 12 34 72,DUT2-GE,Actif`;

  const parseCSV = (csvText: string): DutgeStudentData[] => {
    const lines = csvText.trim().split('\n');
    const headers = lines[0].split(',');
    
    return lines.slice(1).map(line => {
      const values = line.split(',');
      return {
        matricule: values[0]?.trim() || '',
        nom: values[1]?.trim() || '',
        prenom: values[2]?.trim() || '',
        dateNaissance: values[3]?.trim() || '',
        lieuNaissance: values[4]?.trim() || '',
        email: values[5]?.trim() || '',
        telephone: values[6]?.trim() || '',
        classe: values[7]?.trim() || '',
        statut: values[8]?.trim() || '',
      };
    });
  };

  const handleFileUpload = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csvText = e.target?.result as string;
        const data = parseCSV(csvText);
        
        if (data.length === 0) {
          throw new Error('Aucune donnée valide trouvée dans le fichier');
        }
        
        toast({
          title: "Fichier CSV chargé",
          description: `${data.length} étudiants détectés`,
        });
        
        onCSVUploaded(data);
      } catch (error) {
        toast({
          title: "Erreur de lecture",
          description: error instanceof Error ? error.message : "Impossible de lire le fichier",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
  }, [onCSVUploaded, toast]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const csvFile = files.find(file => file.type === 'text/csv' || file.name.endsWith('.csv'));
    
    if (csvFile) {
      handleFileUpload(csvFile);
    } else {
      toast({
        title: "Type de fichier invalide",
        description: "Veuillez sélectionner un fichier CSV",
        variant: "destructive",
      });
    }
  }, [handleFileUpload, toast]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const loadDutgeData = () => {
    const data = parseCSV(dutgeStudentsData);
    toast({
      title: "Données DUTGE chargées",
      description: `${data.length} étudiants prêts pour l'import`,
    });
    onCSVUploaded(data);
  };

  const downloadTemplate = () => {
    const blob = new Blob([dutgeStudentsData], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'dutge-students-template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Quick load DUTGE data */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="text-blue-800">Import Automatique - Promotion DUTGE 2023/2024</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-blue-700 mb-4">
            Charger automatiquement les 17 étudiants de la promotion DUT2 Gestion des Entreprises
          </p>
          <Button onClick={loadDutgeData} className="bg-blue-600 hover:bg-blue-700">
            <Upload className="w-4 h-4 mr-2" />
            Charger les Données DUTGE (17 étudiants)
          </Button>
        </CardContent>
      </Card>

      {/* File upload area */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Fichier CSV</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragOver 
                ? 'border-blue-400 bg-blue-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDrop={handleDrop}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
          >
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-lg font-medium mb-2">
              Glissez votre fichier CSV ici ou cliquez pour sélectionner
            </p>
            <p className="text-gray-500 mb-4">
              Format supporté: CSV avec les colonnes requises
            </p>
            
            <div className="space-x-4">
              <Button asChild variant="outline">
                <label className="cursor-pointer">
                  <FileText className="w-4 h-4 mr-2" />
                  Sélectionner un fichier
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileInput}
                    className="hidden"
                  />
                </label>
              </Button>
              
              <Button variant="ghost" onClick={downloadTemplate}>
                <Download className="w-4 h-4 mr-2" />
                Télécharger le modèle CSV
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Format CSV Requis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="font-medium mb-2">Colonnes requises:</p>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>• Matricule</div>
              <div>• Nom</div>
              <div>• Prénom</div>
              <div>• Date_Naissance</div>
              <div>• Lieu_Naissance</div>
              <div>• Email</div>
              <div>• Telephone</div>
              <div>• Classe</div>
              <div>• Statut</div>
            </div>
            <p className="text-gray-600 mt-3 text-sm">
              Le système générera automatiquement les comptes utilisateurs et assignera les étudiants aux groupes TD appropriés.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
