import InteractiveMap from "@/components/AdminMapInteractive";
import { defineComponent } from "vue";

export default defineComponent({
  name: "Map",
  setup() {
    return () => (
      <div>
        <InteractiveMap
          buildingId="e8296b0c-9f2f-4191-9a53-d683b8cecc05" // 208관
          floorId="1a7cf235-ab2e-4c79-a6dc-fa3fbc221fbf" // 5층
          isAdmin={true}
        />
      </div>
    );
  },
});
