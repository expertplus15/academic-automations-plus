import { RouteConfig } from '../base.config';

export const settingsRoutes: RouteConfig = {
  path: "/settings",
  component: "Settings",
  title: "Paramètres",
  icon: "Settings",
  protected: true,
  children: [
    {
      path: "/settings/general",
      component: "SettingsGeneral",
      title: "Général",
    },
    {
      path: "/settings/users",
      component: "SettingsUsers",
      title: "Utilisateurs",
    },
  ],
};