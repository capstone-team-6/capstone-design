import InteractiveMap from "@/components/AdminMapInteractive";
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "MapAdmin",
  setup() {
    const floorId = ref("7ab8b93c-2f87-4815-93d1-b8110004ca4f");
    const buildingId = ref("e8296b0c-9f2f-4191-9a53-d683b8cecc05"); // demo 5f
    const inputFloorId = ref(floorId.value);
    const inputBuildingId = ref(buildingId.value);
    return () => (
      <div>
        <input
          type="text"
          value={buildingId.value}
          onInput={(e) =>
            (inputBuildingId.value = (e.target as HTMLInputElement).value)
          }
          class="border-2 border-gray-300"
        />
        <button
          onClick={() => (buildingId.value = inputBuildingId.value)}
          class="pb-3"
        >
          빌딩 ID 저장
        </button>
        <input
          type="text"
          value={floorId.value}
          onInput={(e) =>
            (inputFloorId.value = (e.target as HTMLInputElement).value)
          }
          class="border-2 border-gray-300"
        />
        <button
          onClick={() => (floorId.value = inputFloorId.value)}
          class="pb-3"
        >
          floor ID 저장
        </button>
        <InteractiveMap buildingId={buildingId.value} floorId={floorId.value} />
      </div>
    );
  },
});
