import { useFingerprintAPI } from "@/apis/fingerprint";
import { create } from "@tensorflow-models/knn-classifier";
import * as tf from "@tensorflow/tfjs";
import { APSignal } from "~/entities/fingerprint";

const MIN_RSSI = -100 as const;

export const usePosition = () => {
  const { findBuilding, find } = useFingerprintAPI();

  const classifier = create();
  const idVector = [] as string[];

  const init = async (signals: APSignal[]): Promise<string> => {
    const buildingResult = await findBuilding({}, {}, { apList: signals });

    if (!buildingResult.success) {
      throw new Error(buildingResult.message);
    }

    const fingerprintsResult = await find(
      { buildingId: buildingResult.data },
      {}
    );

    if (!fingerprintsResult.success) {
      throw new Error(fingerprintsResult.message);
    }

    const idSet = new Set<string>(
      fingerprintsResult.data
        .map((fingerprint) => fingerprint.signals.map((signal) => signal.BSSID))
        .flat()
    );

    idVector.push(...Array.from(idSet).sort());

    fingerprintsResult.data.forEach((fingerprint) =>
      classifier.addExample(toTensor(fingerprint.signals), fingerprint.markerId)
    );

    return buildingResult.data;
  };

  const findPosition = async (signals: APSignal[]) => {
    const tensor = toTensor(signals);
    const result = await classifier.predictClass(tensor);

    return result.label;
  };

  const toTensor = (signals: APSignal[]) => {
    return tf.tensor(
      idVector.map(
        (id) => signals.find((signal) => signal.BSSID === id)?.level ?? MIN_RSSI
      )
    );
  };

  return {
    init,
    findPosition,
  };
};
