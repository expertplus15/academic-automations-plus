import { RouteConfig } from '../base.config';

export const communicationRoutes: RouteConfig = {
  path: "/communication",
  component: "Communication",
  title: "Communication",
  icon: "MessageSquare",
  protected: true,
  children: [
    {
      path: "/communication/messaging",
      component: "Messaging",
      title: "Messagerie",
    },
    {
      path: "/communication/announcements",
      component: "Announcements",
      title: "Annonces",
    },
  ],
};