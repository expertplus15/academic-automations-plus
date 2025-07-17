import { RouteConfig } from '../base.config';

export const resourcesRoutes: RouteConfig = {
  path: "/resources",
  component: "Resources",
  title: "Ressources",
  icon: "Package",
  protected: true,
  children: [
    {
      path: "/resources/inventory",
      component: "ResourcesInventory",
      title: "Inventaire",
    },
    {
      path: "/resources/bookings",
      component: "ResourcesBookings",
      title: "Réservations",
    },
  ],
};