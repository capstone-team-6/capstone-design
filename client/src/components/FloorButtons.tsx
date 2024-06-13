import { defineComponent, PropType, ref } from "vue";

export const FloorButtons = defineComponent({
  name: "FloorButtons",
  props: {
    floors: {
      type: Array as PropType<{ id: string; label: string }[]>,
      required: true,
    },
  },
  emits: ["data:clickData"],
  setup(props, { emit }) {
    const selectedFloorId = ref("");

    const onSelectFloor = (floorId: string) => {
      selectedFloorId.value = floorId;
      emit("data:clickData", floorId);
    };

    return () => (
      <div class="flex overflow-x-auto py-2.5">
        {props.floors.map((floor) => (
          <button
            key={floor.id}
            style={{
              background:
                selectedFloorId.value === floor.id ? "#00B605" : "#f8f9fa",
              color: selectedFloorId.value === floor.id ? "#ffffff" : "#000",
            }}
            class="px-4 py-2.5 ml-1.5 border border-gray-300 rounded-lg cursor-pointer transition-colors duration-300"
            onClick={() => onSelectFloor(floor.id)}
          >
            {floor.label}
          </button>
        ))}
      </div>
    );
  },
});
