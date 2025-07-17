import { RouteConfig } from '../base.config';

export const studentsRoutes: RouteConfig = {
  path: "/students",
  component: "Students",
  title: "Étudiants",
  icon: "Users",
  protected: true,
  children: [
    {
      path: "/students/registration",
      component: "StudentsRegistration",
      title: "Inscriptions",
    },
    {
      path: "/students/profiles",
      component: "StudentsProfiles",
      title: "Profils",
    },
    {
      path: "/students/tracking",
      component: "StudentsTracking",
      title: "Suivi",
    },
    {
      path: "/students/cards",
      component: "StudentsCards",
      title: "Cartes étudiants",
    },
    {
      path: "/students/analytics",
      component: "StudentsAnalytics",
      title: "Analytics",
    },
  ],
};