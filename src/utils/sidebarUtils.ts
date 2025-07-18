
import { AcademicModuleSidebar } from "@/components/AcademicModuleSidebar";
import { StudentsModuleSidebar } from "@/components/StudentsModuleSidebar";
import { ExamsModuleSidebar } from "@/components/ExamsModuleSidebar";
import { ResultsModuleSidebar } from "@/components/ResultsModuleSidebar";
import { FinanceModuleSidebar } from "@/components/FinanceModuleSidebar";
import { ElearningModuleSidebar } from "@/components/ElearningModuleSidebar";
import { HrModuleSidebar } from "@/components/HrModuleSidebar";
import { ResourcesModuleSidebar } from "@/components/ResourcesModuleSidebar";
import { PartnershipsModuleSidebar } from "@/components/PartnershipsModuleSidebar";
import { SettingsModuleSidebar } from "@/components/SettingsModuleSidebar";
import { ServicesModuleSidebar } from "@/components/ServicesModuleSidebar";
import { HealthModuleSidebar } from "@/components/HealthModuleSidebar";
import { DocumentsModuleSidebar } from "@/components/DocumentsModuleSidebar";
import { CommunicationModuleSidebar } from "@/components/CommunicationModuleSidebar";
import { OrganizationModuleSidebar } from "@/components/OrganizationModuleSidebar";

export const getSidebarForPath = (pathname: string) => {
  if (pathname.startsWith('/organization')) return OrganizationModuleSidebar;
  if (pathname.startsWith('/academic')) return AcademicModuleSidebar;
  if (pathname.startsWith('/students')) return StudentsModuleSidebar;
  if (pathname.startsWith('/exams')) return ExamsModuleSidebar;
  if (pathname.startsWith('/results')) return ResultsModuleSidebar;
  if (pathname.startsWith('/finance')) return FinanceModuleSidebar;
  if (pathname.startsWith('/elearning')) return ElearningModuleSidebar;
  if (pathname.startsWith('/hr')) return HrModuleSidebar;
  if (pathname.startsWith('/resources')) return ResourcesModuleSidebar;
  if (pathname.startsWith('/partnerships')) return PartnershipsModuleSidebar;
  if (pathname.startsWith('/settings')) return SettingsModuleSidebar;
  if (pathname.startsWith('/services')) return ServicesModuleSidebar;
  if (pathname.startsWith('/health')) return HealthModuleSidebar;  
  if (pathname.startsWith('/documents')) return DocumentsModuleSidebar;
  if (pathname.startsWith('/communication')) return CommunicationModuleSidebar;
  return null;
};
