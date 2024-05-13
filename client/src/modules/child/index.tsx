import { useFingerprintAPI } from "@/apis/fingerprint";
import MapView from "@/components/MapView";
import Spinner from "@/components/Spinner";
import { useSignal } from "@/composables/signal";
import { create } from "@tensorflow-models/knn-classifier";
import * as tf from "@tensorflow/tfjs";
import { defineComponent, onUnmounted, reactive } from "vue";
import { useRouter } from "vue-router";
import { APSignal, Fingerprint } from "~/entities/fingerprint";

const buildingId = "e8296b0c-9f2f-4191-9a53-d683b8cecc05";

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

    const classifier = create();
    const sortedIds = [] as string[];

    const MIN_RSSI = -100 as const;

    find({ buildingId }, {}).then((fingerprints) => {
      const idSet = new Set<string>([
        ...fingerprints
          .map((fingerprint) =>
            fingerprint.signals.map((signal) => signal.BSSID)
          )
          .flat(),
      ]);

      sortedIds.push(...Array.from(idSet).sort());

      fingerprints.forEach((fingerprint) => {
        const tensor = tf.tensor(
          sortedIds.map(
            (id) =>
              fingerprint.signals.find((signal) => signal.BSSID === id)
                ?.level ?? MIN_RSSI
          )
        );

        classifier.addExample(tensor, fingerprint.markerId);
      });

      fingerprints.forEach(async (fingerprint) => {
        const tensor = tf.tensor(
          sortedIds.map(
            (id) =>
              fingerprint.signals.find((signal) => signal.BSSID === id)
                ?.level ?? MIN_RSSI
          )
        );

        const result = await classifier.predictClass(tensor);
        console.log(result.label, fingerprint.markerId);
      });

      return;
    });

    const { isLoading, unsubscribe } = subscribe(async (signals) => {
      if (sortedIds.length === 0) return;

      const tensor = tf.tensor(
        sortedIds.map(
          (id) =>
            signals.find((signal) => signal.BSSID === id)?.level ?? MIN_RSSI
        )
      );

      const result = await classifier.predictClass(tensor);

      state.position = result.label;

      // state.signals = signals;

      // const { distance, position } = findPosition(
      //   state.signals,
      //   state.fingerprints
      // );

      // state.distance = distance;
      // state.position = position;
    }, 3000);

    onUnmounted(() => {
      unsubscribe();
    });

    const router = useRouter();

    return () => {
      if (isLoading.value) return <Spinner />;

      return (
        <MapView
          buildingId={buildingId}
          floorId="1a7cf235-ab2e-4c79-a6dc-fa3fbc221fbf"
          markerImageSrc="https://storage.googleapis.com/cau-team6-data/marker-red.svg"
          user={state.position}
        />
        // <div>
        //   <button onClick={() => router.push({ name: AdminRoute.MEASURE })}>
        //     수집
        //   </button>
        //   <div>{isLoading.value && <div>로딩 중</div>}</div>
        //   <div class="flex">
        //     <div>위치</div>
        //     <div>{state.position}</div>
        //   </div>
        //   <div class="flex">
        //     <div>거리</div>
        //     <div>{state.distance}</div>
        //   </div>
        //   <div>
        //     {state.signals.map((signal) => (
        //       <SignalInfo signal={signal} />
        //     ))}
        //   </div>
        // </div>
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
