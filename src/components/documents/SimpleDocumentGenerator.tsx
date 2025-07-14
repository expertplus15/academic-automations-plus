import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { SimpleDocumentGenerator } from '@/services/SimpleDocumentGenerator';
import { FileText, Download, Eye, Printer } from 'lucide-react';

export function SimpleDocumentGeneratorComponent() {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [studentData, setStudentData] = useState({
    first_name: 'Jean',
    last_name: 'Dupont',
    email: 'jean.dupont@email.com',
    student_number: 'STU001',
    program_name: 'Informatique',
    academic_year: '2023-2024'
  });
  const [previewHtml, setPreviewHtml] = useState<string>('');
  const [showPreview, setShowPreview] = useState(false);
  const { toast } = useToast();

  const templates = SimpleDocumentGenerator.getAvailableTemplates();

  const handlePreview = () => {
    if (!selectedTemplate) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un template",
        variant: "destructive"
      });
      return;
    }

    try {
      const html = SimpleDocumentGenerator.generateHTML(selectedTemplate, studentData);
      setPreviewHtml(html);
      setShowPreview(true);
      
      toast({
        title: "Aperçu généré",
        description: "Document prévisualisé avec succès"
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de générer l'aperçu",
        variant: "destructive"
      });
    }
  };

  const handlePrint = () => {
    if (!selectedTemplate) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un template",
        variant: "destructive"
      });
      return;
    }

    try {
      SimpleDocumentGenerator.printDocument(selectedTemplate, studentData);
      
      toast({
        title: "Impression lancée",
        description: "Le document s'ouvre dans une nouvelle fenêtre"
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'imprimer le document",
        variant: "destructive"
      });
    }
  };

  const handleDownloadPDF = async () => {
    if (!selectedTemplate) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un template",
        variant: "destructive"
      });
      return;
    }

    try {
      const pdfBlob = await SimpleDocumentGenerator.generatePDF(selectedTemplate, studentData);
      
      // Créer un lien de téléchargement
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `document-${selectedTemplate}-${Date.now()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast({
        title: "PDF téléchargé",
        description: "Le document PDF a été généré et téléchargé"
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de générer le PDF",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Générateur de Documents Simplifié
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Sélection du template */}
          <div>
            <Label htmlFor="template-select">Type de document</Label>
            <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un template" />
              </SelectTrigger>
              <SelectContent>
                {templates.map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Données de l'étudiant */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="first_name">Prénom</Label>
              <Input
                id="first_name"
                value={studentData.first_name}
                onChange={(e) => setStudentData(prev => ({ ...prev, first_name: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="last_name">Nom</Label>
              <Input
                id="last_name"
                value={studentData.last_name}
                onChange={(e) => setStudentData(prev => ({ ...prev, last_name: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={studentData.email}
                onChange={(e) => setStudentData(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="student_number">Numéro étudiant</Label>
              <Input
                id="student_number"
                value={studentData.student_number}
                onChange={(e) => setStudentData(prev => ({ ...prev, student_number: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="program_name">Formation</Label>
              <Input
                id="program_name"
                value={studentData.program_name}
                onChange={(e) => setStudentData(prev => ({ ...prev, program_name: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="academic_year">Année académique</Label>
              <Input
                id="academic_year"
                value={studentData.academic_year}
                onChange={(e) => setStudentData(prev => ({ ...prev, academic_year: e.target.value }))}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button onClick={handlePreview} variant="outline" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Aperçu
            </Button>
            <Button onClick={handlePrint} className="flex items-center gap-2">
              <Printer className="h-4 w-4" />
              Imprimer
            </Button>
            <Button onClick={handleDownloadPDF} variant="secondary" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              PDF
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Aperçu */}
      {showPreview && previewHtml && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Aperçu du document
              <Button onClick={() => setShowPreview(false)} variant="outline" size="sm">
                Fermer
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div 
              className="border rounded-lg p-4 bg-white"
              dangerouslySetInnerHTML={{ __html: previewHtml }}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}