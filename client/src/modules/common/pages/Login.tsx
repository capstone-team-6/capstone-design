import { AppButton } from "@/components/AppButton";
import { Icon } from "@/components/Icon";
import { firebaseApp } from "@/utils/firebase";
import { GoogleAuthProvider, getAuth, signInWithRedirect } from "firebase/auth";

import { defineComponent, reactive } from "vue";
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

    const state = reactive({
      mode: null,
    });

    return () => {
      return (
        <div class="pt-48">
          <div class="flex items-center">
            <Icon type="chevron-down" class="" />
            <div class="text-2xl ml-2 font-semibold">
              <span class="text-[#F35A0C]">
                {state.mode === null ? "어떤 모드" : state.mode}
              </span>
              로 로그인하시겠습니까?
            </div>
          </div>
          <div class="mt-6">
            <AppButton onClick={() => signInWithRedirect(auth, googleProvider)}>
              구글 로그인
            </AppButton>
            <AppButton class="bg-black mt-2" onClick={() => auth.signOut()}>
              로그아웃
            </AppButton>
          </div>
        </div>
      );
    };
  },
});
