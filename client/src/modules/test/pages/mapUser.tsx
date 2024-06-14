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

    return () => {
      return (
        <div class="h-full">
          <button onClick={() => (change.value = !change.value)}>전환</button>
          {building.value && (
            <GuardianMapInteractive
              building={building.value}
              children={[
                {
                  name: "ss",
                  markerId: "43ab8ea5-d638-455a-a6c0-167413bffd88",
                },
                {
                  name: "sa",
                  markerId: "839fbbae-c52f-4f02-8be6-4a110995062e",
                },
                {
                  name: "cs",
                  markerId: "156b576e-0ac4-4764-b2ac-aaa2ce8e4188",
                },
              ]}
              markerId={
                change.value ? "156b576e-0ac4-4764-b2ac-aaa2ce8e4188" : "839fbbae-c52f-4f02-8be6-4a110995062e"
              }
              target={{
                name: "ss",
                markerId: "9775fe54-131e-43cd-bdca-ae1f2429c712",
              }}
            />
          )}
        </div>
      );
    };
  },
});
