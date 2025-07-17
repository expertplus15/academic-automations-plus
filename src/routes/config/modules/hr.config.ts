import { RouteConfig } from '../base.config';

export const hrRoutes: RouteConfig = {
  path: "/hr",
  component: "Hr",
  title: "Ressources Humaines",
  icon: "UserCheck",
  protected: true,
  children: [
    {
      path: "/hr/teachers",
      component: "HrTeachers",
      title: "Enseignants",
    },
    {
      path: "/hr/contracts",
      component: "HrContracts",
      title: "Contrats",
    },
  ],
};