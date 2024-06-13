import { useMapAPI } from "@/apis/map";
import { useUserAPI } from "@/apis/user";
import { AppHeader } from "@/components/AppHeader";
import GuardianMapInteractive from "@/components/GuardianMapInteractive";
import { Icon } from "@/components/Icon";
import { Sidebar } from "@/components/Sidebar";
import Spinner from "@/components/Spinner";
import { usePosition } from "@/composables/position";
import { useSignal } from "@/composables/signal";
import { useSocket } from "@/composables/socket";
import { AdminRoute, GuardianRoute } from "@/routers/route";
import { useAuthStore } from "@/stores/auth";

import { defineComponent, onUnmounted, reactive } from "vue";
import { RouterLink, useRouter } from "vue-router";
import { Building } from "~/entities/map";
import { Event } from "~/entities/message";
import { User } from "~/entities/user";

enum State {
  SOCKET = "서버와 연결 중입니다.",
  FIND_POSITION = "신호 수집 중입니다.",
  FIND_BUILDING = "위치 정보를 받아오는 중입니다.",
  LOAD_MAP = "지도 정보를 받아오는 중입니다",
  INIT = "",
}

export default defineComponent({
  name: "Graurdian.Map",
  setup() {
    const router = useRouter();
    const authStore = useAuthStore();
    const { listUsers } = useUserAPI();
    const { findBuilding } = useMapAPI();

    const singnal = useSignal();
    // const singnal = useMockSignal();
    const position = usePosition();
    const socket = useSocket();

    const state = reactive({
      state: State.SOCKET,
      now: Date.now(),

      showSidebar: false,
      isInitiated: false,
      children: {} as Record<User["id"], { markerId: string; name: string }>,
      childSignals: {} as Record<User["id"], null | number>,

      building: null as null | Building,
      position: "",
      target: null as null | User["id"],

      unmountedHook: (() => ({})) as () => any,
    });

    Promise.all([
      listUsers({}, {}, { ids: authStore.context.user!.group }).then(
        (result) => {
          if (!result.success) {
            console.error(result.message);
            return;
          }

          result.data.forEach((child) => {
            state.children[child.id] = {
              name: child.name,
              markerId: "",
            };
            state.childSignals[child.id] = null;
          });
        }
      ),
      socket.init(),
    ])
      .then(() => {
        state.state = State.FIND_POSITION;
        return singnal.get();
      })
      .then((signals) => {
        return position.init(signals);
      })
      .then((buildingId) => {
        state.state = State.FIND_BUILDING;
        return findBuilding({ buildingId }, {});
      })
      .then((result) => {
        if (!result.success) {
          throw new Error(result.message);
        }

        state.building = result.data;

        socket.subscribe(Event.POSITION, (data) => {
          state.children[data.from.uid].markerId = data.markerId;
          state.childSignals[data.from.uid] = Date.now();
          state.now = Date.now();
        });

        const { unsubscribe } = singnal.subscribe((signals) =>
          position.findPosition(signals).then((markerId) => {
            state.position = markerId;

            socket.send({
              event: Event.POSITION,
              data: {
                buildingId: state.building!.buildingId,
                markerId: state.position,
              },
            });
          })
        );

        const intervalHandle = setInterval(
          () => (state.now = Date.now()),
          1000
        );

        state.unmountedHook = () => {
          unsubscribe();
          socket.close();
          clearInterval(intervalHandle);
        };

        state.state = State.INIT;
      })
      .catch((e) => console.error("Failed to initiante", e));

    onUnmounted(() => state.unmountedHook());

    return () => {
      return (
        <div class="flex flex-col h-full">
          <RouterLink to={{ name: AdminRoute.MEASURE }}>측정</RouterLink>
          <AppHeader name={authStore.context.user?.name ?? ""}>
            <button onClick={() => (state.showSidebar = true)}>
              <Icon type="bars" class="w-8 h-8" />
            </button>
          </AppHeader>

          <Sidebar
            show={state.showSidebar}
            onClose={() => (state.showSidebar = false)}
          >
            <div class="text-lg p-4 font-semibold">
              <div class="mb-8 flex items-center justify-between text-xl">
                <div>연결된 목록</div>
                <div onClick={() => router.push({ name: GuardianRoute.PAIR })}>
                  <Icon type="plus" />
                </div>
              </div>
              {Object.entries(state.children).map(([id, child]) => (
                <div class="py-2">
                  <div class="flex items-center justify-between">
                    <div>{child.name}</div>
                    <div
                      class={[state.target === id ? "text-red-500" : ""]}
                      onClick={() => {
                        state.target === id
                          ? (state.target = null)
                          : (state.target = id);

                        state.showSidebar = false;
                      }}
                    >
                      <Icon type="marker" />
                    </div>
                  </div>
                  <div class="text-sm text-gray-500">
                    {(() => {
                      const lastSignal = state.childSignals[id];
                      if (lastSignal === null) return "응답 없음";
                      const elapsed = (state.now - lastSignal) / 1000;

                      if (elapsed < 10) return "온라인";

                      if (elapsed > 60) return "1분 이상";

                      return elapsed.toFixed(0) + "초 전";
                    })()}
                  </div>
                </div>
              ))}
            </div>
          </Sidebar>
          <div class="grow basis-1">
            {state.state === State.INIT ? (
              <GuardianMapInteractive
                building={state.building!}
                children={Object.values(state.children)}
                markerId={state.position}
                target={state.target ? state.children[state.target] : undefined}
              />
            ) : (
              <div>
                <Spinner label={state.state} />
              </div>
            )}
          </div>
        </div>
      );
    };
  },
});
