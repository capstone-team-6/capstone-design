import { PropType, defineComponent, onMounted, onUnmounted, ref } from "vue";
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
    markerId: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    QRGenerate,
  },
  setup(props) {
    const markerRef = ref<HTMLImageElement | null>(null);
    const position = ref(props.position);
    const isClick = ref(false);

    const onMouseDown = (event: MouseEvent) => {
      event.stopPropagation();
      event.preventDefault();

      isClick.value = !isClick.value; // 마커 클릭시 큐알코드 보여줌
    };

    onMounted(() => {
      if (markerRef.value && props.isAdmin) {
        markerRef.value.addEventListener("mousedown", onMouseDown);
      }
    });

    onUnmounted(() => {
      if (markerRef.value && props.isAdmin) {
        markerRef.value.removeEventListener("mousedown", onMouseDown);
      }
    });

    return () => (
      <div>
        <img
          ref={markerRef}
          src={props.imageSrc}
          class={
            props.isAdmin
              ? "absolute cursor-default hover:brightness-75 transition duration-300 ease-in-out"
              : "absolute transition duration-300 ease-in-out"
          }
          style={{
            left: `${position.value.x}px`,
            top: `${position.value.y}px`,
          }}
        />
        {isClick.value && (
          <div>
            <QRGenerate data={props.markerId} />
            <p class="bg-white">{props.markerId}</p>
          </div>
        )}
      </div>
    );
  },
});
