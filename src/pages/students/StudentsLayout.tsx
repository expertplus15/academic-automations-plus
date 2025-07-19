import { Outlet } from "react-router-dom";
import { StudentsModuleLayout } from "@/components/layouts/StudentsModuleLayout";

export default function StudentsLayout() {
  return (
    <StudentsModuleLayout>
      <Outlet />
    </StudentsModuleLayout>
  );
}