import { Routes, Route, useLocation } from "react-router-dom";
import { ModuleRoutes } from "./ModuleRoutes";
import Dashboard from "@/pages/Dashboard";

export function AppRoutes() {
  const location = useLocation();
  const isDashboard = location.pathname === "/" || location.pathname === "/dashboard";

  if (isDashboard) {
    return (
      <div className="min-h-screen w-full">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    );
  }

  return <ModuleRoutes />;
}