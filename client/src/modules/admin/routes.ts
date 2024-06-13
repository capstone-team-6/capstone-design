import { AdminRoute } from "@/routers/route";
import { RouteRecordRaw } from "vue-router";
import MapAdmin from "./pages/MapAdmin";
import Measure from "./pages/Measure";

export const adminRoutes: RouteRecordRaw[] = [
  {
    path: "/admin",
    children: [
      {
        path: "measure",
        component: Measure,
        name: AdminRoute.MEASURE,
      },
      {
        path: "map-admin",
        component: MapAdmin,
        name: AdminRoute.MAP_ADMIN,
      },
    ],
  },
];
