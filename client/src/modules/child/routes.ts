import { RouteRecordRaw } from "vue-router";
import Child from ".";

export enum ChlidRoute {
  INDEX = "index",
}

export const childRoutes: RouteRecordRaw[] = [
  {
    path: "/child",
    children: [
      {
        path: "",
        component: Child,
        name: ChlidRoute.INDEX,
      },
    ],
  },
];
