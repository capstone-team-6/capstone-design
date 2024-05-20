import { useMapAPI } from "@/apis/map";
import { useUserAPI } from "@/apis/user";
import { AppHeader } from "@/components/AppHeader";
import { usePosition } from "@/composables/position";
import { useSignal } from "@/composables/signal";
import { useSocket } from "@/composables/socket";
import { useAuthStore } from "@/stores/auth";
import { defineComponent, reactive } from "vue";
import { User } from "~/entities/user";

export default defineComponent({
  name: "Child",
  setup() {
    const authStore = useAuthStore();
    const { listUsers } = useUserAPI();
    const { findBuilding } = useMapAPI();

    const { get, subscribe } = useSignal();
    const { init, findPosition } = usePosition();
    const socket = useSocket();

    socket
      .init()
      .then(() => alert("success"))
      .then(() => get())
      .then((signals) => init(signals))
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
      .catch((e) => alert(e));

    listUsers({}, {}, { ids: authStore.context.user!.group }).then((result) => {
      if (!result.success) {
        throw new Error(result.message);
      }

      state.guardian = result.data;
    });

    const state = reactive({
      guardian: [] as User[],
      position: "",
    });

    return () => {
      return (
        <div>
          <AppHeader name={authStore.context.user?.name ?? ""} />
          <div class="mt-12">
            <div>{state.position}</div>
            <div>연결된 목록</div>

            {state.guardian.map((user) => (
              <div>{user.name}</div>
            ))}
          </div>
        </div>
      );
    };
  },
});
