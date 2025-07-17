import { RouteConfig } from '../base.config';

export const servicesRoutes: RouteConfig = {
  path: "/services",
  component: "Services",
  title: "Services",
  icon: "Briefcase",
  protected: true,
  children: [
    {
      path: "/services/transport",
      component: "Transport",
      title: "Transport",
    },
    {
      path: "/services/catering",
      component: "Catering",
      title: "Restauration",
    },
    {
      path: "/services/accommodation",
      component: "Accommodation",
      title: "Hébergement",
    },
  ],
};