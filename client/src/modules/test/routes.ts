import { RouteRecordRaw } from "vue-router";
import mapUser from "./pages/mapUser";

export enum TestRoute {
  MAP_USER = "mapUser",
}

export const testRoutes: RouteRecordRaw[] = [
  {
    path: "/test",
    children: [
      {
        path: "map-user",
        component: mapUser,
        name: TestRoute.MAP_USER,
      },
    ],
  },
];
