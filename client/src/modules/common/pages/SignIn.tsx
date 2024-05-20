import { AppButton } from "@/components/AppButton";
import { useAuthStore } from "@/stores/auth";
import { computed, defineComponent } from "vue";
import { RouterLink, useRoute, useRouter } from "vue-router";
import { User } from "~/entities/user";

import { ChlidRoute, CommonRoute, GuardianRoute } from "@/routers/route";
import { typeLabel } from "../utils/type";

export default defineComponent({
  name: "Common.Login",
  setup() {
    const route = useRoute();
    const router = useRouter();

    const authStore = useAuthStore();

    const type = computed(() => route.params.type as User["type"]);
    const complementaryType = computed(() =>
      type.value === "guardian" ? "child" : "guardian"
    );

    authStore.$subscribe(
      (_, store) => {
        const { state, user } = store.context;

        if (state === "empty")
          return router.replace({
            name: CommonRoute.SIGN_UP,
            params: { type: type.value },
          });

        if (state === "signIn") {
          if (user.type === "child") {
            return router.replace({ name: ChlidRoute.INDEX });
          }

          if (user.type === "guardian") {
            return router.replace({ name: GuardianRoute.MAP });
          }
        }
      },
      { immediate: true }
    );

    return () => {
      return (
        <div class="pt-48">
          <div class="flex items-center">
            <div class="text-2xl ml-2 font-semibold">
              <span class="text-[#F35A0C]">{typeLabel[type.value]}</span>로
              로그인하시겠습니까?
            </div>
          </div>
          <div class="mt-6">
            <AppButton onClick={() => authStore.signIn("google")}>
              구글 로그인
            </AppButton>
            <AppButton
              class="bg-black mt-2"
              onClick={() => authStore.signOut()}
            >
              로그아웃
            </AppButton>
          </div>
          <RouterLink
            to={{
              name: CommonRoute.SIGN_IN,
              params: { type: complementaryType.value },
            }}
            class="mt-4 block text-center"
          >
            <span class="text-[#F35A0C]">
              {typeLabel[complementaryType.value]}
            </span>
            로 로그인하기
          </RouterLink>
        </div>
      );
    };
  },
});
