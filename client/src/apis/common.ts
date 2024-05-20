import { getAuth } from "firebase/auth";
import { Endpoint, ParamType, QueryType, Result } from "~/endpoints/type";

export function makeAPI<T extends Endpoint>(
  path: `${T["basePath"]}/${T["path"]}`,
  method: T["method"]
) {
  return async (
    query: QueryType<T>,
    param: ParamType<T>,
    body: T["body"]
  ): Promise<Result<T["response"]>> => {
    const queryStr = new URLSearchParams(Object.entries(query)).toString();
    const pathStr = Object.entries(param).reduce<string>(
      (str, [key, value]) => str.replace(key, value as string),
      path
    );

    const idToken = (await getAuth().currentUser?.getIdToken()) ?? "";

    const result = await fetch(
      `${import.meta.env.VITE_SERVER_URL}${pathStr}?${queryStr}`,
      {
        method,
        ...(body ? { body: JSON.stringify(body) } : {}),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
          // "ngrok-skip-browser-warning": "true",
        },
      }
    );

    return result.json();
  };
}
