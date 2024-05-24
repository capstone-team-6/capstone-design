import { useFingerprintAPI } from "@/apis/fingerprint";
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
  },
  emits: ["event:buttonClick"],
  setup(props, { emit }) {
    const isClick = ref(false);

    const markerName = ref(props.marker.markerName);
    const nearNodeId = ref("");
    const markerCnt = ref(0);

    const { combineNearNode, updateMarkerName } = useMapAPI();
    const { find } = useFingerprintAPI();

    const onMouseDown = (event: MouseEvent) => {
      event.stopPropagation();
      event.preventDefault();

      isClick.value = !isClick.value; // 마커 클릭시 큐알코드 보여줌
    };

    const getFingerprintCnt = async () => {
      await find({ markerId: props.marker.markerId }, {}).then(
        (result) => result.success && (markerCnt.value = result.data.length)
      );
    };

    getFingerprintCnt();

    return () => (
      <div>
        <div
          style={{
            left: `${props.position.x}px`,
            top: `${props.position.y}px`,
          }}
          class="absolute"
        >
          <img
            onMousedown={onMouseDown}
            src={props.imageSrc}
            class="cursor-default hover:brightness-75 transition duration-300 ease-in-out -translate-x-1/2 -translate-y-full"
          />
          <p class="bg-white px-2 -translate-x-9 -translate-y-16">
            {props.marker.markerName}
          </p>
        </div>
        {isClick.value && (
          <div
            class="max-w-md mx-auto fixed top-0 left-0 h-full w-64 bg-gray-200 p-3"
            onMousedown={(e) => e.stopPropagation()}
          >
            <QRGenerate data={props.marker.markerId} />
            <p class="mb-2">{props.marker.markerId}</p>
            <input
              class="w-full"
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

                if (!building.success) {
                  console.error(building.message);
                  return;
                }

                emit("event:buttonClick", building.data);
              }}
            >
              [마커 이름 등록]
            </button>
            <input
              class="w-full"
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

                if (!building.success) {
                  console.error(building.message);
                  return;
                }

                emit("event:buttonClick", building.data);

                nearNodeId.value = "";
              }}
            >
              [인접 노드 등록]
            </button>
            <p class="mt-2">현재 Fingerprint 개수 - {markerCnt.value}</p>
            <button class="flex flex-col" onClick={getFingerprintCnt}>
              [Fingerprint info 새로고침]
            </button>
            <button
              class="flex flex-col mt-2"
              onClick={() => (isClick.value = false)}
            >
              [닫기]
            </button>
          </div>
        )}
      </div>
    );
    // TODO:
    // 마커 삭제
  },
});
