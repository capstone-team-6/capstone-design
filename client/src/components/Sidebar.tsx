import { Teleport, defineComponent } from "vue";

export const Sidebar = defineComponent({
  name: "sidebar",
  props: {
    show: {
      type: Boolean,
      required: true,
    },
  },
  emits: {
    close: () => true,
  },
  setup(props, { slots, emit }) {
    return () => {
      return (
        <Teleport to="body">
          <div
            class={[
              "absolute inset-0 left-0 w-1/3",
              props.show ? "bg-black opacity-20" : "bg-none -z-10",
            ]}
            onClick={() => props.show && emit("close")}
          ></div>
          <div
            class={[
              "fixed bg-white transition-transform bottom-0 right-0 inset-y-0 w-2/3 z-10",
              props.show ? "translate-x-0" : "translate-x-full",
            ]}
          >
            {slots.default?.()}
          </div>
        </Teleport>
      );
    };
  },
});
