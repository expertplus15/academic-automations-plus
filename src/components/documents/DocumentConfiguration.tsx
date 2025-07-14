import React, { useState, useEffect } from 'react';
import { Settings, FileText, Download, Eye, Calendar, BookOpen } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { useDocumentGeneration } from '@/hooks/useDocumentGeneration';

interface DocumentConfigurationProps {
  isOpen: boolean;
  onClose: () => void;
  documentType: string;
  studentIds: string[];
  students: Array<{
    id: string;
    student_number: string;
    profiles: { full_name: string; email: string } | null;
    programs: { name: string; code: string } | null;
  }>;
}

interface Template {
  id: string;
  name: string;
  description?: string;
  template_type: string;
  is_active: boolean;
}

interface AcademicYear {
  id: string;
  name: string;
  is_current: boolean;
}

export function DocumentConfiguration({
  isOpen,
  onClose,
  documentType,
  studentIds,
  students
}: DocumentConfigurationProps) {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [selectedAcademicYear, setSelectedAcademicYear] = useState<string>('');
  const [selectedSemester, setSelectedSemester] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const { generateDocument, previewDocument, batchGenerate, loading: generating } = useDocumentGeneration();

  // Fetch templates and academic years
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Get templates matching document type
        const { data: templatesData } = await supabase
          .from('document_templates')
          .select('*')
          .eq('is_active', true)
          .order('name');

        // Get academic years
        const { data: academicYearsData } = await supabase
          .from('academic_years')
          .select('*')
          .order('is_current', { ascending: false });

        setTemplates(templatesData || []);
        setAcademicYears(academicYearsData || []);

        // Pre-select current academic year
        const currentYear = academicYearsData?.find(y => y.is_current);
        if (currentYear) {
          setSelectedAcademicYear(currentYear.id);
        }

        // Pre-select first matching template if available
        const matchingTemplate = templatesData?.find(t => 
          t.template_type.toLowerCase().includes(documentType.toLowerCase())
        );
        if (matchingTemplate) {
          setSelectedTemplate(matchingTemplate.id);
        } else if (templatesData?.length > 0) {
          setSelectedTemplate(templatesData[0].id);
        }

      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchData();
    }
  }, [isOpen, documentType]);

  const getDocumentTypeLabel = () => {
    const types: Record<string, string> = {
      'bulletins': 'Bulletins de Notes',
      'releves': 'Relevés de Notes',
      'attestations': 'Attestations',
      'certificats': 'Certificats de Scolarité',
      'reussite': 'Attestations de Réussite',
      'autre': 'Autre Document'
    };
    return types[documentType] || documentType;
  };

  const handlePreview = async () => {
    if (!selectedTemplate || studentIds.length === 0) return;

    try {
      const additionalData = {
        academic_year_id: selectedAcademicYear,
        semester: selectedSemester ? parseInt(selectedSemester) : undefined
      };

      await previewDocument(selectedTemplate, studentIds[0], additionalData);
    } catch (error) {
      console.error('Preview error:', error);
    }
  };

  const handleGenerate = async () => {
    if (!selectedTemplate || studentIds.length === 0) return;

    try {
      const additionalData = {
        academic_year_id: selectedAcademicYear,
        semester: selectedSemester ? parseInt(selectedSemester) : undefined
      };

      if (studentIds.length === 1) {
        await generateDocument(selectedTemplate, studentIds[0], additionalData);
      } else {
        await batchGenerate(selectedTemplate, studentIds, additionalData);
      }

      onClose();
    } catch (error) {
      console.error('Generation error:', error);
    }
  };

  const selectedTemplateData = templates.find(t => t.id === selectedTemplate);
  const isMultiple = studentIds.length > 1;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Configuration - {getDocumentTypeLabel()}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 overflow-y-auto">
          {/* Students summary */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <FileText className="w-4 h-4" />
                {isMultiple ? 'Étudiants sélectionnés' : 'Étudiant sélectionné'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {students.slice(0, 3).map(student => (
                  <div key={student.id} className="flex items-center justify-between text-sm">
                    <span>{student.profiles?.full_name}</span>
                    <Badge variant="outline" className="text-xs">
                      {student.student_number}
                    </Badge>
                  </div>
                ))}
                {students.length > 3 && (
                  <div className="text-sm text-muted-foreground">
                    ... et {students.length - 3} autre{students.length - 3 > 1 ? 's' : ''}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Template selection */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Template de document</Label>
            <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un template" />
              </SelectTrigger>
              <SelectContent>
                {templates.map(template => (
                  <SelectItem key={template.id} value={template.id}>
                    <div className="flex flex-col items-start">
                      <span>{template.name}</span>
                      {template.description && (
                        <span className="text-xs text-muted-foreground">
                          {template.description}
                        </span>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedTemplateData && (
              <div className="text-sm text-muted-foreground">
                Type: {selectedTemplateData.template_type}
              </div>
            )}
          </div>

          {/* Academic year selection */}
          <div className="space-y-3">
            <Label className="text-base font-medium flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Année académique
            </Label>
            <Select value={selectedAcademicYear} onValueChange={setSelectedAcademicYear}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une année académique" />
              </SelectTrigger>
              <SelectContent>
                {academicYears.map(year => (
                  <SelectItem key={year.id} value={year.id}>
                    <div className="flex items-center gap-2">
                      <span>{year.name}</span>
                      {year.is_current && (
                        <Badge variant="default" className="text-xs">
                          Actuelle
                        </Badge>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Semester selection */}
          <div className="space-y-3">
            <Label className="text-base font-medium flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Semestre (optionnel)
            </Label>
            <Select value={selectedSemester} onValueChange={setSelectedSemester}>
              <SelectTrigger>
                <SelectValue placeholder="Tous les semestres" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Tous les semestres</SelectItem>
                <SelectItem value="1">Semestre 1</SelectItem>
                <SelectItem value="2">Semestre 2</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Actions */}
          <div className="flex justify-between">
            <Button variant="outline" onClick={onClose}>
              Annuler
            </Button>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handlePreview}
                disabled={!selectedTemplate || loading || generating}
              >
                <Eye className="w-4 h-4 mr-2" />
                Aperçu
              </Button>
              
              <Button
                onClick={handleGenerate}
                disabled={!selectedTemplate || loading || generating}
              >
                <Download className="w-4 h-4 mr-2" />
                {generating ? 'Génération...' : 
                 isMultiple ? `Générer ${studentIds.length} documents` : 'Générer le document'}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}