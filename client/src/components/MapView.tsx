import { PropType, defineComponent, ref } from "vue";

export default defineComponent({
  name: "MapComponent",
  props: {
    mapImageURL: {
      type: String,
      required: true,
    },
    startPosition: {
      type: Object as PropType<{ x: number; y: number }>,
      default: { x: 0, y: 0 },
    },
  },
  emits: ["event:contextmenu", "load:img"],
  setup(props, { slots, emit, expose }) {
    const mapRef = ref<HTMLDivElement | null>(null);
    const position = ref(props.startPosition);

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
        class="w-[2600px] h-[860px] bg-cover bg-center cursor-grab active:cursor-grabbing"
        style={{
          backgroundImage: `url("${props.mapImageURL}")`,
          transform: `translate(${position.value.x}px, ${position.value.y}px)`,
        }}
        onContextmenu={onContextMenu}
        onLoadstart={onImgLoadStart}
        onLoad={onImgLoad}
      >
        {slots.default ? slots.default() : null}
      </div>
    );
  },
});
