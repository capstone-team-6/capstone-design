import { RouteRecordRaw } from "vue-router";
import Map from "./pages/mapTest";

export enum TestRoute {
  MAP_TEST = "mapTest",
}

export const testRoutes: RouteRecordRaw[] = [
  {
    path: "/test",
    children: [
      {
        path: "map",
        component: Map,
        name: TestRoute.MAP_TEST,
      },
    ],
  },
];
