import { CommonRoute } from "@/modules/common/routes";
import { firebaseApp } from "@/utils/firebase";
import { getAuth } from "firebase/auth";
import { NavigationGuard } from "vue-router";

export const authGuard: NavigationGuard = async (to, _, next) => {
  const auth = getAuth(firebaseApp);
  await auth.authStateReady();

  if (auth.currentUser) return next();

  next({ name: CommonRoute.LOGIN, query: { next: to.path } });
};
