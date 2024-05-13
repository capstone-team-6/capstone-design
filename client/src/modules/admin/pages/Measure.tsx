import { useFingerprintAPI } from "@/apis/fingerprint";
import Spinner from "@/components/Spinner";
import { defineComponent, reactive, ref } from "vue";
import { QrcodeStream } from "vue-qrcode-reader";
import { APSignal } from "~/entities/fingerprint";
import { useSignal } from "../../../composables/signal";

export default defineComponent({
  name: "Measure",
  components: {
    QrcodeStream,
  },
  setup() {
    const input = reactive({
      buildingId: "e8296b0c-9f2f-4191-9a53-d683b8cecc05", // 208관
      markerId: "",
      signals: [] as APSignal[],
    });
    const successedMarkerId = ref("");

    const state = reactive({
      isLoading: false,
    });

    const { register } = useFingerprintAPI();
    const { get } = useSignal();

    const scan = async () => {
      state.isLoading = true;
      const result = await get();
      state.isLoading = false;

      input.signals = result;
    };

    const onDecode = async (content: { rawValue: string }[]) => {
      input.markerId = content[0].rawValue;
      state.isLoading = true;
      await scan();
      await register({}, {}, input);
      state.isLoading = false;
      successedMarkerId.value = content[0].rawValue;
    };

    const cameraSwitch = ref(true);

    return () => {
      return [
        state.isLoading && <Spinner />,
        <div>
          <QrcodeStream
            onDetect={onDecode}
            constraints={cameraSwitch.value ? { facingMode: "environment" } : { facingMode: "user" } }
          />
          <p>등록 완료-{successedMarkerId.value}</p>
          <button
            onClick={() => {
              cameraSwitch.value = !cameraSwitch.value;
            }}
          >카메라 변경</button>
        </div>,
      ];
    };
  },
});
