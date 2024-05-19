import { useUserAPI } from "@/apis/user";
import { firebaseApp } from "@/utils/firebase";
import { GoogleAuthProvider, getAuth, signInWithRedirect } from "firebase/auth";
import { defineStore } from "pinia";
import { ref } from "vue";
import { User } from "~/entities/user";

type State =
  | { state: "init"; user: null }
  | { state: "check"; user: null }
  | { state: "empty"; user: null }
  | { state: "signIn"; user: User }
  | { state: "signOut"; user: null };

type OauthProvider = "google";

export const useAuthStore = defineStore("user", () => {
  const context = ref<State>({ state: "init", user: null });

  const auth = getAuth(firebaseApp);
  const googleProvider = new GoogleAuthProvider();

  function init() {
    auth.onAuthStateChanged(async (user) => {
      if (user === null) {
        context.value.user = null;
        context.value.state = "signOut";
        return;
      }

      context.value.state = "check";

      const result = await useUserAPI().signIn({}, {});

      if (!result.success) {
        console.error(result.message);
        context.value.state = "signOut";
        context.value.user = null;
        return;
      }

      if (result.data === null) {
        context.value.state = "empty";
        context.value.user = null;

        return;
      }

      context.value.state = "signIn";
      context.value.user = result.data;
    });
  }

  async function signUp(name: User["name"], type: User["type"]) {
    return useUserAPI().signUp({}, {}, { name, type });
  }

  function signIn(provider: OauthProvider) {
    if (provider === "google") {
      return signInWithRedirect(auth, googleProvider);
    }
  }

  function signOut() {
    return auth.signOut();
  }

  return {
    init,
    signUp,
    signIn,
    signOut,
    context,
  };
});
