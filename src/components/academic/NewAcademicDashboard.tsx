import React from 'react';
import { AcademicBanner } from './AcademicBanner';
import { AcademicStatusCards } from './AcademicStatusCards';
import { AcademicModuleCards } from './AcademicModuleCards';

export function NewAcademicDashboard() {
  return (
    <div className="min-h-screen bg-background">
      <AcademicBanner />
      <AcademicStatusCards />
      <AcademicModuleCards />
    </div>
  );
}