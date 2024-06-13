import { firebaseApp } from "@/utils/firebase";
import { getAuth } from "firebase/auth";
import { NavigationGuard } from "vue-router";
import { CommonRoute } from "./route";

export const authGuard: NavigationGuard = async (to, _, next) => {
  const auth = getAuth(firebaseApp);
  await auth.authStateReady();

  if (auth.currentUser) return next();

  next({
    name: CommonRoute.SIGN_IN,
    query: { next: to.path },
    params: { type: "child" },
  });
};
