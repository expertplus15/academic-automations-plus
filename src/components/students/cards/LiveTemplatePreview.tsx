import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, User, CreditCard, Calendar, GraduationCap, Loader2 } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';

interface LiveTemplatePreviewProps {
  templateData: {
    name: string;
    colors: {
      primary: string;
      secondary: string;
      text: string;
    };
    fields: string[];
    dimensions: {
      width: number;
      height: number;
      unit: string;
    };
  };
  isUpdating?: boolean;
}

export function LiveTemplatePreview({ templateData, isUpdating = false }: LiveTemplatePreviewProps) {
  const [isLoading, setIsLoading] = useState(false);
  
  // Debounce the template data to avoid excessive re-renders
  const debouncedTemplateData = useDebounce(templateData, 300);

  useEffect(() => {
    if (isUpdating) {
      setIsLoading(true);
      const timer = setTimeout(() => setIsLoading(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isUpdating]);

  const { colors, fields, dimensions } = debouncedTemplateData;

  // Mock student data for preview
  const mockStudent = {
    student_name: 'Jean Dupont',
    student_number: 'INF240001',
    program_name: 'Informatique - L3',
    issue_date: '01/09/2024',
    expiry_date: '31/08/2026'
  };

  const aspectRatio = dimensions.width / dimensions.height;

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            Aperçu en Temps Réel
          </CardTitle>
          <div className="flex items-center gap-2">
            {isLoading && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin" />
                Mise à jour...
              </div>
            )}
            <Badge variant="outline" className="text-xs">
              {dimensions.width} x {dimensions.height} {dimensions.unit}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-6">
          {/* Card Preview */}
          <div className="flex justify-center">
            <div 
              className={`relative rounded-lg shadow-lg overflow-hidden border transition-all duration-300 ${
                isLoading ? 'opacity-50 scale-95' : 'opacity-100 scale-100'
              }`}
              style={{
                width: '400px',
                height: `${400 / aspectRatio}px`,
                background: `linear-gradient(135deg, ${colors.primary || '#10B981'}, ${colors.secondary || '#1F2937'})`
              }}
            >
              {/* Card Content */}
              <div 
                className="absolute inset-4 flex flex-col justify-between text-white transition-colors duration-300"
                style={{ color: colors.text || '#FFFFFF' }}
              >
                {/* Header Section */}
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    {fields.includes('student_name') && (
                      <div className="font-bold text-lg animate-fade-in">
                        {mockStudent.student_name}
                      </div>
                    )}
                    {fields.includes('student_number') && (
                      <div className="text-sm opacity-90 font-mono animate-fade-in">
                        {mockStudent.student_number}
                      </div>
                    )}
                  </div>
                  
                  {fields.includes('photo') && (
                    <div 
                      className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center animate-scale-in"
                      style={{ backgroundColor: `${colors.text || '#FFFFFF'}20` }}
                    >
                      <User className="w-8 h-8" style={{ color: colors.text || '#FFFFFF' }} />
                    </div>
                  )}
                </div>

                {/* Middle Section */}
                {fields.includes('program_name') && (
                  <div className="flex items-center gap-2 animate-fade-in">
                    <GraduationCap className="w-4 h-4" />
                    <span className="text-sm">{mockStudent.program_name}</span>
                  </div>
                )}

                {/* Bottom Section */}
                <div className="flex items-end justify-between">
                  <div className="space-y-1 text-xs">
                    {fields.includes('issue_date') && (
                      <div className="animate-fade-in">Émise le: {mockStudent.issue_date}</div>
                    )}
                    {fields.includes('expiry_date') && (
                      <div className="animate-fade-in">Expire le: {mockStudent.expiry_date}</div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {fields.includes('qr_code') && (
                      <div 
                        className="w-12 h-12 rounded bg-white/90 flex items-center justify-center animate-scale-in"
                      >
                        <div className="w-8 h-8 bg-gray-800 rounded grid grid-cols-3 gap-px">
                          {Array.from({ length: 9 }).map((_, i) => (
                            <div 
                              key={i} 
                              className={`${Math.random() > 0.5 ? 'bg-white' : 'bg-gray-800'} rounded-sm animate-pulse`}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {fields.includes('barcode') && (
                      <div className="w-16 h-8 bg-white/90 rounded flex items-center justify-center animate-scale-in">
                        <div className="flex gap-px">
                          {Array.from({ length: 12 }).map((_, i) => (
                            <div 
                              key={i}
                              className="bg-gray-800 rounded-sm"
                              style={{ 
                                width: '2px', 
                                height: Math.random() > 0.5 ? '20px' : '16px' 
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Card brand/logo area */}
              <div className="absolute top-2 left-2">
                <div className="flex items-center gap-1 text-xs opacity-75">
                  <CreditCard className="w-3 h-3" />
                  <span>ÉTUDIANT</span>
                </div>
              </div>

              {/* Loading overlay */}
              {isLoading && (
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <Loader2 className="w-8 h-8 animate-spin text-white" />
                </div>
              )}
            </div>
          </div>

          {/* Template Info */}
          <div className="grid grid-cols-2 gap-4 text-sm bg-muted/30 p-4 rounded-lg">
            <div>
              <span className="font-medium">Champs affichés:</span>
              <div className="mt-1">
                <div className="flex flex-wrap gap-1">
                  {fields.map((field) => (
                    <Badge key={field} variant="secondary" className="text-xs">
                      {field.replace('_', ' ')}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            <div>
              <span className="font-medium">Couleurs:</span>
              <div className="mt-1 flex items-center gap-2">
                <div 
                  className="w-4 h-4 rounded border"
                  style={{ backgroundColor: colors.primary }}
                  title="Couleur primaire"
                />
                <div 
                  className="w-4 h-4 rounded border"
                  style={{ backgroundColor: colors.secondary }}
                  title="Couleur secondaire"
                />
                <div 
                  className="w-4 h-4 rounded border"
                  style={{ backgroundColor: colors.text }}
                  title="Couleur du texte"
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}