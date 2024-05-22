import { RouteRecordRaw } from "vue-router";
import MapAdmin from "./pages/mapAdmin";
import mapUser from "./pages/mapUser";

export enum TestRoute {
  MAP_ADMIN = "mapAdmin",
  MAP_USER = "mapUser",
}

export const testRoutes: RouteRecordRaw[] = [
  {
    path: "/test",
    children: [
      {
        path: "map-admin",
        component: MapAdmin,
        name: TestRoute.MAP_ADMIN,
      },
      {
        path: "map-user",
        component: mapUser,
        name: TestRoute.MAP_USER,
      },
    ],
  },
];
