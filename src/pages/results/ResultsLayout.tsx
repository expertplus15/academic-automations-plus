import { Outlet } from "react-router-dom";

export default function ResultsLayout() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        <Outlet />
      </div>
    </div>
  );
}