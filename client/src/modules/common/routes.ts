import { authGuard } from "@/routers/guards";
import { RouteRecordRaw } from "vue-router";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";

export enum CommonRoute {
  SIGN_IN = "sign in",
  SIGN_UP = "sign up",
}

export const commonRoutes: RouteRecordRaw[] = [
  {
    path: "/sign-in/:type",
    component: SignIn,
    name: CommonRoute.SIGN_IN,
  },
  {
    path: "/sign-up/:type",
    component: SignUp,
    name: CommonRoute.SIGN_UP,
    beforeEnter: [authGuard],
  },
];
