import { AppButton } from "@/components/AppButton";

import { AppInput } from "@/components/AppInput";

import { useAuthStore } from "@/stores/auth";
import { computed, defineComponent, reactive } from "vue";
import { useRoute } from "vue-router";
import { User } from "~/entities/user";
import { AppHeader } from "../../../components/AppHeader";
import { typeLabel } from "../utils/type";

export default defineComponent({
  name: "SignUp",
  setup() {
    const route = useRoute();
    const type = computed(() => route.params.type as User["type"]);
    const authStore = useAuthStore();

    const input = reactive({
      name: "",
    });

    return () => {
      return (
        <div class="pt-4">
          <AppHeader name={typeLabel[type.value]} />
          <div class="mt-12">
            <div class="text-2xl font-semibold">이름을 설정해주세요</div>
            <AppInput
              placeholder="상대방에게 표시될 이름을 입력해주세요"
              value={input.name}
              class="mt-12 block w-full"
              onInput={(value) => (input.name = value)}
            />
            <AppButton
              class={[type.value === "guardian" ? "!bg-[#00B605]" : "", "mt-4"]}
              onClick={() => authStore.signUp(input.name, type.value)}
            >
              확인
            </AppButton>
          </div>
        </div>
      );
    };
  },
});
