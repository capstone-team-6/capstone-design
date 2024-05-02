import { RouteRecordRaw } from "vue-router";
import Login from "./pages/Login";

export enum CommonRoute {
  LOGIN = "login",
}

export const commonRoutes: RouteRecordRaw[] = [
  {
    path: "/login",
    component: Login,
    name: CommonRoute.LOGIN,
  },
];
