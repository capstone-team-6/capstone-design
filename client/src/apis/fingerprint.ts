import { FingerprintAPI } from "~/endpoints/fingerprint";
import { makeAPI } from "./common";

export const useFingerprintAPI = () => {
  const register = makeAPI<FingerprintAPI["register"]>(
    "/api/fingerprint/register",
    "POST"
  );
  const find = makeAPI<FingerprintAPI["find"]>("/api/fingerprint/find", "GET");
  const findPosition = makeAPI<FingerprintAPI["findPosition"]>(
    "/api/fingerprint/find-position",
    "POST"
  );

  return {
    register,
    find,
    findPosition,
  };
};
