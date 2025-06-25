import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useModuleSync } from '@/hooks/module-sync';
import { useExamAcademicIntegration } from '@/hooks/academic-integration';
import { useExamStudentIntegration } from '@/hooks/useExamStudentIntegration';
import { useExamResourceIntegration } from '@/hooks/resource-integration';
import { ExamIntegrationHeader } from './integration/ExamIntegrationHeader';
import { ExamIntegrationOverview } from './integration/ExamIntegrationOverview';
import { ExamIntegrationTabs } from './integration/ExamIntegrationTabs';

interface ExamIntegrationDashboardProps {
  examId?: string;
}

export function ExamIntegrationDashboard({ examId }: ExamIntegrationDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedExam, setSelectedExam] = useState<string>(examId || '');

  const { 
    syncEvents, 
    isConnected, 
    syncConfig,
    publishEvent 
  } = useModuleSync();

  const {
    integrationData: academicData,
    loading: academicLoading,
    syncExamWithAcademic
  } = useExamAcademicIntegration();

  const {
    integrationData: studentData,
    loading: studentLoading,
    syncExamWithStudents
  } = useExamStudentIntegration();

  const {
    integrationData: resourceData,
    loading: resourceLoading,
    syncExamWithResources
  } = useExamResourceIntegration();

  const handleSyncAll = async () => {
    if (!selectedExam) return;

    await Promise.all([
      syncExamWithAcademic(selectedExam),
      syncExamWithStudents(selectedExam),
      syncExamWithResources(selectedExam)
    ]);

    await publishEvent('exams', 'full_sync_completed', {
      examId: selectedExam,
      timestamp: new Date()
    });
  };

  const getOverallSyncStatus = () => {
    if (!selectedExam) return 'pending';
    
    const academic = academicData.find(d => d.examId === selectedExam);
    const student = studentData.find(d => d.examId === selectedExam);
    const resource = resourceData.find(d => d.examId === selectedExam);

    const statuses = [academic?.syncStatus, student?.syncStatus, resource?.syncStatus];
    
    if (statuses.includes('error')) return 'error';
    if (statuses.includes('conflict')) return 'conflict';
    if (statuses.every(s => s === 'synced')) return 'synced';
    if (statuses.some(s => s === 'synced')) return 'partial';
    return 'pending';
  };

  const getSyncProgress = () => {
    if (!selectedExam) return 0;
    
    const academic = academicData.find(d => d.examId === selectedExam);
    const student = studentData.find(d => d.examId === selectedExam);
    const resource = resourceData.find(d => d.examId === selectedExam);

    const syncedCount = [academic, student, resource].filter(d => d?.syncStatus === 'synced').length;
    return (syncedCount / 3) * 100;
  };

  const isLoading = academicLoading || studentLoading || resourceLoading;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <ExamIntegrationHeader
            isConnected={isConnected}
            onSyncAll={handleSyncAll}
            isLoading={isLoading}
            selectedExam={selectedExam}
          />
        </CardHeader>
        
        <CardContent>
          <ExamIntegrationOverview
            academicStatus={academicData.find(d => d.examId === selectedExam)?.syncStatus || 'pending'}
            studentStatus={studentData.find(d => d.examId === selectedExam)?.syncStatus || 'pending'}
            resourceStatus={resourceData.find(d => d.examId === selectedExam)?.syncStatus || 'pending'}
            syncProgress={getSyncProgress()}
          />
        </CardContent>
      </Card>

      <ExamIntegrationTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        syncEvents={syncEvents}
        syncConfig={syncConfig}
        selectedExam={selectedExam}
        hasAcademicIntegration={!!academicData.find(d => d.examId === selectedExam)}
        hasStudentIntegration={!!studentData.find(d => d.examId === selectedExam)}
        hasResourceIntegration={!!resourceData.find(d => d.examId === selectedExam)}
      />
    </div>
  );
}
