import { AppButton } from "@/components/AppButton";
import { AppHeader } from "@/components/AppHeader";
import { Icon } from "@/components/Icon";
import { ChlidRoute } from "@/routers/route";
import { useAuthStore } from "@/stores/auth";
import { computed, defineComponent, reactive } from "vue";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "ID",
  setup() {
    const authStore = useAuthStore();
    const router = useRouter();

    const name = computed(() => authStore.context.user?.name ?? "");
    const id = computed(() => authStore.context.user?.id ?? "");

    const state = reactive({
      idCopied: false,
    });

    return () => {
      return (
        <div>
          <AppHeader name={name.value} />
          <div class="mt-12">
            <div class="text-2xl font-semibold">아이디를 복사해주세요</div>
            <div
              class="mt-12 w-full flex justify-between items-center bg-gray-100 shadow-inner rounded-lg p-2"
              onClick={() => {
                navigator.clipboard.writeText(id.value);
                state.idCopied = true;
                setTimeout(() => (state.idCopied = false), 1000);
              }}
            >
              <div>{id.value}</div>
              <Icon type="copy" />
            </div>
            <div class="mt-2 text-[#555555] text-center">
              {state.idCopied
                ? "복사되었습니다"
                : "이 아이디를 보호자에게 전달해주세요"}
            </div>
            <AppButton
              class="mt-8"
              onClick={async () => {
                await authStore.refreshUser();
                router.push({ name: ChlidRoute.INDEX });
              }}
            >
              다음으로
            </AppButton>
          </div>
        </div>
      );
    };
  },
});
