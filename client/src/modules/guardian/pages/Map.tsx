import { useMapAPI } from "@/apis/map";
import { useUserAPI } from "@/apis/user";
import blue_marker from "@/assets/blue_marker.svg";
import red_marker from "@/assets/red_marker.svg";
import { AppHeader } from "@/components/AppHeader";
import { Icon } from "@/components/Icon";
import MapView from "@/components/MapView";
import { Sidebar } from "@/components/Sidebar";
import UserMarker from "@/components/UserMarker";
import { usePosition } from "@/composables/position";
import { useSignal } from "@/composables/signal";
import { useSocket } from "@/composables/socket";
import { useAuthStore } from "@/stores/auth";
import { defineComponent, onUnmounted, reactive } from "vue";
import { Building, Floor, Marker } from "~/entities/map";
import { User } from "~/entities/user";

export default defineComponent({
  name: "Graurdian.Map",
  setup() {
    const authStore = useAuthStore();
    const { listUsers } = useUserAPI();
    const { findBuilding } = useMapAPI();

    const { get, subscribe } = useSignal();
    const { init, findPosition } = usePosition();
    const socket = useSocket();

    // init

    Promise.all([
      listUsers({}, {}, { ids: authStore.context.user!.group }).then(
        (result) => {
          if (!result.success) {
            console.error(result.message);
            return;
          }

          state.children = result.data.map((child) => ({
            ...child,
            position: { floorId: "", marker: { id: "", x: 0, y: 0 } },
          }));
        }
      ),
      socket.init().then(() => alert("success")),
    ])
      .then(() => get())
      .then((signals) => init(signals))
      .then((buildingId) => findBuilding({ buildingId }, {}))
      .then((result) => {
        if (!result.success) {
          throw new Error(result.message);
        }

        state.building = result.data;

        socket.subscribe<{ id: string; position: string }>((data) => {
          const { floor, marker } = getPosition(
            state.building!,
            data.position
          )!;

          state.children.find((child) => child.id === data.id)!.position = {
            floorId: floor.floorId,
            marker: {
              id: marker.markerId,
              x: marker.xLocation,
              y: marker.yLocation,
            },
          };
        });

        const { unsubscribe } = subscribe((signals) =>
          findPosition(signals).then((markerId) => {
            const { floor, marker } = getPosition(state.building!, markerId)!;

            state.position = {
              floorId: floor.floorId,
              marker: {
                id: marker.markerId,
                x: marker.xLocation,
                y: marker.yLocation,
              },
            };

            socket.send({
              event: "position",
              data: {
                buildingId: state.building!.buildingId,
                markerId: state.position.marker.id,
              },
            });
          })
        );

        onUnmounted(() => {
          unsubscribe();
          socket.close();
        });

        state.isInitiated = true;
      })
      .catch((e) => console.error("Failed to initiante", e));

    const state = reactive({
      showSidebar: false,
      isInitiated: false,
      children: [] as (User & {
        position: {
          marker: {
            id: string;
            x: number;
            y: number;
          };
          floorId: string;
        };
      })[],
      building: null as null | Building,

      position: {
        marker: {
          id: "",
          x: 0,
          y: 0,
        },
        floorId: "",
      },
    });

    return () => {
      return (
        <div>
          <AppHeader name={authStore.context.user?.name ?? ""}>
            <button onClick={() => (state.showSidebar = true)}>
              <Icon type="bars" class="w-8 h-8" />
            </button>
          </AppHeader>

          <Sidebar
            show={state.showSidebar}
            onClose={() => (state.showSidebar = false)}
          >
            <div class="text-xl p-4">
              <div>연결된 목록</div>
              {state.children.map((child) => (
                <div>{child.name}</div>
              ))}
            </div>
          </Sidebar>
          <div class="mt-12">
            {state.isInitiated && (
              <MapView
                buildingId={state.building!.buildingId}
                floorId={state.position.floorId}
                mapImageURL={
                  state.building?.floors.find(
                    (floor) => floor.floorId === state.position.floorId
                  )?.mapImageURL ?? ""
                }
              >
                <UserMarker
                  imageSrc={red_marker}
                  position={{
                    x: state.position.marker.x,
                    y: state.position.marker.y,
                  }}
                  usersName={[authStore.context.user!.name]}
                />
                {state.children
                  .filter(
                    (child) => child.position.floorId === state.position.floorId
                  )
                  .map((child) => (
                    <UserMarker
                      imageSrc={blue_marker}
                      position={{
                        x: child.position.marker.x,
                        y: child.position.marker.y,
                      }}
                      usersName={[child.name]}
                    />
                  ))}
              </MapView>
            )}
          </div>
        </div>
      );
    };
  },
});

const getPosition = (
  building: Building,
  markerId: string
): { floor: Floor; marker: Marker } | null => {
  for (const floor of building.floors) {
    for (const marker of floor.QRMarker) {
      if (marker.markerId === markerId) {
        return { floor, marker };
      }
    }
  }

  console.error("Cannot find marker: " + markerId, building);

  return null;
};
