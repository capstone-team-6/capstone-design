import { useFingerprintAPI } from "@/apis/fingerprint";
import Spinner from "@/components/Spinner";
import { PropType, defineComponent, reactive } from "vue";
import { APSignal } from "~/entities/fingerprint";
import { useSignal } from "../lib/signal";

export default defineComponent({
  name: "Measure",
  setup() {
    const input = reactive({
      buildingId: "home",
      markerId: "",
      signals: [] as APSignal[],
    });

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

    alert(import.meta.env.VITE_SERVER_URL);

    return () => {
      return [
        state.isLoading && <Spinner />,
        <div>
          <div>
            <div>빌딩 id</div>
            <input
              type="text"
              value={input.buildingId}
              onInput={(e) =>
                (input.buildingId = (e.target as HTMLInputElement).value)
              }
            />
          </div>
          <div>
            <div>마커 id</div>
            <input
              type="text"
              value={input.markerId}
              onInput={(e) =>
                (input.markerId = (e.target as HTMLInputElement).value)
              }
            />
          </div>
          <button
            onClick={async () => {
              state.isLoading = true;
              await register({}, {}, input);
              state.isLoading = false;
            }}
            class="block text-xl"
          >
            등록
          </button>
          <button onClick={scan} class="block text-xl mt-4">
            측정
          </button>
          <div>
            {input.signals.map((signal) => (
              <SignalInfo signal={signal} />
            ))}
          </div>
        </div>,
      ];
    };
  },
});

const SignalInfo = defineComponent({
  name: "Measure.SignalInfo",
  props: {
    signal: {
      type: Object as PropType<APSignal>,
      required: true,
    },
  },
  setup(props) {
    return () => {
      const { BSSID, SSID, level } = props.signal;
      return (
        <table>
          <tr>
            <td>BSSID</td>
            <td>{BSSID}</td>
          </tr>
          <tr>
            <td>SSID</td>
            <td>{SSID}</td>
          </tr>
          <tr>
            <td>Level</td>
            <td>{level}</td>
          </tr>
        </table>
      );
    };
  },
});
