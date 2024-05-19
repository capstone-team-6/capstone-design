import { useFingerprintAPI } from "@/apis/fingerprint";
import SignalInfo from "@/components/SignalInfo";
import { useSignal } from "@/composables/signal";
import { AdminRoute } from "@/routers/route";
import { defineComponent, onUnmounted, reactive } from "vue";
import { useRouter } from "vue-router";
import { APSignal, Fingerprint } from "~/entities/fingerprint";

export default defineComponent({
  name: "Child",
  setup() {
    const state = reactive({
      signals: [] as APSignal[],
      fingerprints: [] as Fingerprint[],
      position: "??2?",
      distance: 0,
    });
    const { subscribe } = useSignal();
    const { find } = useFingerprintAPI();

    find({ buildingId: "home" }, {}).then((result) => {
      if (result.success) state.fingerprints = result.data;
    });

    const { isLoading, unsubscribe } = subscribe(async (signals) => {
      state.signals = signals;

      const { distance, position } = findPosition(
        state.signals,
        state.fingerprints
      );

      state.distance = distance;
      state.position = position;
    }, 3000);

    onUnmounted(() => {
      unsubscribe();
    });

    const router = useRouter();

    return () => {
      return (
        <div>
          <button onClick={() => router.push({ name: AdminRoute.MEASURE })}>
            수집
          </button>
          <div>{isLoading.value && <div>로딩 중</div>}</div>
          <div class="flex">
            <div>위치</div>
            <div>{state.position}</div>
          </div>
          <div class="flex">
            <div>거리</div>
            <div>{state.distance}</div>
          </div>
          <div>
            {state.signals.map((signal) => (
              <SignalInfo signal={signal} />
            ))}
          </div>
        </div>
      );
    };
  },
});

const findPosition = (
  signals: APSignal[],
  fingerprints: Fingerprint[]
): { position: string; distance: number } => {
  const idSet = new Set<string>([
    ...signals.map((signal) => signal.BSSID),
    // ...fingerprints
    //   .map((fingerprint) => fingerprint.signals.map((signal) => signal.BSSID))
    //   .flat(),
  ]);

  const MIN_RSSI = -100 as const;
  const result = fingerprints
    .map((fingerprint) => {
      let distance = 0;

      idSet.forEach((id) => {
        const a =
          fingerprint.signals.find((signal) => signal.BSSID === id)?.level ??
          MIN_RSSI;
        const b =
          signals.find((signal) => signal.BSSID === id)!.level ?? MIN_RSSI;

        console.log(a, b);
        distance += Math.abs(a - b);
      });

      return {
        distance,
        markerId: fingerprint.markerId,
      };
    })
    .sort((a, b) => a.distance - b.distance);
  const K = 5;
  const candidates = result.slice(0, K);

  const map = new Map<string, number>();
  candidates.forEach((e) => {
    const t = map.get(e.markerId);

    if (t !== undefined) map.set(e.markerId, t + 1);
    else map.set(e.markerId, 0);
  });

  let nearest = "??";
  let cnt = 0;
  map.forEach((value, key) => {
    if (value > cnt) {
      cnt = value;
      nearest = key;
    }
  });

  return {
    distance: result[0].distance,
    position: nearest,
  };
};
