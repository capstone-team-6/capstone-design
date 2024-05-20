import { useAuthStore } from "@/stores/auth";

type Message = {
  event: "position";
  data: {
    buildingId: string;
    markerId: string;
  };
};

export const useSocket = () => {
  const socket = new WebSocket(
    import.meta.env.VITE_SERVER_URL.replace(/http|https/, "ws")
  );
  const authStore = useAuthStore();
  const id = authStore.context.user!.id;
  const target = authStore.context.user!.group;

  const init = (): Promise<void> => {
    return new Promise((resolve) => {
      socket.onopen = () => {
        resolve();
      };
    });
  };

  const send = <T extends Message>(message: T) => {
    socket.send(
      JSON.stringify({
        event: message.event,
        data: {
          id,
          target,
          ...message.data,
        },
      })
    );
  };

  const subscribe = <T>(callback: (data: T) => any) => {
    socket.onmessage = (event) => {
      callback(JSON.parse(event.data));
    };
  };

  const close = () => {
    socket.close();
  };

  return {
    init,
    send,
    subscribe,
    close,
  };
};
