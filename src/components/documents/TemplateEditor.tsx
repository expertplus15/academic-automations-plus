import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Save, 
  Eye, 
  Upload, 
  Download, 
  Settings, 
  Palette, 
  Type,
  Image,
  Code
} from "lucide-react";

interface TemplateEditorProps {
  templateId?: string;
  onSave?: (template: any) => void;
  onCancel?: () => void;
}

export function TemplateEditor({ templateId, onSave, onCancel }: TemplateEditorProps) {
  const [template, setTemplate] = useState({
    name: "",
    description: "",
    type: "bulletin",
    headerContent: "",
    footerContent: "",
    styling: {
      primaryColor: "#3b82f6",
      secondaryColor: "#64748b",
      fontFamily: "Inter",
      fontSize: "12",
      logoUrl: ""
    },
    layout: "standard",
    fields: []
  });

  const [activeTab, setActiveTab] = useState("content");

  const handleSave = () => {
    onSave?.(template);
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Éditeur de Template
                {templateId && <Badge variant="outline">ID: {templateId}</Badge>}
              </CardTitle>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-1" />
                Aperçu
              </Button>
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-1" />
                Enregistrer
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Configuration générale */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Informations Générales</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom du template</Label>
              <Input
                id="name"
                value={template.name}
                onChange={(e) => setTemplate(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Nom du template"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="type">Type de document</Label>
              <Select value={template.type} onValueChange={(value) => 
                setTemplate(prev => ({ ...prev, type: value }))
              }>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bulletin">Bulletin</SelectItem>
                  <SelectItem value="transcript">Relevé</SelectItem>
                  <SelectItem value="certificate">Certificat</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={template.description}
              onChange={(e) => setTemplate(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Description du template..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Éditeur principal */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 w-full max-w-2xl">
          <TabsTrigger value="content" className="flex items-center gap-2">
            <Type className="h-4 w-4" />
            Contenu
          </TabsTrigger>
          <TabsTrigger value="styling" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Style
          </TabsTrigger>
          <TabsTrigger value="layout" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Mise en page
          </TabsTrigger>
          <TabsTrigger value="preview" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Aperçu
          </TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Contenu du Template</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="header">En-tête</Label>
                <Textarea
                  id="header"
                  value={template.headerContent}
                  onChange={(e) => setTemplate(prev => ({ ...prev, headerContent: e.target.value }))}
                  placeholder="Contenu de l'en-tête..."
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="footer">Pied de page</Label>
                <Textarea
                  id="footer"
                  value={template.footerContent}
                  onChange={(e) => setTemplate(prev => ({ ...prev, footerContent: e.target.value }))}
                  placeholder="Contenu du pied de page..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Variables disponibles</Label>
                <div className="flex flex-wrap gap-2">
                  {[
                    "{{student.name}}", 
                    "{{student.number}}", 
                    "{{academic.year}}", 
                    "{{academic.semester}}",
                    "{{program.name}}",
                    "{{date.today}}"
                  ].map((variable) => (
                    <Badge key={variable} variant="outline" className="cursor-pointer text-xs">
                      {variable}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="styling" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Style et Apparence</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="primaryColor">Couleur primaire</Label>
                  <div className="flex gap-2">
                    <Input
                      id="primaryColor"
                      type="color"
                      value={template.styling.primaryColor}
                      onChange={(e) => setTemplate(prev => ({
                        ...prev,
                        styling: { ...prev.styling, primaryColor: e.target.value }
                      }))}
                      className="w-16 h-10"
                    />
                    <Input
                      value={template.styling.primaryColor}
                      onChange={(e) => setTemplate(prev => ({
                        ...prev,
                        styling: { ...prev.styling, primaryColor: e.target.value }
                      }))}
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fontFamily">Police</Label>
                  <Select 
                    value={template.styling.fontFamily} 
                    onValueChange={(value) => setTemplate(prev => ({
                      ...prev,
                      styling: { ...prev.styling, fontFamily: value }
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Inter">Inter</SelectItem>
                      <SelectItem value="Arial">Arial</SelectItem>
                      <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                      <SelectItem value="Helvetica">Helvetica</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="logoUrl">Logo (URL)</Label>
                <div className="flex gap-2">
                  <Input
                    id="logoUrl"
                    value={template.styling.logoUrl}
                    onChange={(e) => setTemplate(prev => ({
                      ...prev,
                      styling: { ...prev.styling, logoUrl: e.target.value }
                    }))}
                    placeholder="https://..."
                    className="flex-1"
                  />
                  <Button variant="outline" size="sm">
                    <Upload className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="layout" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Configuration de la Mise en Page</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Disposition</Label>
                <div className="grid grid-cols-3 gap-3">
                  {["standard", "compact", "detailed"].map((layout) => (
                    <div
                      key={layout}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        template.layout === layout ? "border-primary bg-primary/5" : "hover:border-primary/50"
                      }`}
                      onClick={() => setTemplate(prev => ({ ...prev, layout }))}
                    >
                      <div className="text-sm font-medium capitalize">{layout}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {layout === "standard" && "Mise en page classique"}
                        {layout === "compact" && "Version condensée"}
                        {layout === "detailed" && "Version détaillée"}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Aperçu du Template</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg p-6 bg-white min-h-[400px]">
                <div className="text-center text-muted-foreground">
                  Aperçu du template sera affiché ici
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Actions */}
      <div className="flex gap-3">
        <Button onClick={handleSave} className="flex-1">
          <Save className="h-4 w-4 mr-2" />
          Enregistrer Template
        </Button>
        
        <Button variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Exporter
        </Button>
      </div>
    </div>
  );
}