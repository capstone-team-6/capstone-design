import { useMapAPI } from "@/apis/map";
import GuardianMapInteractive from "@/components/GuardianMapInteractive";
import { defineComponent, ref } from "vue";
import { Building } from "~/entities/map";

export default defineComponent({
  name: "MapUser",
  setup() {
    const { findBuilding } = useMapAPI();
    const building = ref<Building | null>(null);

    findBuilding(
      { buildingId: "e8296b0c-9f2f-4191-9a53-d683b8cecc05" },
      {}
    ).then((result) => {
      if (result.success) {
        building.value = result.data;
      }
    });

    const change = ref(true);

    return () => (
      <div>
        <button onClick={() => (change.value = !change.value)}>전환</button>
        {building.value && (
          <GuardianMapInteractive
            building={building.value}
            childs={[
              {
                childName: "ss",
                childMarkerId: "43ab8ea5-d638-455a-a6c0-167413bffd88",
              },
              {
                childName: "sa",
                childMarkerId: "64f77ed5-2e84-4cb0-b042-2325770e630a",
              },
              {
                childName: "cs",
                childMarkerId: "43ab8ea5-d638-455a-a6c0-167413bffd88",
              },
            ]}
            myMarkerId="156b576e-0ac4-4764-b2ac-aaa2ce8e4188"
            target={
              change.value
                ? {
                    childName: "ss",
                    childMarkerId: "9775fe54-131e-43cd-bdca-ae1f2429c712",
                  }
                : {
                    childName: "ss",
                    childMarkerId: "43ab8ea5-d638-455a-a6c0-167413bffd88",
                  }
            }
          />
        )}
      </div>
    );
  },
});
