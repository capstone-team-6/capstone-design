import { authGuard } from "@/routers/guards";
import { GuardianRoute } from "@/routers/route";
import { RouteRecordRaw } from "vue-router";
import Map from "./pages/Map";
import Pair from "./pages/Pair";

export const guardianRoutes: RouteRecordRaw[] = [
  {
    path: "/guardian",
    beforeEnter: [authGuard],
    children: [
      {
        path: "pair",
        component: Pair,
        name: GuardianRoute.PAIR,
      },
      {
        path: "map",
        component: Map,
        name: GuardianRoute.MAP,
      },
    ],
  },
];
