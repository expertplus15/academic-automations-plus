import { useState } from 'react';
import { toast } from '@/hooks/use-toast';

// Mock data for DUT2-GE session management
export interface DUT2GESession {
  id: string;
  code: string;
  name: string;
  status: 'draft' | 'active' | 'completed';
  programId: string;
  academicYearId: string;
  examsCount: number;
  createdAt: string;
}

export interface DUT2GEExam {
  id: string;
  subjectId: string;
  subjectName: string;
  semester: number;
  type: 'written' | 'oral' | 'practical';
  scheduledDate?: string;
  supervisorsAssigned: number;
  convocationsSent: number;
}

export const useDUT2GESessionManager = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mock data for the current session
  const currentSession: DUT2GESession = {
    id: '1',
    code: 'S1-2324-DUTGE',
    name: 'Session 1 - 2023/2024 - DUT Gestion des Entreprises',
    status: 'active',
    programId: 'dut-ge',
    academicYearId: '2023-2024',
    examsCount: 18,
    createdAt: '2024-01-01'
  };

  // Mock data for DUT2-GE exams
  const exams: DUT2GEExam[] = [
    // Semester 3 (S3) - January 2024
    { id: '1', subjectId: 'droit-s3', subjectName: 'Droit', semester: 3, type: 'written', scheduledDate: '2024-01-15', supervisorsAssigned: 2, convocationsSent: 13 },
    { id: '2', subjectId: 'pei-s3', subjectName: 'PEI', semester: 3, type: 'written', scheduledDate: '2024-01-16', supervisorsAssigned: 2, convocationsSent: 13 },
    { id: '3', subjectId: 'mix-s3', subjectName: 'Mix', semester: 3, type: 'written', scheduledDate: '2024-01-17', supervisorsAssigned: 2, convocationsSent: 13 },
    { id: '4', subjectId: 'calc-s3', subjectName: 'Calc', semester: 3, type: 'written', scheduledDate: '2024-01-18', supervisorsAssigned: 2, convocationsSent: 13 },
    { id: '5', subjectId: 'tq-s3', subjectName: 'TQ', semester: 3, type: 'written', scheduledDate: '2024-01-19', supervisorsAssigned: 2, convocationsSent: 13 },
    { id: '6', subjectId: 'info-s3', subjectName: 'Info', semester: 3, type: 'written', scheduledDate: '2024-01-22', supervisorsAssigned: 2, convocationsSent: 13 },
    { id: '7', subjectId: 'comm-s3', subjectName: 'Comm', semester: 3, type: 'written', scheduledDate: '2024-01-23', supervisorsAssigned: 2, convocationsSent: 13 },
    { id: '8', subjectId: 'ang-s3', subjectName: 'Ang', semester: 3, type: 'written', scheduledDate: '2024-01-24', supervisorsAssigned: 2, convocationsSent: 13 },
    { id: '9', subjectId: 'ppp3', subjectName: 'PPP3', semester: 3, type: 'oral', scheduledDate: '2024-01-25', supervisorsAssigned: 3, convocationsSent: 13 },
    
    // Semester 4 (S4) - June 2024
    { id: '10', subjectId: 'fin-s4', subjectName: 'Fin', semester: 4, type: 'written', scheduledDate: '2024-06-10', supervisorsAssigned: 2, convocationsSent: 13 },
    { id: '11', subjectId: 'prod-s4', subjectName: 'Prod', semester: 4, type: 'written', scheduledDate: '2024-06-11', supervisorsAssigned: 2, convocationsSent: 13 },
    { id: '12', subjectId: 'strat-s4', subjectName: 'Strat', semester: 4, type: 'written', scheduledDate: '2024-06-12', supervisorsAssigned: 2, convocationsSent: 13 },
    { id: '13', subjectId: 'nego-s4', subjectName: 'Nego', semester: 4, type: 'written', scheduledDate: '2024-06-13', supervisorsAssigned: 2, convocationsSent: 13 },
    { id: '14', subjectId: 'tci-s4', subjectName: 'TCI', semester: 4, type: 'written', scheduledDate: '2024-06-14', supervisorsAssigned: 2, convocationsSent: 13 },
    { id: '15', subjectId: 'ang2-s4', subjectName: 'Ang2', semester: 4, type: 'written', scheduledDate: '2024-06-17', supervisorsAssigned: 2, convocationsSent: 13 },
    { id: '16', subjectId: 'ppp4', subjectName: 'PPP4', semester: 4, type: 'oral', scheduledDate: '2024-06-18', supervisorsAssigned: 3, convocationsSent: 13 },
    { id: '17', subjectId: 'proj', subjectName: 'Projet', semester: 4, type: 'oral', scheduledDate: '2024-06-19', supervisorsAssigned: 3, convocationsSent: 13 },
    { id: '18', subjectId: 'stage', subjectName: 'Stage', semester: 4, type: 'oral', scheduledDate: '2024-06-20', supervisorsAssigned: 3, convocationsSent: 13 }
  ];

  const createDUT2GESession = async (programId: string, academicYearId: string) => {
    try {
      setLoading(true);
      setError(null);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast({
        title: "Session créée avec succès",
        description: "La session DUT2-GE S1-2324 a été créée avec 18 examens configurés automatiquement.",
      });

      return { session: currentSession, exams };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la création de la session';
      setError(errorMessage);
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive"
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getDUT2GESession = async (sessionId: string) => {
    try {
      setLoading(true);
      setError(null);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      return { session: currentSession, exams };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la récupération de la session';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getSessionStats = () => {
    const totalExams = exams.length;
    const totalSupervisors = exams.reduce((sum, exam) => sum + exam.supervisorsAssigned, 0);
    const totalConvocations = exams.reduce((sum, exam) => sum + exam.convocationsSent, 0);
    const s3Exams = exams.filter(exam => exam.semester === 3).length;
    const s4Exams = exams.filter(exam => exam.semester === 4).length;
    const oralExams = exams.filter(exam => exam.type === 'oral').length;
    const writtenExams = exams.filter(exam => exam.type === 'written').length;

    return {
      totalExams,
      totalSupervisors,
      totalConvocations,
      s3Exams,
      s4Exams,
      oralExams,
      writtenExams,
      progressPercentage: 85, // Mock progress
      conflictsResolved: 100 // Mock percentage
    };
  };

  const getDUT2GESessions = async () => {
    return [currentSession];
  };

  const DUT2GE_SUBJECTS = [
    'Droit', 'PEI', 'Mix', 'Calc', 'TQ', 'Info', 'Comm', 'Ang', 'PPP3',
    'Fin', 'Prod', 'Strat', 'Nego', 'TCI', 'Ang2', 'PPP4', 'Projet', 'Stage'
  ];

  return {
    createDUT2GESession,
    getDUT2GESession,
    getDUT2GESessions,
    getSessionStats,
    currentSession,
    exams,
    DUT2GE_SUBJECTS,
    loading,
    error
  };
};