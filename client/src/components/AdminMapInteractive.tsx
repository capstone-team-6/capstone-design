import { useMapAPI } from "@/apis/map";
import markerImgSrc from "@/assets/red_marker.svg";
import { defineComponent, onMounted, ref } from "vue";
import { Building, Floor, Marker } from "~/entities/map";
import MapComponet from "./MapView";
import MarkerComponet from "./MarkerView";

export default defineComponent({
  name: "AdminMapInteractive",
  props: {
    buildingId: {
      type: String,
      required: true,
    },
    floorId: {
      type: String,
      required: true,
    },
    // 어드민인 경우에만 마커 추가, 편집 가능
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const floorRef = ref<Floor | undefined>(undefined); // floor에 대한 정보를 담고 있는 객체

    const mapRef = ref<HTMLDivElement | null>(null);

    const { findBuilding, registerQRMarker } = useMapAPI();

    const markerImg = new Image();
    markerImg.src = markerImgSrc;

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
          (result) =>
            (floorRef.value = result.floors.find(
              (floor) => floor.floorId === props.floorId
            ))
        );
      }
    };

    // Floor 객체 찾기
    const findFloor = () => {
      findBuilding({ buildingId: props.buildingId }, {}).then(
        (result) =>
          (floorRef.value = result.floors.find(
            (floor) => floor.floorId === props.floorId
          ))
      );
    };

    // Floor 업데이트
    const updateFloor = (building: Building) => {
      floorRef.value = building.floors.find(
        (floor) => floor.floorId === props.floorId
      );
    };

    onMounted(() => {
      findFloor(); // 컴포넌트 마운트 후 플로어 객체 찾기
    });

    return () => (
      <MapComponet
        ref={mapRef}
        buildingId={props.buildingId}
        floorId={props.floorId}
        mapImageURL={floorRef.value ? floorRef.value.mapImageURL : ""}
        onEvent:contextmenu={onRightClick}
      >
        {floorRef.value &&
          floorRef.value.QRMarker.map((marker) => (
            <MarkerComponet
              imageSrc={markerImg.src}
              position={{ x: marker.xLocation, y: marker.yLocation }}
              marker={marker}
              isAdmin={props.isAdmin}
              onEvent:buttonClick={updateFloor}
            />
          ))}
      </MapComponet>
    );
    // TODO:
    // qr마커와 노드 마커 중 선택 버튼
  },
});
