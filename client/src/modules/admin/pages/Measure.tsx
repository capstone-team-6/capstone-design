import { useFingerprintAPI } from "@/apis/fingerprint";
import SignalInfo from "@/components/SignalInfo";
import Spinner from "@/components/Spinner";
import { defineComponent, reactive } from "vue";
import { APSignal } from "~/entities/fingerprint";
import { useSignal } from "../../../composables/signal";

export default defineComponent({
  name: "Measure",
  props: {
    buildingId: {
      type: String,
      default: "home",
    },
    markerId: {
      type: String,
      default: "test_marker1",
    },
  },
  setup(props) {
    const input = reactive({
      buildingId: props.buildingId,
      markerId: props.markerId,
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
