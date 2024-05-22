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
  emits: ["event:contextmenu"],
  setup(props, { slots, emit, expose }) {
    const mapRef = ref<HTMLDivElement | null>(null);
    const position = ref({ x: 0, y: 0 });
    let start = props.startPosition;
    let dragging = false;

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
      if (event.button === 0 && mapRef.value) {
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
      if (mapRef.value) {
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUp);
      }
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

    // onContextmenu 이벤트 상위 컴포넌트로 전달
    const onContextMenu = (event: MouseEvent) => {
      emit("event:contextmenu", event);
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
        onMousedown={onMouseDown}
        onTouchstart={onTouchStart}
        onTouchmove={onTouchMove}
        onTouchend={onTouchEnd}
        onContextmenu={onContextMenu}
      >
        {slots.default ? slots.default() : null}
      </div>
    );
  },
});
