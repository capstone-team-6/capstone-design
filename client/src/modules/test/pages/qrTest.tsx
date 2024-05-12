import QRScan from "@/components/QRScan";
import Measure from "@/modules/admin/pages/Measure";
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "QR",
  components: {
    QRScan,
    Measure,
  },
  setup() {
    const buildingId = "e8296b0c-9f2f-4191-9a53-d683b8cecc05"; // 208관

    const isQRActive = ref(true);
    const markerId = ref("");

    const updateQRData = (data: string) => {
      markerId.value = data;
      isQRActive.value = false;
    };

    return () => (
      <div>
        {isQRActive.value && <QRScan onQrScanData={updateQRData} />}
        {!isQRActive.value && (
          <Measure buildingId={buildingId} markerId={markerId.value} />
        )}
      </div>
    );
  },
});
