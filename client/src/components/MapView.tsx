import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "MapComponent",
  props: {
    mapImageURL: {
      type: String,
      required: true,
    },
  },
  emits: ["event:contextmenu", "load:img"],
  setup(props, { slots, emit, expose }) {
    const mapRef = ref<HTMLDivElement | null>(null);

    // onContextmenu 이벤트 상위 컴포넌트로 전달
    const onContextMenu = (event: MouseEvent) => {
      emit("event:contextmenu", event);
    };

    const onImgLoadStart = () => {
      emit("load:img", true);
    };

    const onImgLoad = () => {
      emit("load:img", false);
    };

    // getBoundingClientRect 함수 노출
    expose({
      getBoundingClientRect: () => {
        return mapRef.value?.getBoundingClientRect();
      },
    });

    return () => (
      <div
        ref={mapRef}
        class="w-[2600px] h-[860px] bg-cover bg-center cursor-grab active:cursor-grabbing absolute"
        style={{
          backgroundImage: `url("${props.mapImageURL}")`,
        }}
        onContextmenu={onContextMenu}
        onLoadstart={onImgLoadStart}
        onLoad={onImgLoad}
      >
        {/* 맵 이미지에서 계단 위 아래 표시 */}
        <p
          style={{
            transform: `translate(485px, 15px)`,
          }}
          class="text-2xl absolute"
        >
          UP
        </p>
        <p
          style={{
            transform: `translate(430px, 15px)`,
          }}
          class="text-2xl absolute"
        >
          DN
        </p>
        <p
          style={{
            transform: `translate(1520px, 15px)`,
          }}
          class="text-2xl absolute"
        >
          UP
        </p>
        <p
          style={{
            transform: `translate(1465px, 15px)`,
          }}
          class="text-2xl absolute"
        >
          DN
        </p>
        {slots.default ? slots.default() : null}
      </div>
    );
  },
});
