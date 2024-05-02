import { firebaseApp } from "@/utils/firebase";
import { GoogleAuthProvider, getAuth, signInWithRedirect } from "firebase/auth";

import { defineComponent } from "vue";
import { LocationQueryValue, useRoute, useRouter } from "vue-router";

export default defineComponent({
  name: "Common.Login",
  setup() {
    const route = useRoute();
    const router = useRouter();

    const auth = getAuth(firebaseApp);
    const googleProvider = new GoogleAuthProvider();

    auth.onAuthStateChanged((user) => {
      const next = route.query.next as LocationQueryValue;
      if (!user || !next) return;

      router.replace(next ?? "/");
    });

    return () => {
      return (
        <div>
          <button onClick={() => auth.signOut()}>로그아웃</button>
          <button onClick={() => signInWithRedirect(auth, googleProvider)}>
            구글 로그인
          </button>
        </div>
      );
    };
  },
});
