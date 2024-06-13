import { useMapAPI } from "@/apis/map";
import { useUserAPI } from "@/apis/user";
import { AppHeader } from "@/components/AppHeader";
import Spinner from "@/components/Spinner";
import { usePosition } from "@/composables/position";
import { useSignal } from "@/composables/signal";
import { useSocket } from "@/composables/socket";
import { AdminRoute } from "@/routers/route";
import { useAuthStore } from "@/stores/auth";
import { defineComponent, reactive } from "vue";
import { RouterLink } from "vue-router";
import { User } from "~/entities/user";

enum State {
  SOCKET = "서버와 연결 중입니다.",
  FIND_POSITION = "신호 수집 중입니다.",
  FIND_BUILDING = "위치 정보를 받아오는 중입니다.",
  INIT = "",
}

export default defineComponent({
  name: "Child",
  setup() {
    const authStore = useAuthStore();
    const { listUsers } = useUserAPI();
    const { findBuilding } = useMapAPI();

    const { get, subscribe } = useSignal();
    // const { get, subscribe } = useMockSignal(true);

    const { init, findPosition } = usePosition();
    const socket = useSocket();

    const state = reactive({
      guardian: [] as User[],
      position: "",
      state: State.SOCKET,
    });

    Promise.all([
      listUsers({}, {}, { ids: authStore.context.user!.group }).then(
        (result) => {
          if (!result.success) {
            throw new Error(result.message);
          }

          state.guardian = result.data;
        }
      ),
      socket.init(),
    ])
      .then(() => (state.state = State.FIND_POSITION))
      .then(() => get())
      .then((signals) => {
        state.state = State.FIND_BUILDING;
        return init(signals);
      })
      .then((buildingId) => findBuilding({ buildingId }, {}))
      .then((result) => {
        if (!result.success) {
          throw new Error(result.message);
        }
        const building = result.data;

        subscribe((signals) =>
          findPosition(signals).then((markerId) => {
            socket.send({
              event: "position",
              data: { buildingId: building.buildingId, markerId },
            });

            state.position = markerId + Math.random().toFixed(2);
          })
        );
      })
      .then(() => (state.state = State.INIT))
      .catch((e) => alert(e));

    return () => {
      return (
        <div>
          <RouterLink to={{ name: AdminRoute.MEASURE }}>측정</RouterLink>
          <AppHeader name={authStore.context.user?.name ?? ""} />
          <div class="mt-12 font-semibold">
            {state.state === State.INIT ? (
              <div>
                <div>{state.position}</div>
                <div class="text-2xl">연결된 목록</div>

                {state.guardian.map((user) => (
                  <div class="text-xl">{user.name}</div>
                ))}
              </div>
            ) : (
              <Spinner label={state.state} />
            )}
          </div>
        </div>
      );
    };
  },
});
