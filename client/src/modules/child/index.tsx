import { useMapAPI } from "@/apis/map";
import { useUserAPI } from "@/apis/user";
import { AppButton } from "@/components/AppButton";
import { AppHeader } from "@/components/AppHeader";
import Spinner from "@/components/Spinner";
import { usePosition } from "@/composables/position";
import { useSignal } from "@/composables/signal";
import { useSocket } from "@/composables/socket";
import level1 from "@/modules/child/assets/level1.mp3?url";
import level2 from "@/modules/child/assets/level2.mp3?url";
import level3 from "@/modules/child/assets/level3.mp3?url";
import { useAuthStore } from "@/stores/auth";
import { PropType, Teleport, defineComponent, reactive } from "vue";
import { Event, NotificationLevel } from "~/entities/message";
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

      notification: {
        from: null as User | null,
        level: NotificationLevel.CLEAR,
      },
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
      .then(() =>
        socket.subscribe(
          Event.NOTIFICATION,
          (data, from) =>
            (state.notification = {
              level: data.level,
              from: state.guardian.find((g) => g.id === from)!,
            })
        )
      )
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
              event: Event.POSITION,
              data: { buildingId: building.buildingId, markerId },
            });

            state.position = markerId + Math.random().toFixed(2);
          })
        );
      })
      .then(() => (state.state = State.INIT))
      .catch((e) => alert(e));

    return () => {
      if (state.notification.level > 0) {
        return (
          <Popup
            level={state.notification.level}
            from={state.notification.from!}
            to={authStore.context.user!}
            onConfirm={() => {
              state.notification.level = NotificationLevel.CLEAR;

              socket.send({
                event: Event.NOTIFICATION,
                data: {
                  level: NotificationLevel.CLEAR,
                  target: state.notification.from!.id,
                },
              });
            }}
          />
        );
      }

      return (
        <div>
          <AppHeader name={authStore.context.user?.name ?? ""} />
          <div class="mt-12 font-semibold">
            {state.state === State.INIT ? (
              <div>
                {/* <div>{state.position}</div> */}
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

const Popup = defineComponent({
  props: {
    from: {
      type: Object as PropType<User>,
      required: true,
    },
    level: {
      type: Number as PropType<NotificationLevel>,
      required: true,
    },
    to: {
      type: Object as PropType<User>,
      required: true,
    },
  },
  emits: {
    confirm: () => true,
  },
  setup(props, { emit }) {
    const lable = [
      "",
      "지금 연락을 드리세요",
      "현재 자리에서 가만히 기다리세요",
      "보호자가 곧 도착할 예정입니다. 아이를 잠시 보호 해주세요",
    ];

    const audioSrcs = [level1, level2, level3];

    return () => {
      return (
        <Teleport to="body">
          <div class="fixed inset-0 flex flex-col items-center p-2">
            <div class="font-bold text-2xl">
              {props.from.name}님이 {props.to.name}님을 찾고 있어요
            </div>
            <div class="font-semibold text-xl mt-4">{lable[props.level]}</div>
            <div
              class={[
                "relative w-48 h-48 rounded-full mt-12",

                props.level === NotificationLevel.NOTICE
                  ? "bg-green-500 "
                  : props.level === NotificationLevel.WARNING
                  ? "bg-orange-500 "
                  : props.level === NotificationLevel.EMERGENCY
                  ? "bg-red-500 "
                  : "",
              ]}
            >
              <div
                class={[
                  "absolute w-48 h-48 rounded-full",

                  props.level === NotificationLevel.NOTICE
                    ? "bg-green-500 animate-ping"
                    : props.level === NotificationLevel.WARNING
                    ? "bg-orange-500 animate-ping"
                    : props.level === NotificationLevel.EMERGENCY
                    ? "bg-red-500 animate-ping"
                    : "",
                ]}
              ></div>
            </div>
            <AppButton
              class="mt-16 bg-gray-500"
              onClick={() => {
                emit("confirm");
              }}
            >
              확인
            </AppButton>
            <audio
              src={audioSrcs[props.level - 1]}
              preload="auto"
              loop
              autoplay
            ></audio>
          </div>
        </Teleport>
      );
    };
  },
});
