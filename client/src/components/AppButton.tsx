import { defineComponent } from "vue";

export const AppButton = defineComponent({
  name: "AppButton",
  emits: {
    click: () => true,
  },
  setup(_, { emit, slots }) {
    return () => (
      <button
        onClick={() => emit("click")}
        class="p-2 text-white bg-[#E15C35] rounded-full block w-full"
      >
        {slots.default?.()}
      </button>
    );
  },
});
