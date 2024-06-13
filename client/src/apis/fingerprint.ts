import { FingerprintAPI } from "~/endpoints/fingerprint";
import { makeAPI } from "./common";

export const useFingerprintAPI = () => {
  const register = makeAPI<FingerprintAPI["register"]>(
    "/api/fingerprint/register",
    "POST"
  );
  const find = makeAPI<FingerprintAPI["list"]>("/api/fingerprint/find", "GET");
  const findBuilding = makeAPI<FingerprintAPI["findBuilding"]>(
    "/api/fingerprint/find-building",
    "POST"
  );

  return {
    register,
    find,
    findBuilding,
  };
};
