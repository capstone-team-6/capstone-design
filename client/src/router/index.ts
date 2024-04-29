import { HelloWorld } from "@/components/HelloWorld";
import { adminRoutes } from "@/modules/admin/routes";
import { childRoutes } from "@/modules/child/routes";
import { createRouter, createWebHistory } from "vue-router";

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", component: HelloWorld },
    ...adminRoutes,
    ...childRoutes,
  ],
});
