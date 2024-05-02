import { firebaseApp } from "@/utils/firebase";
import { GoogleAuthProvider, getAuth, signInWithRedirect } from "firebase/auth";

import { defineComponent } from "vue";

export default defineComponent({
  name: "Common.Login",
  setup() {
    const auth = getAuth(firebaseApp);
    const googleProvider = new GoogleAuthProvider();

    auth.onAuthStateChanged((user) => console.log(user));

    return () => {
      return (
        <div>
          <button onClick={() => signInWithRedirect(auth, googleProvider)}>
            구글 로그인
          </button>
        </div>
      );
    };
  },
});
