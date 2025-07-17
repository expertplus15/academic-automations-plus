import { RouteConfig } from '../base.config';

export const elearningRoutes: RouteConfig = {
  path: "/elearning",
  component: "Elearning",
  title: "e-Learning",
  icon: "Monitor",
  protected: true,
  children: [
    {
      path: "/elearning/courses",
      component: "ElearningCourses",
      title: "Cours",
    },
    {
      path: "/elearning/virtual-classes",
      component: "ElearningVirtualClasses",
      title: "Classes virtuelles",
    },
    {
      path: "/elearning/analytics",
      component: "ElearningAnalytics",
      title: "Analyses",
    },
  ],
};