import { UserAPI } from "~/endpoints/user";
import { makeAPI } from "./common";

export const useUserAPI = () => {
  const signUp = makeAPI<UserAPI["signUp"]>("/api/user/sign-up", "POST");
  const signIn = makeAPI<UserAPI["signIn"]>("/api/user/sign-in", "GET");
  const pairUser = makeAPI<UserAPI["pairUser"]>("/api/user/pair", "POST");

  return {
    signUp,
    signIn,
    pairUser,
  };
};
