import { ref } from "vue";
import { APSignal } from "~/entities/fingerprint";

export const useSignal = () => {
  const scan = () => (window as any).Bridge.startScan();

  const subscribe = (
    callback: (signal: APSignal[]) => any,
    scanRate: number
  ) => {
    const isLoading = ref(false);
    let timeoutHandle: NodeJS.Timeout;

    const handler = (event: MessageEvent) => {
      isLoading.value = false;
      const data = JSON.parse(event.data);
      callback(data);

      timeoutHandle = setTimeout(() => {
        isLoading.value = true;
        scan();
      }, scanRate);
    };

    window.addEventListener("message", handler);
    isLoading.value = true;
    scan();

    const unsubscribe = () => {
      clearTimeout(timeoutHandle);
      window.removeEventListener("message", handler);
    };

    return {
      unsubscribe,
      isLoading,
    };
  };

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
    subscribe,
  };
};
