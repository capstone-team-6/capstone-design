import { defineComponent } from "vue";

export const AppInput = defineComponent({
  name: "Input",
  props: {
    value: {
      type: String,
      required: true,
    },
    placeholder: {
      type: String,
      default: "",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  emits: {
    input: (_: string) => true,
  },
  setup(props, { emit }) {
    return () => {
      return (
        <input
          type="text"
          value={props.value}
          disabled={props.disabled}
          onInput={(e) => emit("input", (e.target as HTMLInputElement).value)}
          class="bg-gray-100 shadow  hover:shadow-inner rounded-lg p-2 focus:outline-[#CCCCCC]"
        />
      );
    };
  },
});
