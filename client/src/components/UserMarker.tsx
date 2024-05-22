import { PropType, defineComponent } from "vue";

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
    usersName: {
      type: Object as PropType<string[]>,
      required: true,
    },
  },
  setup(props) {
    return () => (
      <div
        style={{
          left: `${props.position.x}px`,
          top: `${props.position.y}px`,
        }}
        class="absolute"
      >
        <img
          src={props.imageSrc}
          class="transition duration-300 ease-in-out -translate-x-1/2 -translate-y-full"
        />
        {props.usersName.map((userName) => (
          <p class="bg-white px-2 -translate-x-9 -translate-y-16">{userName}</p>
        ))}
      </div>
    );
  },
});
