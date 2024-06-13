import { authGuard } from "@/routers/guards";
import { ChlidRoute } from "@/routers/route";
import { RouteRecordRaw } from "vue-router";
import Child from ".";
import ID from "./pages/ID";

export const childRoutes: RouteRecordRaw[] = [
  {
    path: "/child",
    beforeEnter: [authGuard],
    children: [
      {
        path: "",
        component: Child,
        name: ChlidRoute.INDEX,
      },
      {
        path: "id",
        component: ID,
        name: ChlidRoute.ID,
      },
    ],
  },
];
