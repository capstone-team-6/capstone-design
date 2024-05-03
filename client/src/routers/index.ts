import { HelloWorld } from "@/components/HelloWorld";
import { adminRoutes } from "@/modules/admin/routes";
import { childRoutes } from "@/modules/child/routes";
import { commonRoutes } from "@/modules/common/routes";
import { testRoutes } from "@/modules/test/routes";
import { createRouter, createWebHistory } from "vue-router";
import { authGuard } from "./guards";

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", component: HelloWorld, beforeEnter: [authGuard] },
    ...adminRoutes,
    ...childRoutes,
    ...commonRoutes,
    ...testRoutes,
  ],
});
