import { useUserAPI } from "@/apis/user";
import { AppButton } from "@/components/AppButton";
import { AppHeader } from "@/components/AppHeader";
import { AppInput } from "@/components/AppInput";
import { useAuthStore } from "@/stores/auth";
import { defineComponent, reactive } from "vue";

export default defineComponent({
  name: "Pair",
  setup() {
    const authStore = useAuthStore();
    const { pairUser } = useUserAPI();

    const input = reactive({
      target: "",
    });

    return () => {
      return (
        <div>
          <AppHeader name={authStore.context.user?.name ?? ""} />
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
              onClick={() => pairUser({}, {}, { target: input.target })}
            >
              확인
            </AppButton>
          </div>
        </div>
      );
    };
  },
});
