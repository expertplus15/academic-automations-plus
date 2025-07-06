import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertTriangle, Info, Calendar, MapPin, Users, Clock, FileText, Settings } from 'lucide-react';
import { ExamCreationData } from '@/hooks/exams/useExamCreation';
import { ExamPreview } from '@/components/exams/creation/ExamPreview';
import { ValidationSummary } from '@/components/exams/creation/ValidationSummary';

interface ReviewProps {
  data: ExamCreationData;
  onChange: (updates: Partial<ExamCreationData>) => void;
}

export function Review({ data, onChange }: ReviewProps) {
  const validationItems = [
    {
      category: 'Informations de base',
      items: [
        { label: 'Titre de l\'examen', value: data.title, valid: !!data.title },
        { label: 'Type d\'examen', value: data.examType, valid: !!data.examType },
        { label: 'Matière', value: data.subjectId, valid: !!data.subjectId },
        { label: 'Programme', value: data.programId, valid: !!data.programId },
      ]
    },
    {
      category: 'Configuration',
      items: [
        { label: 'Durée', value: `${data.durationMinutes} min`, valid: !!data.durationMinutes },
        { label: 'Nombre max d\'étudiants', value: data.maxStudents, valid: !!data.maxStudents },
        { label: 'Nombre de surveillants', value: data.minSupervisors, valid: !!data.minSupervisors },
        { label: 'Coefficient', value: data.coefficient, valid: !!data.coefficient },
      ]
    },
    {
      category: 'Planification',
      items: [
        { label: 'Date programmée', value: data.scheduledDate, valid: !!data.scheduledDate },
        { label: 'Créneau horaire', value: data.scheduledTime, valid: !!data.scheduledTime },
        { label: 'Salle attribuée', value: data.roomName, valid: !!data.roomName },
        { label: 'Surveillants assignés', value: `${data.selectedSupervisors?.length || 0} sélectionné(s)`, valid: (data.selectedSupervisors?.length || 0) >= (data.minSupervisors || 1) }
      ]
    }
  ];

  const allValid = validationItems.every(category => 
    category.items.every(item => item.valid)
  );

  const warningItems = [
    ...(data.durationMinutes && data.durationMinutes > 180 ? ['Examen de longue durée (>3h)'] : []),
    ...(data.materials?.length === 0 ? ['Aucun matériel autorisé'] : []),
    ...(!data.description ? ['Aucune description fournie'] : []),
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-violet-100 rounded-lg">
          <CheckCircle className="w-5 h-5 text-violet-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-foreground">Révision et finalisation</h2>
          <p className="text-muted-foreground">Vérifiez tous les détails avant de créer l'examen</p>
        </div>
      </div>

      {/* Status global */}
      <Card className={`${allValid ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'}`}>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            {allValid ? (
              <>
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="font-medium text-green-800">Examen prêt à être créé</span>
              </>
            ) : (
              <>
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                <span className="font-medium text-amber-800">Informations manquantes ou incomplètes</span>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Validation détaillée */}
        <ValidationSummary validationItems={validationItems} />

        {/* Aperçu de l'examen */}
        <ExamPreview data={data} />
      </div>

      {/* Avertissements */}
      {warningItems.length > 0 && (
        <Card className="bg-amber-50 border-amber-200">
          <CardHeader>
            <CardTitle className="text-base text-amber-800 flex items-center gap-2">
              <Info className="w-4 h-4" />
              Points d'attention
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1">
              {warningItems.map((warning, index) => (
                <li key={index} className="text-sm text-amber-700 flex items-center gap-2">
                  <div className="w-1 h-1 bg-amber-600 rounded-full" />
                  {warning}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Récapitulatif de planification */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Récapitulatif de planification</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-violet-500" />
                <span className="font-medium">Date et horaire</span>
              </div>
              <div className="text-sm text-muted-foreground pl-6">
                {data.scheduledDate ? (
                  <>
                    {new Date(data.scheduledDate).toLocaleDateString('fr-FR', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                    <br />
                    {data.scheduledTime} ({data.durationMinutes} minutes)
                  </>
                ) : (
                  'Non planifié'
                )}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-violet-500" />
                <span className="font-medium">Lieu</span>
              </div>
              <div className="text-sm text-muted-foreground pl-6">
                {data.roomName || 'Salle non attribuée'}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-violet-500" />
                <span className="font-medium">Participants</span>
              </div>
              <div className="text-sm text-muted-foreground pl-6">
                {data.maxStudents} étudiants max<br />
                {data.selectedSupervisors?.length || 0} surveillant(s)
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-violet-500" />
                <span className="font-medium">Matériel</span>
              </div>
              <div className="text-sm text-muted-foreground pl-6">
                {data.materials?.length ? (
                  data.materials.map(material => (
                    <Badge key={material} variant="outline" className="mr-1 mb-1">
                      {material}
                    </Badge>
                  ))
                ) : (
                  'Aucun matériel spécifique'
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Instructions finales */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-700">
              <p className="font-medium">Après création de l'examen :</p>
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li>L'examen sera ajouté au planning général</li>
                <li>Les surveillants recevront une notification automatique</li>
                <li>La salle sera réservée pour la durée prévue</li>
                <li>Les étudiants pourront voir l'examen dans leur planning</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}