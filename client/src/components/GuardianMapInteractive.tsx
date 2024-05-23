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
    myMarkerId: {
      type: String,
      required: true,
    },
    childs: {
      type: Object as PropType<{ name: string; markerId: string }[]>,
      required: true,
    },
    target: {
      type: Object as PropType<{ name: string; markerId: string }>,
      required: false,
    },
  },
  setup(props) {
    const floorRef = computed(() =>
      props.building.floors.find((floor) =>
        floor.QRMarker.find(
          (QRMarker) => QRMarker.markerId === props.myMarkerId
        )
      )
    );

    const groupChild = computed(() => _.groupBy(props.childs, "markerId"));

    const canvasRef = ref<HTMLCanvasElement | null>(null);

    const state = reactive({
      isLoading: false,
    });

    let isOverlap: boolean;

    const drawCanvas = () => {
      if (canvasRef.value && props.target) {
        const path = useFindPath(
          props.building,
          props.myMarkerId,
          props.target.markerId
        );

        const ctx = canvasRef.value.getContext("2d");

        const firstMarker = path.shift();

        if (ctx && firstMarker) {
          let p = findMarkerPosition(firstMarker);

          ctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height);

          ctx.strokeStyle = "#E15C35";
          ctx.lineWidth = 12;

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
      const marker = floorRef.value.QRMarker.find(
        (marker) => marker.markerId === markerId
      );

      if (!marker) {
        return undefined;
      }
      return { x: marker.xLocation, y: marker.yLocation };
    };

    const myPosition = computed(() => findMarkerPosition(props.myMarkerId));

    const mapImgLoading = (isLoading: boolean) => {
      state.isLoading = isLoading;
    };

    onMounted(() => {
      drawCanvas();
    });

    watch(
      () => props.target,
      () => {
        drawCanvas();
      }
    );

    return () => (
      state.isLoading && <Spinner />,
      (
        <MapComponet
          mapImageURL={floorRef.value ? floorRef.value.mapImageURL : ""}
          startPosition={findMarkerPosition(props.myMarkerId)}
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
                      ? ["-"].concat(_.map(groupChild.value[markerId], "name"))
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
      )
    );
  },
});
