import { defineComponent } from "vue";
import { QrcodeStream } from "vue-qrcode-reader";

export default defineComponent({
  name: "QRScan",
  emits: ["qrScanData"],
  components: {
    QrcodeStream,
  },
  setup(_, { emit }) {
    const onDecode = (content: { rawValue: string }[]) => {
      emit("qrScanData", content[0].rawValue);
    };

    return () => <QrcodeStream onDetect={onDecode} />;
  },
});
