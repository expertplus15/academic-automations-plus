import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MatrixStats } from './MatrixStats';
import { StudentSyncStatus } from './StudentSyncStatus';

interface MatrixGradeHeaderProps {
  selectedAcademicYear: any;
  studentCountText: string;
  students: any[];
  dutgeStats: any;
  isLoading: boolean;
}

export function MatrixGradeHeader({ 
  selectedAcademicYear, 
  studentCountText, 
  students, 
  dutgeStats, 
  isLoading 
}: MatrixGradeHeaderProps) {
  return (
    <Card className="border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg text-foreground flex items-center justify-between">
          <div>
            Interface Matricielle - Saisie des Notes
            {selectedAcademicYear && (
              <span className="text-sm font-normal text-muted-foreground ml-2">
                ({selectedAcademicYear.name})
              </span>
            )}
          </div>
          <div className="text-sm font-normal text-muted-foreground">
            {studentCountText}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-3">
            <MatrixStats 
              studentsCount={students.length}
              isLoading={isLoading}
              dutgeStats={dutgeStats}
            />
          </div>
          <div className="lg:col-span-1">
            <StudentSyncStatus 
              students={students}
              loading={isLoading}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}