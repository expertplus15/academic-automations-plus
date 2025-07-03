import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered, 
  Link, 
  Image, 
  Video, 
  FileText,
  Eye,
  Save,
  Upload
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface LessonContent {
  type: 'text' | 'video' | 'image' | 'document' | 'quiz';
  content: any;
  order: number;
}

interface LessonEditorProps {
  lesson?: any;
  onSave: (lessonData: any) => void;
  onCancel: () => void;
}

export function LessonEditor({ lesson, onSave, onCancel }: LessonEditorProps) {
  const [title, setTitle] = useState(lesson?.title || '');
  const [description, setDescription] = useState(lesson?.description || '');
  const [lessonType, setLessonType] = useState(lesson?.lesson_type || 'content');
  const [duration, setDuration] = useState(lesson?.duration_minutes || '');
  const [content, setContent] = useState(lesson?.content || { blocks: [] });
  const [isPreview, setIsPreview] = useState(false);
  const [videoUrl, setVideoUrl] = useState(lesson?.video_url || '');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleTextFormat = (format: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    
    let formattedText = '';
    switch (format) {
      case 'bold':
        formattedText = `**${selectedText}**`;
        break;
      case 'italic':
        formattedText = `*${selectedText}*`;
        break;
      case 'underline':
        formattedText = `__${selectedText}__`;
        break;
      case 'list':
        formattedText = `\n- ${selectedText}`;
        break;
      case 'ordered-list':
        formattedText = `\n1. ${selectedText}`;
        break;
      case 'link':
        formattedText = `[${selectedText}](url)`;
        break;
      default:
        formattedText = selectedText;
    }

    const newContent = 
      textarea.value.substring(0, start) + 
      formattedText + 
      textarea.value.substring(end);
    
    setContent({ ...content, text: newContent });
  };

  const handleSave = () => {
    const lessonData = {
      title,
      description,
      lesson_type: lessonType,
      duration_minutes: duration ? parseInt(duration) : null,
      content: {
        ...content,
        text: content.text || ''
      },
      video_url: videoUrl || null,
      is_published: false,
    };

    onSave(lessonData);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            {lesson ? 'Modifier la leçon' : 'Créer une nouvelle leçon'}
          </h2>
          <p className="text-muted-foreground">
            Créez du contenu riche et interactif pour vos étudiants
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsPreview(!isPreview)}>
            <Eye className="w-4 h-4 mr-2" />
            {isPreview ? 'Éditer' : 'Prévisualiser'}
          </Button>
          <Button variant="outline" onClick={onCancel}>
            Annuler
          </Button>
          <Button onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Sauvegarder
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Panneau de configuration */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Titre de la leçon
              </label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Titre de la leçon..."
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Description
              </label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description courte..."
                rows={3}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Type de leçon
              </label>
              <Select value={lessonType} onValueChange={setLessonType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="content">Contenu texte</SelectItem>
                  <SelectItem value="video">Vidéo</SelectItem>
                  <SelectItem value="interactive">Interactif</SelectItem>
                  <SelectItem value="quiz">Quiz</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Durée (minutes)
              </label>
              <Input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="30"
              />
            </div>

            {lessonType === 'video' && (
              <div>
                <label className="text-sm font-medium mb-2 block">
                  URL de la vidéo
                </label>
                <Input
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://youtube.com/watch?v=..."
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Éditeur principal */}
        <div className="lg:col-span-3">
          {!isPreview ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Éditeur de contenu</CardTitle>
                  <div className="flex items-center gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleTextFormat('bold')}
                    >
                      <Bold className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleTextFormat('italic')}
                    >
                      <Italic className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleTextFormat('underline')}
                    >
                      <Underline className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleTextFormat('list')}
                    >
                      <List className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleTextFormat('ordered-list')}
                    >
                      <ListOrdered className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleTextFormat('link')}
                    >
                      <Link className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="text" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="text">
                      <FileText className="w-4 h-4 mr-2" />
                      Texte
                    </TabsTrigger>
                    <TabsTrigger value="media">
                      <Image className="w-4 h-4 mr-2" />
                      Médias
                    </TabsTrigger>
                    <TabsTrigger value="video">
                      <Video className="w-4 h-4 mr-2" />
                      Vidéo
                    </TabsTrigger>
                    <TabsTrigger value="interactive">
                      <Upload className="w-4 h-4 mr-2" />
                      Interactif
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="text" className="space-y-4">
                    <Textarea
                      ref={textareaRef}
                      value={content.text || ''}
                      onChange={(e) => setContent({ ...content, text: e.target.value })}
                      placeholder="Écrivez le contenu de votre leçon ici... Vous pouvez utiliser le markdown pour le formatage."
                      className="min-h-[400px] font-mono"
                    />
                    <div className="text-sm text-muted-foreground">
                      <p>Formatage supporté :</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Badge variant="outline">**gras**</Badge>
                        <Badge variant="outline">*italique*</Badge>
                        <Badge variant="outline">__souligné__</Badge>
                        <Badge variant="outline">- liste</Badge>
                        <Badge variant="outline">[lien](url)</Badge>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="media" className="space-y-4">
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                      <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-lg font-medium mb-2">Téléverser des images</p>
                      <p className="text-muted-foreground mb-4">
                        Glissez-déposez vos images ici ou cliquez pour parcourir
                      </p>
                      <Button variant="outline">
                        Choisir des fichiers
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="video" className="space-y-4">
                    <div className="space-y-4">
                      <Input
                        placeholder="URL de la vidéo (YouTube, Vimeo, etc.)"
                        value={videoUrl}
                        onChange={(e) => setVideoUrl(e.target.value)}
                      />
                      {videoUrl && (
                        <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                          <div className="text-center">
                            <Video className="w-12 h-12 mx-auto mb-2 text-muted-foreground" />
                            <p className="text-muted-foreground">Aperçu de la vidéo</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="interactive" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card className="p-4 text-center cursor-pointer hover:bg-accent">
                        <FileText className="w-8 h-8 mx-auto mb-2" />
                        <p className="font-medium">Quiz</p>
                        <p className="text-sm text-muted-foreground">Créer un quiz interactif</p>
                      </Card>
                      <Card className="p-4 text-center cursor-pointer hover:bg-accent">
                        <Upload className="w-8 h-8 mx-auto mb-2" />
                        <p className="font-medium">SCORM</p>
                        <p className="text-sm text-muted-foreground">Importer un package SCORM</p>
                      </Card>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Prévisualisation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{title || 'Titre de la leçon'}</h3>
                    <p className="text-muted-foreground">{description}</p>
                  </div>
                  
                  {lessonType === 'video' && videoUrl && (
                    <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <Video className="w-12 h-12 mx-auto mb-2" />
                        <p>Vidéo: {videoUrl}</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="prose max-w-none">
                    <div 
                      dangerouslySetInnerHTML={{ 
                        __html: content.text?.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                          .replace(/\*(.*?)\*/g, '<em>$1</em>')
                          .replace(/__(.*?)__/g, '<u>$1</u>')
                          .replace(/\n- (.*)/g, '<li>$1</li>')
                          .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>') 
                          || 'Aucun contenu'
                      }} 
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}