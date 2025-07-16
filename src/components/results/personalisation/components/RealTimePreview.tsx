import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Monitor,
  Smartphone,
  Tablet,
  Eye,
  RefreshCw,
  Download,
  Share2,
  Settings,
  Zap,
  Clock,
  CheckCircle
} from 'lucide-react';
import { useTemplateEditorContext } from '../providers/TemplateEditorProvider';
import { BlockLibrary } from '../blocks/BlockLibrary';
import { cn } from '@/lib/utils';

interface PreviewDevice {
  id: string;
  name: string;
  icon: React.ReactNode;
  width: number;
  height: number;
  scale: number;
}

const previewDevices: PreviewDevice[] = [
  {
    id: 'desktop',
    name: 'Bureau',
    icon: <Monitor className="w-4 h-4" />,
    width: 794,
    height: 1123,
    scale: 1
  },
  {
    id: 'tablet',
    name: 'Tablette',
    icon: <Tablet className="w-4 h-4" />,
    width: 768,
    height: 1024,
    scale: 0.8
  },
  {
    id: 'mobile',
    name: 'Mobile',
    icon: <Smartphone className="w-4 h-4" />,
    width: 375,
    height: 667,
    scale: 0.6
  }
];

interface MockData {
  student: {
    name: string;
    id: string;
    class: string;
    year: string;
  };
  institution: {
    name: string;
    address: string;
    phone: string;
    email: string;
  };
  grades: Array<{
    subject: string;
    grade: number;
    coefficient: number;
    points: number;
  }>;
}

const mockDataSets: Record<string, MockData> = {
  'student1': {
    student: {
      name: 'Marie Dubois',
      id: 'ETU001',
      class: 'Terminal S',
      year: '2023-2024'
    },
    institution: {
      name: 'Lycée Victor Hugo',
      address: '123 Avenue de la République, 75011 Paris',
      phone: '01 42 55 67 89',
      email: 'contact@lycee-victor-hugo.fr'
    },
    grades: [
      { subject: 'Mathématiques', grade: 16.5, coefficient: 4, points: 66 },
      { subject: 'Physique-Chimie', grade: 15.0, coefficient: 3, points: 45 },
      { subject: 'SVT', grade: 14.5, coefficient: 2, points: 29 }
    ]
  },
  'student2': {
    student: {
      name: 'Thomas Martin',
      id: 'ETU002',
      class: 'Première ES',
      year: '2023-2024'
    },
    institution: {
      name: 'Lycée Émile Zola',
      address: '456 Boulevard Saint-Germain, 75006 Paris',
      phone: '01 43 26 78 90',
      email: 'secretariat@lycee-zola.edu'
    },
    grades: [
      { subject: 'Histoire-Géographie', grade: 17.0, coefficient: 3, points: 51 },
      { subject: 'Économie', grade: 15.5, coefficient: 4, points: 62 },
      { subject: 'Anglais', grade: 16.0, coefficient: 2, points: 32 }
    ]
  }
};

export function RealTimePreview() {
  const { state, currentTemplate, actions } = useTemplateEditorContext();
  const [selectedDevice, setSelectedDevice] = useState<string>('desktop');
  const [selectedMockData, setSelectedMockData] = useState<string>('student1');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState('1000');
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [previewKey, setPreviewKey] = useState(0);

  // Force refresh when template changes
  useEffect(() => {
    if (autoRefresh) {
      setLastUpdate(new Date());
      setPreviewKey(prev => prev + 1);
    }
  }, [currentTemplate?.content, autoRefresh]);

  // Auto-refresh interval
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      setLastUpdate(new Date());
      setPreviewKey(prev => prev + 1);
    }, parseInt(refreshInterval));

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval]);

  const currentDevice = previewDevices.find(d => d.id === selectedDevice) || previewDevices[0];
  const currentMockData = mockDataSets[selectedMockData];
  
  // Processed elements with mock data
  const processedElements = useMemo(() => {
    if (!currentTemplate?.content?.elements) return [];
    
    return currentTemplate.content.elements.map((element: any) => ({
      ...element,
      data: processVariables(element.data || {}, currentMockData)
    }));
  }, [currentTemplate?.content?.elements, currentMockData, previewKey]);

  const handleManualRefresh = () => {
    setLastUpdate(new Date());
    setPreviewKey(prev => prev + 1);
  };

  const handleExportPDF = () => {
    // PDF export logic would go here
    console.log('Exporting PDF with preview data...');
  };

  const handleSharePreview = () => {
    // Share preview logic would go here
    console.log('Sharing preview...');
  };

  return (
    <div className="flex-1 flex flex-col bg-muted/30">
      {/* Preview Controls */}
      <div className="h-14 border-b bg-background/80 backdrop-blur flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-primary" />
            <span className="font-medium text-sm">Aperçu temps réel</span>
            <Badge variant="secondary" className="text-xs">
              <Zap className="w-3 h-3 mr-1" />
              Live
            </Badge>
          </div>

          <Separator orientation="vertical" className="h-6" />

          {/* Device Selection */}
          <div className="flex items-center gap-1">
            {previewDevices.map((device) => (
              <Button
                key={device.id}
                variant={selectedDevice === device.id ? "default" : "ghost"}
                size="sm"
                onClick={() => setSelectedDevice(device.id)}
                className="gap-2"
              >
                {device.icon}
                {device.name}
              </Button>
            ))}
          </div>

          <Separator orientation="vertical" className="h-6" />

          {/* Mock Data Selection */}
          <div className="flex items-center gap-2">
            <Label className="text-xs text-muted-foreground">Données test:</Label>
            <Select value={selectedMockData} onValueChange={setSelectedMockData}>
              <SelectTrigger className="w-40 h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="student1">Marie Dubois</SelectItem>
                <SelectItem value="student2">Thomas Martin</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Auto-refresh Controls */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Switch
                checked={autoRefresh}
                onCheckedChange={setAutoRefresh}
                id="auto-refresh"
              />
              <Label htmlFor="auto-refresh" className="text-xs">
                Auto-actualisation
              </Label>
            </div>

            {autoRefresh && (
              <Select value={refreshInterval} onValueChange={setRefreshInterval}>
                <SelectTrigger className="w-20 h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="500">0.5s</SelectItem>
                  <SelectItem value="1000">1s</SelectItem>
                  <SelectItem value="2000">2s</SelectItem>
                  <SelectItem value="5000">5s</SelectItem>
                </SelectContent>
              </Select>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={handleManualRefresh}
              disabled={autoRefresh}
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>

          <Separator orientation="vertical" className="h-6" />

          {/* Export Actions */}
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" onClick={handleExportPDF}>
              <Download className="w-4 h-4" />
              PDF
            </Button>
            <Button variant="ghost" size="sm" onClick={handleSharePreview}>
              <Share2 className="w-4 h-4" />
              Partager
            </Button>
          </div>

          {/* Status */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <CheckCircle className="w-3 h-3 text-green-500" />
            <Clock className="w-3 h-3" />
            {lastUpdate.toLocaleTimeString()}
          </div>
        </div>
      </div>

      {/* Preview Area */}
      <div className="flex-1 overflow-auto bg-muted/20 p-8">
        <div className="flex justify-center">
          <Card className="shadow-2xl overflow-hidden">
            <div 
              className="relative bg-white"
              style={{
                width: currentDevice.width * currentDevice.scale,
                height: currentDevice.height * currentDevice.scale,
                transform: `scale(${state.zoomLevel / 100})`,
                transformOrigin: 'top center'
              }}
            >
              {/* Preview Canvas */}
              <div
                className="relative w-full h-full overflow-hidden"
                style={{
                  width: currentDevice.width,
                  height: currentDevice.height,
                  transform: `scale(${currentDevice.scale})`,
                  transformOrigin: 'top left'
                }}
              >
                {/* Render Elements */}
                {processedElements.map((element: any) => (
                  <div
                    key={`preview-${element.id}-${previewKey}`}
                    className={cn(
                      "absolute transition-all duration-200",
                      state.selectedElement === element.id && "ring-2 ring-primary ring-opacity-50"
                    )}
                    style={{
                      left: element.x,
                      top: element.y,
                      width: element.width,
                      height: element.height,
                      opacity: element.opacity || 1,
                      transform: element.rotation ? `rotate(${element.rotation}deg)` : undefined,
                      zIndex: element.zIndex || 1
                    }}
                  >
                    <BlockLibrary
                      type={element.type}
                      id={element.id}
                      data={element.data}
                      isSelected={false}
                      onSelect={() => {}}
                      className="w-full h-full pointer-events-none"
                      isPreview={true}
                    />
                  </div>
                ))}

                {/* Preview Overlay */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="w-full h-full border border-dashed border-muted-foreground/20" />
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Preview Info */}
      <div className="h-10 border-t bg-background/80 backdrop-blur flex items-center justify-between px-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-4">
          <span>Aperçu: {currentDevice.name}</span>
          <span>•</span>
          <span>Données: {currentMockData.student.name}</span>
          <span>•</span>
          <span>Éléments: {processedElements.length}</span>
        </div>
        <div className="flex items-center gap-4">
          <span>Zoom: {state.zoomLevel}%</span>
          <span>•</span>
          <span>Taille: {currentDevice.width} × {currentDevice.height}px</span>
        </div>
      </div>
    </div>
  );
}

// Helper function to process variables in element data
function processVariables(data: any, mockData: MockData): any {
  if (!data || !mockData) return data;

  const processValue = (value: any): any => {
    if (typeof value === 'string') {
      // Replace variable placeholders
      return value
        .replace(/\{\{student\.name\}\}/g, mockData.student.name)
        .replace(/\{\{student\.id\}\}/g, mockData.student.id)
        .replace(/\{\{student\.class\}\}/g, mockData.student.class)
        .replace(/\{\{student\.year\}\}/g, mockData.student.year)
        .replace(/\{\{institution\.name\}\}/g, mockData.institution.name)
        .replace(/\{\{institution\.address\}\}/g, mockData.institution.address)
        .replace(/\{\{institution\.phone\}\}/g, mockData.institution.phone)
        .replace(/\{\{institution\.email\}\}/g, mockData.institution.email);
    }
    
    if (Array.isArray(value)) {
      return value.map(processValue);
    }
    
    if (typeof value === 'object' && value !== null) {
      const result: any = {};
      for (const [key, val] of Object.entries(value)) {
        result[key] = processValue(val);
      }
      return result;
    }
    
    return value;
  };

  // Special handling for table data
  if (data.rows && mockData.grades) {
    return {
      ...processValue(data),
      rows: mockData.grades.map(grade => [
        grade.subject,
        grade.grade.toString(),
        grade.coefficient.toString(),
        grade.points.toString()
      ])
    };
  }

  return processValue(data);
}