import { useMapAPI } from "@/apis/map";
import blueMarkerImgSrc from "@/assets/blue_marker.svg";
import redMarkerImgSrc from "@/assets/red_marker.svg";
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
  },
  setup(props) {
    const floorRef = ref<Floor | undefined>(undefined); // floor에 대한 정보를 담고 있는 객체

    const mapRef = ref<HTMLDivElement | null>(null);

    const { findBuilding, registerQRMarker, registerNodeMarker } = useMapAPI();

    const QRMarkerImg = new Image();
    QRMarkerImg.src = redMarkerImgSrc;

    const nodeMarkerImg = new Image();
    nodeMarkerImg.src = blueMarkerImgSrc;

    const markerMode = ref<"QR" | "node">("QR"); // 어떠한 마커를 추가할 것인지

    // 우클릭인 경우 마커 추가
    const onRightClick = (event: MouseEvent) => {
      event.preventDefault();

      if (mapRef.value) {
        const rect = mapRef.value.getBoundingClientRect();

        if (markerMode.value === "QR") {
          const x = event.clientX - rect.left - QRMarkerImg.width / 2; // 클릭 위치와 마커 위치 맞춤
          const y = event.clientY - rect.top - QRMarkerImg.height;

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

              updateFloor(result.data);
            }
          );
        } else {
          const x = event.clientX - rect.left - nodeMarkerImg.width / 2; // 클릭 위치와 마커 위치 맞춤
          const y = event.clientY - rect.top - nodeMarkerImg.height;

          // 마커 객체 생성
          const newNodeMarker: Omit<Marker, "markerId"> = {
            markerName: "",
            xLocation: x,
            yLocation: y,
            nearNodeId: [],
          };

          // 마커 등록
          registerNodeMarker(
            {},
            {},
            {
              buildingId: props.buildingId,
              floorId: props.floorId,
              marker: newNodeMarker,
            }
          ).then(
            // Floor 객체 업데이트
            (result) => {
              if (!result.success) {
                console.error(result.message);
                return;
              }

              updateFloor(result.data);
            }
          );
        }
      }
    };

    // Floor 객체 찾기
    const findFloor = () => {
      findBuilding({ buildingId: props.buildingId }, {}).then((result) => {
        if (!result.success) {
          console.error(result.message);
          return;
        }

        updateFloor(result.data);
      });
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
      <div>
        <p>{markerMode.value === "QR" ? "QR mode" : "Node mode"}</p>
        <button
          onClick={() => {
            if (markerMode.value === "QR") {
              markerMode.value = "node";
            } else {
              markerMode.value = "QR";
            }
          }}
        >
          Mode change
        </button>
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
                imageSrc={QRMarkerImg.src}
                position={{ x: marker.xLocation, y: marker.yLocation }}
                marker={marker}
                onEvent:buttonClick={updateFloor}
              />
            ))}
          {floorRef.value &&
            floorRef.value.nodeMarker.map((marker) => (
              <MarkerComponet
                imageSrc={blueMarkerImgSrc}
                position={{ x: marker.xLocation, y: marker.yLocation }}
                marker={marker}
                onEvent:buttonClick={updateFloor}
              />
            ))}
        </MapComponet>
      </div>
    );
    // TODO:
    // qr마커와 노드 마커 중 선택 버튼
  },
});
