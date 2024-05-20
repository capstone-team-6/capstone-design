import { ref } from "vue";
import { APSignal } from "~/entities/fingerprint";

export const useSignal = () => {
  const scan = () => (window as any).Bridge.startScan();

  const subscribe = (callback: (signal: APSignal[]) => any) => {
    const isLoading = ref(false);
    let isContinue = true;

    const handler = (event: MessageEvent) => {
      isLoading.value = false;
      const data = JSON.parse(event.data);
      callback(data);

      if (isContinue) {
        isLoading.value = true;
        scan();
      }
    };

    window.addEventListener("message", handler);
    isLoading.value = true;
    scan();

    const unsubscribe = () => {
      isContinue = false;
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
