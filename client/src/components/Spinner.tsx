import { defineComponent } from "vue";

export default defineComponent({
  name: "Spinner",
  props: {
    label: {
      type: String,
      required: false,
    },
  },
  setup(props, { attrs }) {
    return () => {
      return [
        <div
          class={[
            "block w-32 h-32  border-[rgba(0,0,0,.3)] border-4 rounded-full border-t-black animate-spin mx-auto",
            attrs.class,
          ]}
        ></div>,
        props.label?.length && (
          <div class="mt-4 text-center">{props.label}</div>
        ),
      ];
    };
  },
});
