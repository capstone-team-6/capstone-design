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
import { Event, NotificationLevel } from "~/entities/message";
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
      children: {} as Record<
        User["id"],
        { markerId: string; name: string; level: NotificationLevel }
      >,
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
              level: NotificationLevel.CLEAR,
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

        socket.subscribe(Event.POSITION, (data, from) => {
          state.children[from].markerId = data.markerId;
          state.childSignals[from] = Date.now();
          state.now = Date.now();
        });

        socket.subscribe(Event.NOTIFICATION, (data, from) => {
          state.children[from].level = data.level;
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
                    <SmartButton
                      onClick={async () => {
                        if (state.childSignals[id] === null) return;

                        child.level = Math.min(
                          NotificationLevel.EMERGENCY,
                          child.level + 1
                        );

                        socket.send({
                          event: Event.NOTIFICATION,
                          data: { target: id, level: child.level },
                        });
                      }}
                      onPress={() => {
                        child.level = NotificationLevel.CLEAR;
                        socket.send({
                          event: Event.NOTIFICATION,
                          data: { target: id, level: child.level },
                        });
                      }}
                      class="mr-4"
                    >
                      <Icon
                        type="megaphone"
                        class={[
                          state.childSignals[id] === null
                            ? "text-gray-500"
                            : child.level === NotificationLevel.CLEAR
                            ? ""
                            : child.level === NotificationLevel.NOTICE
                            ? "text-green-500"
                            : child.level === NotificationLevel.WARNING
                            ? "text-orange-500"
                            : child.level === NotificationLevel.EMERGENCY
                            ? "text-red-500"
                            : "",
                        ]}
                      />
                    </SmartButton>
                    <div class="grow">
                      <div>{child.name}</div>
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
                    <div
                      class={[
                        state.childSignals[id] === null
                          ? "text-gray-500"
                          : state.target === id
                          ? "text-red-500"
                          : "",
                      ]}
                      onClick={() => {
                        if (state.childSignals[id] === null) return;

                        state.target === id
                          ? (state.target = null)
                          : (state.target = id);

                        state.showSidebar = false;
                      }}
                    >
                      <Icon type="marker" />
                    </div>
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

const SmartButton = defineComponent({
  emits: {
    click: () => true,
    press: () => true,
  },
  setup(_, { emit, slots }) {
    const THRESHOLD = 1000;

    const state = reactive({
      handle: null as NodeJS.Timeout | null,
    });

    const start = () => {
      state.handle = setTimeout(() => {
        emit("press");
        state.handle = null;
      }, THRESHOLD);
    };

    const end = () => {
      if (state.handle != null) {
        clearTimeout(state.handle);
        state.handle = null;
        emit("click");
      }
    };

    return () => {
      return (
        <div
          onMousedown={start}
          onTouchstart={start}
          onMouseup={end}
          onTouchend={end}
        >
          {slots.default?.()}
        </div>
      );
    };
  },
});
