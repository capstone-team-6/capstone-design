import { defineComponent } from "vue";
import { RouterView } from "vue-router";
import { useAuthStore } from "./stores/auth";

export default defineComponent({
  name: "App",
  setup() {
    const authStore = useAuthStore();
    authStore.init();

    return () => {
      return (
        <div class="w-full max-w-sm mx-auto">
          {authStore.context.state === "init" ? (
            <div>로그인 정보 확인 중</div>
          ) : authStore.context.state === "check" ? (
            <div>유저 정보 확인 중</div>
          ) : (
            <RouterView />
          )}
        </div>
      );
    };
  },
});
