import { useMapAPI } from "@/apis/map";
import { defineComponent, onMounted, onUnmounted, ref } from "vue";
import { Floor, Marker } from "~/entities/map";
import MarkerComponet from "./MarkerView";

export default defineComponent({
  name: "MapComponent",
  props: {
    buildingId: {
      type: String,
      required: true,
    },
    floorId: {
      type: String,
      required: true,
    },
    markerImageSrc: {
      type: String,
      required: true,
    },
    // 어드민인 경우에만 마커 추가, 편집 가능
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    MarkerComponet,
  },
  setup(props) {
    const floorRef = ref<Floor | undefined>(undefined); // floor에 대한 정보를 담고 있는 객체

    const mapRef = ref<HTMLImageElement | null>(null);
    const position = ref({ x: 0, y: 0 });
    let start = { x: 0, y: 0 };
    let dragging = false;

    const markerImg = new Image();
    markerImg.src = props.markerImageSrc;

    const { findBuilding, registerQRMarker } = useMapAPI();

    const startDrag = (x: number, y: number) => {
      dragging = true;
      start.x = x - position.value.x;
      start.y = y - position.value.y;
    };

    const onDrag = (x: number, y: number) => {
      if (!dragging) return;
      position.value.x = x - start.x;
      position.value.y = y - start.y;
    };

    const endDrag = () => {
      dragging = false;
    };

    const onMouseDown = (event: MouseEvent) => {
      event.preventDefault();
      if (event.button === 0) {
        startDrag(event.clientX, event.clientY);
        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseup", onMouseUp);
      }
    };

    const onMouseMove = (event: MouseEvent) => {
      onDrag(event.clientX, event.clientY);
    };

    const onMouseUp = () => {
      endDrag();
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    const onTouchStart = (event: TouchEvent) => {
      const touch = event.touches[0];
      startDrag(touch.clientX, touch.clientY);
    };

    const onTouchMove = (event: TouchEvent) => {
      const touch = event.touches[0];
      onDrag(touch.clientX, touch.clientY);
    };

    const onTouchEnd = () => {
      endDrag();
    };

    // 우클릭인 경우 마커 추가
    const onRightClick = (event: MouseEvent) => {
      event.preventDefault();

      if (mapRef.value) {
        const rect = mapRef.value.getBoundingClientRect();

        const x = event.clientX - rect.left - markerImg.width / 2; // 클릭 위치와 마커 위치 맞춤
        const y = event.clientY - rect.top - markerImg.height;

        // 마커 객체 생성
        const newQRMarker: Omit<Marker, "markerId"> = {
          markerName: "",
          xLocation: x,
          yLocation: y,
          nearNodeId: [],
        };

        // 마커 등록
        registerQRMarker(
          {},
          {},
          {
            buildingId: props.buildingId,
            floorId: props.floorId,
            marker: newQRMarker,
          }
        ).then(
          // Floor 객체 업데이트
          (result) => {
            if (!result.success) {
              console.error(result.message);
              return;
            }

            floorRef.value = result.data.floors.find(
              (floor) => floor.floorId === props.floorId
            );
          }
        );
      }
    };

    // Floor 객체 찾기
    const findFloor = () => {
      console.log(props.buildingId);
      findBuilding({ buildingId: props.buildingId }, {}).then((result) => {
        if (!result.success) {
          console.error(result.message);
          return;
        }

        floorRef.value = result.data.floors.find(
          (floor) => floor.floorId === props.floorId
        );
      });
    };

    onMounted(() => {
      if (mapRef.value) {
        mapRef.value.addEventListener("mousedown", onMouseDown);
        mapRef.value.addEventListener("touchstart", onTouchStart);
        mapRef.value.addEventListener("touchmove", onTouchMove);
        mapRef.value.addEventListener("touchend", onTouchEnd);
        mapRef.value.addEventListener("contextmenu", onRightClick);
      }

      findFloor(); // 컴포넌트 마운트 후 플로어 객체 찾기
    });

    onUnmounted(() => {
      if (mapRef.value) {
        mapRef.value.removeEventListener("mousedown", onMouseDown);
        mapRef.value.removeEventListener("touchstart", onTouchStart);
        mapRef.value.removeEventListener("touchmove", onTouchMove);
        mapRef.value.removeEventListener("touchend", onTouchEnd);
      }
    });

    return () => (
      <div
        ref={mapRef}
        class="w-[2600px] h-[860px] bg-cover bg-center cursor-grab active:cursor-grabbing"
        style={{
          backgroundImage: `url("${floorRef.value?.mapImageURL}")`,
          transform: `translate(${position.value.x}px, ${position.value.y}px)`,
        }}
      >
        {floorRef.value &&
          floorRef.value.QRMarker.map((marker, index) => (
            <MarkerComponet
              key={index}
              imageSrc={markerImg.src}
              position={{ x: marker.xLocation, y: marker.yLocation }}
              markerId={marker.markerId}
              isAdmin={props.isAdmin}
            />
          ))}
      </div>
    );
  },
});
