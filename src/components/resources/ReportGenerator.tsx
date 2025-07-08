import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { FileText, Download, Calendar as CalendarIcon, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { format, subMonths } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface ReportJob {
  id: string;
  type: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  fileName?: string;
  downloadUrl?: string;
  createdAt: string;
  completedAt?: string;
  error?: string;
}

export function ReportGenerator() {
  const [reportType, setReportType] = useState('');
  const [format, setFormat] = useState('pdf');
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: subMonths(new Date(), 1),
    to: new Date()
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportJobs, setReportJobs] = useState<ReportJob[]>([]);
  const { toast } = useToast();

  const reportTypes = [
    { value: 'inventory', label: 'Rapport d\'inventaire', description: 'État complet des équipements' },
    { value: 'maintenance', label: 'Rapport de maintenance', description: 'Historique et planification' },
    { value: 'procurement', label: 'Rapport d\'achats', description: 'Demandes et approbations' },
    { value: 'bookings', label: 'Rapport de réservations', description: 'Utilisation des salles' },
    { value: 'financial', label: 'Rapport financier', description: 'Coûts et amortissements' },
    { value: 'utilization', label: 'Rapport d\'utilisation', description: 'Statistiques d\'usage' }
  ];

  const formats = [
    { value: 'pdf', label: 'PDF', description: 'Format de présentation' },
    { value: 'excel', label: 'Excel', description: 'Données analysables' },
    { value: 'csv', label: 'CSV', description: 'Export de données' }
  ];

  const generateReport = async () => {
    if (!reportType) {
      toast({
        title: "Type de rapport requis",
        description: "Veuillez sélectionner un type de rapport",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);

    try {
      // Simulate async report generation
      const newJob: ReportJob = {
        id: Date.now().toString(),
        type: reportType,
        status: 'pending',
        progress: 0,
        createdAt: new Date().toISOString()
      };

      setReportJobs(prev => [newJob, ...prev]);

      // Simulate background processing
      const progressInterval = setInterval(() => {
        setReportJobs(prev => prev.map(job => {
          if (job.id === newJob.id && job.status === 'processing') {
            const newProgress = Math.min(job.progress + Math.random() * 20, 100);
            
            if (newProgress >= 100) {
              clearInterval(progressInterval);
              return {
                ...job,
                status: 'completed',
                progress: 100,
                fileName: `${reportType}_report_${format}.${format}`,
                downloadUrl: `/api/reports/${job.id}/download`,
                completedAt: new Date().toISOString()
              };
            }
            
            return { ...job, progress: newProgress };
          }
          return job;
        }));
      }, 500);

      // Start processing after short delay
      setTimeout(() => {
        setReportJobs(prev => prev.map(job => 
          job.id === newJob.id ? { ...job, status: 'processing' } : job
        ));
      }, 1000);

      toast({
        title: "Génération démarrée",
        description: "Le rapport est en cours de génération...",
      });

    } catch (error: any) {
      toast({
        title: "Erreur",
        description: "Impossible de démarrer la génération",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadReport = (job: ReportJob) => {
    if (job.downloadUrl) {
      // Simulate download
      const link = document.createElement('a');
      link.href = job.downloadUrl;
      link.download = job.fileName || 'rapport';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Téléchargement démarré",
        description: `${job.fileName} en cours de téléchargement`,
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Loader2 className="w-4 h-4 animate-spin text-yellow-500" />;
      case 'processing': return <Loader2 className="w-4 h-4 animate-spin text-blue-500" />;
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed': return <AlertCircle className="w-4 h-4 text-red-500" />;
      default: return null;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'En attente';
      case 'processing': return 'En cours';
      case 'completed': return 'Terminé';
      case 'failed': return 'Échec';
      default: return status;
    }
  };

  return (
    <div className="space-y-6">
      {/* Report Generation Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Générateur de rapports
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Type de rapport</Label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un type" />
                </SelectTrigger>
                <SelectContent>
                  {reportTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <div>
                        <div className="font-medium">{type.label}</div>
                        <div className="text-xs text-muted-foreground">{type.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Format</Label>
              <Select value={format} onValueChange={setFormat}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {formats.map((fmt) => (
                    <SelectItem key={fmt.value} value={fmt.value}>
                      <div>
                        <div className="font-medium">{fmt.label}</div>
                        <div className="text-xs text-muted-foreground">{fmt.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Période</Label>
            <div className="flex gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "justify-start text-left font-normal",
                      !dateRange.from && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange.from ? (
                      format(dateRange.from, "PPP", { locale: fr })
                    ) : (
                      <span>Date de début</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dateRange.from}
                    onSelect={(date) => setDateRange(prev => ({ ...prev, from: date }))}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "justify-start text-left font-normal",
                      !dateRange.to && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange.to ? (
                      format(dateRange.to, "PPP", { locale: fr })
                    ) : (
                      <span>Date de fin</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dateRange.to}
                    onSelect={(date) => setDateRange(prev => ({ ...prev, to: date }))}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <Button onClick={generateReport} disabled={isGenerating} className="w-full">
            {isGenerating && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Générer le rapport
          </Button>
        </CardContent>
      </Card>

      {/* Report Jobs */}
      {reportJobs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Rapports générés</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reportJobs.map((job) => (
                <div key={job.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4 flex-1">
                    {getStatusIcon(job.status)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">
                          {reportTypes.find(t => t.value === job.type)?.label || job.type}
                        </h4>
                        <Badge variant="outline">
                          {getStatusLabel(job.status)}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Créé le {new Date(job.createdAt).toLocaleDateString('fr-FR')}
                      </p>
                      {job.status === 'processing' && (
                        <Progress value={job.progress} className="mt-2 w-full" />
                      )}
                      {job.completedAt && (
                        <p className="text-sm text-green-600">
                          Terminé le {new Date(job.completedAt).toLocaleDateString('fr-FR')}
                        </p>
                      )}
                      {job.error && (
                        <p className="text-sm text-red-600">{job.error}</p>
                      )}
                    </div>
                  </div>
                  {job.status === 'completed' && job.downloadUrl && (
                    <Button variant="outline" size="sm" onClick={() => downloadReport(job)}>
                      <Download className="w-4 h-4 mr-2" />
                      Télécharger
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}