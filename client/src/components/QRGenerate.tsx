import { defineComponent } from "vue";
import VueQrcode from "vue-qrcode";

export default defineComponent({
  name: "QRGenerate",
  props: {
    // 큐알코드 생성시 데이터
    data: {
      type: String,
      required: true,
    },
  },
  components: {
    VueQrcode,
  },
  setup(props) {
    return () => <vue-qrcode value={props.data} />;
  },
});
