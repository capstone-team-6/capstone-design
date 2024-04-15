import { APSignal } from "~/entities/fingerprint";

export const useSignal = () => {
  const scan = () => (window as any).Bridge.startScan();

  //   const subscribe = (callback: (signal: APSignal) => any) => {
  //     const handler = (event: MessageEvent) => {
  //       const data = JSON.parse(event.data);
  //       callback(data);
  //     };

  //     window.addEventListener("message", handler);

  //     const unsubscribe = () => {
  //       window.removeEventListener("message", handler);
  //     };

  //     return unsubscribe;
  //   };

  const get = (): Promise<APSignal[]> => {
    return new Promise((resolve) => {
      const hander = (event: MessageEvent) => {
        const data = JSON.parse(event.data);
        resolve(data);

        window.removeEventListener("message", hander);
      };

      window.addEventListener("message", hander);

      scan();
    });
  };

  return {
    // scan,
    get,
  };
};
