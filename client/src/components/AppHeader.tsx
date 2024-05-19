import { Icon } from "@/components/Icon";
import { defineComponent } from "vue";

export const AppHeader = defineComponent({
  name: "AppHeader",
  props: {
    name: {
      type: String,
      required: true,
    },
  },
  setup(props, { slots }) {
    return () => {
      return (
        <div class="flex justify-start items-center">
          <div class="text-[#CCCCCC] border-[3px] border-[#CCCCCC] rounded-full w-9 h-9 overflow-hidden flex justify-center items-center">
            <Icon type="user" class="w-10 h-10" />
          </div>
          <div class="grow ml-2 text-gray-600 text-lg">{props.name}</div>
          {slots.default?.()}
        </div>
      );
    };
  },
});
