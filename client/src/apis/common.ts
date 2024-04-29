import { Endpoint, ParamType, QueryType } from "~/endpoints/type";

export function makeAPI<T extends Endpoint>(
  path: `${T["basePath"]}/${T["path"]}`,
  method: T["method"]
) {
  return async (
    query: QueryType<T>,
    param: ParamType<T>,
    body: T["body"]
  ): Promise<T["response"]> => {
    const queryStr = new URLSearchParams(Object.entries(query)).toString();
    const pathStr = Object.entries(param).reduce<string>(
      (str, [key, value]) => str.replace(key, value as string),
      path
    );

    const result = await fetch(
      `${import.meta.env.VITE_SERVER_URL}${pathStr}?${queryStr}`,
      {
        method,
        ...(body ? { body: JSON.stringify(body) } : {}),
        headers: {
          "Content-Type": "application/json",
          // "ngrok-skip-browser-warning": "true",
        },
      }
    );

    const text = await result.text();
    try {
      const json = JSON.parse(text);
      return json;
    } catch (e) {
      return text;
    }
  };
}
