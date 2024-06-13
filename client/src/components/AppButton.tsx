import { defineComponent } from "vue";

export const AppButton = defineComponent({
  name: "AppButton",
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  emits: {
    click: () => true,
  },
  setup(props, { emit, slots }) {
    return () => (
      <button
        disabled={props.disabled}
        onClick={() => emit("click")}
        class="p-2 text-white bg-[#E15C35] rounded-full block w-full"
      >
        {slots.default?.()}
      </button>
    );
  },
});
