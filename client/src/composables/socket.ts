import { getAuth } from "firebase/auth";
import { Manager } from "socket.io-client";
import { ClientMessage, Event, Message } from "~/entities/message";

export const useSocket = () => {
  const manager = new Manager(
    import.meta.env.VITE_SERVER_URL.replace(/http|https/, "ws"),
    {
      closeOnBeforeunload: true,
      autoConnect: false,
    }
  );

  const socket = manager.socket("/");

  const init = async () => {
    const idToken = (await getAuth().currentUser?.getIdToken()) ?? "";
    socket.auth = {
      idToken,
    };

    const promise = new Promise<void>((res) =>
      socket.on("connect", () => res())
    );
    socket.connect();
    await promise;
  };

  const send = <E extends Event, D extends Message[E]>(message: {
    event: E;
    data: D;
  }) => {
    socket.emit(message.event, message.data);
  };

  const sendWithAck = async <E extends Event, D extends Message[E]>(message: {
    event: E;
    data: D;
  }) => {
    return socket.emitWithAck(message.event, message.data);
  };

  const subscribe = <E extends Event>(
    event: E,
    callback: (data: ClientMessage[E]) => any
  ) => {
    socket.on(event as string, callback);
  };

  const close = () => {
    socket.close();
  };

  return {
    init,
    send,
    sendWithAck,
    subscribe,
    close,
  };
};
