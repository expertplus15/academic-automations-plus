import { RouteConfig } from '../base.config';

export const examsRoutes: RouteConfig = {
  path: "/exams",
  component: "Exams",
  title: "Examens",
  icon: "FileCheck",
  protected: true,
  children: [
    {
      path: "/exams/creation",
      component: "ExamCreation",
      title: "Création",
    },
    {
      path: "/exams/planning",
      component: "ExamsPlanning",
      title: "Planification",
    },
    {
      path: "/exams/monitoring",
      component: "ExamsMonitoring",
      title: "Surveillance",
    },
  ],
};