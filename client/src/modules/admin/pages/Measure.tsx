import { useFingerprintAPI } from "@/apis/fingerprint";
import Spinner from "@/components/Spinner";
import { defineComponent, nextTick, reactive, ref } from "vue";
import { QrcodeStream } from "vue-qrcode-reader";
import { APSignal } from "~/entities/fingerprint";
import { useSignal } from "../../../composables/signal";

export default defineComponent({
  name: "Measure",
  setup() {
    const input = reactive({
      buildingId: "e8296b0c-9f2f-4191-9a53-d683b8cecc05", // 208관
      markerId: "",
      signals: [] as APSignal[],
    });
    const successedMarkerId = ref("");
    const markerCnt = ref(0);

    const state = reactive({
      isLoading: false,
    });

    const cameraSwitch = ref(true);
    const cameraPaused = ref(false);
    const isRegister = ref(false);

    const { register, find } = useFingerprintAPI();
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
      await find({ markerId: input.markerId }, {}).then(
        (result) => result.success && (markerCnt.value = result.data.length)
      );
      state.isLoading = false;
      successedMarkerId.value = content[0].rawValue;
      isRegister.value = true;
    };

    return () => {
      return [
        state.isLoading && <Spinner />,
        <div>
          <QrcodeStream
            onDetect={onDecode}
            constraints={
              cameraSwitch.value
                ? { facingMode: "environment" }
                : { facingMode: "user" }
            }
            paused={cameraPaused.value}
          />
          {isRegister.value && (
            <p>
              등록 완료 <br />
              Marker ID-{successedMarkerId.value}
              <br />
              Fingerprint 개수-{markerCnt.value}
            </p>
          )}
          <button
            onClick={() => {
              cameraSwitch.value = !cameraSwitch.value;
            }}
          >
            카메라 변경
          </button>
          <button
            onClick={() => {
              isRegister.value = false;
              cameraPaused.value = true;
              nextTick(() => {
                cameraPaused.value = false;
              });
            }}
          >
            QR 캐시 Clear
          </button>
        </div>,
      ];
    };
  },
});
