import { defineComponent } from "vue";
import { RouterView } from "vue-router";
import Spinner from "./components/Spinner";
import { useAuthStore } from "./stores/auth";

export default defineComponent({
  name: "App",
  setup() {
    const authStore = useAuthStore();
    authStore.init();

    return () => {
      return (
        <div class="w-full p-2 mx-auto h-screen">
          {authStore.context.state === "init" ? (
            <Spinner label="로그인 정보 확인 중" class="mt-16" />
          ) : authStore.context.state === "check" ? (
            <Spinner label="유저 정보 확인 중" class="mt-16" />
          ) : (
            <RouterView />
          )}
        </div>
      );
    };
  },
});
