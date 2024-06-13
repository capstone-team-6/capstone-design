import { useUserAPI } from "@/apis/user";
import { AppButton } from "@/components/AppButton";
import { AppHeader } from "@/components/AppHeader";
import { AppInput } from "@/components/AppInput";
import { Icon } from "@/components/Icon";
import Spinner from "@/components/Spinner";
import { GuardianRoute } from "@/routers/route";
import { useAuthStore } from "@/stores/auth";
import { defineComponent, reactive } from "vue";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "Pair",
  setup() {
    const router = useRouter();
    const authStore = useAuthStore();
    const { pairUser } = useUserAPI();

    const onInput = async () => {
      state.isLoading = true;
      await pairUser({}, {}, { target: input.target });
      await authStore.refreshUser();
      state.isLoading = false;
    };

    const state = reactive({
      isLoading: false,
    });

    const input = reactive({
      target: "",
    });

    return () => {
      return (
        <div>
          <AppHeader name={authStore.context.user?.name ?? ""}>
            <div onClick={() => router.push({ name: GuardianRoute.MAP })}>
              <Icon type="chevron-left" />
            </div>
          </AppHeader>
          <div class="mt-12">
            <div class="text-2xl font-semibold">
              연결할 어린이의 아이디를 입력해주세요
            </div>
            <AppInput
              placeholder="어린이의 아이디를 입력해주세요"
              value={input.target}
              class="mt-12 block w-full"
              onInput={(value) => (input.target = value)}
            />
            <AppButton
              class="!bg-[#00B605] mt-4"
              onClick={onInput}
              disabled={state.isLoading}
            >
              {state.isLoading ? (
                <Spinner class="!w-6 !h-6 !border-[rgba(255,255,255,.3)] border-2 !border-t-white" />
              ) : (
                <div class="h-6">확인</div>
              )}
            </AppButton>
          </div>
        </div>
      );
    };
  },
});
