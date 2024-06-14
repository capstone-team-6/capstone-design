import blueMarkerImgSrc from "@/assets/blue_marker.svg";
import redMarkerImgSrc from "@/assets/red_marker.svg";
import { useFindPath } from "@/composables/findPath";
import _ from "lodash";
import {
  PropType,
  computed,
  defineComponent,
  onMounted,
  reactive,
  ref,
  watch,
} from "vue";
import { Building } from "~/entities/map";
import MapComponet from "./MapView";
import Spinner from "./Spinner";
import UserMarker from "./UserMarker";

export default defineComponent({
  name: "GuardianMapInteractive",
  props: {
    building: {
      type: Object as PropType<Building>,
      required: true,
    },
    markerId: {
      type: String,
      required: true,
    },
    children: {
      type: Object as PropType<{ name: string; markerId: string }[]>,
      required: true,
    },
    target: {
      type: Object as PropType<{ name: string; markerId: string }>,
      required: false,
    },
    showedFloorId: {
      type: String,
      required: false,
    },
  },
  setup(props) {
    const floorRef = computed(() => {
      return props.showedFloorId
        ? props.building.floors.find(
            (floor) => floor.floorId === props.showedFloorId
          )
        : props.building.floors.find((floor) =>
            floor.QRMarker.find(
              (QRMarker) => QRMarker.markerId === props.markerId
            )
          );
    });

    const groupChild = computed(() => _.groupBy(props.children, "markerId"));

    const canvasRef = ref<HTMLCanvasElement | null>(null);

    const state = reactive({
      isLoading: false,
    });

    let isOverlap: boolean;

    const drawCanvas = () => {
      if (canvasRef.value && props.target) {
        const path = useFindPath(
          props.building,
          props.markerId,
          props.target.markerId
        );
        console.log(path);

        const ctx = canvasRef.value.getContext("2d");

        let firstMarker = path.shift();

        if (ctx && firstMarker) {
          let p;
          while (firstMarker) {
            p = findMarkerPosition(firstMarker);

            if (p) {
              break;
            } else {
              firstMarker = path.shift();
            }
          }

          ctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height);

          ctx.strokeStyle = "#16537e";
          ctx.lineWidth = 9;

          ctx.beginPath();
          p && ctx.moveTo(p.x, p.y);
          for (const marker of path) {
            p = findMarkerPosition(marker);
            p && ctx.lineTo(p.x, p.y);
          }
          ctx.stroke();
        }
      } else if (canvasRef.value && !props.target) {
        const ctx = canvasRef.value.getContext("2d");
        ctx &&
          ctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height);
      }
    };

    const findMarkerPosition = (markerId: string) => {
      if (!floorRef.value) {
        return undefined;
      }
      const QRMarker = floorRef.value.QRMarker.find(
        (marker) => marker.markerId === markerId
      );

      const nodeMarker = floorRef.value.nodeMarker.find(
        (marker) => marker.markerId === markerId
      );

      if (QRMarker) {
        return { x: QRMarker.xLocation, y: QRMarker.yLocation };
      } else if (nodeMarker) {
        return { x: nodeMarker.xLocation, y: nodeMarker.yLocation };
      } else {
        return undefined;
      }
    };

    const myPosition = computed(() => findMarkerPosition(props.markerId));

    const mapImgLoading = (isLoading: boolean) => {
      state.isLoading = isLoading;
    };

    onMounted(() => {
      drawCanvas();
    });

    // TODO: 반응성 잘 되었나..?
    watch(
      () => [props.target, props.showedFloorId],
      () => {
        drawCanvas();
      },
      {
        deep: true,
      }
    );

    return () => (
      state.isLoading && <Spinner />,
      props.showedFloorId ? (
        <div class="w-full h-full overflow-scroll relative">
          <MapComponet
            mapImageURL={floorRef.value ? floorRef.value.mapImageURL : ""}
            onLoad:img={mapImgLoading}
          >
            <canvas ref={canvasRef} width={2600} height={860}></canvas>
            {_.keys(groupChild.value).map((markerId) => {
              const markerPosition = findMarkerPosition(markerId);

              return (
                markerPosition && (
                  <UserMarker
                    imageSrc={blueMarkerImgSrc}
                    usersName={_.map(groupChild.value[markerId], "name")}
                    position={markerPosition}
                  ></UserMarker>
                )
              );
            })}
            {myPosition.value && (
              <UserMarker
                imageSrc={redMarkerImgSrc}
                usersName={["[Me]"]}
                position={myPosition.value}
              ></UserMarker>
            )}
          </MapComponet>
        </div>
      ) : (
        <div class="w-full h-full overflow-scroll relative">
          <MapComponet
            mapImageURL={floorRef.value ? floorRef.value.mapImageURL : ""}
            onLoad:img={mapImgLoading}
          >
            <canvas ref={canvasRef} width={2600} height={860}></canvas>
            {_.keys(groupChild.value).map((markerId) => {
              const markerPosition = findMarkerPosition(markerId);

              if (
                markerPosition &&
                myPosition.value &&
                markerPosition.x === myPosition.value.x &&
                markerPosition.y === myPosition.value.y
              ) {
                isOverlap = true;
              } else {
                isOverlap = false;
              }

              return (
                markerPosition && (
                  <UserMarker
                    imageSrc={blueMarkerImgSrc}
                    usersName={
                      isOverlap
                        ? ["-"].concat(
                            _.map(groupChild.value[markerId], "name")
                          )
                        : _.map(groupChild.value[markerId], "name")
                    }
                    position={markerPosition}
                  ></UserMarker>
                )
              );
            })}
            {myPosition.value && (
              <UserMarker
                imageSrc={redMarkerImgSrc}
                usersName={["[Me]"]}
                position={myPosition.value}
              ></UserMarker>
            )}
          </MapComponet>
        </div>
      )
    );
  },
});
