import { getAuth } from "firebase/auth";
import { defineComponent, reactive } from "vue";
import { RouterView } from "vue-router";
import { firebaseApp } from "./utils/firebase";

export default defineComponent({
  name: "App",
  setup() {
    const auth = getAuth(firebaseApp);
    const state = reactive({
      isAuthStateReady: false,
    });

    auth.authStateReady().then(() => (state.isAuthStateReady = true));

    return () => {
      if (!state.isAuthStateReady) return <div>로그인 정보 확인 중</div>;

      return <RouterView />;
    };
  },
});
