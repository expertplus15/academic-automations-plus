import { Outlet } from "react-router-dom";
import { StudentsModuleLayout } from "@/components/layouts/StudentsModuleLayout";
import { AcademicYearProvider } from "@/contexts/AcademicYearContext";

export default function StudentsLayout() {
  return (
    <AcademicYearProvider>
      <StudentsModuleLayout>
        <Outlet />
      </StudentsModuleLayout>
    </AcademicYearProvider>
  );
}