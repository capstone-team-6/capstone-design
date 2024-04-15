import { RouteRecordRaw } from "vue-router";
import Measure from "./pages/Measure";

export enum AdminRoute {
  MEASURE = "measure",
}

export const adminRoutes: RouteRecordRaw[] = [
  {
    path: "/admin",
    children: [
      {
        path: "measure",
        component: Measure,
        name: AdminRoute.MEASURE,
      },
    ],
  },
];
