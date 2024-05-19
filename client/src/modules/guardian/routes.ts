import { GuardianRoute } from "@/routers/route";
import { RouteRecordRaw } from "vue-router";
import Pair from "./pages/Pair";

export const guardianRoutes: RouteRecordRaw[] = [
  {
    path: "/guardian",
    children: [
      {
        path: "pair",
        component: Pair,
        name: GuardianRoute.PAIR,
      },
    ],
  },
];
