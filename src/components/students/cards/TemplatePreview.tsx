import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CardTemplate } from '@/hooks/students/useStudentCards';
import { Eye, User, CreditCard, Calendar, GraduationCap } from 'lucide-react';

interface TemplatePreviewProps {
  template?: CardTemplate;
}

export function TemplatePreview({ template }: TemplatePreviewProps) {
  if (!template) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-8 text-muted-foreground">
            Sélectionnez un template pour voir l'aperçu
          </div>
        </CardContent>
      </Card>
    );
  }

  const { template_data } = template;
  const colors = template_data.colors || {};
  const fields = template_data.fields || [];
  const dimensions = template_data.dimensions || { width: 85.6, height: 54, unit: 'mm' };

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
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            Aperçu - {template.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center">
            <div 
              className="relative rounded-lg shadow-lg overflow-hidden border"
              style={{
                width: '400px',
                height: `${400 / aspectRatio}px`,
                background: `linear-gradient(135deg, ${colors.primary || '#10B981'}, ${colors.secondary || '#1F2937'})`
              }}
            >
              {/* Card Content */}
              <div 
                className="absolute inset-4 flex flex-col justify-between text-white"
                style={{ color: colors.text || '#FFFFFF' }}
              >
                {/* Header Section */}
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    {fields.includes('student_name') && (
                      <div className="font-bold text-lg">
                        {mockStudent.student_name}
                      </div>
                    )}
                    {fields.includes('student_number') && (
                      <div className="text-sm opacity-90 font-mono">
                        {mockStudent.student_number}
                      </div>
                    )}
                  </div>
                  
                  {fields.includes('photo') && (
                    <div 
                      className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center"
                      style={{ backgroundColor: `${colors.text || '#FFFFFF'}20` }}
                    >
                      <User className="w-8 h-8" style={{ color: colors.text || '#FFFFFF' }} />
                    </div>
                  )}
                </div>

                {/* Middle Section */}
                {fields.includes('program_name') && (
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4" />
                    <span className="text-sm">{mockStudent.program_name}</span>
                  </div>
                )}

                {/* Bottom Section */}
                <div className="flex items-end justify-between">
                  <div className="space-y-1 text-xs">
                    {fields.includes('issue_date') && (
                      <div>Émise le: {mockStudent.issue_date}</div>
                    )}
                    {fields.includes('expiry_date') && (
                      <div>Expire le: {mockStudent.expiry_date}</div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {fields.includes('qr_code') && (
                      <div 
                        className="w-12 h-12 rounded bg-white/90 flex items-center justify-center"
                      >
                        <div className="w-8 h-8 bg-gray-800 rounded grid grid-cols-3 gap-px">
                          {Array.from({ length: 9 }).map((_, i) => (
                            <div 
                              key={i} 
                              className={`${Math.random() > 0.5 ? 'bg-white' : 'bg-gray-800'} rounded-sm`}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {fields.includes('barcode') && (
                      <div className="w-16 h-8 bg-white/90 rounded flex items-center justify-center">
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
            </div>
          </div>

          {/* Template Info */}
          <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Dimensions:</span>
              <div>{dimensions.width} x {dimensions.height} {dimensions.unit}</div>
            </div>
            <div>
              <span className="font-medium">Champs affichés:</span>
              <div>{fields.length} éléments</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}