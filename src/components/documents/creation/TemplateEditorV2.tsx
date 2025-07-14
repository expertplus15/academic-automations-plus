import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Edit3, Save, Eye, Code, Settings, FileText } from 'lucide-react';

export function TemplateEditorV2() {
  const [template, setTemplate] = useState({
    name: '',
    code: '',
    description: '',
    content: '',
    variables: [],
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Edit3 className="w-5 h-5 mr-2" />
            Éditeur de Templates V2
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="design" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="design">Design</TabsTrigger>
              <TabsTrigger value="variables">Variables</TabsTrigger>
              <TabsTrigger value="preview">Aperçu</TabsTrigger>
              <TabsTrigger value="settings">Paramètres</TabsTrigger>
            </TabsList>

            <TabsContent value="design" className="mt-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Nom du template</label>
                    <Input
                      value={template.name}
                      onChange={(e) => setTemplate({...template, name: e.target.value})}
                      placeholder="Nom du template"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Code</label>
                    <Input
                      value={template.code}
                      onChange={(e) => setTemplate({...template, code: e.target.value})}
                      placeholder="CODE_TEMPLATE"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Description</label>
                  <Textarea
                    value={template.description}
                    onChange={(e) => setTemplate({...template, description: e.target.value})}
                    placeholder="Description du template"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Contenu du template</label>
                  <Textarea
                    value={template.content}
                    onChange={(e) => setTemplate({...template, content: e.target.value})}
                    placeholder="Contenu HTML du template..."
                    rows={15}
                    className="font-mono text-sm"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="variables" className="mt-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">Variables disponibles</h3>
                  <Button size="sm">Ajouter variable</Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {['{{student_name}}', '{{student_number}}', '{{date}}', '{{program_name}}'].map(variable => (
                    <Card key={variable} className="p-3">
                      <div className="font-mono text-sm">{variable}</div>
                      <div className="text-xs text-muted-foreground mt-1">Variable système</div>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="preview" className="mt-6">
              <div className="border rounded-lg p-6 bg-white min-h-96">
                <div className="text-center text-muted-foreground">
                  <FileText className="w-12 h-12 mx-auto mb-4" />
                  <p>Aperçu du template</p>
                  <p className="text-xs">Sauvegardez pour voir l'aperçu</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="settings" className="mt-6">
              <div className="space-y-4">
                <h3 className="font-medium">Paramètres du template</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Actif</span>
                    <Badge variant="secondary">Oui</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Approbation requise</span>
                    <Badge variant="outline">Non</Badge>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end space-x-2 mt-6 pt-6 border-t">
            <Button variant="outline">
              <Eye className="w-4 h-4 mr-2" />
              Aperçu
            </Button>
            <Button>
              <Save className="w-4 h-4 mr-2" />
              Sauvegarder
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}