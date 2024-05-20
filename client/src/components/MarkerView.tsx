import { useMapAPI } from "@/apis/map";
import { PropType, defineComponent, ref } from "vue";
import { Marker } from "~/entities/map";
import QRGenerate from "./QRGenerate";

export default defineComponent({
  name: "MarkerComponent",
  props: {
    imageSrc: {
      type: String,
      required: true,
    },
    position: {
      type: Object as PropType<{ x: number; y: number }>,
      required: true,
    },
    marker: {
      type: Object as PropType<Marker>,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["event:buttonClick"],
  setup(props, { emit }) {
    const isClick = ref(false);

    const markerName = ref(props.marker.markerName);
    const nearNodeId = ref("");

    const { combineNearNode, updateMarkerName } = useMapAPI();

    const onMouseDown = (event: MouseEvent) => {
      event.stopPropagation();
      event.preventDefault();

      isClick.value = !isClick.value; // 마커 클릭시 큐알코드 보여줌
    };

    return () => (
      <div>
        <div
          style={{
            left: `${props.position.x}px`,
            top: `${props.position.y}px`,
          }}
          class="absolute flex flex-col items-center justify-center"
        >
          <img
            onMousedown={onMouseDown}
            src={props.imageSrc}
            class={
              props.isAdmin
                ? "cursor-default hover:brightness-75 transition duration-300 ease-in-out"
                : "transition duration-300 ease-in-out"
            }
          />
          <p class="bg-white px-2">{props.marker.markerName}</p>
        </div>
        {isClick.value && (
          <div
            class="fixed top-0 right-0 h-full w-64 bg-gray-200 p-3"
            onMousedown={(e) => e.stopPropagation()}
          >
            <QRGenerate data={props.marker.markerId} />
            <p class="mb-2">{props.marker.markerId}</p>
            <input
              type="text"
              value={markerName.value}
              onInput={(e) =>
                (markerName.value = (e.target as HTMLInputElement).value)
              }
            />
            <button
              onClick={async () => {
                const building = await updateMarkerName(
                  {},
                  {},
                  {
                    markerId: props.marker.markerId,
                    markerName: markerName.value,
                  }
                );
                emit("event:buttonClick", building);
              }}
            >
              마커 이름 등록
            </button>
            <input
              type="text"
              value={nearNodeId.value}
              onInput={(e) => {
                nearNodeId.value = (e.target as HTMLInputElement).value;
              }}
            />
            <button
              onClick={async () => {
                const building = await combineNearNode(
                  {},
                  {},
                  {
                    firstNode: props.marker.markerId,
                    secondNode: nearNodeId.value,
                  }
                );
                emit("event:buttonClick", building);
              }}
            >
              인접 노드 등록
            </button>
            <button
              class="flex flex-col mt-2"
              onClick={() => (isClick.value = false)}
            >
              닫기
            </button>
          </div>
        )}
      </div>
    );
    // TODO:
    // 마커 삭제
  },
});
