import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, Users, FileText, GraduationCap } from 'lucide-react';
import { ExamCreationData } from '@/hooks/exams/useExamCreation';

interface ExamPreviewProps {
  data: ExamCreationData;
}

export function ExamPreview({ data }: ExamPreviewProps) {
  const getExamTypeIcon = (type: string) => {
    switch (type) {
      case 'written': return '📝';
      case 'oral': return '🗣️';
      case 'practical': return '🔬';
      case 'mixed': return '🔄';
      case 'project': return '📋';
      default: return '📄';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <FileText className="w-4 h-4" />
          Aperçu de l'examen
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* En-tête de l'examen */}
        <div className="p-4 bg-gradient-to-r from-violet-50 to-blue-50 rounded-lg border">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-foreground">
                {data.title || 'Titre non défini'}
              </h3>
              {data.description && (
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {data.description}
                </p>
              )}
            </div>
            <div className="text-2xl">
              {getExamTypeIcon(data.examType || '')}
            </div>
          </div>
          
          <div className="flex items-center gap-4 mt-3">
            <Badge variant="outline" className="flex items-center gap-1">
              <GraduationCap className="w-3 h-3" />
              {data.programId || 'Programme non défini'}
            </Badge>
            {data.coefficient && (
              <Badge variant="outline">
                Coeff. {data.coefficient}
              </Badge>
            )}
          </div>
        </div>

        {/* Détails de l'examen */}
        <div className="grid grid-cols-2 gap-4">
          {/* Date et heure */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Calendar className="w-4 h-4 text-violet-500" />
              Date & Heure
            </div>
            <div className="text-sm text-muted-foreground pl-6">
              {data.scheduledDate ? (
                <>
                  {new Date(data.scheduledDate).toLocaleDateString('fr-FR', { 
                    weekday: 'short', 
                    day: 'numeric', 
                    month: 'short' 
                  })}
                  <br />
                  {data.scheduledTime}
                </>
              ) : (
                'À planifier'
              )}
            </div>
          </div>

          {/* Durée */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Clock className="w-4 h-4 text-violet-500" />
              Durée
            </div>
            <div className="text-sm text-muted-foreground pl-6">
              {data.durationMinutes ? `${data.durationMinutes} min` : 'Non définie'}
              {data.durationMinutes && (
                <div className="text-xs">
                  ({Math.floor(data.durationMinutes / 60)}h{data.durationMinutes % 60 > 0 ? ` ${data.durationMinutes % 60}min` : ''})
                </div>
              )}
            </div>
          </div>

          {/* Lieu */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <MapPin className="w-4 h-4 text-violet-500" />
              Lieu
            </div>
            <div className="text-sm text-muted-foreground pl-6">
              {data.roomName || 'Salle non attribuée'}
            </div>
          </div>

          {/* Participants */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Users className="w-4 h-4 text-violet-500" />
              Participants
            </div>
            <div className="text-sm text-muted-foreground pl-6">
              {data.maxStudents ? `${data.maxStudents} étudiants max` : 'Non défini'}
              {data.selectedSupervisors && (
                <div className="text-xs">
                  {data.selectedSupervisors.length} surveillant(s)
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Matériel autorisé */}
        {data.materials && data.materials.length > 0 && (
          <div className="space-y-2">
            <div className="text-sm font-medium">Matériel autorisé</div>
            <div className="flex flex-wrap gap-1">
              {data.materials.map((material) => (
                <Badge key={material} variant="secondary" className="text-xs">
                  {material}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Instructions spéciales */}
        {data.instructions && (
          <div className="space-y-2">
            <div className="text-sm font-medium">Instructions spéciales</div>
            <div className="text-sm text-muted-foreground p-3 bg-gray-50 rounded-lg">
              {data.instructions}
            </div>
          </div>
        )}

        {/* Options */}
        <div className="flex flex-wrap gap-2">
          {data.allowMakeup && (
            <Badge variant="outline" className="text-xs">
              ✅ Rattrapage autorisé
            </Badge>
          )}
          {data.allowDigitalDocuments && (
            <Badge variant="outline" className="text-xs">
              💻 Documents numériques
            </Badge>
          )}
          {data.anonymousGrading && (
            <Badge variant="outline" className="text-xs">
              🔒 Correction anonyme
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}