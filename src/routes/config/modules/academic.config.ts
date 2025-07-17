import { RouteConfig } from '../base.config';

export const academicRoutes: RouteConfig = {
  path: "/academic",
  component: "Academic",
  title: "Académique",
  icon: "GraduationCap",
  protected: true,
  children: [
    {
      path: "/academic/programs",
      component: "AcademicPrograms",
      title: "Programmes",
    },
    {
      path: "/academic/subjects",
      component: "AcademicSubjects",
      title: "Matières",
    },
    {
      path: "/academic/timetables",
      component: "AcademicTimetables",
      title: "Emplois du temps",
    },
    {
      path: "/academic/calendar",
      component: "AcademicCalendar",
      title: "Calendrier",
    },
  ],
};